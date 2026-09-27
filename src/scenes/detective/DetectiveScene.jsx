import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { CASES, caseById } from "../../game/content.js";
import { CASE_SCRIPTS } from "../../data/caseScripts.js";
import { EVA_LOG } from "../../eva/lines.js";
import { recordAnswer, recordCaseOutcome, solvedCaseIds } from "../../game/progress.js";
import { clearRun, saveRun } from "../../game/session.js";
import { hashSeed, newSeed, seededShuffle } from "../../game/rng.js";
import { articleLabel, stripVerdict } from "../../game/format.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Verdict from "../../ui/Verdict.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

const fold = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export default function DetectiveScene({ param }) {
  const c = param ? caseById(param) : null;
  if (!c) return <CaseSelect />;
  return <CasePlay key={c.id} c={c} />;
}

/* ───────────────────────── Selector de expedientes ───────────────────────── */

function caseStatus(save, id) {
  const entry = save.cases?.[id];
  if (save.run?.scene === "detective" && save.run.param === id) return { label: "En curso", cls: "chip-cyan" };
  if (!entry?.best) return { label: "Nuevo", cls: "" };
  if (entry.best === "autonomo") return { label: "Cerrado", cls: "chip-ok" };
  if (entry.best === "asistido") return { label: "Con ayuda", cls: "chip-warn" };
  return { label: "Pendiente", cls: "chip-bad" };
}

function CaseSelect() {
  const { save } = useGame();
  const { go } = useNav();
  const vp = useLayout();
  const solved = solvedCaseIds(save).length;
  const cols = vp.width >= 1000 ? 3 : vp.width >= 620 ? 2 : 1;
  const nextId = CASES.find((c) => !save.cases?.[c.id]?.best || save.cases[c.id].best === "fallido")?.id ?? CASES[0].id;

  const items = useMemo(() => {
    const rows = [];
    for (let i = 0; i < CASES.length; i += cols) rows.push(CASES.slice(i, i + cols));
    return rows.map((row, r) => ({
      id: `r${r}`,
      render: () => (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {row.map((c) => {
            const n = CASES.indexOf(c) + 1;
            const st = caseStatus(save, c.id);
            return (
              <button key={c.id} type="button" className={`choice items-center ${c.id === nextId ? "is-selected" : ""}`} onClick={() => go("detective", c.id)}>
                <span className="title-display w-8 shrink-0 text-center text-lg text-faint tabular-nums">{String(n).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug text-ink">{c.title}</span>
                  <span className="label block" aria-label={`Dificultad ${c.difficulty} de 5`}>
                    {"◆".repeat(c.difficulty)}
                    <span className="text-line">{"◆".repeat(Math.max(0, 5 - c.difficulty))}</span>
                  </span>
                </span>
                <span className={`chip ${st.cls}`}>{st.label}</span>
              </button>
            );
          })}
        </div>
      ),
    }));
  }, [cols, save, go, nextId]);

  return (
    <Screen
      title="Expedientes"
      subtitle={`${solved} de ${CASES.length} cerrados`}
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="prev" />
            <span>Archivo</span>
          </button>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go("detective", nextId)} data-autofocus="">
            <Icon name="doc" />
            <span className="truncate-safe">Siguiente: {caseById(nextId).title}</span>
          </button>
        </>
      }
    >
      <FitPager items={items} gap={8} pageKey="cases" label="Expedientes" />
    </Screen>
  );
}

/* ───────────────────────── Un expediente ───────────────────────── */

function freshState(c) {
  const script = CASE_SCRIPTS[c.id];
  const runKey = newSeed();
  let order = null;
  if (script?.timeline) {
    const ids = script.timeline.events.map((e) => e.id);
    order = seededShuffle(ids, runKey);
    if (order.join() === ids.join()) order = [...ids].reverse();
  }
  return {
    runKey,
    phase: "intro",
    tab: "pruebas",
    view: null, // null = escritorio · { doc: i } · { timeline: true }
    seen: [],
    timeline: order ? { order, done: false, tries: 0, wrong: [] } : null,
    branch: script?.branch ? { done: false, tries: 0, wrong: null } : null,
    node: null,
    hints: 0,
    solution: null,
    fundamento: null,
    attempts: 0,
    result: null,
  };
}

function CasePlay({ c }) {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say, speak } = useEva();
  const vp = useLayout();
  const script = CASE_SCRIPTS[c.id] ?? {};
  const resumable = save.run?.scene === "detective" && save.run.param === c.id && save.run.state?.runKey;
  const [st, setSt] = useState(() => (resumable ? save.run.state : freshState(c)));
  const [evaLine, setEvaLine] = useState(null);
  const n = CASES.indexOf(c) + 1;
  const correctIndex = c.choices.findIndex((ch) => ch.correct);
  const correct = c.choices[correctIndex];
  const set = useCallback((patch) => setSt((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })), []);
  const checkRef = useRef(null);

  // Fundamentos posibles: los artículos citados en las alternativas del caso (sin repetir),
  // completados con los de otros expedientes del mismo módulo si hacen falta.
  const fundamentos = useMemo(() => {
    const own = Array.from(new Set(c.choices.map((ch) => ch.article)));
    const pool = Array.from(new Set(CASES.filter((x) => x.module === c.module && x.id !== c.id).flatMap((x) => x.choices.map((ch) => ch.article)))).filter((a) => !own.includes(a));
    const extra = seededShuffle(pool, hashSeed(c.id)).slice(0, Math.max(0, 3 - own.length));
    return seededShuffle([...own, ...extra], hashSeed(`${c.id}:f`));
  }, [c]);

  useEffect(() => {
    if (st.phase === "resolved" && st.result && !st.result.pending) {
      update((s) => clearRun(s, "detective"));
    } else {
      update((s) => saveRun(s, { scene: "detective", param: c.id, title: c.title, state: st }));
    }
  }, [st, update, c.id, c.title]);

  useEffect(() => {
    if (resumable) {
      speak(`Seguimos con «${c.title}». Todo está donde lo dejaste.`, { mood: "neutral", id: `resume-${c.id}` });
      return;
    }
    if (script.hook) speak(script.hook, { mood: "intrigada", id: `hook-${c.id}` });
    else say("caseIntro");
    const past = Object.keys(save.errors ?? {}).find((k) => fold(k) === fold(correct.concept));
    if (past && !script.hook) say("pastMistake", { concept: correct.concept });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const docsTotal = c.documents.length;
  const pending = (docsTotal - st.seen.length) + (st.timeline && !st.timeline.done ? 1 : 0) + (st.branch && !st.branch.done ? 1 : 0);

  const openDoc = (i) => {
    playSfx("open");
    set((s) => ({ view: { doc: i }, seen: s.seen.includes(i) ? s.seen : [...s.seen, i] }));
    if (!st.seen.includes(i)) {
      const allNow = st.seen.length + 1 === docsTotal;
      const line = allNow ? say("allCluesFound") : say("clueFound");
      if (line) playSfx("connect");
    }
  };

  const hint = () => {
    const level = Math.min(3, st.hints + 1);
    const text =
      script.hints?.[level - 1] ??
      (level === 1
        ? "Una pregunta, no una respuesta: ¿qué hecho del expediente cambia todo si lo miras con calma?"
        : level === 2
          ? `Relaciona los hechos con esta figura: ${c.theme}. Una sola alternativa encaja sin forzar nada.`
          : `${stripVerdict(correct.feedback)} (${articleLabel(correct.article)})`);
    speak(text, { mood: level === 3 ? "seria" : "neutral", id: `hint-${c.id}-${level}` });
    if (level === 3) say("assisted");
    set({ hints: level });
    playSfx("select");
    if (vp.short || vp.layout === "split" || (vp.layout === "stack" && vp.height < 700)) open("eva");
  };

  const confirm = () => {
    if (st.phase !== "investigate" || st.solution == null || !st.fundamento || st.result) return;
    const ok = st.solution === correctIndex;
    const fundOk = st.fundamento === correct.article;
    playSfx(ok ? (fundOk ? "solve" : "success") : "error");
    if (ok) {
      const assisted = !fundOk || st.hints > 0 || st.attempts > 0;
      finalize({ ok: true, fundOk, assisted, gaveUp: false });
    } else {
      const chosen = c.choices[st.solution];
      const line = say(st.attempts >= 1 ? "errorRepeat" : "error", { why: "Mira otra vez las pruebas antes de volver a decidir." });
      setEvaLine(line ? { text: line.text, mood: line.mood } : null);
      update((s) => recordAnswer(s, { key: `case:${c.id}:${st.runKey}:try${st.attempts}`, correct: false, module: c.module, article: chosen.article, concept: chosen.concept, mode: "detective", feedback: chosen.feedback, xp: 2 }));
      set((s) => ({ phase: "resolved", attempts: s.attempts + 1, result: { ok: false, pending: true, choice: s.solution } }));
    }
  };

  const finalize = ({ ok, fundOk, assisted, gaveUp }) => {
    const outcome = gaveUp ? "fallido" : assisted ? "asistido" : "autonomo";
    const before = solvedCaseIds(save).length;
    update((s) => {
      let next = recordCaseOutcome(s, c.id, { runKey: st.runKey, outcome, hintsUsed: st.hints, decisions: [c.choices[st.solution ?? correctIndex]?.label, st.fundamento].filter(Boolean) });
      next = recordAnswer(next, { key: `case:${c.id}:${st.runKey}`, correct: ok && !gaveUp, assisted, module: c.module, article: correct.article, concept: correct.concept, mode: "detective", feedback: correct.feedback, xp: gaveUp ? 4 : assisted ? 25 : 60 });
      return next;
    });
    const solvedAfter = before + (!gaveUp && !save.cases?.[c.id]?.best ? 1 : 0);
    const log = EVA_LOG.find((l) => l.at === solvedAfter && before < l.at);
    let line;
    if (gaveUp) line = say("caseFailed");
    else if (!fundOk) line = speak("Eso explica las ganas de heredar. Todavía nos faltaba el fundamento: el caso queda resuelto con ayuda.", { mood: "ironica", id: `fund-${c.id}` });
    else if (assisted) line = say("assisted");
    else line = say("caseClosed");
    setEvaLine(line ? { text: line.text, mood: line.mood } : null);
    set({ phase: "resolved", result: { ok: ok && !gaveUp, fundOk, assisted, gaveUp, outcome, log: log?.title ?? null } });
  };

  const retry = () => {
    playSfx("tap");
    set({ phase: "investigate", tab: "decision", result: null, solution: null, fundamento: null });
  };
  const giveUp = () => finalize({ ok: false, fundOk: false, assisted: true, gaveUp: true });

  const solvedIds = solvedCaseIds(save);
  const nextCase = CASES.slice(CASES.indexOf(c) + 1).find((x) => !solvedIds.includes(x.id)) ?? CASES.find((x) => !solvedIds.includes(x.id) && x.id !== c.id);
  const bossTime = st.result?.ok && solvedIds.length > 0 && solvedIds.length % 3 === 0;

  useKeys({
    Enter: () => {
      if (st.phase === "intro") set({ phase: "investigate" });
      else if (st.phase === "resolved" && st.result?.pending) retry();
      else if (st.phase === "resolved" && nextCase) go("detective", nextCase.id);
    },
  });

  const narrow = vp.width < 420;
  const subtitle = `Expediente ${String(n).padStart(2, "0")} · ${"◆".repeat(c.difficulty)}`;

  /* ── Fase 1: el conflicto ── */
  if (st.phase === "intro") {
    const items = [
      { id: "d", text: c.dossier, render: (t) => <p className="text-[1rem] leading-snug text-paperInk">{t}</p> },
    ];
    return (
      <Screen
        title={c.title}
        subtitle={subtitle}
        dock={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => go("detective")}>
              <Icon name="prev" />
              <span className={narrow ? "sr-only" : ""}>Expedientes</span>
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={() => { playSfx("confirm"); set({ phase: "investigate" }); }} data-autofocus="">
              <Icon name="search" />
              <span>Investigar</span>
            </button>
          </>
        }
      >
        <article className="paper col min-h-0 flex-1 gap-2 p-4">
          <p className="label !text-paperInk/70">Notaría Nocturna 404 · expediente {String(n).padStart(2, "0")}</p>
          <h2 className="title-display text-2xl text-paperInk">{c.title}</h2>
          <FitPager items={items} gap={10} label="Página" pageKey={`dossier:${c.id}`} />
        </article>
      </Screen>
    );
  }

  /* ── Fase 3: consecuencia ── */
  if (st.phase === "resolved" && st.result) {
    const r = st.result;
    if (r.pending) {
      const chosen = c.choices[r.choice];
      return (
        <Screen
          title={c.title}
          subtitle={subtitle}
          eva="compact-sm"
          dock={
            <>
              <button type="button" className="btn btn-ghost" onClick={giveUp}>
                <Icon name="eye" />
                <span>Ver solución</span>
              </button>
              <button type="button" className="btn btn-primary flex-1" onClick={retry} data-autofocus="">
                <Icon name="reset" />
                <span>Reintentar</span>
              </button>
            </>
          }
        >
          <Verdict
            resetKey={`wrong-${st.attempts}`}
            tone="bad"
            verdict="No se sostiene"
            what={`Elegiste: «${chosen.label}».`}
            why={chosen.feedback}
            article={chosen.article}
            concept={chosen.concept}
            eva={evaLine}
            extra={<p className="text-[0.9375rem] leading-snug text-dim">Puedes volver a las pruebas y decidir otra vez (contará como resuelto con ayuda) o ver la solución.</p>}
          />
        </Screen>
      );
    }
    const mistake = c.choices.find((ch) => !ch.correct)?.feedback;
    return (
      <Screen
        title={c.title}
        subtitle={subtitle}
        eva="compact-sm"
        dock={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => go("detective")}>
              <Icon name="archive" />
              <span className={narrow ? "sr-only" : ""}>Expedientes</span>
            </button>
            {bossTime ? (
              <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go("boss")} data-autofocus="">
                <Icon name="swords" />
                <span>Duelo desbloqueado</span>
              </button>
            ) : nextCase ? (
              <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go("detective", nextCase.id)} data-autofocus="">
                <span className="truncate-safe">Siguiente expediente</span>
                <Icon name="next" />
              </button>
            ) : (
              <button type="button" className="btn btn-primary flex-1" onClick={() => go("progress")} data-autofocus="">
                <Icon name="chart" />
                <span>Ver progreso</span>
              </button>
            )}
          </>
        }
      >
        <Verdict
          resetKey={`ok-${st.runKey}`}
          tone={r.gaveUp ? "bad" : r.assisted ? "time" : "ok"}
          verdict={r.gaveUp ? "Solución" : r.assisted ? "Cerrado con ayuda" : "Caso cerrado"}
          picked={r.gaveUp ? undefined : c.choices[st.solution]?.label}
          answer={r.gaveUp ? undefined : correct.label}
          what={`${script.consequence ?? c.resolution}${r.fundOk === false && !r.gaveUp ? ` Fundamento elegido: ${st.fundamento}; el pertinente era ${articleLabel(correct.article)}.` : ""}`}
          why={correct.feedback}
          article={correct.article}
          concept={correct.concept}
          mistake={mistake}
          eva={evaLine}
          extra={[
            <FamilyTree key="tree" c={c} revealed compact />,
            r.log && (
              <p key="log" className="panel-raised flex items-center gap-2 px-3 py-2 text-[0.9375rem] text-ink">
                <Icon name="star" className="text-lilac" /> Nuevo registro en la bitácora de EVA: {r.log}
              </p>
            ),
          ]}
        />
      </Screen>
    );
  }

  /* ── Fase 2: investigación ── */
  const decisionReady = st.solution != null && st.fundamento;
  const tabs = [
    { id: "pruebas", label: "Pruebas", badge: docsTotal - st.seen.length + (st.timeline && !st.timeline.done ? 1 : 0) },
    { id: "familia", label: "Familia", badge: st.branch && !st.branch.done ? 1 : 0 },
    { id: "decision", label: "Decisión", badge: 0 },
  ];

  return (
    <Screen
      title={c.title}
      subtitle={subtitle}
      eva="compact-sm"
      hud={
        <span className={`chip ${pending ? "" : "chip-ok"}`} title="Pistas pendientes">
          <Icon name="search" size={15} /> {pending ? `${pending} pendiente${pending === 1 ? "" : "s"}` : "Listo"}
        </span>
      }
      dock={
        st.tab === "decision" ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={hint} disabled={st.hints >= 3}>
              <Icon name="hint" />
              <span className={narrow ? "sr-only" : ""}>Pista {st.hints ? `${st.hints}/3` : ""}</span>
            </button>
            <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={confirm} disabled={!decisionReady}>
              <Icon name="gavel" />
              <span>{decisionReady ? "Confirmar decisión" : st.solution == null ? "Elige una solución" : "Elige el fundamento"}</span>
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={hint} disabled={st.hints >= 3}>
              <Icon name="hint" />
              <span className={narrow ? "sr-only" : ""}>Pista {st.hints ? `${st.hints}/3` : ""}</span>
            </button>
            {st.view?.timeline && !st.timeline?.done ? (
              <>
                <button type="button" className="btn btn-ghost" onClick={() => { playSfx("close"); set({ view: null }); }} aria-label="Volver al escritorio">
                  <Icon name="prev" />
                </button>
                <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => checkRef.current?.()}>
                  <Icon name="check" />
                  <span>Comprobar orden</span>
                </button>
              </>
            ) : st.view ? (
              <button type="button" className="btn btn-cyan min-w-0 flex-1" onClick={() => { playSfx("close"); set({ view: null }); }}>
                <Icon name="prev" />
                <span>Volver al escritorio</span>
              </button>
            ) : (
              <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => { playSfx("select"); set({ tab: st.tab === "pruebas" ? "familia" : "decision", view: null }); }}>
                <span>{st.tab === "pruebas" ? "Ver la familia" : "Ir a decidir"}</span>
                <Icon name="next" />
              </button>
            )}
          </>
        )
      }
    >
      <div className="col min-h-0 flex-1 gap-2">
        <div className="tabbar shrink-0" role="tablist" aria-label="Vistas del expediente">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={st.tab === t.id} className="tab" onClick={() => { playSfx("tap"); set({ tab: t.id, view: null }); }}>
              <span>{t.label}</span>
              {t.badge > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 text-[0.75rem] font-bold text-bg" aria-label={`${t.badge} pendiente`}>{t.badge}</span>}
            </button>
          ))}
        </div>
        {st.tab === "pruebas" && (st.view?.doc != null ? (
          <DocReader doc={c.documents[st.view.doc]} n={st.view.doc} />
        ) : st.view?.timeline ? (
          <Timeline st={st} set={set} script={script} say={say} speak={speak} c={c} checkRef={checkRef} />
        ) : (
          <Desk c={c} st={st} onOpen={openDoc} onTimeline={() => { playSfx("open"); set({ view: { timeline: true } }); }} />
        ))}
        {st.tab === "familia" && <FamilyPanel c={c} st={st} set={set} script={script} speak={speak} />}
        {st.tab === "decision" && <Decision c={c} st={st} set={set} fundamentos={fundamentos} pending={pending} />}
      </div>
    </Screen>
  );
}

/* ── Escritorio: las pruebas como objetos ── */

const DOC_ICON = (title) => (/testamento/i.test(title) ? "flag" : /certificado|defunci/i.test(title) ? "doc" : /video|c[aá]mara/i.test(title) ? "eye" : /inventario|contable|planilla/i.test(title) ? "chart" : /tiempo|bit[aá]cora/i.test(title) ? "timeline" : "doc");

function Desk({ c, st, onOpen, onTimeline }) {
  const vp = useLayout();
  const cols = vp.width >= 900 ? 4 : vp.width >= 560 ? 3 : 2;
  const cards = [
    ...c.documents.map((d, i) => ({ key: `d${i}`, title: d.title, icon: DOC_ICON(d.title), done: st.seen.includes(i), onClick: () => onOpen(i), label: st.seen.includes(i) ? "Examinado" : "Sin revisar" })),
    ...(st.timeline ? [{ key: "tl", title: "Reconstruir la cronología", icon: "timeline", done: st.timeline.done, onClick: onTimeline, label: st.timeline.done ? "Reconstruida" : "Pendiente", accent: true }] : []),
  ];
  return (
    <div className="col min-h-0 flex-1 gap-2">
      <p className="shrink-0 text-[0.9375rem] leading-snug text-dim">Toca cada prueba para examinarla. EVA anota lo que encuentres.</p>
      <div className="grid min-h-0 flex-1 content-start gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {cards.map((card) => (
          <button key={card.key} type="button" onClick={card.onClick} className={`choice min-h-[96px] flex-col items-start justify-between ${card.done ? "" : card.accent ? "pulse border-magenta" : "pulse"}`}>
            <span className={`grid h-9 w-9 place-items-center rounded-lg border ${card.done ? "border-ok text-ok" : "border-cyan text-cyan"}`}>
              <Icon name={card.done ? "check" : card.icon} size={20} />
            </span>
            <span className="font-semibold leading-snug text-ink">{card.title}</span>
            <span className={`label ${card.done ? "text-ok" : ""}`}>{card.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const MARK = /(\b\d{1,2}\.\d{2}\.\d{4}\b|\blunes\b|\bs[aá]bado\b|\bdos años antes\b|\bcinco d[ií]as\b)/gi;

function Marked({ text }) {
  const parts = String(text).split(MARK);
  return parts.map((p, i) => (i % 2 === 1 ? <mark key={i} className="mark-clue">{p}</mark> : <span key={i}>{p}</span>));
}

function DocReader({ doc, n }) {
  const items = [{ id: `doc-${n}`, text: doc.body, render: (t) => <p className="text-[1.0625rem] leading-relaxed"><Marked text={t} /></p> }];
  return (
    <article className="paper col min-h-0 flex-1 gap-2 p-4" aria-label={doc.title}>
      <p className="label !text-paperInk/70">Prueba {n + 1}</p>
      <h3 className="title-display text-xl">{doc.title}</h3>
      <FitPager items={items} label="Página" pageKey={`doc:${doc.title}`} />
    </article>
  );
}

/* ── Cronología: ordenar sucesos ── */

function Timeline({ st, set, script, say, speak, c, checkRef }) {
  const t = st.timeline;
  const events = script.timeline.events;
  const byId = Object.fromEntries(events.map((e) => [e.id, e]));
  const move = (i, d) => {
    if (t.done) return;
    const j = i + d;
    if (j < 0 || j >= t.order.length) return;
    playSfx("place");
    const order = [...t.order];
    [order[i], order[j]] = [order[j], order[i]];
    set({ timeline: { ...t, order, wrong: [] } });
  };
  const check = () => {
    const ok = t.order.every((id, i) => id === events[i].id);
    if (ok) {
      playSfx("solve");
      speak(script.timeline.done, { mood: "complacida", id: `tl-${c.id}` });
      set({ timeline: { ...t, done: true, wrong: [] } });
    } else {
      playSfx("error");
      say("error", { why: "El orden no calza con las fechas del expediente." });
      set({ timeline: { ...t, tries: t.tries + 1, wrong: t.order.map((id, i) => (id !== events[i].id ? id : null)).filter(Boolean) } });
    }
  };
  if (checkRef) checkRef.current = check;
  return (
    <div className="col min-h-0 flex-1 gap-2">
      <p className="shrink-0 text-[0.9375rem] leading-snug text-dim">{script.timeline.prompt}</p>
      <ol className="grid gap-2">
        {t.order.map((id, i) => {
          const e = byId[id];
          const wrong = t.wrong.includes(id);
          return (
            <li key={id} className={`panel-raised flex items-center gap-2 px-2 py-1.5 ${t.done ? "border-ok" : wrong ? "border-bad" : ""}`}>
              <span className="title-display w-7 text-center text-lg text-cyan tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1 leading-snug text-ink">
                {e.label}
                {t.done && <span className="label block text-ok">{e.date}</span>}
                {wrong && <span className="sr-only"> (posición incorrecta)</span>}
              </span>
              {wrong && <Icon name="close" size={18} className="text-bad" />}
              {!t.done && (
                <span className="flex shrink-0 gap-1">
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Subir: ${e.label}`}>
                    <Icon name="up" />
                  </button>
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => move(i, 1)} disabled={i === t.order.length - 1} aria-label={`Bajar: ${e.label}`}>
                    <Icon name="down" />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {t.done && (
        <p className="flex items-center gap-2 text-[0.9375rem] text-ok">
          <Icon name="check" /> Cronología reconstruida.
        </p>
      )}
    </div>
  );
}

/* ── Familia: árbol por generaciones ── */

const FACT_STATUS = /^(muert|viv|fallec)/i;

function castOf(c, node) {
  const key = fold(node.name).split(/[\s/]+/)[0];
  return c.cast.find((p) => fold(p.name).split(/[\s/]+/)[0] === key) ?? null;
}

const REVEAL = {
  dead: { label: "Fallecido", icon: "dead", cls: "border-faint text-faint" },
  alive: { label: "Vivo", icon: "heart", cls: "border-line text-ink" },
  represented: { label: "Hereda", icon: "check", cls: "border-ok text-ok" },
  excluded: { label: "Fuera", icon: "close", cls: "border-bad text-bad" },
};

export function FamilyTree({ c, selected, onSelect, revealed = false, wrong, compact = false }) {
  const rows = useMemo(() => {
    const byY = new Map();
    [...c.tree].sort((a, b) => a.y - b.y || a.x - b.x).forEach((node) => {
      const key = Math.round(node.y / 14);
      if (!byY.has(key)) byY.set(key, []);
      byY.get(key).push(node);
    });
    return [...byY.values()].map((r) => r.sort((a, b) => a.x - b.x));
  }, [c]);
  return (
    <div className={compact ? "flex flex-wrap justify-center gap-1.5" : "grid gap-1"} role={onSelect ? "listbox" : "list"} aria-label="Árbol familiar">
      {rows.map((row, ri) => (
        <div key={ri} className={compact ? "contents" : "grid gap-1"}>
          {ri > 0 && !compact && <div className="mx-auto h-2 w-px bg-line" aria-hidden="true" />}
          <div className={compact ? "contents" : "flex flex-wrap justify-center gap-2"}>
            {row.map((node) => {
              // Durante la investigación solo se ven los hechos (vivo o fallecido).
              const state = revealed ? node.state : node.state === "dead" ? "dead" : "alive";
              const s = REVEAL[state];
              const isSel = selected === node.id;
              const content = (
                <>
                  <span className={`grid shrink-0 place-items-center rounded-full border ${compact ? "h-6 w-6" : "h-7 w-7"} ${s.cls}`}>
                    <Icon name={s.icon} size={compact ? 13 : 15} />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className={`block font-semibold leading-tight text-ink ${compact ? "text-[0.875rem]" : ""}`}>
                      {node.name}
                      {compact && <span className="sr-only"> · {s.label}</span>}
                    </span>
                    {!compact && (
                      <span className="block text-[0.8125rem] leading-tight text-dim">
                        {node.tag}
                        {revealed && ` · ${s.label}`}
                      </span>
                    )}
                  </span>
                </>
              );
              return onSelect ? (
                <button key={node.id} type="button" role="option" aria-selected={isSel} className={`choice min-w-[124px] max-w-[200px] items-center gap-2 px-2.5 py-1.5 ${isSel ? "is-selected" : ""} ${wrong === node.id ? "is-wrong" : ""}`} style={{ width: "auto", minHeight: 44 }} onClick={() => onSelect(node.id)}>
                  {content}
                </button>
              ) : (
                <div key={node.id} role="listitem" title={s.label} className={`panel-raised flex max-w-[220px] items-center ${compact ? "gap-1.5 px-1.5 py-0.5" : "min-w-[124px] gap-2 px-2.5 py-1.5"} ${revealed ? s.cls.split(" ")[0] : ""}`}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function FamilyPanel({ c, st, set, script, speak }) {
  const node = c.tree.find((x) => x.id === st.node);
  const person = node ? castOf(c, node) : null;
  const b = st.branch;
  const mark = () => {
    if (!node || !b || b.done) return;
    if (node.id === script.branch.node) {
      playSfx("connect");
      speak(script.branch.explain, { mood: "complacida", id: `br-${c.id}` });
      set({ branch: { ...b, done: true, wrong: null } });
    } else {
      playSfx("error");
      speak(`${node.name} no es la clave. Mira quién cambia el resultado según lo que dicen las pruebas.`, { mood: "neutral", id: `brw-${c.id}-${node.id}` });
      set({ branch: { ...b, tries: b.tries + 1, wrong: node.id } });
    }
  };
  const vp = useLayout();
  const side = vp.width > vp.height && vp.height < 600;
  return (
    <div className={side ? "grid min-h-0 flex-1 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start gap-3" : "col min-h-0 flex-1 gap-2"}>
      {/* La ficha de la persona elegida ocupa el lugar de la consigna: el árbol conserva su espacio. */}
      {!node && b && (
        <p className={`flex min-h-[52px] shrink-0 items-center text-[0.9375rem] leading-snug ${b.done ? "text-ok" : "text-ink"}`}>
          {b.done ? (
            <span>
              <Icon name="check" size={16} className="mr-1 inline" />
              {script.branch.explain}
            </span>
          ) : (
            <span>{script.branch.prompt} Toca a una persona.</span>
          )}
        </p>
      )}
      {!node && !b && <p className="flex min-h-[52px] shrink-0 items-center text-[0.9375rem] leading-snug text-dim">Toca a cada persona para ver quién es.</p>}
      {node && (
        <div className="panel-raised flex min-h-[52px] shrink-0 items-center gap-2 px-3 py-1.5">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">{person?.name ?? node.name}</p>
            <p className="text-[0.875rem] leading-snug text-dim">
              {person?.role ?? node.tag}
              {person?.status && FACT_STATUS.test(person.status) ? ` · ${person.status}` : ""}
            </p>
          </div>
          {b && !b.done && (
            <button type="button" className="btn btn-cyan btn-sm" onClick={mark}>
              <Icon name="target" size={18} />
              <span>Es esta</span>
            </button>
          )}
          {b?.done && <Icon name="check" className="text-ok" title="Rama identificada" />}
        </div>
      )}
      <div className="min-h-0 flex-1">
        <FamilyTree c={c} selected={st.node} wrong={b?.wrong} onSelect={(id) => { playSfx("tap"); set({ node: st.node === id ? null : id }); }} />
      </div>
    </div>
  );
}

/* ── Decisión: solución + fundamento ── */

function Decision({ c, st, set, fundamentos, pending }) {
  const vp = useLayout();
  const step = st.solution == null ? "solution" : "fundamento";
  const sol = st.solution != null ? c.choices[st.solution] : null;
  return (
    <div className="col min-h-0 flex-1 gap-2">
      {pending > 0 && step === "solution" && (
        <p className="flex shrink-0 items-center gap-2 text-[0.875rem] text-warn">
          <Icon name="alert" size={16} /> Quedan {pending} prueba{pending === 1 ? "" : "s"} sin revisar. Puedes decidir igual.
        </p>
      )}
      {step === "solution" ? (
        <>
          <p className="label shrink-0">1 · ¿Qué debe resolverse?</p>
          <div className="grid gap-2" role="radiogroup" aria-label="Solución">
            {c.choices.map((ch, i) => (
              <button key={ch.label} type="button" role="radio" aria-checked={st.solution === i} className="choice" onClick={() => { playSfx("select"); set({ solution: i }); }}>
                <span className="choice-key">{i + 1}</span>
                <span className="min-w-0 flex-1 text-ink">{ch.label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button type="button" className="choice shrink-0 items-center" onClick={() => { playSfx("tap"); set({ solution: null, fundamento: null }); }} aria-label={`Solución elegida: ${sol.label}. Toca para cambiarla.`}>
            <span className="choice-key">
              <Icon name="check" size={14} />
            </span>
            <span className="min-w-0 flex-1 text-ink">{sol.label}</span>
            <span className="label">Cambiar</span>
          </button>
          <p className="label shrink-0">2 · ¿Con qué fundamento?</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${vp.width >= 560 ? 3 : 1}, minmax(0, 1fr))` }} role="radiogroup" aria-label="Fundamento">
            {fundamentos.map((f) => (
              <button key={f} type="button" role="radio" aria-checked={st.fundamento === f} className="choice items-center" onClick={() => { playSfx("select"); set({ fundamento: f }); }}>
                <Icon name="gavel" size={18} className="text-cyan" />
                <span className="font-semibold text-ink">{articleLabel(f)}</span>
              </button>
            ))}
          </div>
          <p className="shrink-0 text-[0.8125rem] text-faint">Puedes cambiar ambas elecciones hasta confirmar.</p>
        </>
      )}
    </div>
  );
}
