import { useCallback, useEffect, useMemo, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { MNEMONICS, moduleTitle } from "../../game/content.js";
import { recordAnswer } from "../../game/progress.js";
import { finishRun, saveRun } from "../../game/session.js";
import { hashSeed, mulberry32, newSeed, seededShuffle } from "../../game/rng.js";
import { normalizeAnswer } from "../../game/format.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import Verdict from "../../ui/Verdict.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

const SIZE = 8;
const byId = new Map(MNEMONICS.map((m) => [m.id, m]));
const POOL = "ABCDEFGHIJLMNOPRSTUV0123456789";

/** Caracteres que se arman (sin espacios, sin tildes, en mayúscula). */
const target = (m) => normalizeAnswer(m.answer).replace(/\s+/g, "").split("");

/** Fichas del desafío: las de la respuesta más algunas señuelo, en orden estable. */
function tilesFor(m, seed) {
  const chars = target(m);
  const rnd = mulberry32(hashSeed(`${seed}:${m.id}`));
  const decoys = [];
  const want = chars.length <= 3 ? 5 : chars.length <= 7 ? 4 : 1;
  while (decoys.length < want) {
    const ch = POOL[Math.floor(rnd() * POOL.length)];
    if (!/\d/.test(ch) || chars.some((c) => /\d/.test(c))) decoys.push(ch);
  }
  return seededShuffle([...chars, ...decoys].map((ch, i) => ({ id: `t${i}`, ch })), hashSeed(`${seed}:${m.id}:t`));
}

export default function MnemonicsScene() {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const resumable = save.run?.scene === "mnemonics" && save.run.state?.ids?.length;
  const [run, setRun] = useState(() => {
    if (resumable) return save.run.state;
    const seed = newSeed();
    return { seed, ids: seededShuffle(MNEMONICS, seed).slice(0, SIZE).map((m) => m.id), i: 0, placed: [], hint: false, stage: "build", results: [] };
  });
  const m = byId.get(run.ids[run.i]);
  const chars = useMemo(() => target(m), [m]);
  const tiles = useMemo(() => tilesFor(m, run.seed), [m, run.seed]);
  const used = new Set(run.placed);

  useEffect(() => {
    update((s) => saveRun(s, { scene: "mnemonics", param: null, title: "Máquina de siglas", state: run }));
  }, [run, update]);
  useEffect(() => {
    if (!resumable) say("mnemonicsStart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const place = useCallback(
    (tileId) => {
      if (run.stage !== "build" || used.has(tileId) || run.placed.length >= chars.length) return;
      playSfx("place");
      setRun((r) => ({ ...r, placed: [...r.placed, tileId] }));
    },
    [run.stage, run.placed.length, chars.length, used],
  );
  const unplace = (index) => {
    if (run.stage !== "build") return;
    playSfx("tap");
    setRun((r) => ({ ...r, placed: r.placed.filter((_, i) => i !== index) }));
  };
  const check = useCallback(() => {
    if (run.stage !== "build" || run.placed.length !== chars.length) return;
    const built = run.placed.map((id) => tiles.find((t) => t.id === id).ch).join("");
    const ok = built === chars.join("");
    playSfx(ok ? "solve" : "error");
    update((s) => recordAnswer(s, { key: `mn:${run.seed}:${m.id}`, correct: ok, assisted: run.hint, module: m.module, concept: m.hint, mode: "mnemonics", feedback: m.expansion, xp: ok ? (run.hint ? 5 : 12) : 2 }));
    if (ok && !run.hint) say("success");
    setRun((r) => ({ ...r, stage: "verdict", results: [...r.results, { id: m.id, ok, built, hint: r.hint }] }));
  }, [run, chars, tiles, m, update, say]);

  const next = useCallback(() => {
    if (run.stage !== "verdict") return;
    if (run.i + 1 >= run.ids.length) {
      const correct = run.results.filter((x) => x.ok).length;
      update((s) =>
        finishRun(s, {
          id: `mn:${run.seed}`,
          mode: "mnemonics",
          title: "Máquina de siglas",
          correct,
          answered: run.results.length,
          assisted: run.results.filter((x) => x.ok && x.hint).length,
          message: correct === run.results.length ? "Todas armadas. Ahora el desafío es expandirlas en voz alta sin mirar." : "Las siglas se olvidan si no se expanden. Repasa las que fallaste con su significado completo.",
          details: run.results.map((x) => ({ label: `${byId.get(x.id).prompt} → ${byId.get(x.id).answer}`, ok: x.ok, note: byId.get(x.id).expansion })),
          stat: "mnemonicsSolved",
          replay: { scene: "mnemonics", param: null, label: "Otra ronda" },
        }),
      );
      go("results", null, { replace: true });
      return;
    }
    playSfx("page");
    setRun((r) => ({ ...r, i: r.i + 1, placed: [], hint: false, stage: "build" }));
  }, [run, update, go]);

  const keys = { Enter: () => (run.stage === "build" ? check() : next()), Backspace: () => run.placed.length && unplace(run.placed.length - 1) };
  // Escribir una letra coloca la primera ficha libre con esa letra.
  for (const ch of new Set(tiles.map((t) => t.ch))) keys[ch.toLowerCase()] = () => {
    const t = tiles.find((x) => x.ch === ch && !used.has(x.id));
    if (t) place(t.id);
  };
  useKeys(keys);

  const last = run.results[run.results.length - 1];
  const narrow = vp.width < 420;
  const slotW = Math.max(28, Math.min(52, Math.floor((Math.min(vp.width, 900) - 60) / Math.max(chars.length, 1)) - 6));
  const tileSize = chars.length > 8 || vp.height < 560 ? 44 : 48;

  return (
    <Screen
      title="Máquina de siglas"
      subtitle={`Sigla ${run.i + 1} de ${run.ids.length}`}
      eva="compact"
      dock={
        run.stage === "build" ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => { setRun((r) => ({ ...r, hint: true })); playSfx("select"); }} disabled={run.hint}>
              <Icon name="hint" />
              <span className={narrow ? "sr-only" : ""}>Pista</span>
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setRun((r) => ({ ...r, placed: [] }))} disabled={!run.placed.length} aria-label="Vaciar">
              <Icon name="reset" />
            </button>
            <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={check} disabled={run.placed.length !== chars.length}>
              <Icon name="check" />
              <span>Comprobar</span>
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => open("pause")} aria-label="Pausa">
              <Icon name="pause" />
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={next} data-autofocus="">
              <span>{run.i + 1 >= run.ids.length ? "Ver resultado" : "Siguiente sigla"}</span>
              <Icon name="next" />
            </button>
          </>
        )
      }
    >
      {run.stage === "verdict" ? (
        <Verdict
          resetKey={m.id}
          tone={last?.ok ? (last.hint ? "time" : "ok") : "bad"}
          verdict={last?.ok ? (last.hint ? "Armada con pista" : "Sigla armada") : "No calza"}
          picked={last?.built}
          answer={chars.join("")}
          what={`${m.prompt} → ${m.answer}`}
          why={m.expansion}
          concept={m.hint}
        />
      ) : (
        <section className={`panel col min-h-0 flex-1 justify-between ${vp.height < 640 ? "gap-2 p-3" : "gap-3 p-4"}`}>
          <div className="grid gap-1">
            <p className="label text-lilac">{moduleTitle(m.module)}</p>
            <p className={`title-display tracking-[0.2em] text-ink ${vp.height < 640 ? "text-[1.5rem]" : "text-[2rem]"}`} aria-label={`Sigla: ${m.prompt}`}>
              {m.prompt}
            </p>
            <p className={`text-[0.875rem] leading-snug ${run.hint ? "text-warn" : "text-dim"}`}>{run.hint ? `Pista: ${m.hint}` : vp.height < 640 ? "Arma lo que falta con las fichas." : "Arma lo que falta con las fichas. Toca una casilla llena para devolver su ficha."}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Respuesta">
            {chars.map((_, i) => {
              const tileId = run.placed[i];
              const t = tileId ? tiles.find((x) => x.id === tileId) : null;
              return (
                <button key={i} type="button" className={`slot justify-center font-display text-xl font-bold text-ink ${i === run.placed.length ? "is-target" : ""}`} style={{ width: slotW, minWidth: 30, padding: 0 }} onClick={() => t && unplace(i)} aria-label={t ? `Casilla ${i + 1}: ${t.ch}. Toca para quitar.` : `Casilla ${i + 1} vacía`}>
                  {t?.ch ?? ""}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Fichas">
            {tiles.map((t) => (
              <button key={t.id} type="button" style={{ width: tileSize, height: tileSize, padding: 0 }} className={`piece justify-center font-display text-xl ${used.has(t.id) ? "opacity-25" : ""}`} onClick={() => place(t.id)} disabled={used.has(t.id)} aria-label={`Ficha ${t.ch}`}>
                {t.ch}
              </button>
            ))}
          </div>
        </section>
      )}
    </Screen>
  );
}
