import { useEffect, useState } from "react";
import { useGame } from "../game/store.jsx";

function systemPrefersReduced() {
  return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

/** true si el jugador eligió efectos reducidos o su sistema lo pide (en «Según sistema»). */
export function useReducedMotion() {
  const { save } = useGame();
  const [system, setSystem] = useState(systemPrefersReduced);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return undefined;
    const on = () => setSystem(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  const effects = save.settings.effects;
  return effects === "reduced" || (effects === "auto" && system);
}
