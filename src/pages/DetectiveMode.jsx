import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import PixelCharacter from "../components/PixelCharacter";
import StatPanel from "../components/StatPanel";
import { detectiveCases } from "../data/cases";
import { advancedDetectiveCases } from "../data/advancedContent";
import { buildResult } from "../utils/gameLogic";
import { incrementStat } from "../utils/storage";

export default function DetectiveMode({ navigate, recordEvent, finishRun }) {
  const allCases = useMemo(() => [...detectiveCases, ...advancedDetectiveCases], []);
  const [caseId, setCaseId] = useState(allCases[0].id);
  const [docIndex, setDocIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [solved, setSolved] = useState({});

  const currentCase = useMemo(() => allCases.find((item) => item.id === caseId) ?? allCases[0], [allCases, caseId]);
  const currentDoc = currentCase.documents[docIndex] ?? currentCase.documents[0];

  function choose(option) {
    if (choice) return;
    setChoice(option);
    recordEvent({
      correct: option.correct,
      module: currentCase.module,
      article: option.article,
      concept: option.concept,
      mode: "detective",
      xp: option.correct ? 45 + currentCase.difficulty * 5 : 8,
      feedback: option.feedback,
    });
    if (option.correct && !solved[currentCase.id]) {
      incrementStat("detectiveSolved");
      setSolved((value) => ({ ...value, [currentCase.id]: true }));
    }
  }

  function finishCase() {
    finishRun(
      buildResult({
        mode: "Detective",
        title: currentCase.title,
        score: choice?.correct ? 500 + currentCase.difficulty * 75 : 120,
        correct: choice?.correct ? 1 : 0,
        total: 1,
        message: choice?.correct ? currentCase.resolution : "Caso cerrado con olor a apelacion academica.",
      }),
    );
  }

  function resetCase(nextId = currentCase.id) {
    setCaseId(nextId);
    setDocIndex(0);
    setChoice(null);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <ArcadeFrame title="Casos" kicker="Expedientes iniciales">
        <div className="grid gap-2">
          {allCases.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => resetCase(item.id)}
              className={`pixel-corners border p-3 text-left transition ${
                item.id === currentCase.id
                  ? "border-neonPink bg-neonPink/15 text-white"
                  : "border-white/10 bg-black/25 text-zinc-300 hover:border-neonCyan/50"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-neonCyan">Nivel {item.difficulty}</p>
              <p className="mt-1 font-bold">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.theme}</p>
            </button>
          ))}
        </div>
      </ArcadeFrame>

      <ArcadeFrame
        title={currentCase.title}
        kicker={`Detective juridico / ${currentCase.theme}`}
        action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="grid gap-5">
            <div className="pixel-corners border border-oldGold/30 bg-black/35 p-5">
              <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
                <PixelCharacter color="#c69a41" label="Fiscal civil" />
                <p className="text-sm leading-7 text-zinc-300">{currentCase.dossier}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {currentCase.documents.map((doc, index) => (
                <PixelButton
                  key={doc.title}
                  variant={docIndex === index ? "cyan" : "ghost"}
                  onClick={() => setDocIndex(index)}
                >
                  {doc.title}
                </PixelButton>
              ))}
            </div>

            <article className="document-paper pixel-corners border border-oldGold/40 p-5 shadow-gold">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-oldGold">Documento interactivo</p>
              <h3 className="mt-2 font-display text-2xl font-black text-white">{currentDoc.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{currentDoc.body}</p>
            </article>

            <div className="grid gap-3">
              {currentCase.choices.map((option) => (
                <PixelButton
                  key={option.label}
                  variant={choice ? (option.correct ? "cyan" : choice.label === option.label ? "danger" : "ghost") : "primary"}
                  disabled={Boolean(choice)}
                  onClick={() => choose(option)}
                >
                  {option.label}
                </PixelButton>
              ))}
            </div>

            {choice && (
              <div className={`pixel-corners border p-5 ${choice.correct ? "border-acid/50 bg-acid/10" : "border-blood/60 bg-blood/10"}`}>
                <p className="text-sm leading-7 text-zinc-100">{choice.feedback}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {choice.article} / {choice.concept}
                </p>
                <p className="mt-4 text-sm leading-7 text-zinc-300">{currentCase.resolution}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <PixelButton variant="gold" onClick={finishCase}>Cerrar expediente</PixelButton>
                  <PixelButton variant="ghost" onClick={() => resetCase()}>Reintentar caso</PixelButton>
                </div>
              </div>
            )}
          </section>

          <aside className="grid gap-5">
            <div className="grid grid-cols-2 gap-3">
              <StatPanel label="Dificultad" value={currentCase.difficulty} tone="gold" />
              <StatPanel label="Sospechosos" value={currentCase.cast.length} tone="pink" />
            </div>

            <div className="pixel-corners relative min-h-[360px] border border-neonCyan/25 bg-black/35 p-4">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-neonCyan">Arbol sucesorio</p>
              <div className="relative h-[300px]">
                <div className="absolute left-1/2 top-[22%] h-[42%] w-px bg-neonCyan/25" />
                <div className="absolute left-[28%] top-[47%] h-px w-[44%] bg-neonCyan/25" />
                {currentCase.tree.map((node) => (
                  <div
                    key={node.id}
                    className={`family-node pixel-corners absolute w-32 -translate-x-1/2 -translate-y-1/2 p-2 text-center text-xs ${
                      node.state === "dead" ? "is-dead" : node.state === "excluded" ? "is-excluded" : node.state === "represented" ? "is-represented" : ""
                    }`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <p className="font-black text-white">{node.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-400">{node.tag}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pixel-corners border border-white/10 bg-black/30 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-oldGold">Personajes</p>
              <div className="grid gap-2">
                {currentCase.cast.map((person) => (
                  <div key={person.name} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 text-xs">
                    <span className="font-bold text-zinc-200">{person.name}</span>
                    <span className="text-right text-zinc-500">{person.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </ArcadeFrame>
    </div>
  );
}
