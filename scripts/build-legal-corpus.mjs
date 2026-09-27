// Genera src/data/legal/corpus.js a partir del texto oficial publicado por la
// Biblioteca del Congreso Nacional (LeyChile). Se ejecuta a mano cuando se
// quiera actualizar la versión consultada:
//
//   node scripts/build-legal-corpus.mjs            (descarga desde BCN)
//   node scripts/build-legal-corpus.mjs --from dir (usa XML ya descargados)
//
// Las notas marginales de modificación («L. 19.585 Art. 1º, Nº 75») vienen
// intercaladas en el texto de LeyChile; se retiran para la lectura en el
// Codex. Cada artículo conserva su fecha de versión y el enlace a la fuente.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONSULTED_AT = process.env.LEGAL_CONSULTED_AT ?? new Date().toISOString().slice(0, 10);

const SOURCES = [
  {
    id: "cc",
    idNorma: 172986,
    title: "Código Civil (DFL 1, 2000, texto refundido)",
    short: "CC",
    range: [951, 1436],
  },
  {
    id: "auc",
    idNorma: 1075210,
    title: "Ley 20.830, crea el Acuerdo de Unión Civil",
    short: "Ley 20.830",
    range: [16, 19],
  },
];

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const ORDINALS = "Primero|Segundo|Tercero|Cuarto|Quinto|Sexto|Séptimo|Octavo|Noveno|Décimo";

export function cleanArticle(raw) {
  const flat = raw
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, " @@PARRAFO@@ ")
    .replace(/\n/g, " ")
    .replace(/[ \t]{2,}/g, " ");
  const head = flat.match(/^\s*Art(?:ículo|\.)\s*\d+(?:\s*(?:bis|ter))?\s*[.\-–]+\s*/i)?.[0] ?? "";
  let body = flat.slice(head.length);
  body = body
    // Número de ley modificatoria: «L. 19.585», «Ley 19585».
    .replace(/\s*\bL\.\s?\d{1,2}\.\d{3}\b/g, "")
    .replace(/\s*\bLey\s?\d{5}\b/g, "")
    .replace(/\s*\bD\.O\.\s?\d{2}\.\d{2}\.\d{4}\b/g, "")
    // Artículo de la ley modificatoria: «Art. 1º, Nº 75», «Art. único», «Art. séptimo».
    .replace(new RegExp(`\\s*\\bArt\\.\\s?(?:${ORDINALS})\\b,?`, "gi"), "")
    .replace(
      /\s*\bArt\.\s?(?:\d+[º°]?|[ÚU]NICO|único)(?:\s?,?\s?N[º°]s?\s?\d+(?:\s?[a-z]\))?)?(?:\s?,?\s?letras?\s?[a-z]\))?(?=[\s,.;:]|$)/g,
      "",
    )
    // Restos sueltos de la nota: «Nº 15», «N° 22», «letra a)».
    .replace(/\s*\bN[º°]\s?\d+(?:\s?,?\s?letras?\s?[a-z]\))?(?=[\s,.;:])/g, "")
    .replace(/\s*\bletras?\s[a-z]\)(?=\s)/g, "")
    // Nota partida en dos líneas: «juez Art. letrado. Séptimo, Nº 19».
    .replace(/\s*\bArt\.\s(?=[a-záéíóúñ])/g, " ")
    .replace(new RegExp(`\\s*\\b(?:${ORDINALS}),?\\s?N[º°]\\s?\\d+`, "g"), "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s*@@PARRAFO@@\s*/g, "\n\n")
    .trim();
  return body;
}

function parse(xml) {
  const tagRe = /<EstructuraFuncional ([^>]*)>\s*<Texto>([\s\S]*?)<\/Texto>/g;
  const attr = (attrs, name) => (attrs.match(new RegExp(`${name}="([^"]*)"`)) ?? [])[1];
  const out = [];
  let m;
  while ((m = tagRe.exec(xml))) {
    if (decode(attr(m[1], "tipoParte") ?? "") !== "Artículo") continue;
    const text = decode(m[2]).trim();
    const num = text.match(/^\s*Art(?:ículo|\.)?\s*(\d+)(?:\s*(bis|ter))?/i);
    if (!num) continue;
    out.push({
      num: num[1] + (num[2] ? ` ${num[2]}` : ""),
      n: Number(num[1]),
      version: attr(m[1], "fechaVersion") ?? "",
      repealed: attr(m[1], "derogado") !== "no derogado",
      raw: text,
    });
  }
  return out;
}

async function getXml(source, fromDir) {
  if (fromDir) return fs.readFileSync(path.join(fromDir, `${source.id}.xml`), "utf8");
  const url = `https://www.bcn.cl/leychile/Consulta/obtxml?opt=7&idNorma=${source.idNorma}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (LEX MORTIS corpus builder)" } });
  if (!res.ok) throw new Error(`BCN respondió ${res.status} para ${url}`);
  return res.text();
}

const fromIndex = process.argv.indexOf("--from");
const fromDir = fromIndex > 0 ? process.argv[fromIndex + 1] : null;

const articles = [];
const suspicious = [];
for (const source of SOURCES) {
  const xml = await getXml(source, fromDir);
  const parsed = parse(xml).filter((a) => a.n >= source.range[0] && a.n <= source.range[1]);
  for (const a of parsed) {
    const text = cleanArticle(a.raw);
    if (/\bArt\.\s?\d|\bL\.\s?\d{1,2}\.\d{3}|N[º°]\s?\d+/.test(text)) suspicious.push(`${source.short} ${a.num}`);
    articles.push({
      id: `${source.id}-${a.num.replace(" ", "-")}`,
      law: source.id,
      num: a.num,
      version: a.version,
      repealed: a.repealed,
      text,
    });
  }
}

const header = `// Archivo generado por scripts/build-legal-corpus.mjs. No editar a mano.
// Fuente: Biblioteca del Congreso Nacional de Chile, LeyChile (texto vigente).
// Consultado: ${CONSULTED_AT}.
`;
const sources = SOURCES.map(({ id, idNorma, title, short }) => ({
  id,
  title,
  short,
  url: `https://www.bcn.cl/leychile/navegar?idNorma=${idNorma}`,
  consultedAt: CONSULTED_AT,
}));
const target = path.join(root, "src", "data", "legal", "corpus.js");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(
  target,
  `${header}export const legalSources = ${JSON.stringify(sources, null, 2)};\n\nexport const legalArticles = ${JSON.stringify(articles, null, 1)};\n`,
);
console.log(`Corpus: ${articles.length} artículos → ${path.relative(root, target)}`);
if (suspicious.length) console.log(`Revisar notas marginales residuales en: ${suspicious.join(", ")}`);
