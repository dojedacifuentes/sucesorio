import { useEffect, useMemo } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { getRank, solvedCaseIds } from "../../game/progress.js";
import { BOSSES, CASES } from "../../game/content.js";
import { dueCards } from "../../game/memory.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import Icon from "../../ui/Icon.jsx";
import { playSfx } from "../../audio/sfx.js";
import { RUN_LABELS } from "../title/TitleScene.jsx";

export const ROOMS = [
  { id: "detective", icon: "doc", title: "Expedientes", copy: "Investiga pruebas, reconstruye la cronología y decide quién hereda.", tone: "violet" },
  { id: "arcade", icon: "bolt", title: "Neón de artículos", copy: "Oleadas rápidas con combos y vidas.", tone: "cyan" },
  { id: "boss", icon: "swords", title: "Duelos", copy: "Rivales que atacan con confusiones típicas.", tone: "magenta" },
  { id: "memory", icon: "cards", title: "Cementerio de conceptos", copy: "Recuerda, voltea y evalúate.", tone: "cyan" },
  { id: "mnemonics", icon: "puzzle", title: "Máquina de siglas", copy: "Arma siglas pieza a pieza.", tone: "violet" },
  { id: "acervos", icon: "flask", title: "Laboratorio de acervos", copy: "Calcula cuotas y acervos paso a paso.", tone: "cyan" },
  { id: "oral", icon: "mic", title: "Sala oral", copy: "Arma tu respuesta y resiste la repregunta.", tone: "magenta" },
  { id: "progress", icon: "chart", title: "Progreso", copy: "Dominio, bitácora de EVA y errores.", tone: "violet" },
];

const TONE = {
  cyan: "rgb(var(--c-cyan))",
  violet: "rgb(var(--c-lilac))",
  magenta: "rgb(var(--c-magenta))",
};

export default function HubScene() {
  const { save } = useGame();
  const { go } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const solved = solvedCaseIds(save).length;
  const rank = getRank(save.profile.xp);
  const run = save.run;

  useEffect(() => {
    say("hub", { lastMode: save.lastResult?.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(
    () => ({
      detective: `${solved}/${CASES.length}`,
      boss: `${(save.campaign?.bossesDefeated ?? []).length}/${BOSSES.length}`,
      memory: `${Math.min(99, dueCards(save.memorySchedule).length)} hoy`,
    }),
    [solved, save.campaign, save.memorySchedule],
  );

  // Rejilla que cabe entera: columnas y filas según el espacio real.
  const cols = vp.width >= 1100 ? 4 : vp.width >= 700 ? (vp.height < 560 ? 4 : 3) : vp.height < 560 ? 4 : 2;
  const rows = Math.ceil(ROOMS.length / cols);
  const roomy = vp.width >= 700 && vp.height >= 700;
  const tight = vp.height < 700;

  return (
    <Screen
      title="Archivo de la Notaría"
      subtitle={`${rank.title} · ${save.profile.xp} XP`}
      eva="compact"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("title")}>
            <Icon name="home" />
            <span className={vp.width < 400 ? "sr-only" : ""}>Portada</span>
          </button>
          {run?.scene ? (
            <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go(run.scene, run.param ?? null)} data-autofocus="">
              <Icon name="play" />
              <span className="truncate-safe">Continuar: {run.title ?? RUN_LABELS[run.scene]}</span>
            </button>
          ) : (
            <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go("arcade", "rapida")} data-autofocus="">
              <Icon name="bolt" />
              <span>Partida rápida</span>
            </button>
          )}
        </>
      }
    >
      <div className="grid min-h-0 flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
        {ROOMS.map((room) => (
          <button
            key={room.id}
            type="button"
            className="choice min-h-0 flex-col items-start justify-center gap-1 overflow-hidden"
            onClick={() => {
              playSfx("select");
              go(room.id);
            }}
            data-room={room.id}
          >
            <span className="flex w-full items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border" style={{ borderColor: TONE[room.tone], color: TONE[room.tone] }}>
                <Icon name={room.icon} size={20} />
              </span>
              {stats[room.id] && !tight && <span className="chip ml-auto tabular-nums">{stats[room.id]}</span>}
            </span>
            <span className="title-display text-[0.9688rem] leading-tight text-ink">{room.title}</span>
            {roomy && <span className="text-[0.8125rem] leading-snug text-dim">{room.copy}</span>}
          </button>
        ))}
      </div>
    </Screen>
  );
}
