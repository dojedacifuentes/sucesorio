import { motion } from "framer-motion";
import ArcadeFrame from "../components/ArcadeFrame";
import GlitchText from "../components/GlitchText";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import PixelCharacter from "../components/PixelCharacter";
import { getRank, nextRank } from "../utils/gameLogic";

export default function Home({ navigate, progress }) {
  const rank = getRank(progress.xp);
  const next = nextRank(progress.xp);
  const rankProgress = next.minXp === rank.minXp ? 100 : ((progress.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <ArcadeFrame className="min-h-[620px]" kicker="Sistema local / sin backend / sin misericordia">
        <div className="relative overflow-hidden">
          <div className="absolute right-4 top-4 hidden h-32 w-32 border border-neonCyan/20 bg-neonCyan/5 shadow-neon md:block" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-4xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.32em] text-oldGold">Arcade juridico cyberpunk</p>
            <GlitchText as="h1" className="mt-4 block font-display text-5xl font-black leading-none text-white md:text-7xl">
              LEX MORTIS
            </GlitchText>
            <h2 className="mt-2 font-display text-2xl font-black text-neonCyan md:text-4xl">Sucesorio Arcade</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
              Memorizacion activa de Derecho Sucesorio chileno en una ciudad donde los expedientes brillan, la lluvia cae
              en pixeles y cada error vuelve como pariente en posesion efectiva.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <PixelButton variant="primary" onClick={() => navigate("modes")}>
              Insertar moneda juridica
            </PixelButton>
            <PixelButton variant="cyan" onClick={() => navigate("arcade")}>
              Neón de artículos
            </PixelButton>
            <PixelButton variant="gold" onClick={() => navigate("detective")}>
              Abrir expediente
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => navigate("codex")}>
              Consultar codex
            </PixelButton>
            <PixelButton variant="cyan" onClick={() => navigate("acervos")}>
              Calcular acervos
            </PixelButton>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <StatPanel label="XP" value={progress.xp} detail={rank.title} tone="pink" />
            <StatPanel label="Articulos" value={progress.unlockedArticles.length} detail="desbloqueados" tone="cyan" />
            <StatPanel label="Errores" value={progress.recentErrors.length} detail="cadaveres recientes" tone="gold" />
          </div>

          <div className="mt-8">
            <ProgressBar value={rankProgress} label={`Progreso hacia ${next.title}`} tone="pink" />
          </div>
        </div>
      </ArcadeFrame>

      <div className="grid gap-6">
        <ArcadeFrame title="Detective de sucesiones" kicker="Caso inicial recomendado">
          <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
            <PixelCharacter color="#ff3fbd" label="Abogada NPC" />
            <div>
              <p className="text-sm leading-7 text-zinc-300">
                El causante murio. Como suele pasar en sucesorio. Tu trabajo es determinar quien hereda, que accion
                procede y por que el arbol familiar parece una escena del crimen.
              </p>
              <PixelButton className="mt-5 w-full" variant="gold" onClick={() => navigate("detective")}>
                Resolver primer expediente
              </PixelButton>
            </div>
          </div>
        </ArcadeFrame>

        <ArcadeFrame title="Modos activos" kicker="6 gabinetes">
          <div className="grid gap-3">
            {["Arcade", "Detective", "Boss Fight", "Memoria", "Mnemotecnias", "Acervos", "Oral de grado"].map((mode) => (
              <div key={mode} className="pixel-corners border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300">
                <span className="text-neonCyan">▣</span> {mode}
              </div>
            ))}
          </div>
        </ArcadeFrame>
      </div>
    </div>
  );
}
