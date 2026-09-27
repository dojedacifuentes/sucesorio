import { useCallback, useEffect, useMemo, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { CALCS } from "../../game/content.js";
import { recordAnswer } from "../../game/progress.js";
import { clearRun, finishRun, saveRun } from "../../game/session.js";
import { newSeed } from "../../game/rng.js";
import { checkAmount, formatAmount, parseAmount } from "../../game/format.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Verdict from "../../ui/Verdict.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

export const LABELS = {
  conyuge: "Cónyuge",
  hijo: "El hijo",
  cadaHijo: "Cada hijo",
  cadaAscendiente: "Cada ascendiente",
  cadaCarnal: "Cada hermano carnal",
  medioHermano: "El medio hermano",
  acervoIliquido: "Acervo ilíquido",
  acervoLiquido: "Acervo líquido",
  primerAcervo: "Primer acervo imaginario",
  mitadLegitimaria: "Mitad legitimaria",
  cuartaMejoras: "Cuarta de mejoras",
  cuartaLibre: "Cuarta de libre disposición",
  sumaBase: "Acervo más donaciones",
  cuartaReferencia: "Cuarta parte de esa suma",
  exceso: "Exceso de las donaciones",
  segundoAcervo: "Segundo acervo imaginario",
  saldoLegitima: "Saldo de la legítima",
  cubreLegitima: "Parte de la donación que cubre la legítima",
  excesoAMejora: "Exceso imputado a mejoras",
};
const label = (k) => LABELS[k] ?? k;

export default function AcervosScene({ param }) {
  const c = param ? CALCS.find((x) => x.id === param) : null;
  if (!c) return <CalcSelect />;
  return <CalcRun key={c.id} c={c} />;
}

function CalcSelect() {
  const { save } = useGame();
  const { go } = useNav();
  const vp = useLayout();
  const cols = vp.width >= 900 ? 3 : vp.width >= 560 ? 2 : 1;
  const done = (id) => save.awards?.[`stat:acervoLabs:calc:${id}`];
  const next = CALCS.find((c) => !done(c.id)) ?? CALCS[0];
  const items = [];
  for (let i = 0; i < CALCS.length; i += cols) {
    const row = CALCS.slice(i, i + cols);
    items.push({
      id: `r${i}`,
      render: () => (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {row.map((c) => (
            <button key={c.id} type="button" className={`choice items-center ${c.id === next.id ? "is-selected" : ""}`} onClick={() => go("acervos", c.id)}>
              <Icon name="flask" className="text-cyan" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-ink">{c.title}</span>
                <span className="label block">{Object.keys(c.answers).length} pasos · art. {c.article}</span>
              </span>
              {done(c.id) && <span className="chip chip-ok">Hecho</span>}
            </button>
          ))}
        </div>
      ),
    });
  }
  return (
    <Screen
      title="Laboratorio de acervos"
      subtitle="Cálculo paso a paso"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="prev" />
            <span>Archivo</span>
          </button>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go("acervos", next.id)} data-autofocus="">
            <Icon name="flask" />
            <span className="truncate-safe">{next.title}</span>
          </button>
        </>
      }
    >
      <FitPager items={items} gap={8} pageKey="calcs" label="Cálculos" />
    </Screen>
  );
}

function freshCalc(c) {
  return { seed: newSeed(), step: 0, entry: "", results: {}, tries: {}, shown: {}, stage: "intro", error: null };
}

function CalcRun({ c }) {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say, speak } = useEva();
  const vp = useLayout();
  const keys = Object.keys(c.answers);
  const resumable = save.run?.scene === "acervos" && save.run.param === c.id && save.run.state?.stage;
  const [st, setSt] = useState(() => (resumable ? save.run.state : freshCalc(c)));
  const key = keys[st.step];

  useEffect(() => {
    if (st.stage === "done") update((s) => clearRun(s, "acervos"));
    else update((s) => saveRun(s, { scene: "acervos", param: c.id, title: `Acervos: ${c.title}`, state: st }));
  }, [st, update, c.id, c.title]);
  useEffect(() => {
    if (!resumable) say("acervosStart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const type = useCallback(
    (ch) => {
      if (st.stage !== "step") return;
      setSt((s) => {
        let e = s.entry;
        if (ch === "back") e = e.slice(0, -1);
        else if (ch === "clear") e = "";
        else if (ch === "," && (e.includes(",") || e === "")) return s;
        else if (e.length >= 12) return s;
        else e = e + ch;
        return { ...s, entry: e, error: null };
      });
      playSfx("tick");
    },
    [st.stage],
  );

  const check = useCallback(() => {
    if (st.stage !== "step") return;
    const expected = c.answers[key];
    const parsed = parseAmount(st.entry);
    // Vacío no es cero: sin respuesta no se evalúa ni se castiga.
    if (parsed.status === "empty") return setSt((s) => ({ ...s, error: "Escribe un número. (Cero también vale, si es lo que corresponde.)" }));
    if (parsed.status === "invalid") return setSt((s) => ({ ...s, error: "No entiendo ese número. Usa dígitos y, si hace falta, una coma decimal." }));
    const res = checkAmount(st.entry, expected);
    const firstTry = !(st.tries[key] > 0);
    const assisted = !firstTry || Boolean(st.shown[key]);
    if (res.ok) {
      playSfx("success");
      update((s) => recordAnswer(s, { key: `calc:${st.seed}:${c.id}:${key}`, correct: true, assisted, module: "acervos-calculo", article: c.article, concept: label(key), mode: "acervos", xp: assisted ? 4 : 12 }));
      setSt((s) => ({ ...s, results: { ...s.results, [key]: { ok: true, value: res.value, assisted } }, stage: s.step + 1 >= keys.length ? "done" : "step", step: s.step + 1 >= keys.length ? s.step : s.step + 1, entry: "", error: null }));
      if (st.step + 1 >= keys.length) finish({ ...st.results, [key]: { ok: true, value: res.value, assisted } });
    } else {
      playSfx("error");
      update((s) => recordAnswer(s, { key: `calc:${st.seed}:${c.id}:${key}:${st.tries[key] ?? 0}`, correct: false, module: "acervos-calculo", article: c.article, concept: label(key), mode: "acervos", xp: 1 }));
      setSt((s) => ({ ...s, tries: { ...s.tries, [key]: (s.tries[key] ?? 0) + 1 }, error: `${formatAmount(res.value)} no calza. Revisa el paso y vuelve a intentarlo, o pide ver el procedimiento.` }));
    }
  }, [st, c, key, keys.length, update]);

  const finish = (results) => {
    const vals = Object.values(results);
    const auto = vals.filter((r) => r.ok && !r.assisted).length;
    const line = auto === keys.length ? say("success") : say("assisted");
    void line;
    update((s) => finishRun(s, {
      id: `calc:${st.seed}:${c.id}`,
      mode: "acervos",
      title: `Acervos: ${c.title}`,
      correct: vals.filter((r) => r.ok).length,
      answered: keys.length,
      assisted: vals.filter((r) => r.assisted).length,
      outcome: "completado",
      message: auto === keys.length ? "Cálculo limpio: cada paso a la primera." : "Llegaste al resultado; los pasos con ayuda quedan anotados aparte.",
      details: keys.map((k) => ({ label: `${label(k)}: ${formatAmount(c.answers[k])}`, ok: results[k]?.ok && !results[k]?.assisted ? true : null, note: results[k]?.assisted ? "Con ayuda o reintento" : undefined })),
      stat: null,
      replay: { scene: "acervos", param: null, label: "Otro cálculo" },
    }));
    update((s) => ({ ...s, awards: { ...s.awards, [`stat:acervoLabs:calc:${c.id}`]: new Date().toISOString() }, profile: { ...s.profile, stats: { ...s.profile.stats, acervoLabs: (s.profile.stats.acervoLabs ?? 0) + (s.awards?.[`stat:acervoLabs:calc:${c.id}`] ? 0 : 1) } } }));
  };

  const showSteps = () => {
    playSfx("select");
    speak(c.steps.join(" "), { mood: "neutral", id: `steps-${c.id}` });
    setSt((s) => ({ ...s, shown: { ...s.shown, [key]: true } }));
    if (vp.layout === "stack" || vp.short) open("eva");
  };

  const keyHandlers = { Enter: () => (st.stage === "intro" ? setSt((s) => ({ ...s, stage: "step" })) : st.stage === "step" ? check() : go("results")), Backspace: () => type("back"), ",": () => type(","), ".": () => type(",") };
  for (let d = 0; d <= 9; d += 1) keyHandlers[String(d)] = () => type(String(d));
  useKeys(keyHandlers);

  const narrow = vp.width < 420;

  if (st.stage === "intro") {
    return (
      <Screen
        title={c.title}
        subtitle="Laboratorio de acervos"
        eva="compact"
        dock={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => go("acervos")}>
              <Icon name="prev" />
              <span className={narrow ? "sr-only" : ""}>Cálculos</span>
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={() => { playSfx("confirm"); setSt((s) => ({ ...s, stage: "step" })); }} data-autofocus="">
              <Icon name="play" />
              <span>Calcular</span>
            </button>
          </>
        }
      >
        <div className="col min-h-0 flex-1 justify-center gap-3">
          <p className="label text-cyan">Planilla · art. {c.article}</p>
          <p className="title-display text-[1.5rem] leading-snug text-ink">{c.prompt}</p>
          <ol className="grid gap-1.5">
            {keys.map((k, i) => (
              <li key={k} className="flex items-center gap-2 text-dim">
                <span className="title-display w-6 text-center text-cyan">{i + 1}</span>
                {label(k)}
              </li>
            ))}
          </ol>
        </div>
      </Screen>
    );
  }

  if (st.stage === "done") {
    const max = Math.max(...keys.map((k) => c.answers[k]), 1);
    return (
      <Screen
        title={c.title}
        subtitle="Cálculo completo"
        eva="compact"
        dock={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => go("acervos")}>
              <Icon name="flask" />
              <span className={narrow ? "sr-only" : ""}>Cálculos</span>
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={() => go("results")} data-autofocus="">
              <span>Ver resultado</span>
              <Icon name="next" />
            </button>
          </>
        }
      >
        <Verdict
          resetKey={c.id}
          tone={Object.values(st.results).every((r) => !r.assisted) ? "ok" : "time"}
          verdict={Object.values(st.results).every((r) => !r.assisted) ? "Planilla cuadrada" : "Cuadrada con ayuda"}
          what={c.prompt}
          why={c.steps.join(" ")}
          article={c.article}
          extra={
            <div className="grid gap-1.5" aria-label="Resultado del cálculo">
              {keys.map((k) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2">
                  <span className="text-[0.875rem] leading-tight text-dim">{label(k)}</span>
                  <span className="title-display tabular-nums text-ink">{formatAmount(c.answers[k])}</span>
                  <span className="meter col-span-2 h-2">
                    <span style={{ width: `${(c.answers[k] / max) * 100}%`, background: "linear-gradient(90deg, rgb(var(--c-blue)), rgb(var(--c-violet)))" }} />
                  </span>
                </div>
              ))}
            </div>
          }
        />
      </Screen>
    );
  }

  const short = vp.height < 560;
  const PAD = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ",", "0", "back"];
  return (
    <Screen
      title={c.title}
      subtitle={`Paso ${st.step + 1} de ${keys.length}`}
      eva="compact"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={showSteps}>
            <Icon name="hint" />
            <span className={narrow ? "sr-only" : ""}>Ver procedimiento</span>
          </button>
          <button type="button" className="btn btn-primary flex-1" onClick={check}>
            <Icon name="check" />
            <span>Comprobar</span>
          </button>
        </>
      }
    >
      <div className={short ? "grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3" : "col min-h-0 flex-1 gap-2"}>
        <div className="col min-h-0 gap-2">
          <p className="shrink-0 text-[0.9375rem] leading-snug text-dim">{c.prompt}</p>
          {keys.slice(0, st.step).map((k) => (
            <p key={k} className="flex shrink-0 items-center justify-between gap-2 text-[0.875rem]">
              <span className="text-dim">{label(k)}</span>
              <span className="flex items-center gap-1 font-semibold tabular-nums text-ok">
                <Icon name="check" size={14} /> {formatAmount(c.answers[k])}
              </span>
            </p>
          ))}
          <label className="label shrink-0 text-cyan" htmlFor="calc-display">
            {label(key)}
          </label>
          <output id="calc-display" className={`panel-raised flex h-14 shrink-0 items-center justify-end px-4 font-display text-3xl tabular-nums ${st.error ? "border-bad" : "border-cyan"}`} aria-live="polite">
            {st.entry || <span className="text-faint">—</span>}
          </output>
          {st.error && <p className="shrink-0 text-[0.875rem] leading-snug text-bad" role="alert">{st.error}</p>}
        </div>
        <div className="grid shrink-0 grid-cols-3 gap-1.5 self-end" role="group" aria-label="Teclado numérico">
          {PAD.map((k) => (
            <button key={k} type="button" className="btn h-11 text-lg font-bold" onClick={() => type(k)} aria-label={k === "back" ? "Borrar" : k === "," ? "Coma decimal" : k}>
              {k === "back" ? <Icon name="backspace" /> : k}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}
