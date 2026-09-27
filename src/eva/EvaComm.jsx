import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../game/store.jsx";
import { useNav } from "../game/nav.jsx";
import FitPager from "../ui/FitPager.jsx";
import Icon from "../ui/Icon.jsx";
import { useEva } from "./EvaProvider.jsx";

const MOOD = {
  neutral: { ring: "rgb(var(--c-cyan))", label: "EVA" },
  ironica: { ring: "rgb(var(--c-magenta))", label: "EVA · ironía" },
  complacida: { ring: "rgb(var(--c-ok))", label: "EVA · satisfecha" },
  intrigada: { ring: "rgb(var(--c-violet))", label: "EVA · intrigada" },
  seria: { ring: "rgb(var(--c-warn))", label: "EVA · en serio" },
};

const SPEED = { normal: 70, fast: 180, instant: Infinity };
const SkipContext = createContext(0);

export function EvaAvatar({ size = 44, mood = "neutral", className = "" }) {
  const ring = MOOD[mood]?.ring ?? MOOD.neutral.ring;
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, boxShadow: `0 0 0 2px ${ring}, 0 0 16px ${ring}` }}
      aria-hidden="true"
    >
      <img src="/assets/eva/eva-avatar-128.webp" alt="" width={size} height={size} className="h-full w-full object-cover" draggable="false" />
    </span>
  );
}

function useSpeed() {
  const { save } = useGame();
  const effects = save.settings.effects;
  const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (effects === "reduced" || (effects === "auto" && prefersReduced)) return Infinity;
  return SPEED[save.settings.evaSpeed] ?? SPEED.normal;
}

/** Texto que aparece letra a letra sin mover el layout: el resto ocupa su sitio, invisible. */
function Typed({ text, cps }) {
  const skip = useContext(SkipContext);
  const [count, setCount] = useState(cps === Infinity ? text.length : 0);
  const skipAtMount = useRef(skip);

  useEffect(() => {
    if (cps === Infinity) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    let raf = 0;
    const start = performance.now();
    const tick = (t) => {
      const n = Math.min(text.length, Math.floor(((t - start) / 1000) * cps));
      setCount(n);
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, cps]);

  useEffect(() => {
    if (skip !== skipAtMount.current) setCount(text.length);
  }, [skip, text.length]);

  return (
    <>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span aria-hidden="true" style={{ opacity: 0 }}>
        {text.slice(count)}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

/**
 * Comunicador de EVA. Ocupa siempre la misma franja (no empuja el contenido
 * al aparecer) y nunca tapa opciones ni la barra de acciones.
 */
export default function EvaComm({ variant = "strip" }) {
  const { message, markRead } = useEva();
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState({ index: 0, total: 1 });
  const cps = useSpeed();
  const mood = message?.mood ?? "neutral";
  const pagerRef = useRef(null);

  useEffect(() => {
    if (message) markRead();
  }, [message, markRead]);

  const items = useMemo(
    () =>
      message
        ? [
            {
              id: message.key,
              text: message.text,
              render: (chunk) => (
                <p className={variant === "panel" ? "text-[0.975rem] leading-relaxed text-ink" : "text-[0.875rem] leading-[1.28] text-ink"}>
                  <Typed text={chunk} cps={cps} />
                </p>
              ),
            },
          ]
        : [
            {
              id: "idle",
              render: () => <p className="text-[0.9375rem] leading-snug text-dim">EVA observa el expediente.</p>,
            },
          ],
    [message, cps, variant],
  );

  const onPages = useCallback((p) => setPages(p), []);

  if (variant === "panel") {
    return (
      <SkipContext.Provider value={skip}>
        <section className="panel col h-full min-h-0 p-3" aria-label="EVA" onClick={() => setSkip((s) => s + 1)}>
          <div className="mb-2 flex items-center gap-3">
            <EvaAvatar size={52} mood={mood} />
            <div className="min-w-0">
              <p className="title-display text-base text-ink">EVA</p>
              <p className="label">{MOOD[mood]?.label ?? "EVA"}</p>
            </div>
          </div>
          <div className="col min-h-0 flex-1" aria-live="polite">
            <FitPager items={items} label="Mensaje" resetOn={message?.key} />
          </div>
        </section>
      </SkipContext.Provider>
    );
  }

  return (
    <SkipContext.Provider value={skip}>
      <section
        className="panel flex h-[96px] min-h-0 items-center gap-2.5 px-2.5 py-2"
        aria-label="EVA"
        data-eva-strip=""
      >
        <EvaAvatar size={40} mood={mood} />
        {/* Tocar el texto completa la escritura; el contenido entero está además en el lector de pantalla. */}
        <div className="col h-full min-h-0 min-w-0 flex-1 cursor-pointer" onClick={() => setSkip((s) => s + 1)} aria-live="polite">
          <FitPager items={items} controls="none" onPagesChange={onPages} resetOn={message?.key} label="Mensaje" />
        </div>
        {pages.total > 1 && <StripPager pages={pages} />}
      </section>
    </SkipContext.Provider>
  );
}

function StripPager({ pages }) {
  const { open } = useNav();
  return (
    <button type="button" className="btn btn-ghost h-11 w-11 shrink-0 flex-col gap-0 p-0 tabular-nums" onClick={() => open("eva")} aria-label={`Leer el mensaje completo de EVA (${pages.total} partes)`}>
      <Icon name="next" size={16} />
      <span className="text-[0.6875rem] leading-none">{pages.index + 1}/{pages.total}</span>
    </button>
  );
}

/** Botón compacto para pantallas bajas: la intervención se lee en su propia capa. */
export function EvaButton() {
  const { unread, message } = useEva();
  const { open } = useNav();
  return (
    <button type="button" className="btn btn-ghost btn-icon relative" onClick={() => open("eva")} aria-label={unread && message ? "EVA tiene un mensaje nuevo" : "Hablar con EVA"} title="EVA">
      <EvaAvatar size={28} mood={message?.mood} />
      {unread && message && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-magenta shadow-glowMagenta" aria-hidden="true" />}
    </button>
  );
}
