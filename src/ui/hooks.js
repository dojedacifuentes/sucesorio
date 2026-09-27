import { useEffect, useRef, useState } from "react";
import { usePaused } from "../game/nav.jsx";

/**
 * Atajos de teclado de una escena. No actúan mientras hay una capa abierta
 * ni cuando el foco está en un campo de texto.
 * handlers: { "1": fn, "Enter": fn, ... } (claves de KeyboardEvent.key)
 */
export function useKeys(handlers, enabled = true) {
  const paused = usePaused();
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    if (!enabled || paused) return undefined;
    const onKey = (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const fn = ref.current[event.key] ?? ref.current[event.key.toLowerCase()];
      if (!fn) return;
      // Enter sobre un botón enfocado lo activa el navegador: no duplicar.
      if ((event.key === "Enter" || event.key === " ") && tag === "BUTTON") return;
      event.preventDefault();
      fn(event);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, paused]);
}

/**
 * Cuenta atrás que se detiene sola con una capa abierta o la pestaña oculta.
 * Llama a onExpire una sola vez por `key`. seconds = null → sin reloj.
 */
export function useCountdown({ seconds, running, key, onExpire }) {
  const paused = usePaused();
  const [left, setLeft] = useState(seconds ?? 0);
  const fired = useRef(null);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => {
    setLeft(seconds ?? 0);
    fired.current = null;
  }, [seconds, key]);

  useEffect(() => {
    if (seconds == null || !running || paused) return undefined;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      setLeft((value) => {
        const next = Math.max(0, value - dt);
        if (next === 0 && fired.current !== key) {
          fired.current = key;
          window.setTimeout(() => expire.current?.(), 0);
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [seconds, running, paused, key]);

  return seconds == null ? null : left;
}

/** Segundos por pregunta según la sala y el ajuste «Tiempo en desafíos». */
export function timerSeconds(base, setting) {
  if (setting === "off") return null;
  if (setting === "relaxed") return Math.round(base * 1.8);
  return base;
}
