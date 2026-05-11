import { calculateLevel, clamp, nextReviewDelay } from "./gameLogic";

const KEY = "lex-mortis-progress-v1";

export const defaultProgress = {
  xp: 0,
  level: 1,
  unlockedArticles: ["951", "955", "956"],
  moduleMastery: {},
  errors: {},
  recentErrors: [],
  history: [],
  memorySchedule: {},
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
  },
  lastResult: null,
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultProgress);
    const parsed = JSON.parse(raw);
    return mergeProgress(defaultProgress, parsed);
  } catch {
    return structuredClone(defaultProgress);
  }
}

export function saveProgress(progress) {
  const clean = mergeProgress(defaultProgress, progress);
  clean.level = calculateLevel(clean.xp);
  localStorage.setItem(KEY, JSON.stringify(clean));
  return clean;
}

export function patchProgress(updater) {
  const current = loadProgress();
  const next = typeof updater === "function" ? updater(structuredClone(current)) : { ...current, ...updater };
  return saveProgress(next);
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  return structuredClone(defaultProgress);
}

export function recordLearningEvent(event) {
  return patchProgress((progress) => {
    const {
      correct,
      module,
      article,
      concept,
      mode = "general",
      xp = correct ? 20 : 5,
      feedback = "",
    } = event;

    progress.xp += xp;
    progress.stats.correct += correct ? 1 : 0;
    progress.stats.wrong += correct ? 0 : 1;

    if (module) {
      const current = progress.moduleMastery[module] ?? 0;
      progress.moduleMastery[module] = clamp(current + (correct ? 5 : -3), 0, 100);
    }

    if (article) {
      const normalized = String(article).replace(/art\.|arts\.|ss\.|aprox\.|,/gi, "").trim();
      normalized
        .split(/\s+/)
        .filter((token) => /^\d+$/.test(token))
        .forEach((token) => {
          if (!progress.unlockedArticles.includes(token)) progress.unlockedArticles.push(token);
        });
    }

    if (!correct) {
      const key = concept || article || module || "Error juridico no clasificado";
      progress.errors[key] = (progress.errors[key] ?? 0) + 1;
      progress.recentErrors = [
        {
          key,
          module,
          article,
          feedback,
          mode,
          at: new Date().toISOString(),
        },
        ...progress.recentErrors,
      ].slice(0, 10);
    }

    progress.history = [
      {
        mode,
        correct,
        module,
        article,
        concept,
        xp,
        at: new Date().toISOString(),
      },
      ...progress.history,
    ].slice(0, 80);

    return progress;
  });
}

export function saveResult(result) {
  return patchProgress((progress) => {
    progress.lastResult = result;
    progress.history = [
      {
        mode: result.mode,
        score: result.score,
        accuracy: result.accuracy,
        at: result.at,
      },
      ...progress.history,
    ].slice(0, 80);
    return progress;
  });
}

export function incrementStat(stat, amount = 1) {
  return patchProgress((progress) => {
    progress.stats[stat] = (progress.stats[stat] ?? 0) + amount;
    return progress;
  });
}

export function scheduleMemoryCard(cardId, rating) {
  return patchProgress((progress) => {
    const previous = progress.memorySchedule[cardId] ?? { confidence: 0 };
    const delta = rating === "know" ? 2 : rating === "doubt" ? 0 : -1;
    progress.memorySchedule[cardId] = {
      dueAt: Date.now() + nextReviewDelay(rating),
      confidence: clamp((previous.confidence ?? 0) + delta, -5, 10),
      lastRating: rating,
      reviewedAt: new Date().toISOString(),
    };
    progress.stats.flashcardsReviewed += 1;
    return progress;
  });
}

function mergeProgress(base, value) {
  return {
    ...structuredClone(base),
    ...value,
    stats: { ...base.stats, ...(value?.stats ?? {}) },
    moduleMastery: { ...base.moduleMastery, ...(value?.moduleMastery ?? {}) },
    errors: { ...base.errors, ...(value?.errors ?? {}) },
    memorySchedule: { ...base.memorySchedule, ...(value?.memorySchedule ?? {}) },
    unlockedArticles: Array.from(new Set(value?.unlockedArticles ?? base.unlockedArticles)),
    recentErrors: value?.recentErrors ?? base.recentErrors,
    history: value?.history ?? base.history,
  };
}
