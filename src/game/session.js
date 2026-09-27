// Cierre de una partida: un resultado idempotente (id único por partida) que
// alimenta la pantalla de resultados, el historial y las estadísticas.
import { accuracy, bumpStat, pushResult } from "./progress.js";

/**
 * @param {object} r
 * @param {string} r.id        único por partida (p. ej. `arcade:<semilla>`)
 * @param {string} r.mode      sala (arcade, boss, memory…)
 * @param {string} r.title
 * @param {number} r.correct   aciertos autónomos + asistidos
 * @param {number} r.answered  lo realmente respondido (denominador de la precisión)
 * @param {number} [r.assisted]
 * @param {number} [r.score]
 * @param {string} [r.outcome] victoria | derrota | completado
 * @param {string} [r.message]
 * @param {Array<{label:string, ok:boolean|null, note?:string}>} [r.details]
 * @param {string} [r.stat]    estadística del perfil que suma una partida
 * @param {{scene:string, param?:string, label:string}} [r.replay]
 */
export function finishRun(save, r) {
  const result = {
    id: r.id,
    mode: r.mode,
    title: r.title,
    score: r.score ?? 0,
    correct: r.correct ?? 0,
    answered: r.answered ?? 0,
    assisted: r.assisted ?? 0,
    accuracy: accuracy(r.correct ?? 0, r.answered ?? 0),
    outcome: r.outcome ?? "completado",
    message: r.message ?? "",
    details: r.details ?? [],
    replay: r.replay ?? null,
    at: new Date().toISOString(),
  };
  let next = pushResult(save, result);
  if (r.stat) next = bumpStat(next, r.stat, r.id);
  if (next.run?.id === r.id || next.run?.scene === r.mode) next = { ...next, run: null };
  return next;
}

/** Guarda la partida en curso (para «Continuar» desde la portada). */
export function saveRun(save, run) {
  return { ...save, run: { ...run, savedAt: new Date().toISOString() } };
}

export function clearRun(save, scene) {
  if (!save.run || (scene && save.run.scene !== scene)) return save;
  return { ...save, run: null };
}
