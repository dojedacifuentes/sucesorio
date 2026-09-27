import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { ARCADE, moduleTitle } from "../../game/content.js";
import { recordAnswer } from "../../game/progress.js";
import { finishRun, saveRun } from "../../game/session.js";
import { hashSeed, newSeed, seededShuffle } from "../../game/rng.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Choices from "../../ui/Choices.jsx";
import Verdict from "../../ui/Verdict.jsx";
import Icon from "../../ui/Icon.jsx";
import { timerSeconds, useCountdown, useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

export const LEVELS = [
  { id: "aprendiz", label: "Aprendiz", seconds: 26, note: "Preguntas del banco base y reloj holgado." },
  { id: "litigante", label: "Litigante", seconds: 18, note: "Mezcla de base y avanzadas." },
  { id: "ministro", label: "Ministro", seconds: 12, note: "Avanzadas primero y reloj corto." },
];
const LIVES = 3;
const REVEAL_MS = 420;

function config(param) {
  return param === "rapida" ? { quick: true, waves: 1, perWave: 8, title: "Partida rápida" } : { quick: false, waves: 3, perWave: 5, title: "Neón de artículos" };
}

/** Siguiente oleada: preguntas aún no usadas, del nivel que corresponde. Determinista por semilla. */
function drawWave(seed, level, used, count) {
  const usedSet = new Set(used);
  const t1 = seededShuffle(ARCADE.filter((q) => q.tier === 1), hashSeed(`${seed}:1`)).filter((q) => !usedSet.has(q.id));
  const t2 = seededShuffle(ARCADE.filter((q) => q.tier === 2), hashSeed(`${seed}:2`)).filter((q) => !usedSet.has(q.id));
  const out = [];
  for (let i = 0; i < count; i += 1) {
    // Aprendiz: base; Litigante: alterna; Ministro: avanzadas (base si se agotan).
    const wantAdvanced = level === 2 || (level === 1 && i % 2 === 1);
    const source = wantAdvanced ? (t2.length ? t2 : t1) : t1.length ? t1 : t2;
    const q = source.shift();
    if (q) out.push(q.id);
  }
  return out;
}

const byId = new Map(ARCADE.map((q) => [q.id, q]));

function freshRun(param, levelId) {
  const cfg = config(param);
  const seed = newSeed();
  const level = Math.max(0, LEVELS.findIndex((l) => l.id === levelId));
  const quickLevel = cfg.quick ? 1 : level;
  return {
    seed,
    level: quickLevel,
    startLevel: quickLevel,
    wave: 0,
    q: 0,
    ids: drawWave(seed, quickLevel, [], cfg.perWave),
    used: [],
    lives: LIVES,
    score: 0,
    combo: 0,
    bestCombo: 0,
    correct: 0,
    answered: 0,
    waveCorrect: 0,
    log: [],
    phase: "ask",
    last: null,
  };
}

export default function ArcadeScene({ param }) {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const cfg = config(param);
  const resumable = save.run?.scene === "arcade" && (save.run.param ?? null) === (param ?? null) && save.run.state?.phase;
  const [run, setRun] = useState(() => (resumable ? save.run.state : cfg.quick ? freshRun(param) : null));
  const [reveal, setReveal] = useState(null);
  const [evaLine, setEvaLine] = useState(null);
  const locked = useRef(false);
  const wrongStreak = useRef(0);

  const question = run && run.phase !== "wave" ? byId.get(run.ids[run.q]) : null;
  const level = run ? LEVELS[run.level] : null;
  const seconds = run && level ? timerSeconds(level.seconds, save.settings.timer) : null;

  // Orden estable de alternativas por partida y pregunta.
  const options = useMemo(() => (question ? seededShuffle(question.options, hashSeed(`${run.seed}:${question.id}`)) : []), [question, run?.seed]);

  // Guarda la partida en curso para «Continuar».
  useEffect(() => {
    if (!run) return;
    update((s) => saveRun(s, { scene: "arcade", param: param ?? null, title: cfg.title, state: run }));
  }, [run, update, param, cfg.title]);

  useEffect(() => {
    if (run && !resumable) say("arcadeStart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(run)]);

  const answer = useCallback(
    (option) => {
      if (!run || run.phase !== "ask" || locked.current || !question) return;
      locked.current = true;
      const correct = option === question.answer;
      const timedOut = option === null;
      setReveal({ picked: option, answer: question.answer });
      playSfx(correct ? "success" : timedOut ? "damage" : "error");
      const key = `arcade:${run.seed}:${question.id}`;
      update((s) => recordAnswer(s, { key, correct, module: question.module, article: question.article, concept: question.concept, mode: "arcade", feedback: question.feedback, xp: correct ? 14 + run.combo * 2 : 2 }));
      wrongStreak.current = correct ? 0 : wrongStreak.current + 1;
      const combo = correct ? run.combo + 1 : 0;
      let line;
      if (timedOut) line = say("timeout");
      else if (correct) line = combo >= 3 && combo % 3 === 0 ? say("combo", { combo }) ?? say("success") : say("success");
      else line = say(wrongStreak.current >= 2 ? "errorRepeat" : "lifeLost", { why: `Era «${question.answer}».` });
      setEvaLine(line ? { text: line.text, mood: line.mood } : null);
      if (combo >= 3 && correct) playSfx("combo");
      const bonus = seconds && !timedOut ? Math.round((leftRef.current ?? 0) * 3) : 0;
      window.setTimeout(() => {
        setRun((r) => ({
          ...r,
          phase: "verdict",
          lives: correct ? r.lives : r.lives - 1,
          combo,
          bestCombo: Math.max(r.bestCombo, combo),
          score: r.score + (correct ? 100 + r.combo * 20 + bonus : 0),
          correct: r.correct + (correct ? 1 : 0),
          answered: r.answered + 1,
          waveCorrect: r.waveCorrect + (correct ? 1 : 0),
          used: [...r.used, question.id],
          log: [...r.log, { id: question.id, ok: correct, picked: option }],
          last: { picked: option, correct, timedOut },
        }));
        setReveal(null);
        locked.current = false;
      }, REVEAL_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run, question, update, say, seconds],
  );

  const left = useCountdown({ seconds, running: run?.phase === "ask" && !reveal, key: run ? `${run.wave}:${run.q}:${run.seed}` : "none", onExpire: () => answer(null) });
  const leftRef = useRef(left);
  leftRef.current = left;

  const finish = useCallback(
    (outcome) => {
      const r = run;
      const next = (s) =>
        finishRun(s, {
          id: `arcade:${r.seed}`,
          mode: "arcade",
          title: cfg.title,
          score: r.score,
          correct: r.correct,
          answered: r.answered,
          outcome,
          message:
            outcome === "derrota"
              ? "Te quedaste sin vidas. Los artículos que fallaste están abajo: son exactamente los que conviene repasar."
              : r.bestCombo >= 5
                ? `Combo máximo x${r.bestCombo}. El Código casi sonríe.`
                : "Oleadas superadas. La precisión importa más que la velocidad; la velocidad llega sola.",
          details: r.log.map((e) => {
            const q = byId.get(e.id);
            return { label: q.prompt, ok: e.ok, note: e.ok ? q.answer : `Correcta: ${q.answer}${e.picked ? ` · elegiste ${e.picked}` : " · sin respuesta"}` };
          }),
          stat: "arcadeRuns",
          replay: { scene: "arcade", param: param ?? null, label: cfg.quick ? "Otra partida rápida" : "Jugar otra vez" },
        });
      update(next);
      playSfx(outcome === "derrota" ? "damage" : "solve");
      go("results", null, { replace: true });
    },
    [run, cfg, update, go, param],
  );

  const next = useCallback(() => {
    if (!run || run.phase !== "verdict") return;
    playSfx("page");
    if (run.lives <= 0) return finish("derrota");
    if (run.q + 1 < run.ids.length) return setRun((r) => ({ ...r, phase: "ask", q: r.q + 1, last: null }));
    if (run.wave + 1 < cfg.waves) {
      say("waveClear");
      return setRun((r) => ({ ...r, phase: "wave" }));
    }
    return finish("victoria");
  }, [run, cfg.waves, finish, say]);

  const nextWave = useCallback(() => {
    setRun((r) => {
      const acc = r.waveCorrect / r.ids.length;
      const lvl = acc >= 0.8 ? Math.min(2, r.level + 1) : acc <= 0.4 ? Math.max(0, r.level - 1) : r.level;
      return { ...r, phase: "ask", wave: r.wave + 1, q: 0, level: lvl, waveCorrect: 0, ids: drawWave(r.seed, lvl, r.used, cfg.perWave), last: null };
    });
    playSfx("phase");
  }, [cfg.perWave]);

  useKeys({ Enter: () => (run?.phase === "verdict" ? next() : run?.phase === "wave" ? nextWave() : undefined) }, Boolean(run));

  if (!run) return <ArcadeSetup onStart={(levelId) => setRun(freshRun(param, levelId))} />;

  const total = cfg.waves * cfg.perWave;
  const done = run.wave * cfg.perWave + run.q + 1;
  const narrow = vp.width < 400;

  const hud = (
    <>
      <span className="chip chip-bad tabular-nums" aria-label={`${run.lives} vidas`} title="Vidas">
        <Icon name="heart" size={16} /> {run.lives}
      </span>
      {!narrow && (
        <span className={`chip tabular-nums ${run.combo >= 3 ? "chip-cyan" : ""}`} title="Combo">
          x{run.combo}
        </span>
      )}
      <span className="chip chip-warn tabular-nums" title="Puntaje">
        {run.score.toLocaleString("es-CL")}
      </span>
    </>
  );

  if (run.phase === "wave") {
    const acc = Math.round((run.waveCorrect / run.ids.length) * 100);
    const up = acc >= 80 && run.level < 2;
    const down = acc <= 40 && run.level > 0;
    return (
      <Screen title={cfg.title} subtitle={`Oleada ${run.wave + 1} de ${cfg.waves} superada`} hud={hud} eva="compact" dock={
        <button type="button" className="btn btn-primary flex-1" onClick={nextWave} data-autofocus="">
          <Icon name="bolt" />
          <span>Siguiente oleada</span>
        </button>
      }>
        <div className="grid flex-1 place-items-center">
          <div className="panel grid w-full max-w-[520px] gap-3 p-5 text-center">
            <p className="label text-cyan">Oleada superada</p>
            <p className="title-display text-5xl text-ink tabular-nums">{acc}%</p>
            <p className="text-dim">
              {run.waveCorrect} de {run.ids.length} correctas · combo máximo x{run.bestCombo}
            </p>
            <p className={`title-display text-lg ${up ? "text-ok" : down ? "text-warn" : "text-ink"}`}>
              {up ? `Sube la dificultad: ${LEVELS[run.level + 1].label}` : down ? `Bajamos el ritmo: ${LEVELS[run.level - 1].label}` : `Sigues en ${LEVELS[run.level].label}`}
            </p>
            <p className="text-[0.875rem] text-faint">La dificultad se ajusta con tu precisión: 80 % o más la sube; 40 % o menos la baja.</p>
          </div>
        </div>
      </Screen>
    );
  }

  const inVerdict = run.phase === "verdict";
  const q = question;

  return (
    <Screen
      title={cfg.title}
      subtitle={`${level.label} · pregunta ${Math.min(done, total)} de ${total}`}
      hud={hud}
      eva="compact"
      dock={
        inVerdict ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => open("pause")}>
              <Icon name="pause" />
              <span className={narrow ? "sr-only" : ""}>Pausa</span>
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={next} data-autofocus="">
              <span>{run.lives <= 0 ? "Ver resultado" : run.q + 1 < run.ids.length ? "Siguiente" : run.wave + 1 < cfg.waves ? "Cerrar oleada" : "Ver resultado"}</span>
              <Icon name="next" />
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => open("pause")}>
              <Icon name="pause" />
              <span>Pausa</span>
            </button>
            <p className="label flex-1 text-right">{vp.layout === "stack" ? "Toca una alternativa" : "Teclas 1–4 para responder"}</p>
          </>
        )
      }
    >
      {inVerdict ? (
        <Verdict
          resetKey={`${run.wave}:${run.q}`}
          tone={run.last?.timedOut ? "time" : run.last?.correct ? "ok" : "bad"}
          verdict={run.last?.correct ? (run.combo >= 3 ? `Correcto · combo x${run.combo}` : "Correcto") : run.last?.timedOut ? "Se acabó el tiempo" : run.lives <= 0 ? "Incorrecto · sin vidas" : "Incorrecto · pierdes una vida"}
          picked={run.last?.picked ?? null}
          answer={q.answer}
          what={q.prompt}
          why={q.feedback}
          article={q.article}
          concept={q.concept}
          eva={evaLine}
        />
      ) : (
        <div className="col min-h-0 flex-1 gap-2">
          {left != null && (
            <div className="meter shrink-0" role="timer" aria-label={`${Math.ceil(left)} segundos`}>
              <span style={{ width: `${(left / seconds) * 100}%`, background: left < 5 ? "rgb(var(--c-bad))" : "linear-gradient(90deg, rgb(var(--c-blue)), rgb(var(--c-violet)))" }} />
            </div>
          )}
          <section className="panel col min-h-0 flex-1 gap-3 p-3" key={q.id}>
            <div className="flex shrink-0 items-center justify-between gap-2">
              <p className="label text-lilac">{moduleTitle(q.module)}</p>
              {left != null && <p className={`label tabular-nums ${left < 5 ? "text-bad" : ""}`}>{Math.ceil(left)} s</p>}
            </div>
            <div className="col min-h-0 flex-1">
              <FitPager
                items={[{ id: q.id, text: q.prompt, render: (t) => <h2 className="title-display text-[1.35rem] leading-snug text-ink md:text-[1.6rem]">{t}</h2> }]}
                resetOn={q.id}
                label="Enunciado"
              />
            </div>
            <Choices options={options} onPick={answer} disabled={Boolean(reveal)} reveal={reveal} columns={vp.height < 560 ? 2 : undefined} />
          </section>
        </div>
      )}
    </Screen>
  );
}

function ArcadeSetup({ onStart }) {
  const { save, setSetting } = useGame();
  const { go } = useNav();
  const [pick, setPick] = useState(save.settings.arcadeDifficulty ?? "litigante");
  const start = () => {
    setSetting("arcadeDifficulty", pick);
    playSfx("confirm");
    onStart(pick);
  };
  useKeys({ Enter: start });
  return (
    <Screen
      title="Neón de artículos"
      subtitle="Oleadas rápidas · combos · 3 vidas"
      eva="compact"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="prev" />
            <span>Archivo</span>
          </button>
          <button type="button" className="btn btn-primary flex-1" onClick={start} data-autofocus="">
            <Icon name="play" />
            <span>Empezar</span>
          </button>
        </>
      }
    >
      <div className="col min-h-0 flex-1 justify-center gap-3">
        <p className="max-w-[60ch] text-[0.975rem] leading-snug text-dim">
          Tres oleadas de cinco preguntas. Acertar suma combo; fallar cuesta una vida. Entre oleadas, la dificultad se ajusta a tu precisión.
        </p>
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Dificultad inicial">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={pick === l.id} className="choice flex-col" onClick={() => setPick(l.id)}>
              <span className="title-display text-lg text-ink">{l.label}</span>
              <span className="text-[0.875rem] leading-snug text-dim">{l.note}</span>
              <span className="label">
                {save.settings.timer === "off" ? "Sin reloj" : `${timerSeconds(l.seconds, save.settings.timer)} s por pregunta`}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[0.8125rem] text-faint">El reloj se detiene al abrir el Codex o la pausa. En Ajustes puedes jugar sin reloj.</p>
      </div>
    </Screen>
  );
}
