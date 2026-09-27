import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export const SCENES = ["title", "hub", "detective", "arcade", "boss", "memory", "mnemonics", "acervos", "oral", "progress", "results"];

const NavContext = createContext(null);

function parseHash(hash) {
  const [scene, ...rest] = String(hash ?? "")
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);
  if (!SCENES.includes(scene)) return null;
  return { id: scene, param: rest[0] ?? null };
}

function toHash(scene) {
  if (!scene || scene.id === "title") return "#/";
  return `#/${scene.id}${scene.param ? `/${encodeURIComponent(scene.param)}` : ""}`;
}

/**
 * Navegación por escenas (sin enrutador): una escena activa y una pila de
 * capas (Codex, pausa, ajustes, EVA…). Las capas no desmontan la escena de
 * abajo, así que al cerrarlas se vuelve al punto exacto.
 */
export function NavProvider({ children }) {
  const [scene, setScene] = useState(() => parseHash(window.location.hash) ?? { id: "title", param: null });
  const [overlays, setOverlays] = useState([]);
  const [hidden, setHidden] = useState(() => document.visibilityState === "hidden");
  const returnFocus = useRef([]);

  const go = useCallback((id, param = null, { replace = false } = {}) => {
    setOverlays([]);
    setScene({ id, param, nonce: Date.now() });
    const hash = toHash({ id, param });
    if (window.location.hash !== hash) {
      if (replace) window.history.replaceState(null, "", hash);
      else window.history.pushState(null, "", hash);
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      const next = parseHash(window.location.hash) ?? { id: "title", param: null };
      setOverlays([]);
      setScene((current) => (current.id === next.id && current.param === next.param ? current : { ...next, nonce: Date.now() }));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const open = useCallback((id, params = {}) => {
    returnFocus.current.push(document.activeElement);
    setOverlays((stack) => [...stack.filter((o) => o.id !== id), { id, params }]);
  }, []);

  const close = useCallback((id) => {
    setOverlays((stack) => (id ? stack.filter((o) => o.id !== id) : stack.slice(0, -1)));
    const target = returnFocus.current.pop();
    window.requestAnimationFrame(() => {
      if (target && typeof target.focus === "function" && document.contains(target)) target.focus({ preventScroll: true });
    });
  }, []);

  const value = useMemo(
    () => ({
      scene,
      go,
      overlays,
      open,
      close,
      top: overlays[overlays.length - 1] ?? null,
      paused: overlays.length > 0 || hidden,
      hidden,
    }),
    [scene, go, overlays, open, close, hidden],
  );
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav fuera de NavProvider");
  return ctx;
}

/** true mientras haya una capa abierta o la pestaña esté oculta. */
export function usePaused() {
  return useNav().paused;
}
