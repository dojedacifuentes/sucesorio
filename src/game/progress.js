// Reglas de progreso. Funciones puras sobre el guardado: reciben el estado y
// devuelven uno nuevo. Toda recompensa pasa por una clave idempotente, de modo
// que un doble clic, una tecla repetida o una reanudación no la duplican.
import { emptyMastery } from "./persistence.js";

export const ranks = [
  { level: 1, minXp: 0, title: "Merodeador de apuntes" },
  { level: 2, minXp: 180, title: "Técnico en subrayado fluorescente" },
  { level: 3, minXp: 420, title: "Pasante de notaría nocturna" },
  { level: 4, minXp: 760, title: "Litigante de cementerio" },
  { level: 5, minXp: 1200, title: "Albacea del neón" },
  { level: 6, minXp: 1750, title: "Heredero universal del caos" },
  { level: 7, minXp: 2500, title: "Ministro de Corte del inframundo civil" },
];

export function getRank(xp = 0) {
  return ranks.reduce((current, rank) => (xp >= rank.minXp ? rank : current), ranks[0]);
}

export function nextRank(xp = 0) {
  return ranks.find((rank) => rank.minXp > xp) ?? null;
}

export function hasAward(save, key) {
  return Boolean(save.awards?.[key]);
}

function stamp(save, key, at) {
  return { ...save.awards, [key]: at };
}

function normalizeArticles(article) {
  return String(article ?? "")
    .replace(/arts?\.|ss\.|aprox\.|,|\/|a /gi, " ")
    .split(/\s+/)
    .filter((token) => /^\d{3,4}$/.test(token));
}

/**
 * Registra una respuesta evaluada.
 * - key: identifica la respuesta dentro de la partida (p. ej. "arcade:<seed>:a12").
 * - assisted: hubo pista, modelo o reintento; no cuenta como dominio autónomo.
 */
export function recordAnswer(save, event, at = new Date().toISOString()) {
  const { key, correct, assisted = false, module, article, concept, mode = "general", feedback = "", xp } = event;
  const awardKey = `ans:${key}`;
  if (!key || hasAward(save, awardKey)) return save;

  const next = {
    ...save,
    awards: stamp(save, awardKey, at),
    profile: { ...save.profile, stats: { ...save.profile.stats } },
    mastery: { ...save.mastery },
  };
  const stats = next.profile.stats;
  if (correct) stats.correct += 1;
  else stats.wrong += 1;
  if (assisted) stats.assisted = (stats.assisted ?? 0) + 1;

  const gained = typeof xp === "number" ? xp : correct ? (assisted ? 6 : 20) : 3;
  next.profile.xp = Math.max(0, (save.profile.xp ?? 0) + gained);

  if (module) {
    const m = { ...emptyMastery(), ...(save.mastery[module] ?? {}) };
    if (!correct) m.wrong += 1;
    else if (assisted) m.assisted += 1;
    else m.auto += 1;
    next.mastery[module] = m;
  }

  const articles = normalizeArticles(article);
  if (articles.length) {
    next.profile.unlockedArticles = Array.from(new Set([...(save.profile.unlockedArticles ?? []), ...articles]));
  }

  if (!correct) {
    const errKey = concept || article || module || "Error no clasificado";
    next.errors = { ...save.errors, [errKey]: (save.errors?.[errKey] ?? 0) + 1 };
    next.recentErrors = [{ key: errKey, module, article, feedback, mode, at }, ...(save.recentErrors ?? [])].slice(0, 12);
  }
  return next;
}

/** Autoevaluación de una ficha: se guarda aparte y nunca se convierte en dominio. */
export function recordSelfRating(save, { key, cardId, module, rating, article }, at = Date.now()) {
  const awardKey = `self:${key}`;
  if (!key || hasAward(save, awardKey)) return save;
  const delays = { know: 18 * 3600e3, doubt: 12 * 60e3, forgot: 60e3 };
  const deltas = { know: 2, doubt: 0, forgot: -1 };
  const previous = save.memorySchedule?.[cardId] ?? { confidence: 0 };
  const m = { ...emptyMastery(), ...(save.mastery?.[module] ?? {}) };
  if (rating === "know") m.selfKnow += 1;
  else if (rating === "doubt") m.selfDoubt += 1;
  else m.selfForgot += 1;
  const next = {
    ...save,
    awards: stamp(save, awardKey, new Date(at).toISOString()),
    memorySchedule: {
      ...save.memorySchedule,
      [cardId]: {
        dueAt: at + (delays[rating] ?? delays.forgot),
        confidence: Math.max(-5, Math.min(10, (previous.confidence ?? 0) + (deltas[rating] ?? -1))),
        lastRating: rating,
        reviewedAt: new Date(at).toISOString(),
      },
    },
    mastery: module ? { ...save.mastery, [module]: m } : save.mastery,
    profile: {
      ...save.profile,
      xp: (save.profile.xp ?? 0) + (rating === "know" ? 4 : 2),
      stats: { ...save.profile.stats, flashcardsReviewed: (save.profile.stats.flashcardsReviewed ?? 0) + 1 },
    },
  };
  const articles = normalizeArticles(article);
  if (articles.length) next.profile.unlockedArticles = Array.from(new Set([...(save.profile.unlockedArticles ?? []), ...articles]));
  return next;
}

/** Aplica un cambio solo la primera vez que se reclama la clave. */
export function awardOnce(save, key, apply, at = new Date().toISOString()) {
  if (hasAward(save, key)) return save;
  const patched = apply({ ...save });
  return { ...patched, awards: stamp(patched, key, at) };
}

export function bumpStat(save, stat, key, amount = 1) {
  return awardOnce(save, `stat:${stat}:${key}`, (s) => ({
    ...s,
    profile: { ...s.profile, stats: { ...s.profile.stats, [stat]: (s.profile.stats[stat] ?? 0) + amount } },
  }));
}

/**
 * Cierre de un expediente. outcome: "autonomo" | "asistido" | "fallido".
 * Se conserva el mejor resultado y se registran intentos y decisiones.
 */
export function recordCaseOutcome(save, caseId, { runKey, outcome, hintsUsed = 0, decisions = [] }, at = new Date().toISOString()) {
  const key = `case:${caseId}:${runKey}`;
  if (hasAward(save, key)) return save;
  const prev = save.cases?.[caseId] ?? { attempts: 0, best: null, hintsUsed: 0 };
  const order = { autonomo: 3, asistido: 2, fallido: 1 };
  const best = !prev.best || order[outcome] > order[prev.best] ? outcome : prev.best;
  const solvedNow = outcome !== "fallido" && (!prev.best || prev.best === "fallido");
  let next = {
    ...save,
    awards: stamp(save, key, at),
    cases: {
      ...save.cases,
      [caseId]: { attempts: prev.attempts + 1, best, hintsUsed: prev.hintsUsed + hintsUsed, lastDecisions: decisions, lastAt: at, solvedAt: prev.solvedAt ?? (outcome !== "fallido" ? at : null) },
    },
  };
  if (solvedNow) {
    next = { ...next, profile: { ...next.profile, stats: { ...next.profile.stats, detectiveSolved: (next.profile.stats.detectiveSolved ?? 0) + 1 } } };
  }
  return next;
}

export function pushResult(save, result) {
  const key = `result:${result.id}`;
  if (hasAward(save, key)) return save;
  return {
    ...save,
    awards: stamp(save, key, result.at),
    lastResult: result,
    history: [result, ...(save.history ?? [])].slice(0, 50),
  };
}

/** Resumen legible del dominio de un módulo, separando ayuda y autoevaluación. */
export function masterySummary(entry) {
  const m = { ...emptyMastery(), ...(entry ?? {}) };
  const evaluated = m.auto + m.assisted + m.wrong;
  const autonomy = evaluated ? Math.round((m.auto / evaluated) * 100) : 0;
  return { ...m, evaluated, autonomy };
}

/** Precisión con el denominador correcto: lo realmente respondido. */
export function accuracy(correct, answered) {
  return answered > 0 ? Math.round((correct / answered) * 100) : 0;
}

export function solvedCaseIds(save) {
  return Object.entries(save.cases ?? {})
    .filter(([, c]) => c.best && c.best !== "fallido")
    .map(([id]) => id);
}
