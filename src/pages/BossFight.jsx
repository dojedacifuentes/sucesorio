import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import { bosses } from "../data/bosses";
import { advancedBosses } from "../data/advancedContent";
import { buildResult, shuffle } from "../utils/gameLogic";
import { incrementStat } from "../utils/storage";

export default function BossFight({ navigate, recordEvent, finishRun }) {
  const allBosses = useMemo(() => [...bosses, ...advancedBosses], []);
  const [bossId, setBossId] = useState(allBosses[0].id);
  const [index, setIndex] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [log, setLog] = useState("El boss espera una cita correcta. Que Dios, si litiga, te ampare.");
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);

  const boss = allBosses.find((item) => item.id === bossId) ?? allBosses[0];
  const question = boss.questions[index];
  const options = useMemo(() => shuffle(question.options), [question]);

  function reset(id = bossId) {
    setBossId(id);
    setIndex(0);
    setBossHp(100);
    setPlayerHp(100);
    setLog("Nuevo combate. El examen oral huele sangre.");
    setLocked(false);
    setScore(0);
    setCorrect(0);
  }

  function answer(option) {
    if (locked) return;
    const ok = option === question.answer;
    const nextBossHp = ok ? Math.max(0, bossHp - 22) : bossHp;
    const nextPlayerHp = ok ? playerHp : Math.max(0, playerHp - 24);

    setLocked(true);
    setBossHp(nextBossHp);
    setPlayerHp(nextPlayerHp);
    setCorrect((value) => value + (ok ? 1 : 0));
    setScore((value) => value + (ok ? 180 + boss.questions.length * 10 : 20));
    setLog(`${ok ? "Impacto critico." : "Daño recibido."} ${question.feedback}`);

    recordEvent({
      correct: ok,
      module: boss.module,
      article: question.article,
      concept: boss.subtitle,
      mode: "boss",
      xp: ok ? 32 : 6,
      feedback: question.feedback,
    });

    if (nextBossHp <= 0 || nextPlayerHp <= 0 || index >= boss.questions.length - 1) {
      window.setTimeout(() => {
        if (nextBossHp <= 0) incrementStat("bossKills");
        finishRun(
          buildResult({
            mode: "Boss Fight",
            title: boss.name,
            score: score + (ok ? 220 : 0),
            correct: correct + (ok ? 1 : 0),
            total: boss.questions.length,
            message: nextBossHp <= 0 ? "Boss destruido. Montecinos.exe dejo de responder." : "El boss sobrevivio. Tu memoria pidio inventario.",
          }),
        );
      }, 900);
      return;
    }

    window.setTimeout(() => {
      setIndex((value) => value + 1);
      setLocked(false);
    }, 900);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[310px_1fr]">
      <ArcadeFrame title="Bosses" kicker="Seleccion de amenaza">
        <div className="grid gap-2">
          {allBosses.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => reset(item.id)}
              className={`pixel-corners border p-3 text-left transition ${
                boss.id === item.id ? "border-neonPink bg-neonPink/15 text-white" : "border-white/10 bg-black/25 text-zinc-300 hover:border-neonCyan/50"
              }`}
            >
              <p className="font-bold">{item.name}</p>
              <p className="text-xs text-zinc-500">{item.subtitle}</p>
            </button>
          ))}
        </div>
      </ArcadeFrame>

      <ArcadeFrame
        title={boss.name}
        kicker={boss.subtitle}
        action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <section className="pixel-corners border border-white/10 bg-black/35 p-5">
            <p className="text-sm leading-7 text-zinc-400">{boss.intro}</p>
            <div className="mt-5 grid gap-4">
              <ProgressBar value={playerHp} label="Tu vida juridica" tone="cyan" />
              <ProgressBar value={bossHp} label="Defensa del boss" tone="blood" />
            </div>

            <div className="mt-8 min-h-48 pixel-corners border border-neonPink/35 bg-neonPink/10 p-5 shadow-pink">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-oldGold">
                Ataque {index + 1}/{boss.questions.length}
              </p>
              <h3 className="mt-3 font-display text-3xl font-black leading-tight text-white">{question.prompt}</h3>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <PixelButton key={option} variant="primary" disabled={locked} onClick={() => answer(option)}>
                  {option}
                </PixelButton>
              ))}
            </div>
          </section>

          <aside className="grid gap-5">
            <div className="pixel-corners border border-white/10 bg-black/35 p-5 text-center">
              <div
                className="mx-auto h-40 w-40 pixel-corners border bg-black/50 shadow-pink"
                style={{
                  borderColor: boss.color,
                  boxShadow: `0 0 36px ${boss.color}55`,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08), transparent), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)",
                }}
              />
              <h3 className="mt-4 font-display text-2xl font-black text-white">{boss.name}</h3>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Entidad examinadora</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatPanel label="Puntaje" value={score} tone="gold" />
              <StatPanel label="Aciertos" value={correct} tone="acid" />
            </div>

            <div className="pixel-corners border border-oldGold/30 bg-black/35 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-oldGold">Log del combate</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{log}</p>
            </div>
          </aside>
        </div>
      </ArcadeFrame>
    </div>
  );
}
