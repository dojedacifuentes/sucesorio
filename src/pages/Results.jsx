import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";

export default function Results({ navigate, progress }) {
  const result = progress.lastResult ?? {
    mode: "Sin resultados",
    title: "Aun no hay expediente cerrado",
    score: 0,
    correct: 0,
    total: 0,
    accuracy: 0,
    message: "Juega un modo para generar resultados.",
  };

  return (
    <ArcadeFrame title="Pantalla de resultados" kicker={result.mode}>
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="grid gap-4">
          <StatPanel label="Puntaje" value={result.score} tone="gold" />
          <StatPanel label="Aciertos" value={`${result.correct}/${result.total}`} tone="acid" />
          <StatPanel label="Precision" value={`${result.accuracy}%`} tone={result.accuracy >= 70 ? "cyan" : "blood"} />
        </aside>

        <section className="pixel-corners border border-neonPink/35 bg-black/35 p-6 shadow-pink">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-neonPink">{result.mode}</p>
          <h2 className="mt-2 font-display text-4xl font-black text-white">{result.title}</h2>
          <p className="mt-5 text-sm leading-7 text-zinc-300">{result.message}</p>
          <div className="mt-6">
            <ProgressBar value={result.accuracy} label="Precision del expediente" tone={result.accuracy >= 70 ? "cyan" : "blood"} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <PixelButton variant="primary" onClick={() => navigate("modes")}>Elegir modo</PixelButton>
            <PixelButton variant="cyan" onClick={() => navigate("memory")}>Repasar errores</PixelButton>
            <PixelButton variant="gold" onClick={() => navigate("codex")}>Abrir codex</PixelButton>
          </div>
        </section>
      </div>
    </ArcadeFrame>
  );
}
