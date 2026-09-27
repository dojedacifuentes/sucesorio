// Todos los bancos de contenido reunidos, con el mismo orden y los mismos ids
// de siempre (scripts/check-content.mjs vigila que no se pierda ninguno).
import { arcadeQuestions, flashcards as baseCards, mnemonicChallenges, modules as baseModules, oralQuestions } from "../data/successionData.js";
import {
  additionalModules,
  advancedArcadeQuestions,
  advancedBosses,
  advancedDetectiveCases,
  advancedFlashcards,
  advancedMnemonicChallenges,
  advancedOralQuestions,
  calculationScenarios,
} from "../data/advancedContent.js";
import { detectiveCases } from "../data/cases.js";
import { bosses as baseBosses } from "../data/bosses.js";

export const MODULES = [...baseModules, ...additionalModules];
const moduleById = new Map(MODULES.map((m) => [m.id, m]));
export const moduleTitle = (id) => moduleById.get(id)?.title ?? id;

/** Preguntas rápidas. `tier`: 1 las del banco base, 2 las avanzadas. */
export const ARCADE = [...arcadeQuestions.map((q) => ({ ...q, tier: 1 })), ...advancedArcadeQuestions.map((q) => ({ ...q, tier: 2 }))];

export const CASES = [...detectiveCases, ...advancedDetectiveCases];
export const caseById = (id) => CASES.find((c) => c.id === id) ?? null;

export const BOSSES = [...baseBosses, ...advancedBosses];
export const bossById = (id) => BOSSES.find((b) => b.id === id) ?? null;

export const CARDS = [...baseCards, ...advancedFlashcards];
export const MNEMONICS = [...mnemonicChallenges, ...advancedMnemonicChallenges];
export const ORAL = [...oralQuestions, ...advancedOralQuestions];
export const CALCS = calculationScenarios;
