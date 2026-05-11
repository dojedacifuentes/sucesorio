export const ranks = [
  { level: 1, minXp: 0, title: "Merodeador de apuntes" },
  { level: 2, minXp: 180, title: "Tecnico en subrayado fluorescente" },
  { level: 3, minXp: 420, title: "Pasante de notaria distopica" },
  { level: 4, minXp: 760, title: "Litigante de cementerio" },
  { level: 5, minXp: 1200, title: "Albacea del neon" },
  { level: 6, minXp: 1750, title: "Heredero universal del caos" },
  { level: 7, minXp: 2500, title: "Ministro de Corte del inframundo civil" },
];

export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pick(items, count = 1) {
  return shuffle(items).slice(0, count);
}

export function calculateLevel(xp = 0) {
  return ranks.reduce((current, rank) => (xp >= rank.minXp ? rank.level : current), 1);
}

export function getRank(xp = 0) {
  return ranks.reduce((current, rank) => (xp >= rank.minXp ? rank : current), ranks[0]);
}

export function nextRank(xp = 0) {
  return ranks.find((rank) => rank.minXp > xp) ?? ranks[ranks.length - 1];
}

export function xpToNextRank(xp = 0) {
  const next = nextRank(xp);
  if (next.minXp <= xp) return 0;
  return next.minXp - xp;
}

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function formatTimer(seconds) {
  return `${Math.max(0, seconds).toString().padStart(2, "0")}s`;
}

export function normalizeAnswer(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();
}

export function isAnswerCorrect(input, expected) {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}

export function masteryColor(value = 0) {
  if (value >= 80) return "text-acid";
  if (value >= 55) return "text-neonCyan";
  if (value >= 30) return "text-oldGold";
  return "text-blood";
}

export function getDueFlashcards(cards, schedule) {
  const now = Date.now();
  return cards
    .map((card) => ({
      ...card,
      dueAt: schedule?.[card.id]?.dueAt ?? 0,
      confidence: schedule?.[card.id]?.confidence ?? 0,
    }))
    .filter((card) => card.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || a.confidence - b.confidence);
}

export function nextReviewDelay(rating) {
  if (rating === "know") return 1000 * 60 * 60 * 18;
  if (rating === "doubt") return 1000 * 60 * 12;
  return 1000 * 12;
}

export function buildResult({ mode, title, score = 0, correct = 0, total = 0, message = "" }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  return {
    mode,
    title,
    score,
    correct,
    total,
    accuracy,
    message,
    at: new Date().toISOString(),
  };
}
