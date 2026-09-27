// Guardado local de LEX MORTIS.
//
// v1 («lex-mortis-progress-v1») queda intacta como respaldo recuperable: la
// migración lee de ella y escribe en v2 sin borrarla. Si v2 está corrupta se
// aparta a una clave de cuarentena y se avisa; nunca se elimina en silencio.

export const SAVE_KEY = "lex-mortis-save-v2";
export const LEGACY_KEY = "lex-mortis-progress-v1";
export const SCHEMA_VERSION = 2;

export const defaultSettings = {
  sound: true,
  volume: 0.6,
  ambience: true,
  effects: "auto", // auto | full | reduced
  textScale: 1, // 1 | 1.15 | 1.3
  timer: "normal", // normal | relaxed | off
  evaSpeed: "normal", // normal | fast | instant
  evaChatter: "normal", // normal | quiet
  arcadeDifficulty: "litigante",
};

export function createDefaultSave(now = new Date().toISOString()) {
  return {
    version: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    migratedFrom: null,
    settings: { ...defaultSettings },
    profile: {
      xp: 0,
      unlockedArticles: ["951", "955", "956"],
      firstVisitAt: null,
      visits: 0,
      stats: {
        arcadeRuns: 0,
        detectiveSolved: 0,
        bossKills: 0,
        flashcardsReviewed: 0,
        mnemonicsSolved: 0,
        acervoLabs: 0,
        oralAnswered: 0,
        correct: 0,
        wrong: 0,
        assisted: 0,
      },
    },
    // Dominio: respuestas autónomas, asistidas, errores y autoevaluaciones por separado.
    mastery: {},
    errors: {},
    recentErrors: [],
    // Registro idempotente: una recompensa o respuesta se anota una sola vez.
    awards: {},
    cases: {},
    campaign: { chapter: 1, unlocked: [1], bossesDefeated: [], cleared: [] },
    memorySchedule: {},
    eva: { recent: [], seen: {}, log: [], lastEvent: null },
    run: null,
    history: [],
    lastResult: null,
  };
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function num(value, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** Migra un progreso v1 válido al esquema v2 sin perder datos útiles. */
export function migrateV1(v1, now = new Date().toISOString()) {
  const save = createDefaultSave(now);
  if (!isObject(v1)) return save;
  save.migratedFrom = LEGACY_KEY;
  save.profile.xp = Math.max(0, num(v1.xp));
  if (Array.isArray(v1.unlockedArticles)) {
    save.profile.unlockedArticles = Array.from(new Set([...save.profile.unlockedArticles, ...v1.unlockedArticles.map(String)]));
  }
  if (isObject(v1.stats)) {
    for (const [key, value] of Object.entries(v1.stats)) save.profile.stats[key] = Math.max(0, num(value));
  }
  if (isObject(v1.moduleMastery)) {
    for (const [module, value] of Object.entries(v1.moduleMastery)) {
      // v1 mezclaba aciertos, errores y ayudas en un solo número: se conserva
      // como referencia histórica, sin contarlo como dominio autónomo.
      save.mastery[module] = { ...emptyMastery(), legacyScore: Math.max(0, Math.min(100, num(value))) };
    }
  }
  if (isObject(v1.errors)) {
    for (const [key, value] of Object.entries(v1.errors)) save.errors[key] = Math.max(0, num(value));
  }
  if (Array.isArray(v1.recentErrors)) save.recentErrors = v1.recentErrors.filter(isObject).slice(0, 12);
  if (isObject(v1.memorySchedule)) {
    for (const [cardId, entry] of Object.entries(v1.memorySchedule)) {
      if (isObject(entry)) save.memorySchedule[cardId] = { ...entry, dueAt: num(entry.dueAt), confidence: num(entry.confidence) };
    }
  }
  if (Array.isArray(v1.history)) {
    save.history = v1.history
      .filter((item) => isObject(item) && (item.score !== undefined || item.accuracy !== undefined))
      .slice(0, 50)
      .map((item) => ({ mode: item.mode, score: num(item.score), accuracy: num(item.accuracy), at: item.at, legacy: true }));
  }
  if (isObject(v1.lastResult)) save.lastResult = { ...v1.lastResult, legacy: true };
  return save;
}

export function emptyMastery() {
  return { auto: 0, assisted: 0, wrong: 0, selfKnow: 0, selfDoubt: 0, selfForgot: 0, legacyScore: 0 };
}

/** Completa un guardado v2 con los campos que falten (versiones futuras o parciales). */
export function normalizeSave(value) {
  const base = createDefaultSave(value?.createdAt);
  if (!isObject(value)) return base;
  return {
    ...base,
    ...value,
    version: SCHEMA_VERSION,
    settings: { ...base.settings, ...(isObject(value.settings) ? value.settings : {}) },
    profile: {
      ...base.profile,
      ...(isObject(value.profile) ? value.profile : {}),
      stats: { ...base.profile.stats, ...(isObject(value.profile?.stats) ? value.profile.stats : {}) },
      unlockedArticles: Array.isArray(value.profile?.unlockedArticles) ? value.profile.unlockedArticles : base.profile.unlockedArticles,
    },
    mastery: isObject(value.mastery) ? value.mastery : {},
    errors: isObject(value.errors) ? value.errors : {},
    recentErrors: Array.isArray(value.recentErrors) ? value.recentErrors : [],
    awards: isObject(value.awards) ? value.awards : {},
    cases: isObject(value.cases) ? value.cases : {},
    campaign: { ...base.campaign, ...(isObject(value.campaign) ? value.campaign : {}) },
    memorySchedule: isObject(value.memorySchedule) ? value.memorySchedule : {},
    eva: { ...base.eva, ...(isObject(value.eva) ? value.eva : {}) },
    run: isObject(value.run) ? value.run : null,
    history: Array.isArray(value.history) ? value.history : [],
  };
}

function safeStorage(storage) {
  try {
    const s = storage ?? globalThis.localStorage;
    if (!s) return null;
    const probe = "__lm_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/**
 * Carga el guardado. Nunca lanza: devuelve { save, notice } donde notice
 * explica al jugador cualquier situación anómala.
 */
export function loadSave(storage) {
  const s = safeStorage(storage);
  if (!s) {
    return { save: createDefaultSave(), notice: "sin-almacenamiento", storageOk: false };
  }
  let raw = null;
  try {
    raw = s.getItem(SAVE_KEY);
  } catch {
    return { save: createDefaultSave(), notice: "sin-almacenamiento", storageOk: false };
  }
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!isObject(parsed)) throw new Error("formato");
      return { save: normalizeSave(parsed), notice: null, storageOk: true };
    } catch {
      const quarantine = `${SAVE_KEY}-corrupto-${Date.now()}`;
      try {
        s.setItem(quarantine, raw);
      } catch {
        /* si no cabe, al menos no se sobrescribe hasta el próximo guardado */
      }
      return { save: createDefaultSave(), notice: "corrupto", quarantineKey: quarantine, storageOk: true };
    }
  }
  let legacyRaw = null;
  try {
    legacyRaw = s.getItem(LEGACY_KEY);
  } catch {
    legacyRaw = null;
  }
  if (legacyRaw) {
    try {
      const migrated = migrateV1(JSON.parse(legacyRaw));
      return { save: migrated, notice: "migrado", storageOk: true };
    } catch {
      return { save: createDefaultSave(), notice: "legado-ilegible", storageOk: true };
    }
  }
  return { save: createDefaultSave(), notice: null, storageOk: true };
}

/** Escribe el guardado. Devuelve false si el navegador lo impide (cuota, modo privado). */
export function writeSave(save, storage) {
  const s = safeStorage(storage);
  if (!s) return false;
  try {
    const next = { ...save, updatedAt: new Date().toISOString() };
    s.setItem(SAVE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

/** Reinicio intencional: aparta una copia recuperable antes de limpiar. */
export function resetSave(storage) {
  const s = safeStorage(storage);
  const fresh = createDefaultSave();
  if (!s) return fresh;
  try {
    const current = s.getItem(SAVE_KEY);
    if (current) s.setItem(`${SAVE_KEY}-respaldo-${Date.now()}`, current);
    s.setItem(SAVE_KEY, JSON.stringify(fresh));
  } catch {
    /* sin espacio: el juego sigue en memoria */
  }
  return fresh;
}
