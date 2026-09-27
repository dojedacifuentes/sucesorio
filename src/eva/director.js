import { LINES } from "./lines.js";

const RECENT_LIMIT = 14;
const AMBIENT_GAP_MS = 25000;

/**
 * Elige qué dice EVA ante un evento. Pura y determinista (fácil de probar):
 * - descarta líneas cuya condición no se cumple;
 * - evita las usadas recientemente;
 * - limita la frecuencia de comentarios de ambiente;
 * - las líneas funcionales nunca se silencian.
 */
export function pickLine(event, ctx = {}, { recent = [], now = 0, lastAmbientAt = -Infinity, chatter = "normal" } = {}) {
  const pool = (LINES[event] ?? []).filter((line) => !line.when || safeWhen(line.when, ctx));
  if (!pool.length) return null;
  const kind = pool[0].kind;
  if (kind === "ambiente") {
    if (chatter === "quiet") return null;
    if (now - lastAmbientAt < AMBIENT_GAP_MS) return null;
  }
  const fresh = pool.filter((line) => !recent.includes(line.id));
  let line;
  if (fresh.length) {
    line = fresh[(recent.length + event.length) % fresh.length];
  } else {
    // Todas usadas: la menos reciente.
    line = [...pool].sort((a, b) => recent.lastIndexOf(a.id) - recent.lastIndexOf(b.id))[0];
  }
  const text = typeof line.text === "function" ? line.text(ctx) : line.text;
  return { id: line.id, kind: line.kind, mood: line.mood, text: tidy(text), event };
}

export function pushRecent(recent, id) {
  return [...recent.filter((x) => x !== id), id].slice(-RECENT_LIMIT);
}

function safeWhen(fn, ctx) {
  try {
    return Boolean(fn(ctx));
  } catch {
    return false;
  }
}

function tidy(text) {
  return String(text ?? "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}

/** Prioridad de reemplazo: una línea de ambiente no pisa una pista reciente. */
export function canReplace(current, incoming, now, minFunctionalMs = 8000) {
  if (!current) return true;
  if (incoming.kind === "funcional") return true;
  if (current.kind === "funcional" && now - current.at < minFunctionalMs) return false;
  if (incoming.kind === "ambiente" && current.kind !== "ambiente" && now - current.at < minFunctionalMs) return false;
  return true;
}
