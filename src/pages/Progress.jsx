import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import { modules } from "../data/successionData";
import { additionalModules } from "../data/advancedContent";
import { getRank, nextRank, xpToNextRank } from "../utils/gameLogic";
import { resetProgress } from "../utils/storage";

export default function Progress({ navigate, progress, refreshProgress }) {
  const rank = getRank(progress.xp);
  const next = nextRank(progress.xp);
  const distance = xpToNextRank(progress.xp);
  const errors = Object.entries(progress.errors).sort((a, b) => b[1] - a[1]);
  const allModules = [...modules, ...additionalModules];

  function reset() {
    const ok = window.confirm("Reiniciar progreso local. El cementerio juridico quedara limpio. ¿Continuar?");
    if (!ok) return;
    resetProgress();
    refreshProgress();
  }

  return (
    <ArcadeFrame
      title="Progreso"
      kicker="LocalStorage / expediente personal"
      action={<PixelButton variant="danger" onClick={reset}>Reiniciar</PixelButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Nivel" value={progress.level} detail={rank.title} tone="pink" />
            <StatPanel label="XP" value={progress.xp} detail={distance ? `${distance} XP al siguiente rango` : "rango maximo"} tone="gold" />
            <StatPanel label="Correctas" value={progress.stats.correct} tone="acid" />
            <StatPanel label="Errores" value={progress.stats.wrong} tone="blood" />
          </div>
          <ProgressBar value={progress.xp - rank.minXp} max={Math.max(1, next.minXp - rank.minXp)} label={`Siguiente: ${next.title}`} tone="pink" />
          <PixelButton variant="cyan" onClick={() => navigate("memory")}>Repasar mis cadáveres jurídicos</PixelButton>
        </aside>

        <section className="grid gap-5">
          <div className="pixel-corners border border-white/10 bg-black/30 p-5">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-neonCyan">Dominio por modulo</p>
            <div className="grid gap-4">
              {allModules.map((module) => (
                <ProgressBar key={module.id} value={progress.moduleMastery[module.id] ?? 0} label={module.title} tone="cyan" />
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="pixel-corners border border-blood/30 bg-black/30 p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-blood">Errores frecuentes</p>
              <div className="grid gap-2">
                {errors.length === 0 && <p className="text-sm text-zinc-500">Aun no hay cadaveres juridicos registrados.</p>}
                {errors.slice(0, 8).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between gap-4 border-b border-white/10 py-2 text-sm">
                    <span className="text-zinc-300">{key}</span>
                    <span className="text-blood">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pixel-corners border border-oldGold/30 bg-black/30 p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-oldGold">Ultimos errores</p>
              <div className="grid gap-3">
                {progress.recentErrors.length === 0 && <p className="text-sm text-zinc-500">Silencio procesal. Sospechoso, pero agradable.</p>}
                {progress.recentErrors.slice(0, 6).map((error) => (
                  <div key={`${error.at}-${error.key}`} className="pixel-corners border border-white/10 bg-black/25 p-3">
                    <p className="text-sm font-bold text-white">{error.key}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">{error.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ArcadeFrame>
  );
}
