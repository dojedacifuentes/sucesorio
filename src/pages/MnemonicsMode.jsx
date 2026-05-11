import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import { mnemonicChallenges } from "../data/successionData";
import { advancedMnemonicChallenges } from "../data/advancedContent";
import { buildResult, isAnswerCorrect, shuffle } from "../utils/gameLogic";
import { incrementStat } from "../utils/storage";

export default function MnemonicsMode({ navigate, recordEvent, finishRun }) {
  const challenges = useMemo(() => shuffle([...mnemonicChallenges, ...advancedMnemonicChallenges]), []);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const challenge = challenges[index];

  function submit(event) {
    event.preventDefault();
    if (feedback) return;
    const ok = isAnswerCorrect(input, challenge.answer);
    setFeedback(ok ? challenge.feedback : `Incorrecto. Era ${challenge.answer}. ${challenge.expansion}`);
    setCorrect((value) => value + (ok ? 1 : 0));
    setScore((value) => value + (ok ? 140 : 20));
    recordEvent({
      correct: ok,
      module: challenge.module,
      article: challenge.answer,
      concept: challenge.hint,
      mode: "mnemonics",
      xp: ok ? 20 : 5,
      feedback: challenge.feedback,
    });
    if (ok) incrementStat("mnemonicsSolved");
  }

  function next() {
    if (index >= challenges.length - 1) {
      finishRun(
        buildResult({
          mode: "Mnemotecnias",
          title: "Máquina de mnemotecnias",
          score,
          correct,
          total: challenges.length,
          message: correct >= 12 ? "Tu memoria ya tiene luces de emergencia funcionales." : "Las siglas siguen vivas. Eso no es una amenaza; es un temario.",
        }),
      );
      return;
    }
    setIndex((value) => value + 1);
    setInput("");
    setFeedback(null);
  }

  return (
    <ArcadeFrame
      title="Máquina de mnemotecnias"
      kicker="Siglas, plazos y reflejos"
      action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Puntaje" value={score} tone="gold" />
            <StatPanel label="Aciertos" value={correct} tone="acid" />
          </div>
          <ProgressBar value={index + 1} max={challenges.length} label="Ronda" tone="pink" />
          <div className="pixel-corners border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-400">
            Completa la sigla o palabra clave. Mayusculas, minusculas y tildes dan igual; el ridiculo doctrinal no.
          </div>
        </aside>

        <form onSubmit={submit} className="pixel-corners border border-neonPink/35 bg-black/40 p-6 shadow-pink">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-oldGold">{challenge.hint}</p>
          <h3 className="mt-5 font-display text-6xl font-black tracking-[0.12em] text-white md:text-7xl">{challenge.prompt}</h3>
          <p className="mt-5 text-sm leading-7 text-zinc-400">{challenge.expansion}</p>

          <label className="mt-8 block">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-neonCyan">Respuesta</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={Boolean(feedback)}
              className="mt-2 w-full border border-white/10 bg-black/55 px-4 py-4 text-2xl font-black uppercase tracking-[0.18em] text-white outline-none focus:border-neonCyan"
              autoFocus
            />
          </label>

          {feedback && (
            <div className={`mt-5 pixel-corners border p-4 text-sm leading-7 ${feedback.startsWith("Correcto") ? "border-acid/50 bg-acid/10" : "border-blood/60 bg-blood/10"}`}>
              {feedback}
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {!feedback ? (
              <PixelButton type="submit" variant="primary">Verificar</PixelButton>
            ) : (
              <PixelButton variant="cyan" onClick={next}>{index >= challenges.length - 1 ? "Resultados" : "Siguiente"}</PixelButton>
            )}
            <PixelButton variant="ghost" onClick={() => setInput(challenge.answer)}>Mostrar respuesta</PixelButton>
          </div>
        </form>
      </div>
    </ArcadeFrame>
  );
}
