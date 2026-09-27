import { useEffect, useMemo } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { getRank, solvedCaseIds } from "../../game/progress.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Icon from "../../ui/Icon.jsx";
import { playSfx } from "../../audio/sfx.js";

export const ROOMS = [
  { id: "detective", icon: "doc", title: "Expedientes", copy: "Investiga pruebas, reconstruye la cronología y decide quién hereda.", tone: "violet" },
  { id: "arcade", icon: "bolt", title: "Neón de artículos", copy: "Oleadas rápidas con combos, vidas y dificultad a elección.", tone: "cyan" },
  { id: "boss", icon: "swords", title: "Duelos", copy: "Rivales con fases y ataques anunciados: cada uno, una confusión típica.", tone: "magenta" },
  { id: "memory", icon: "cards", title: "Cementerio de conceptos", copy: "Recuerda, revela y compruébalo con un ejemplo.", tone: "cyan" },
  { id: "mnemonics", icon: "puzzle", title: "Máquina de siglas", copy: "Reconstruye siglas y asociaciones pieza a pieza.", tone: "violet" },
  { id: "acervos", icon: "flask", title: "Laboratorio de acervos", copy: "Clasifica, ordena el cálculo y reparte cuotas paso a paso.", tone: "cyan" },
  { id: "oral", icon: "mic", title: "Sala oral", copy: "Arma tu respuesta y resiste la objeción del examinador.", tone: "magenta" },
  { id: "progress", icon: "chart", title: "Progreso", copy: "Lo que dominas, lo que resolviste con ayuda y la bitácora de EVA.", tone: "violet" },
];

const TONE = {
  cyan: "rgb(var(--c-cyan))",
  violet: "rgb(var(--c-violet))",
  magenta: "rgb(var(--c-magenta))",
};

export default function HubScene() {
  const { save } = useGame();
  const { go } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const solved = solvedCaseIds(save).length;
  const rank = getRank(save.profile.xp);

  useEffect(() => {
    say("hub", { lastMode: save.lastResult?.mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cols = vp.width >= 1000 ? 3 : vp.width >= 560 ? 2 : 1;
  const stats = useMemo(
    () => ({
      detective: `${solved}/30 cerrados`,
      boss: `${save.profile.stats.bossKills ?? 0} derrotados`,
      memory: `${Object.keys(save.memorySchedule ?? {}).length} fichas vistas`,
    }),
    [solved, save.profile.stats.bossKills, save.memorySchedule],
  );

  const items = useMemo(() => {
    const rows = [];
    for (let i = 0; i < ROOMS.length; i += cols) rows.push(ROOMS.slice(i, i + cols));
    return rows.map((row, r) => ({
      id: `row-${r}`,
      render: () => (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {row.map((room) => (
            <button
              key={room.id}
              type="button"
              className="choice items-center"
              onClick={() => {
                playSfx("select");
                go(room.id);
              }}
              data-room={room.id}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border" style={{ borderColor: TONE[room.tone], color: TONE[room.tone] }}>
                <Icon name={room.icon} size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="title-display block text-[0.975rem] text-ink">{room.title}</span>
                <span className="block text-[0.8125rem] leading-snug text-dim">{room.copy}</span>
              </span>
              {stats[room.id] && <span className="chip hidden sm:inline-flex">{stats[room.id]}</span>}
            </button>
          ))}
        </div>
      ),
    }));
  }, [cols, go, stats]);

  return (
    <Screen
      title="Archivo de la Notaría"
      subtitle={`${rank.title} · ${save.profile.xp} XP`}
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("title")}>
            <Icon name="home" />
            <span>Portada</span>
          </button>
          <div className="flex-1" />
          <button type="button" className="btn btn-primary" onClick={() => go("detective")}>
            <Icon name="doc" />
            <span>Expedientes</span>
          </button>
        </>
      }
    >
      <FitPager items={items} gap={8} pageKey="hub" label="Salas" />
    </Screen>
  );
}
