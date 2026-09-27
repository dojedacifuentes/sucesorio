import { useCallback, useEffect, useMemo, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { CARDS, MODULES, moduleTitle } from "../../game/content.js";
import { recordSelfRating } from "../../game/progress.js";
import { dueCards } from "../../game/memory.js";
import { finishRun, saveRun } from "../../game/session.js";
import { newSeed, seededShuffle } from "../../game/rng.js";
import { articleLabel } from "../../game/format.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

const SIZE = 10;
const byId = new Map(CARDS.map((c) => [c.id, c]));



export default function MemoryScene({ param }) {
  const { save } = useGame();
  const resumable = save.run?.scene === "memory" && save.run.state?.ids?.length;
  const [run, setRun] = useState(() => (resumable ? save.run.state : null));
  if (!run) return <MemorySetup onStart={setRun} preset={param} />;
  return <MemorySession run={run} setRun={setRun} />;
}

function MemorySetup({ onStart, preset }) {
  const { save } = useGame();
  const { go } = useNav();
  const vp = useLayout();
  const due = useMemo(() => dueCards(save.memorySchedule), [save.memorySchedule]);
  const start = (pool, label) => {
    if (!pool.length) return;
    const seed = newSeed();
    // El mazo se fija al empezar: evaluar una ficha no lo reordena ni lo vacía.
    const ids = (label === "Repaso del día" ? pool : seededShuffle(pool, seed)).slice(0, SIZE).map((c) => c.id);
    playSfx("confirm");
    onStart({ seed, label, ids, i: 0, stage: "recall", face: "def", ratings: {} });
  };
  useEffect(() => {
    if (preset && MODULES.some((m) => m.id === preset)) start(CARDS.filter((c) => c.module === preset), moduleTitle(preset));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useKeys({ Enter: () => start(due.length ? due : CARDS, "Repaso del día") });
  const cols = vp.width >= 900 ? 3 : vp.width >= 520 ? 2 : 1;
  const mods = MODULES.map((m) => ({ m, n: CARDS.filter((c) => c.module === m.id).length })).filter((x) => x.n);
  const items = [];
  for (let i = 0; i < mods.length; i += cols) {
    const row = mods.slice(i, i + cols);
    items.push({
      id: `r${i}`,
      render: () => (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {row.map(({ m, n }) => (
            <button key={m.id} type="button" className="choice items-center py-2" onClick={() => start(CARDS.filter((c) => c.module === m.id), m.title)}>
              <span className="min-w-0 flex-1 text-[0.9375rem] leading-snug text-ink">{m.title}</span>
              <span className="chip">{n}</span>
            </button>
          ))}
        </div>
      ),
    });
  }
  return (
    <Screen
      title="Cementerio de conceptos"
      subtitle={`${due.length} fichas para hoy`}
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="prev" />
            <span>Archivo</span>
          </button>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => start(due.length ? due : CARDS, "Repaso del día")} data-autofocus="">
            <Icon name="cards" />
            <span>Repaso del día · {Math.min(SIZE, due.length || CARDS.length)}</span>
          </button>
        </>
      }
    >
      <div className="col min-h-0 flex-1 gap-2">
        <p className="shrink-0 text-[0.9375rem] leading-snug text-dim">Intenta recordar antes de voltear. Tu propia evaluación decide cuándo vuelve cada ficha; no cuenta como dominio. O elige un tema:</p>
        <FitPager items={items} gap={6} pageKey="mem-modules" label="Temas" />
      </div>
    </Screen>
  );
}

const FACES = [
  ["def", "Definición"],
  ["ex", "Ejemplo"],
  ["err", "Error frecuente"],
];

function MemorySession({ run, setRun }) {
  const { update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const card = byId.get(run.ids[run.i]);
  const n = run.ids.length;

  useEffect(() => {
    update((s) => saveRun(s, { scene: "memory", param: null, title: `Memoria: ${run.label}`, state: run }));
  }, [run, update]);
  useEffect(() => {
    if (run.i === 0 && run.stage === "recall") say("memoryStart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flip = useCallback(() => {
    if (run.stage !== "recall") return;
    playSfx("open");
    setRun((r) => ({ ...r, stage: "reveal", face: "def" }));
  }, [run.stage, setRun]);

  const rate = useCallback(
    (rating) => {
      if (run.stage !== "reveal" || run.ratings[card.id]) return;
      playSfx(rating === "know" ? "success" : rating === "doubt" ? "select" : "tap");
      update((s) => recordSelfRating(s, { key: `mem:${run.seed}:${card.id}`, cardId: card.id, module: card.module, rating, article: card.article }));
      const ratings = { ...run.ratings, [card.id]: rating };
      if (run.i + 1 >= n) {
        const know = Object.values(ratings).filter((x) => x === "know").length;
        update((s) =>
          finishRun(s, {
            id: `memory:${run.seed}`,
            mode: "memory",
            title: `Memoria: ${run.label}`,
            correct: know,
            answered: n,
            outcome: "completado",
            message: `Autoevaluación: ${know} lo sabías, ${Object.values(ratings).filter((x) => x === "doubt").length} dudaste, ${Object.values(ratings).filter((x) => x === "forgot").length} por repasar. Las que dudaste vuelven en minutos; las que sabías, mañana. Esto no se suma como dominio.`,
            details: run.ids.map((id) => ({ label: byId.get(id).concept, ok: ratings[id] === "know" ? true : ratings[id] === "forgot" ? false : null, note: ratings[id] === "doubt" ? "Dudaste" : undefined })),
            stat: null,
            replay: { scene: "memory", param: null, label: "Otro repaso" },
          }),
        );
        go("results", null, { replace: true });
        return;
      }
      setRun((r) => ({ ...r, ratings, i: r.i + 1, stage: "recall", face: "def" }));
    },
    [run, card, n, update, go, setRun],
  );

  useKeys(
    run.stage === "recall"
      ? { Enter: flip, " ": flip }
      : { "1": () => rate("forgot"), "2": () => rate("doubt"), "3": () => rate("know"), ArrowRight: () => setRun((r) => ({ ...r, face: FACES[(FACES.findIndex((f) => f[0] === r.face) + 1) % 3][0] })) },
  );

  const text = run.face === "def" ? card.definition : run.face === "ex" ? card.example : card.commonError;
  const narrow = vp.width < 420;

  return (
    <Screen
      title="Cementerio de conceptos"
      subtitle={`${run.label} · ficha ${run.i + 1} de ${n}`}
      eva="compact"
      dock={
        run.stage === "recall" ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => open("pause")} aria-label="Pausa">
              <Icon name="pause" />
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={flip} data-autofocus="">
              <Icon name="swap" />
              <span>Voltear la ficha</span>
            </button>
          </>
        ) : (
          <div className="grid w-full grid-cols-3 gap-2" role="group" aria-label="¿Lo sabías?">
            <button type="button" className="btn btn-danger" onClick={() => rate("forgot")}>
              <span>{narrow ? "No" : "No lo sabía"}</span>
            </button>
            <button type="button" className="btn" onClick={() => rate("doubt")} style={{ borderColor: "rgb(var(--c-warn))" }}>
              <span>Dudé</span>
            </button>
            <button type="button" className="btn btn-cyan" onClick={() => rate("know")} style={{ borderColor: "rgb(var(--c-ok))" }}>
              <span>{narrow ? "Sí" : "Lo sabía"}</span>
            </button>
          </div>
        )
      }
    >
      <div className="col min-h-0 flex-1 gap-2">
        <div className="meter shrink-0" aria-hidden="true">
          <span style={{ width: `${((run.i + (run.stage === "reveal" ? 0.5 : 0)) / n) * 100}%`, background: "linear-gradient(90deg, rgb(var(--c-blue)), rgb(var(--c-violet)))" }} />
        </div>
        <article className={`panel col min-h-0 flex-1 gap-3 p-4 ${run.stage === "reveal" ? "panel-glow" : ""}`} key={`${card.id}-${run.stage}`}>
          <div className="flex shrink-0 items-center justify-between gap-2">
            <p className="label text-lilac">{moduleTitle(card.module)}</p>
            {run.stage === "reveal" && <span className="chip chip-cyan">{articleLabel(card.article)}</span>}
          </div>
          <h2 className="title-display shrink-0 text-[1.75rem] leading-tight text-ink">{card.concept}</h2>
          {run.stage === "recall" ? (
            <div className="col min-h-0 flex-1 justify-center gap-2 text-center">
              <Icon name="eye" size={32} className="mx-auto text-faint" />
              <p className="text-[1rem] text-dim">¿Qué es, en qué artículo está y cuál es el error típico? Dilo en voz alta o piénsalo. Después voltea.</p>
            </div>
          ) : (
            <>
              <div className="tabbar shrink-0" role="tablist" aria-label="Caras de la ficha">
                {FACES.map(([id, label]) => (
                  <button key={id} type="button" role="tab" aria-selected={run.face === id} className="tab" onClick={() => { playSfx("page"); setRun((r) => ({ ...r, face: id })); }}>
                    {label}
                  </button>
                ))}
              </div>
              <FitPager
                items={[{ id: `${card.id}-${run.face}`, text, render: (t) => <p className={`text-[1.0625rem] leading-relaxed ${run.face === "err" ? "text-ink" : "text-ink"}`}>{t}</p> }]}
                resetOn={`${card.id}-${run.face}`}
                label="Página"
              />
            </>
          )}
        </article>
      </div>
    </Screen>
  );
}
