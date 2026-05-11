import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import StatPanel from "../components/StatPanel";
import { flashcards } from "../data/successionData";
import { advancedFlashcards } from "../data/advancedContent";
import { getDueFlashcards, pick } from "../utils/gameLogic";
import { scheduleMemoryCard } from "../utils/storage";

export default function MemoryMode({ navigate, progress, recordEvent, refreshProgress }) {
  const allFlashcards = useMemo(() => [...flashcards, ...advancedFlashcards], []);
  const due = useMemo(() => getDueFlashcards(allFlashcards, progress.memorySchedule), [allFlashcards, progress.memorySchedule]);
  const deck = useMemo(() => (due.length > 0 ? due : pick(allFlashcards, 12)), [allFlashcards, due]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[index % deck.length];

  function rate(rating) {
    const correct = rating !== "die";
    recordEvent({
      correct,
      module: card.module,
      article: card.article,
      concept: card.concept,
      mode: "memory",
      xp: rating === "know" ? 18 : rating === "doubt" ? 10 : 4,
      feedback: card.commonError,
    });
    scheduleMemoryCard(card.id, rating);
    refreshProgress();
    setFlipped(false);
    setIndex((value) => value + 1);
  }

  return (
    <ArcadeFrame
      title="Cementerio de conceptos"
      kicker="Repeticion espaciada local"
      action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Debidas" value={due.length} tone="pink" />
            <StatPanel label="Revisadas" value={progress.stats.flashcardsReviewed} tone="cyan" />
          </div>
          <div className="pixel-corners border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-400">
            Las tarjetas vuelven segun tu honestidad. Si aprietas "Mori juridicamente", aparece de inmediato. El sistema
            no juzga; solo archiva.
          </div>
        </aside>

        <section>
          <button
            type="button"
            onClick={() => setFlipped((value) => !value)}
            className="document-paper pixel-corners min-h-[390px] w-full border border-oldGold/50 p-6 text-left shadow-gold transition hover:border-neonCyan/60"
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-oldGold">
              Tarjeta {index + 1} / {deck.length} · {card.module}
            </p>
            {!flipped ? (
              <div className="mt-8">
                <p className="text-sm uppercase tracking-[0.24em] text-neonCyan">Concepto</p>
                <h3 className="mt-3 font-display text-5xl font-black text-white">{card.concept}</h3>
                <p className="mt-8 text-sm text-zinc-500">Click para revelar definicion, ejemplo y error frecuente.</p>
              </div>
            ) : (
              <div className="mt-4 grid gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-neonCyan">Articulo</p>
                  <p className="mt-1 text-2xl font-black text-white">{card.article}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-oldGold">Definicion</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-200">{card.definition}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-neonPink">Ejemplo</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{card.example}</p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-blood">Error frecuente</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">{card.commonError}</p>
                </div>
              </div>
            )}
          </button>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <PixelButton variant="cyan" onClick={() => rate("know")}>Lo sé</PixelButton>
            <PixelButton variant="gold" onClick={() => rate("doubt")}>Dudé</PixelButton>
            <PixelButton variant="danger" onClick={() => rate("die")}>Morí jurídicamente</PixelButton>
          </div>
        </section>
      </div>
    </ArcadeFrame>
  );
}
