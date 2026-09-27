import { modules as baseModules, flashcards as baseCards } from "../../data/successionData.js";
import { additionalModules, advancedFlashcards } from "../../data/advancedContent.js";
import { legalArticles, legalSources } from "../../data/legal/corpus.js";

export const modules = [...baseModules, ...additionalModules];
export const concepts = [...baseCards, ...advancedFlashcards];
export const articles = legalArticles;
export const sources = Object.fromEntries(legalSources.map((s) => [s.id, s]));

export const fold = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const articleIndex = articles.map((a) => ({ a, hay: fold(a.text) }));
const moduleIndex = modules.map((m) => ({ m, hay: fold([m.title, m.summary, m.mnemonic, m.commonError, ...(m.concepts ?? []), ...(m.articles ?? [])].join(" ")) }));
const conceptIndex = concepts.map((c) => ({ c, hay: fold([c.concept, c.definition, c.example, c.commonError, c.article].join(" ")) }));

export function articleTitle(a) {
  return a.law === "cc" ? `Art. ${a.num} del Código Civil` : `Art. ${a.num} · ${sources[a.law]?.short ?? a.law}`;
}

export function findArticle(ref) {
  const clean = String(ref ?? "").replace(/^arts?\.\s*/i, "").trim();
  const num = clean.match(/\d{2,4}(?:\s*(?:bis|ter))?/)?.[0];
  if (!num) return null;
  return articles.find((a) => a.law === "cc" && a.num === num.replace(/\s+/, " ")) ?? null;
}

/** Busca en módulos, conceptos y artículos. Un número busca primero el artículo exacto. */
export function search(query, filter = "todo") {
  const q = fold(query).trim();
  const results = [];
  const wants = (kind) => filter === "todo" || filter === kind;
  if (!q) {
    if (wants("modulos")) modules.forEach((m) => results.push({ kind: "modulo", id: m.id, title: m.title, snippet: m.summary }));
    if (filter === "articulos") articles.slice(0, 60).forEach((a) => results.push({ kind: "articulo", id: a.id, title: articleTitle(a), snippet: a.text.slice(0, 110) }));
    if (filter === "conceptos") concepts.forEach((c) => results.push({ kind: "concepto", id: c.id, title: c.concept, snippet: c.definition }));
    return results;
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const matches = (hay) => terms.every((t) => hay.includes(t));
  const numeric = /^\d{2,4}$/.test(q);
  if (wants("articulos")) {
    if (numeric) {
      const exact = articles.filter((a) => a.num === q);
      exact.forEach((a) => results.push({ kind: "articulo", id: a.id, title: articleTitle(a), snippet: a.text.slice(0, 110), exact: true }));
    }
  }
  if (wants("modulos")) moduleIndex.filter((x) => matches(x.hay)).forEach(({ m }) => results.push({ kind: "modulo", id: m.id, title: m.title, snippet: m.summary }));
  if (wants("conceptos")) conceptIndex.filter((x) => matches(x.hay)).forEach(({ c }) => results.push({ kind: "concepto", id: c.id, title: c.concept, snippet: c.definition }));
  if (wants("articulos") && !numeric) {
    articleIndex
      .filter((x) => matches(x.hay))
      .slice(0, 80)
      .forEach(({ a }) => results.push({ kind: "articulo", id: a.id, title: articleTitle(a), snippet: snippetAround(a.text, terms[0]) }));
  }
  return results;
}

function snippetAround(text, term) {
  const hay = fold(text);
  const at = Math.max(0, hay.indexOf(term) - 40);
  const piece = text.slice(at, at + 120);
  return `${at > 0 ? "…" : ""}${piece}${at + 120 < text.length ? "…" : ""}`;
}
