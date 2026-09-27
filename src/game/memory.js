import { CARDS } from "./content.js";

/** Fichas para hoy: vencidas o nunca vistas, primero las de menor confianza. */
export function dueCards(schedule, now = Date.now()) {
  return CARDS.map((c) => ({ c, due: schedule?.[c.id]?.dueAt ?? 0, conf: schedule?.[c.id]?.confidence ?? 0 }))
    .filter((x) => x.due <= now)
    .sort((a, b) => a.due - b.due || a.conf - b.conf)
    .map((x) => x.c);
}
