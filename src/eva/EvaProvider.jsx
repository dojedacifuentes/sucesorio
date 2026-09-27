import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useGame } from "../game/store.jsx";
import { canReplace, pickLine, pushRecent } from "./director.js";

const EvaContext = createContext(null);

/**
 * Controlador de diálogo de EVA ligado a eventos del juego. Recuerda qué
 * dijo hace poco (también entre sesiones) y mantiene un historial para
 * releer cualquier mensaje: ninguna pista caduca antes de poder leerla.
 */
export function EvaProvider({ children }) {
  const { save, update } = useGame();
  const [message, setMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [unread, setUnread] = useState(false);
  const lastAmbient = useRef(-Infinity);
  const counter = useRef(0);
  const messageRef = useRef(null);
  const recentRef = useRef(save.eva?.recent ?? []);
  const chatter = save.settings.evaChatter;

  const show = useCallback(
    (line) => {
      if (!line?.text) return null;
      const now = Date.now();
      const entry = { ...line, at: now, key: `${line.id}-${(counter.current += 1)}` };
      // Si no puede reemplazar al mensaje actual (una pista recién dada), queda
      // en el historial y se devuelve igual: la escena puede mostrarla en su sitio.
      if (!canReplace(messageRef.current, entry, now)) {
        setHistory((h) => [entry, ...h].slice(0, 24));
        return entry;
      }
      if (entry.kind === "ambiente") lastAmbient.current = now;
      messageRef.current = entry;
      setMessage(entry);
      setUnread(true);
      setHistory((h) => [entry, ...h].slice(0, 24));
      if (line.id && !line.id.startsWith("custom")) {
        recentRef.current = pushRecent(recentRef.current, line.id);
        update((s) => ({ ...s, eva: { ...s.eva, recent: recentRef.current, lastEvent: line.event ?? null } }));
      }
      return entry;
    },
    [update],
  );

  /** Evento genérico: EVA elige la línea. */
  const say = useCallback(
    (event, ctx = {}) =>
      show(pickLine(event, ctx, { recent: recentRef.current, now: Date.now(), lastAmbientAt: lastAmbient.current, chatter })),
    [show, chatter],
  );

  /** Línea escrita para un caso concreto (pistas, ganchos, desenlaces). */
  const speak = useCallback(
    (text, { mood = "neutral", kind = "funcional", id } = {}) => show({ id: id ?? `custom-${text.slice(0, 24)}`, text, mood, kind }),
    [show],
  );

  const clear = useCallback(() => {
    messageRef.current = null;
    setMessage(null);
  }, []);

  const value = useMemo(
    () => ({ message, history, say, speak, clear, unread, markRead: () => setUnread(false) }),
    [message, history, say, speak, clear, unread],
  );
  return <EvaContext.Provider value={value}>{children}</EvaContext.Provider>;
}

export function useEva() {
  const ctx = useContext(EvaContext);
  if (!ctx) throw new Error("useEva fuera de EvaProvider");
  return ctx;
}
