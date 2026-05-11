import { useCallback, useEffect, useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import { arcadeQuestions } from "../data/successionData";
import { advancedArcadeQuestions } from "../data/advancedContent";
import { buildResult, formatTimer, pick, shuffle } from "../utils/gameLogic";
import { incrementStat } from "../utils/storage";

const ROUND_TIME = 18;

export default function ArcadeMode({ navigate, recordEvent, finishRun }) {
  const questionBank = useMemo(() => [...arcadeQuestions, ...advancedArcadeQuestions], []);
  const questions = useMemo(() => pick(questionBank, 16), [questionBank]);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(ROUND_TIME);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [sessionOver, setSessionOver] = useState(false);

  const question = questions[index];
  const options = useMemo(() => shuffle(question.options), [question]);

  const answer = useCallback(
    (option) => {
      if (feedback || sessionOver) return;
      const correct = option === question.answer;
      const nextLives = correct ? lives : lives - 1;
      const nextCombo = correct ? combo + 1 : 0;
      const gained = correct ? 120 + combo * 25 + time * 4 : 0;

      setLives(nextLives);
      setCombo(nextCombo);
      setBestCombo((value) => Math.max(value, nextCombo));
      setScore((value) => value + gained);
      setCorrectCount((value) => value + (correct ? 1 : 0));
      setFeedback({
        correct,
        selected: option ?? "Tiempo agotado",
        text: correct ? question.feedback : `Incorrecto. ${question.feedback}`,
      });

      recordEvent({
        correct,
        module: question.module,
        article: question.article,
        concept: question.concept,
        mode: "arcade",
        xp: correct ? 22 : 4,
        feedback: question.feedback,
      });

      if (nextLives <= 0 || index >= questions.length - 1) {
        setSessionOver(true);
      }
    },
    [combo, feedback, index, lives, question, recordEvent, sessionOver, time],
  );

  useEffect(() => {
    if (feedback || sessionOver) return undefined;
    const interval = window.setInterval(() => {
      setTime((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [feedback, index, sessionOver]);

  useEffect(() => {
    if (time === 0 && !feedback && !sessionOver) answer(null);
  }, [answer, feedback, sessionOver, time]);

  function nextQuestion() {
    if (sessionOver) {
      incrementStat("arcadeRuns");
      finishRun(
        buildResult({
          mode: "Arcade",
          title: "Neón de artículos",
          score,
          correct: correctCount,
          total: questions.length,
          message: bestCombo >= 5 ? "Combo respetable. El Codigo casi sonrio." : "Sobreviviste. La doctrina pidio revisar tus heridas.",
        }),
      );
      return;
    }
    setIndex((value) => value + 1);
    setTime(ROUND_TIME);
    setFeedback(null);
  }

  return (
    <ArcadeFrame
      title="Neón de artículos"
      kicker="Modo arcade"
      action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Tiempo" value={formatTimer(time)} tone={time <= 5 ? "blood" : "cyan"} />
            <StatPanel label="Vidas" value={"♥".repeat(Math.max(0, lives)) || "0"} tone="blood" />
            <StatPanel label="Puntaje" value={score} tone="gold" />
            <StatPanel label="Combo" value={`x${combo}`} tone="pink" />
          </div>
          <ProgressBar value={index + 1} max={questions.length} label="Oleada de preguntas" tone="cyan" />
          <div className="pixel-corners border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-400">
            Responde antes de que el cronometro cierre el expediente. Error: pierdes vida. Acierto: combo y XP.
          </div>
        </div>

        <div className="pixel-corners border border-neonCyan/30 bg-black/35 p-5 shadow-neon">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-oldGold">
            Pregunta {index + 1}/{questions.length}
          </p>
          <h3 className="mt-3 min-h-24 font-display text-3xl font-black leading-tight text-white">{question.prompt}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <PixelButton
                key={option}
                variant={feedback ? (option === question.answer ? "cyan" : option === feedback.selected ? "danger" : "ghost") : "primary"}
                disabled={Boolean(feedback)}
                onClick={() => answer(option)}
              >
                {option}
              </PixelButton>
            ))}
          </div>

          {feedback && (
            <div
              className={`mt-6 pixel-corners border p-4 ${
                feedback.correct ? "border-acid/50 bg-acid/10 text-green-100" : "border-blood/60 bg-blood/10 text-red-100"
              }`}
            >
              <p className="text-sm leading-7">{feedback.text}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-400">
                Articulo: {question.article} / Concepto: {question.concept}
              </p>
              <PixelButton className="mt-4 w-full" variant={sessionOver ? "gold" : "cyan"} onClick={nextQuestion}>
                {sessionOver ? "Ver resultados" : "Siguiente pregunta"}
              </PixelButton>
            </div>
          )}
        </div>
      </div>
    </ArcadeFrame>
  );
}
