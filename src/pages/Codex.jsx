import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import { modules, flashcards } from "../data/successionData";
import { additionalModules, advancedFlashcards } from "../data/advancedContent";

export default function Codex({ navigate, progress }) {
  const [query, setQuery] = useState("");
  const allModules = useMemo(() => [...modules, ...additionalModules], []);
  const allFlashcards = useMemo(() => [...flashcards, ...advancedFlashcards], []);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return allModules;
    return allModules.filter((module) =>
      [module.title, module.summary, module.mnemonic, module.commonError, ...module.articles, ...module.concepts]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [allModules, query]);

  return (
    <ArcadeFrame
      title="Codex jurídico"
      kicker="Articulos, conceptos y errores frecuentes"
      action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Modos</PixelButton>}
    >
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar: 955, legitima, BILII, transmision..."
          className="pixel-corners border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none focus:border-neonCyan"
        />
        <PixelButton variant="cyan" onClick={() => setQuery("")}>Limpiar</PixelButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((module) => {
          const mastery = progress.moduleMastery[module.id] ?? 0;
          const cards = allFlashcards.filter((card) => card.module === module.id).length;
          return (
            <article key={module.id} className="pixel-corners border border-white/10 bg-black/30 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-neonCyan">{module.id}</p>
                  <h3 className="mt-1 font-display text-2xl font-black text-white">{module.title}</h3>
                </div>
                <span className="pixel-corners border border-oldGold/40 bg-oldGold/10 px-3 py-2 text-xs font-black text-oldGold">
                  {cards} tarjetas
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{module.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {module.articles.map((article) => (
                  <span
                    key={article}
                    className={`pixel-corners border px-3 py-1 text-xs font-black ${
                      progress.unlockedArticles.includes(article)
                        ? "border-neonCyan/45 bg-neonCyan/10 text-neonCyan"
                        : "border-white/10 bg-white/5 text-zinc-500"
                    }`}
                  >
                    art. {article}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <ProgressBar value={mastery} label="Dominio" tone="cyan" />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="pixel-corners border border-neonPink/20 bg-neonPink/5 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-neonPink">Mnemotecnia</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{module.mnemonic}</p>
                </div>
                <div className="pixel-corners border border-blood/20 bg-blood/5 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blood">Error frecuente</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{module.commonError}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </ArcadeFrame>
  );
}
