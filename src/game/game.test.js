import { describe, expect, it } from "vitest";
import { LEGACY_KEY, SAVE_KEY, createDefaultSave, loadSave, migrateV1, resetSave, writeSave } from "./persistence.js";
import { accuracy, masterySummary, recordAnswer, recordCaseOutcome, recordSelfRating, solvedCaseIds } from "./progress.js";
import { checkAmount, parseAmount, splitSentences, stripVerdict } from "./format.js";
import { hashSeed, seededShuffle } from "./rng.js";
import { finishRun } from "./session.js";
import { dueCards } from "./memory.js";
import { ARCADE, CARDS, CASES } from "./content.js";
import { pickLine, pushRecent } from "../eva/director.js";

/** Almacenamiento en memoria, con cuota opcional. */
function memoryStorage(initial = {}, { failWrites = false } = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => {
      if (failWrites && k !== "__lm_probe__") throw new Error("QuotaExceededError");
      data.set(k, String(v));
    },
    removeItem: (k) => data.delete(k),
    keys: () => [...data.keys()],
    data,
  };
}

describe("guardado", () => {
  it("migra un progreso v1 sin borrarlo y sin contarlo como dominio autónomo", () => {
    const v1 = { xp: 340, unlockedArticles: ["984", 988], stats: { arcadeRuns: 2 }, moduleMastery: { intestada: 70 }, errors: { Representacion: 2 }, memorySchedule: { f1: { dueAt: 5, confidence: 2 } }, history: [{ mode: "Arcade", score: 900, accuracy: 60 }] };
    const storage = memoryStorage({ [LEGACY_KEY]: JSON.stringify(v1) });
    const { save, notice } = loadSave(storage);
    expect(notice).toBe("migrado");
    expect(save.profile.xp).toBe(340);
    expect(save.profile.unlockedArticles).toEqual(expect.arrayContaining(["984", "988"]));
    expect(save.mastery.intestada.legacyScore).toBe(70);
    expect(save.mastery.intestada.auto).toBe(0);
    expect(save.history[0].legacy).toBe(true);
    expect(storage.getItem(LEGACY_KEY)).toBe(JSON.stringify(v1)); // respaldo intacto
  });

  it("aparta un guardado dañado en cuarentena y empieza limpio", () => {
    const storage = memoryStorage({ [SAVE_KEY]: "{roto" });
    const { save, notice, quarantineKey } = loadSave(storage);
    expect(notice).toBe("corrupto");
    expect(save.profile.xp).toBe(0);
    expect(storage.getItem(quarantineKey)).toBe("{roto");
  });

  it("sin almacenamiento o sin cuota no rompe el juego", () => {
    expect(loadSave(null).save.version).toBe(2);
    const full = memoryStorage({}, { failWrites: true });
    expect(writeSave(createDefaultSave(), full)).toBe(false);
  });

  it("el reinicio intencional deja una copia de respaldo", () => {
    const storage = memoryStorage();
    writeSave({ ...createDefaultSave(), profile: { ...createDefaultSave().profile, xp: 99 } }, storage);
    resetSave(storage);
    expect(storage.keys().some((k) => k.startsWith(`${SAVE_KEY}-respaldo-`))).toBe(true);
  });

  it("migra también un v1 vacío o raro sin lanzar", () => {
    expect(migrateV1(null).profile.xp).toBe(0);
    expect(migrateV1({ xp: "mucho", stats: { correct: -3 } }).profile.stats.correct).toBe(0);
  });
});

describe("progreso idempotente", () => {
  const ev = { key: "arcade:1:a1", correct: true, module: "bases", article: "art. 951", concept: "Sucesión" };

  it("una misma respuesta repetida (doble clic, reanudar) se anota una sola vez", () => {
    const once = recordAnswer(createDefaultSave(), ev);
    const twice = recordAnswer(once, ev);
    expect(twice).toBe(once);
    expect(twice.profile.stats.correct).toBe(1);
  });

  it("una respuesta asistida no cuenta como dominio autónomo", () => {
    const s = recordAnswer(createDefaultSave(), { ...ev, assisted: true });
    const m = masterySummary(s.mastery.bases);
    expect(m.auto).toBe(0);
    expect(m.assisted).toBe(1);
    expect(m.autonomy).toBe(0);
  });

  it("la autoevaluación se guarda aparte y nunca suma dominio", () => {
    const s = recordSelfRating(createDefaultSave(), { key: "mem:1:f1", cardId: "f1", module: "bases", rating: "know" }, 1000);
    expect(s.mastery.bases.selfKnow).toBe(1);
    expect(masterySummary(s.mastery.bases).evaluated).toBe(0);
    expect(s.memorySchedule.f1.dueAt).toBeGreaterThan(1000);
  });

  it("un expediente conserva su mejor resultado y cuenta una vez como resuelto", () => {
    let s = recordCaseOutcome(createDefaultSave(), "premuerto", { runKey: 1, outcome: "fallido" });
    expect(solvedCaseIds(s)).toEqual([]);
    s = recordCaseOutcome(s, "premuerto", { runKey: 2, outcome: "asistido" });
    s = recordCaseOutcome(s, "premuerto", { runKey: 2, outcome: "asistido" });
    s = recordCaseOutcome(s, "premuerto", { runKey: 3, outcome: "autonomo" });
    expect(s.cases.premuerto.best).toBe("autonomo");
    expect(s.cases.premuerto.attempts).toBe(3);
    expect(s.profile.stats.detectiveSolved).toBe(1);
  });

  it("la precisión usa lo realmente respondido", () => {
    expect(accuracy(3, 4)).toBe(75);
    expect(accuracy(0, 0)).toBe(0);
    const s = finishRun(createDefaultSave(), { id: "arcade:9", mode: "arcade", title: "x", correct: 3, answered: 4 });
    expect(s.lastResult.accuracy).toBe(75);
    expect(finishRun(s, { id: "arcade:9", mode: "arcade", title: "x", correct: 3, answered: 4 }).history).toHaveLength(1);
  });
});

describe("cantidades", () => {
  it("distingue vacío de cero válido", () => {
    expect(parseAmount("").status).toBe("empty");
    expect(parseAmount("   ").status).toBe("empty");
    expect(parseAmount("0")).toEqual({ status: "ok", value: 0 });
    expect(checkAmount("0", 0).ok).toBe(true);
  });
  it("acepta coma o punto decimal y miles con punto", () => {
    expect(parseAmount("18,75").value).toBe(18.75);
    expect(parseAmount("18.75").value).toBe(18.75);
    expect(parseAmount("1.200").value).toBe(1200);
    expect(parseAmount("1.234,5").value).toBe(1234.5);
  });
  it("rechaza lo que no es número", () => {
    expect(parseAmount("12a").status).toBe("invalid");
    expect(parseAmount("1,2,3").status).toBe("invalid");
  });
  it("aplica la tolerancia en la unidad del ejercicio", () => {
    expect(checkAmount("18,75", 18.75).ok).toBe(true);
    expect(checkAmount("18,76", 18.75).ok).toBe(false);
    expect(checkAmount("18,755", 18.75, 0.01).ok).toBe(true);
  });
});

describe("orden estable", () => {
  it("la misma semilla da el mismo orden; otra, otro", () => {
    const ids = ARCADE.map((q) => q.id);
    expect(seededShuffle(ids, 42)).toEqual(seededShuffle(ids, 42));
    expect(seededShuffle(ids, 42)).not.toEqual(seededShuffle(ids, 43));
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
  });
  it("las fichas para hoy no dependen de evaluar una ficha a mitad de mazo", () => {
    const before = dueCards({}, 0).slice(0, 10).map((c) => c.id);
    const deck = [...before]; // el mazo se fija al empezar la partida
    const after = dueCards({ [deck[0]]: { dueAt: 10 ** 12, confidence: 3 } }, 0).slice(0, 10).map((c) => c.id);
    expect(deck).toEqual(before);
    expect(after).not.toContain(deck[0]);
    expect(dueCards(Object.fromEntries(CARDS.map((c) => [c.id, { dueAt: 10 ** 12 }])), 0)).toEqual([]);
  });
});

describe("textos", () => {
  it("parte en oraciones sin perder caracteres ni cortar fechas o artículos", () => {
    const t = "Aurelio muere el 12.08.2088. Ver art. 984 del Código. Fin.";
    const parts = splitSentences(t);
    expect(parts.join(" ")).toBe(t);
    expect(parts).toHaveLength(3);
  });
  it("quita el veredicto con que empiezan los textos del banco", () => {
    expect(stripVerdict("Incorrecto. La rama sigue.")).toBe("La rama sigue.");
    expect(stripVerdict("Correcto: bien")).toBe("bien");
  });
});

describe("EVA", () => {
  it("no repite una línea reciente mientras haya otras", () => {
    const a = pickLine("clueFound", {}, { recent: [] });
    const b = pickLine("clueFound", {}, { recent: pushRecent([], a.id) });
    expect(b.id).not.toBe(a.id);
  });
  it("los comentarios de ambiente respetan la pausa y el modo «solo lo útil»", () => {
    expect(pickLine("hub", {}, { now: 1000, lastAmbientAt: 900 })).toBeNull();
    expect(pickLine("hub", {}, { chatter: "quiet", now: 10 ** 9 })).toBeNull();
    expect(pickLine("hint1", {}, { chatter: "quiet" })).not.toBeNull();
  });
});

describe("contenido", () => {
  it("cada pregunta tiene su respuesta entre las opciones y cada expediente una sola correcta", () => {
    for (const q of ARCADE) expect(q.options).toContain(q.answer);
    for (const c of CASES) expect(c.choices.filter((x) => x.correct)).toHaveLength(1);
  });
});
