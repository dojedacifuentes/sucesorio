import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createDefaultSave, loadSave, resetSave, writeSave } from "./persistence.js";

const GameContext = createContext(null);

/**
 * Estado persistente de la partida. `update(fn)` aplica una función pura al
 * guardado; la escritura se agrupa y se fuerza al ocultar la pestaña.
 */
export function GameProvider({ children, storage }) {
  const initial = useMemo(() => loadSave(storage), [storage]);
  const [save, setSave] = useState(initial.save);
  const [notice, setNotice] = useState(initial.notice);
  const [saveFailed, setSaveFailed] = useState(!initial.storageOk);
  const saveRef = useRef(save);
  const pending = useRef(null);
  saveRef.current = save;

  const flush = useCallback(() => {
    if (pending.current) {
      window.clearTimeout(pending.current);
      pending.current = null;
    }
    const ok = writeSave(saveRef.current, storage);
    setSaveFailed(!ok);
    return ok;
  }, [storage]);

  const schedule = useCallback(() => {
    if (pending.current) window.clearTimeout(pending.current);
    pending.current = window.setTimeout(flush, 250);
  }, [flush]);

  const update = useCallback(
    (fn) => {
      setSave((current) => {
        const next = fn(current);
        if (next === current) return current;
        saveRef.current = next;
        return next;
      });
      schedule();
    },
    [schedule],
  );

  // La migración desde v1 se escribe de inmediato: v1 queda intacta como respaldo.
  useEffect(() => {
    if (initial.notice === "migrado") flush();
  }, [initial.notice, flush]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
      if (pending.current) window.clearTimeout(pending.current);
    };
  }, [flush]);

  const reset = useCallback(() => {
    const keepSettings = saveRef.current.settings;
    const fresh = { ...resetSave(storage), settings: keepSettings };
    saveRef.current = fresh;
    setSave(fresh);
    schedule();
  }, [schedule, storage]);

  const setSetting = useCallback(
    (key, value) => update((s) => ({ ...s, settings: { ...s.settings, [key]: value } })),
    [update],
  );

  const value = useMemo(
    () => ({ save, update, reset, setSetting, flush, notice, dismissNotice: () => setNotice(null), saveFailed }),
    [save, update, reset, setSetting, flush, notice, saveFailed],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame fuera de GameProvider");
  return ctx;
}

export function useSettings() {
  return useGame().save.settings;
}

export { createDefaultSave };
