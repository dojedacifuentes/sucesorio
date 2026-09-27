import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { INTRO_VIDEO } from "./introConfig.js";

// Secuencia de activación según el storyboard de la marca:
// □X latente → ≡X (emerge la E) → EVA activa. Usa las piezas originales,
// sin redibujarlas. Es decorativa: no bloquea la portada (pointer-events:
// none), se salta con cualquier tecla o toque y se omite con movimiento
// reducido o si ya se vio en esta sesión.
const FRAMES = [
  { src: "/assets/marca/simbolo-cuadro-480.webp", label: "Latencia" },
  { src: "/assets/marca/emblema-lineas-480.webp", label: "Emerge la E" },
  { src: "/assets/marca/eva-logo-480.webp", label: "EVA activa" },
];
const STEP_MS = 620;
const SESSION_KEY = "lm-intro-visto";

function alreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export default function IntroSequence({ reduced }) {
  const [step, setStep] = useState(() => (reduced || alreadySeen() ? FRAMES.length : 0));

  useEffect(() => {
    if (step >= FRAMES.length) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* sin almacenamiento de sesión: se volverá a ver, sin más */
      }
      return undefined;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step >= FRAMES.length) return undefined;
    const skip = () => setStep(FRAMES.length);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [step]);

  if (INTRO_VIDEO && step < FRAMES.length) {
    // Integración preparada para el video del logotipo (ver introConfig.js).
    return (
      <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center bg-bg" aria-hidden="true">
        <video src={INTRO_VIDEO.src} poster={INTRO_VIDEO.poster} muted playsInline autoPlay preload="none" onEnded={() => setStep(FRAMES.length)} className="max-h-full max-w-full" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {step < FRAMES.length && (
        <motion.div
          key="intro"
          className="pointer-events-none absolute inset-0 z-40 grid place-items-center bg-bg/95"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          aria-hidden="true"
          data-decor=""
        >
          <div className="relative h-[min(56vmin,340px)] w-[min(56vmin,340px)]">
            <AnimatePresence>
              <motion.img
                key={FRAMES[step].src}
                src={FRAMES[step].src}
                alt=""
                className="brand-img absolute inset-0 h-full w-full"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.28 }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
