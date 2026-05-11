import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import { oralQuestions } from "../data/successionData";
import { advancedOralQuestions } from "../data/advancedContent";
import { buildResult, pick, shuffle } from "../utils/gameLogic";
import { incrementStat } from "../utils/storage";

export default function OralMode({ navigate, recordEvent, finishRun }) {
  const questionBank = useMemo(() => [...oralQuestions, ...advancedOralQuestions], []);
  const questions = useMemo(() => pick(questionBank, 10), [questionBank]);
  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState(() => shuffle(questions[0].blocks));
  const [answer, setAnswer] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const question = questions[index];

  function moveToAnswer(block) {
    if (feedback) return;
    setPool((value) => value.filter((item) => item.id !== block.id));
    setAnswer((value) => [...value, block]);
  }

  function moveToPool(block) {
    if (feedback) return;
    setAnswer((value) => value.filter((item) => item.id !== block.id));
    setPool((value) => [...value, block]);
  }

  function submit() {
    const ordered = answer.map((item) => item.id);
    const ok = ordered.length === question.answer.length && ordered.every((item, itemIndex) => item === question.answer[itemIndex]);
    setFeedback(ok ? question.feedback : `Orden incorrecto. Estructura esperada: concepto, norma, doctrina y caso. ${question.feedback}`);
    setCorrect((value) => value + (ok ? 1 : 0));
    setScore((value) => value + (ok ? 220 : 35));
    recordEvent({
      correct: ok,
      module: question.module,
      article: question.blocks.find((block) => block.id === "norma")?.label ?? "",
      concept: question.prompt,
      mode: "oral",
      xp: ok ? 30 : 6,
      feedback: question.feedback,
    });
    incrementStat("oralAnswered");
  }

  function next() {
    if (index >= questions.length - 1) {
      finishRun(
        buildResult({
          mode: "Oral",
          title: "Oral de grado",
          score,
          correct,
          total: questions.length,
          message: correct >= 8 ? "Respuesta con columna vertebral civilista." : "Hay estructura, pero aun suena a fotocopia nerviosa.",
        }),
      );
      return;
    }
    const nextQuestion = questions[index + 1];
    setIndex((value) => value + 1);
    setPool(shuffle(nextQuestion.blocks));
    setAnswer([]);
    setFeedback(null);
  }

  return (
    <ArcadeFrame
      title="Oral de grado"
      kicker="Concepto / norma / doctrina / caso"
      action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Puntaje" value={score} tone="gold" />
            <StatPanel label="Aciertos" value={correct} tone="acid" />
          </div>
          <ProgressBar value={index + 1} max={questions.length} label="Interrogacion" tone="cyan" />
          <div className="pixel-corners border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-400">
            Ordena la respuesta como si estuvieras de pie frente a una comision que ya escucho diecisiete definiciones
            peores.
          </div>
        </aside>

        <section className="grid gap-5">
          <div className="pixel-corners border border-neonCyan/30 bg-black/40 p-5 shadow-neon">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-oldGold">
              Pregunta {index + 1}/{questions.length}
            </p>
            <h3 className="mt-3 font-display text-3xl font-black text-white">{question.prompt}</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="pixel-corners border border-white/10 bg-black/30 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-neonPink">Bloques disponibles</p>
              <div className="grid gap-3">
                {pool.map((block) => (
                  <PixelButton key={block.id} variant="ghost" onClick={() => moveToAnswer(block)}>
                    {block.label}
                  </PixelButton>
                ))}
              </div>
            </div>

            <div className="pixel-corners border border-oldGold/30 bg-black/30 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-oldGold">Tu estructura</p>
              <div className="grid min-h-56 gap-3">
                {answer.map((block, blockIndex) => (
                  <PixelButton key={block.id} variant="gold" onClick={() => moveToPool(block)}>
                    {blockIndex + 1}. {block.label}
                  </PixelButton>
                ))}
              </div>
            </div>
          </div>

          {feedback && (
            <div className={`pixel-corners border p-4 text-sm leading-7 ${feedback.startsWith("Orden incorrecto") ? "border-blood/60 bg-blood/10" : "border-acid/50 bg-acid/10"}`}>
              {feedback}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {!feedback ? (
              <PixelButton variant="primary" disabled={answer.length !== question.answer.length} onClick={submit}>
                Responder
              </PixelButton>
            ) : (
              <PixelButton variant="cyan" onClick={next}>{index >= questions.length - 1 ? "Resultados" : "Siguiente"}</PixelButton>
            )}
            <PixelButton variant="ghost" onClick={() => { setPool(shuffle(question.blocks)); setAnswer([]); setFeedback(null); }}>
              Reordenar
            </PixelButton>
            <PixelButton
              variant="gold"
              onClick={() => {
                setAnswer(question.answer.map((id) => question.blocks.find((block) => block.id === id)));
                setPool([]);
              }}
            >
              Estructura modelo
            </PixelButton>
          </div>
        </section>
      </div>
    </ArcadeFrame>
  );
}
