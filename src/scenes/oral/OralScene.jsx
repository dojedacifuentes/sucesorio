import { useCallback, useEffect, useMemo, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { ORAL, moduleTitle } from "../../game/content.js";
import { recordAnswer } from "../../game/progress.js";
import { finishRun, saveRun } from "../../game/session.js";
import { hashSeed, newSeed, seededShuffle } from "../../game/rng.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Choices from "../../ui/Choices.jsx";
import Verdict from "../../ui/Verdict.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

const SIZE = 4;
const ROLES = [
  { id: "concepto", label: "Concepto", ask: "¿Cómo lo define, en una frase?" },
  { id: "norma", label: "Norma", ask: "¿Dónde está eso en la ley?" },
  { id: "doctrina", label: "Doctrina", ask: "¿Y por qué importa la distinción?" },
  { id: "caso", label: "Caso", ask: "Deme un ejemplo." },
];
const byId = new Map(ORAL.map((q) => [q.id, q]));
/** El texto de un bloque sin su rótulo («Norma: …» → «…»). */
const body = (label) => String(label).replace(/^\s*(concepto|norma|doctrina|caso)\s*:\s*/i, "");

export default function OralScene() {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const resumable = save.run?.scene === "oral" && save.run.state?.ids?.length;
  const [run, setRun] = useState(() => {
    if (resumable) return save.run.state;
    const seed = newSeed();
    return { seed, ids: seededShuffle(ORAL, seed).slice(0, SIZE).map((q) => q.id), i: 0, stage: "build", slots: {}, objection: null, results: [] };
  });
  const q = byId.get(run.ids[run.i]);
  const blocks = useMemo(() => seededShuffle(q.blocks, hashSeed(`${run.seed}:${q.id}`)), [q, run.seed]);
  const placedIds = new Set(Object.values(run.slots));
  const role = ROLES[hashSeed(`${run.seed}:${q.id}:obj`) % ROLES.length];

  // Repregunta de la comisión: el bloque correcto de ese papel entre otros del mismo papel de otras preguntas.
  const objectionOptions = useMemo(() => {
    const own = q.blocks.find((b) => b.id === role.id);
    const others = seededShuffle(ORAL.filter((x) => x.id !== q.id).map((x) => x.blocks.find((b) => b.id === role.id)).filter(Boolean), hashSeed(`${run.seed}:${q.id}:o`))
      .map((b) => body(b.label))
      .filter((t) => t !== body(own.label))
      .slice(0, 2);
    return { answer: body(own.label), options: seededShuffle([body(own.label), ...others], hashSeed(`${run.seed}:${q.id}:oo`)) };
  }, [q, role.id, run.seed]);

  useEffect(() => {
    update((s) => saveRun(s, { scene: "oral", param: null, title: "Sala oral", state: run }));
  }, [run, update]);
  useEffect(() => {
    if (!resumable) say("oralStart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Una frase a la vez: la primera aún sin papel.
  const current = blocks.find((b) => !placedIds.has(b.id)) ?? null;
  const assign = (roleId) => {
    if (run.stage !== "build" || !current) return;
    playSfx("place");
    // Si el papel ya tenía una frase, esa vuelve a la fila.
    setRun((r) => ({ ...r, slots: { ...r.slots, [roleId]: current.id } }));
  };
  const empty = (roleId) => {
    if (run.stage !== "build" || !run.slots[roleId]) return;
    playSfx("tap");
    setRun((r) => {
      const slots = { ...r.slots };
      delete slots[roleId];
      return { ...r, slots };
    });
  };

  const complete = ROLES.every((r) => run.slots[r.id]);
  const toSummary = () => complete && (playSfx("page"), setRun((r) => ({ ...r, stage: "summary" })));
  const present = () => {
    const correctSlots = ROLES.filter((r) => run.slots[r.id] === r.id).length;
    playSfx(correctSlots === 4 ? "success" : "error");
    setRun((r) => ({ ...r, stage: "objection", structure: correctSlots }));
  };
  const answerObjection = useCallback(
    (option) => {
      if (run.stage !== "objection") return;
      const ok = option === objectionOptions.answer;
      const structureOk = run.structure === 4;
      playSfx(ok && structureOk ? "solve" : ok ? "success" : "error");
      update((s) => recordAnswer(s, { key: `oral:${run.seed}:${q.id}`, correct: structureOk && ok, module: q.module, concept: q.prompt, mode: "oral", feedback: q.feedback, xp: structureOk && ok ? 20 : ok || structureOk ? 8 : 2 }));
      const line = structureOk && ok ? say("success") : say("error", { why: structureOk ? "La estructura estaba bien; la repregunta, no." : "Revisa qué papel cumple cada frase." });
      setRun((r) => ({ ...r, stage: "verdict", objection: option, results: [...r.results, { id: q.id, structure: r.structure, objection: ok }], evaLine: line ? { text: line.text, mood: line.mood } : null }));
    },
    [run, objectionOptions.answer, q, update, say],
  );
  const next = useCallback(() => {
    if (run.stage !== "verdict") return;
    if (run.i + 1 >= run.ids.length) {
      const res = run.results;
      update((s) =>
        finishRun(s, {
          id: `oral:${run.seed}`,
          mode: "oral",
          title: "Sala oral",
          correct: res.filter((x) => x.structure === 4 && x.objection).length,
          answered: res.length,
          message: "En el oral no gana quien recita más, sino quien ubica cada pieza: qué es, dónde está, por qué importa y un caso.",
          details: res.map((x) => ({ label: byId.get(x.id).prompt, ok: x.structure === 4 && x.objection, note: `Estructura ${x.structure}/4 · repregunta ${x.objection ? "bien" : "mal"}` })),
          stat: "oralAnswered",
          replay: { scene: "oral", param: null, label: "Otra comisión" },
        }),
      );
      go("results", null, { replace: true });
      return;
    }
    playSfx("page");
    setRun((r) => ({ ...r, i: r.i + 1, stage: "build", slots: {}, objection: null, structure: null, evaLine: null }));
  }, [run, update, go]);

  useKeys({
    Enter: () => (run.stage === "build" ? toSummary() : run.stage === "summary" ? present() : run.stage === "verdict" ? next() : undefined),
    ...(run.stage === "build" ? Object.fromEntries(ROLES.map((r, i) => [String(i + 1), () => !run.slots[r.id] && assign(r.id)])) : {}),
  });

  const narrow = vp.width < 420;
  const wide = vp.width >= 760;
  const subtitle = `Pregunta ${run.i + 1} de ${run.ids.length} · ${moduleTitle(q.module)}`;

  if (run.stage === "verdict") {
    const structureOk = run.structure === 4;
    const ok = run.objection === objectionOptions.answer;
    return (
      <Screen title="Sala oral" subtitle={subtitle} eva="compact" dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => open("pause")} aria-label="Pausa">
            <Icon name="pause" />
          </button>
          <button type="button" className="btn btn-primary flex-1" onClick={next} data-autofocus="">
            <span>{run.i + 1 >= run.ids.length ? "Ver resultado" : "Siguiente pregunta"}</span>
            <Icon name="next" />
          </button>
        </>
      }>
        <Verdict
          resetKey={q.id}
          tone={structureOk && ok ? "ok" : structureOk || ok ? "time" : "bad"}
          verdict={structureOk && ok ? "La comisión asiente" : structureOk ? "Buena estructura, repregunta fallida" : ok ? "Repregunta bien, estructura floja" : "La comisión frunce el ceño"}
          what={q.prompt}
          why={q.feedback}
          eva={run.evaLine}
          extra={
            <ol className="grid gap-1.5">
              {ROLES.map((r) => {
                const b = q.blocks.find((x) => x.id === r.id);
                const good = run.slots[r.id] === r.id;
                return (
                  <li key={r.id} className={`panel-raised flex gap-2 px-3 py-1.5 ${good ? "" : "border-bad"}`}>
                    <Icon name={good ? "check" : "close"} size={16} className={`mt-0.5 ${good ? "text-ok" : "text-bad"}`} />
                    <span className="min-w-0 flex-1 text-[0.9375rem] leading-snug text-ink">
                      <span className="label mr-1 text-lilac">{r.label}</span>
                      {body(b.label)}
                    </span>
                  </li>
                );
              })}
            </ol>
          }
        />
      </Screen>
    );
  }

  if (run.stage === "objection") {
    return (
      <Screen title="Sala oral" subtitle={subtitle} eva="compact" dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => open("pause")}>
            <Icon name="pause" />
            <span>Pausa</span>
          </button>
          <p className="label flex-1 text-right">Elige tu respuesta</p>
        </>
      }>
        <section className="panel col min-h-0 flex-1 gap-3 p-3">
          <p className="label text-magenta">Repregunta de la comisión</p>
          <p className="title-display text-[1.3rem] leading-snug text-ink">«{role.ask}»</p>
          <p className="text-[0.875rem] text-dim">Sobre: {q.prompt}</p>
          <div className="min-h-0 flex-1" />
          <Choices options={objectionOptions.options} onPick={answerObjection} columns={1} />
        </section>
      </Screen>
    );
  }

  if (run.stage === "summary") {
    const items = ROLES.map((r) => ({
      id: r.id,
      text: body(blocks.find((b) => b.id === run.slots[r.id]).label),
      render: (t, o) => (
        <p className="text-[1rem] leading-relaxed text-ink">
          {!o?.continued && <span className="label mr-2 text-lilac">{r.label}</span>}
          {t}
        </p>
      ),
    }));
    return (
      <Screen title="Sala oral" subtitle={subtitle} eva="compact" dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => setRun((r) => ({ ...r, stage: "build" }))}>
            <Icon name="undo" />
            <span>Editar</span>
          </button>
          <button type="button" className="btn btn-primary flex-1" onClick={present} data-autofocus="">
            <Icon name="mic" />
            <span>Presentar</span>
          </button>
        </>
      }>
        <section className="panel col min-h-0 flex-1 gap-2 p-3">
          <p className="label shrink-0 text-cyan">Tu respuesta, en voz alta</p>
          <p className="shrink-0 font-semibold text-ink">{q.prompt}</p>
          <FitPager items={items} gap={8} label="Página" />
        </section>
      </Screen>
    );
  }

  // Armar: cada frase, una a la vez, a su papel (1–4 con teclado).
  return (
    <Screen
      title="Sala oral"
      subtitle={subtitle}
      eva="compact"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => setRun((r) => ({ ...r, slots: {} }))} disabled={!Object.keys(run.slots).length} aria-label="Empezar de nuevo">
            <Icon name="reset" />
          </button>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={toSummary} disabled={!complete}>
            <span>{complete ? "Ver síntesis" : `Frase ${Math.min(4, placedIds.size + 1)} de 4`}</span>
            <Icon name="next" />
          </button>
        </>
      }
    >
      <div className="col min-h-0 flex-1 gap-2">
        <p className="shrink-0 font-semibold leading-snug text-ink">{q.prompt}</p>
        <section className="panel col min-h-0 flex-1 justify-center gap-2 p-3" aria-live="polite">
          {current ? (
            <>
              <p className="label text-cyan">¿Qué papel cumple esta frase en tu respuesta?</p>
              <FitPager key={current.id} items={[{ id: current.id, text: body(current.label), render: (t) => <p className="title-display text-[1.15rem] leading-snug text-ink">«{t}»</p> }]} label="Frase" />
            </>
          ) : (
            <p className="text-center text-ok">
              <Icon name="check" className="mr-1 inline" /> Las cuatro frases tienen papel. Revisa la síntesis.
            </p>
          )}
        </section>
        <div className="grid shrink-0 grid-cols-2 gap-2" role="group" aria-label="Papeles">
          {ROLES.map((r, i) => {
            const id = run.slots[r.id];
            const b = id ? blocks.find((x) => x.id === id) : null;
            return b ? (
              <button key={r.id} type="button" className="slot min-w-0 text-left" onClick={() => empty(r.id)} aria-label={`${r.label}: ${body(b.label)}. Toca para quitarla.`} title={body(b.label)}>
                <Icon name="check" size={16} className="shrink-0 text-ok" />
                <span className="label shrink-0 text-lilac">{r.label}</span>
                <span className="min-w-0 flex-1 text-[0.8125rem] leading-tight text-dim">{narrow ? "lista" : `${body(b.label).split(" ").slice(0, 3).join(" ")}…`}</span>
              </button>
            ) : (
              <button key={r.id} type="button" className="btn btn-cyan min-w-0 justify-start" onClick={() => assign(r.id)} disabled={!current}>
                <span className="choice-key">{i + 1}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
