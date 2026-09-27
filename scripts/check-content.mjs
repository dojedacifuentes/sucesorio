// Comprueba que el corpus jurídico conserva su cobertura e invariantes.
// Uso: node scripts/check-content.mjs            (verifica)
//      node scripts/check-content.mjs --snapshot (regenera la línea base)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (rel) => import(pathToFileURL(path.join(root, rel)).href);

const s = await load("src/data/successionData.js");
const a = await load("src/data/advancedContent.js");
const c = await load("src/data/cases.js");
const b = await load("src/data/bosses.js");

const banks = {
  modules: [...s.modules, ...a.additionalModules],
  arcade: [...s.arcadeQuestions, ...a.advancedArcadeQuestions],
  flashcards: [...s.flashcards, ...a.advancedFlashcards],
  mnemonics: [...s.mnemonicChallenges, ...a.advancedMnemonicChallenges],
  oral: [...s.oralQuestions, ...a.advancedOralQuestions],
  cases: [...c.detectiveCases, ...a.advancedDetectiveCases],
  bosses: [...b.bosses, ...a.advancedBosses],
  bossQuestions: [...b.bosses, ...a.advancedBosses].flatMap((boss) => boss.questions.map((q) => ({ ...q, bossId: boss.id }))),
  calc: a.calculationScenarios,
};

const snapshotFile = path.join(root, "scripts", "content-baseline.json");
const ids = Object.fromEntries(Object.entries(banks).map(([k, v]) => [k, v.map((x) => x.id)]));

if (process.argv.includes("--snapshot")) {
  fs.writeFileSync(snapshotFile, `${JSON.stringify(ids, null, 1)}\n`);
  console.log("Línea base escrita:", Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, v.length])));
  process.exit(0);
}

const errors = [];
const fail = (msg) => errors.push(msg);
const baseline = JSON.parse(fs.readFileSync(snapshotFile, "utf8"));

for (const [bank, list] of Object.entries(baseline)) {
  const current = new Set(ids[bank] ?? []);
  for (const id of list) if (!current.has(id)) fail(`${bank}: falta el id "${id}" de la línea base`);
  const dupes = (ids[bank] ?? []).filter((id, i, arr) => arr.indexOf(id) !== i);
  if (dupes.length && bank !== "bossQuestions") fail(`${bank}: ids duplicados ${dupes.join(", ")}`);
}

const moduleIds = new Set(banks.modules.map((m) => m.id));
const needText = (bank, item, field) => {
  if (typeof item[field] !== "string" || !item[field].trim()) fail(`${bank}/${item.id}: campo "${field}" vacío`);
};

for (const q of banks.arcade) {
  if (!q.options.includes(q.answer)) fail(`arcade/${q.id}: la respuesta no está entre las opciones`);
  if (new Set(q.options).size !== q.options.length) fail(`arcade/${q.id}: opciones repetidas`);
  if (!moduleIds.has(q.module)) fail(`arcade/${q.id}: módulo inexistente ${q.module}`);
  ["prompt", "feedback", "concept"].forEach((f) => needText("arcade", q, f));
}
for (const q of banks.bossQuestions) {
  if (!q.options.includes(q.answer)) fail(`boss/${q.bossId}/${q.id}: la respuesta no está entre las opciones`);
  if (new Set(q.options).size !== q.options.length) fail(`boss/${q.bossId}/${q.id}: opciones repetidas`);
}
for (const boss of banks.bosses) if (!moduleIds.has(boss.module)) fail(`boss/${boss.id}: módulo inexistente ${boss.module}`);
for (const card of banks.flashcards) {
  ["concept", "definition", "example", "commonError"].forEach((f) => needText("flashcards", card, f));
  if (!moduleIds.has(card.module)) fail(`flashcards/${card.id}: módulo inexistente ${card.module}`);
}
for (const m of banks.mnemonics) ["prompt", "answer", "hint", "expansion", "feedback"].forEach((f) => needText("mnemonics", m, f));
for (const o of banks.oral) {
  const blockIds = new Set(o.blocks.map((bl) => bl.id));
  if (o.answer.some((id) => !blockIds.has(id))) fail(`oral/${o.id}: la respuesta cita bloques inexistentes`);
  if (o.blocks.length !== o.answer.length) fail(`oral/${o.id}: bloques y respuesta no coinciden`);
}
for (const cs of banks.cases) {
  const correct = cs.choices.filter((ch) => ch.correct);
  if (correct.length !== 1) fail(`cases/${cs.id}: debe haber exactamente una opción correcta (hay ${correct.length})`);
  if (!moduleIds.has(cs.module)) fail(`cases/${cs.id}: módulo inexistente ${cs.module}`);
  if (!cs.documents?.length) fail(`cases/${cs.id}: sin documentos`);
  if (!cs.tree?.length) fail(`cases/${cs.id}: sin árbol`);
  ["title", "dossier", "resolution"].forEach((f) => needText("cases", cs, f));
}
for (const calc of banks.calc) {
  for (const [key, value] of Object.entries(calc.answers)) {
    if (typeof value !== "number" || !Number.isFinite(value)) fail(`calc/${calc.id}: respuesta ${key} no numérica`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s) de contenido:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("✓ Contenido íntegro:", Object.fromEntries(Object.entries(ids).map(([k, v]) => [k, v.length])));
