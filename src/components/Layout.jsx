import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRank } from "../utils/gameLogic";
import PixelButton from "./PixelButton";

const navItems = [
  ["home", "Portada"],
  ["modes", "Modos"],
  ["codex", "Codex"],
  ["progress", "Progreso"],
];

export default function Layout({ children, currentView, navigate, progress }) {
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef(null);
  const rank = getRank(progress.xp);

  useEffect(() => {
    if (!audioOn) {
      audioRef.current?.stop?.();
      audioRef.current = null;
      return;
    }

    const context = new AudioContext();
    const gain = context.createGain();
    const drone = context.createOscillator();
    const pulse = context.createOscillator();
    const filter = context.createBiquadFilter();

    drone.type = "sawtooth";
    drone.frequency.value = 46.25;
    pulse.type = "sine";
    pulse.frequency.value = 92.5;
    filter.type = "lowpass";
    filter.frequency.value = 420;
    gain.gain.value = 0.025;

    drone.connect(filter);
    pulse.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    drone.start();
    pulse.start();

    audioRef.current = {
      stop: () => {
        gain.gain.setTargetAtTime(0, context.currentTime, 0.05);
        setTimeout(() => {
          drone.stop();
          pulse.stop();
          context.close();
        }, 160);
      },
    };

    return () => audioRef.current?.stop?.();
  }, [audioOn]);

  return (
    <div className="arcade-shell">
      <div className="city-layer" />
      <div className="rain-layer" />
      <div className="noise" />
      <div className="scanlines" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="group text-left focus:outline-none focus:ring-2 focus:ring-neonCyan"
          >
            <p className="font-display text-xl font-black tracking-[0.12em] text-white md:text-2xl">
              LEX <span className="text-neonPink">MORTIS</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neonCyan">Sucesorio Arcade</p>
          </button>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map(([view, label]) => (
              <button
                key={view}
                type="button"
                onClick={() => navigate(view)}
                className={`pixel-corners border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                  currentView === view
                    ? "border-neonPink bg-neonPink/20 text-white"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:border-neonCyan/50 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
            <PixelButton variant={audioOn ? "gold" : "ghost"} className="py-2" onClick={() => setAudioOn((value) => !value)}>
              {audioOn ? "Audio ON" : "Audio OFF"}
            </PixelButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto min-h-[calc(100vh-86px)] max-w-7xl px-4 py-6 md:py-8">
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="pixel-corners border border-white/10 bg-black/25 px-4 py-3 text-xs text-zinc-300">
            <span className="text-neonCyan">Rango:</span> {rank.title} <span className="mx-2 text-zinc-600">/</span>
            <span className="text-oldGold">XP:</span> {progress.xp} <span className="mx-2 text-zinc-600">/</span>
            <span className="text-neonPink">Articulos:</span> {progress.unlockedArticles.length}
          </div>
          <PixelButton variant="cyan" onClick={() => navigate("memory")}>
            Repasar cadaveres juridicos
          </PixelButton>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.22 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
