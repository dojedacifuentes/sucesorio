// Deriva los recursos optimizados del juego a partir de los originales
// entregados por el autor (PNG opacos, sin transparencia útil).
//
//   node scripts/build-assets.mjs "<carpeta EVA IMAGENES>" "<carpeta Descargas>"
//
// Los originales no se versionan: pesan ~2 MB cada uno y el juego solo
// necesita recortes pequeños. La correspondencia original → derivado queda
// documentada en SOURCES y en docs/RECURSOS.md.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [evaDir = "", downloadsDir = ""] = process.argv.slice(2);
if (!evaDir || !downloadsDir) {
  console.error('Uso: node scripts/build-assets.mjs "<EVA IMAGENES>" "<Descargas>"');
  process.exit(1);
}

export const SOURCES = {
  retrato: { dir: evaDir, file: "d073a98e-94df-4392-91f0-e9292b48b632.png", use: "Retrato frontal de EVA (comunicador)" },
  escritorio: { dir: evaDir, file: "5bce5c86-866e-4ba3-b80d-e4bc4dd35a45.png", use: "EVA sentada en la Notaría (portada)" },
  vistas: { dir: evaDir, file: "51d8a3de-7e31-4d82-aa02-3137cd209d31.png", use: "Plancha de seis vistas (referencia de consistencia)" },
  expresiones: { dir: evaDir, file: "7316d0b5-ed5b-4f06-b189-2f11c1ed1074.png", use: "Mosaico 4×4 de situaciones (escenas contextuales)" },
  marcaTrio: { dir: downloadsDir, file: "bf6f3124-9600-4709-bdc8-414560715c04.png", use: "Tres formas de la marca; se recorta el círculo EVA" },
  lineasH: { dir: downloadsDir, file: "1a00651b-7b90-4236-abb9-9d5d7c102908.png", use: "Emblema ≡X horizontal" },
  lineasV: { dir: downloadsDir, file: "4e2bcaea-5539-4593-8175-a2824b12da4c.png", use: "Emblema ≡X vertical" },
  cuadroH: { dir: downloadsDir, file: "73dec808-a51e-4f2c-aed0-6042db5b5e56 (1).png", use: "Símbolo □X horizontal (estado latente)" },
  cuadroV: { dir: downloadsDir, file: "64e5d12e-871d-494d-9555-15cee9c13980.png", use: "Símbolo □X vertical (idéntico a su copia «(1)»)" },
};

// Celdas del mosaico 7316d0b5 (bordes blancos detectados: filas 362–365,
// 686–688, 982–984; columnas 311–314, 624–628, 938–942).
const ROWS = [
  [0, 361],
  [366, 685],
  [689, 981],
  [985, 1253],
];
const COLS = [
  [0, 310],
  [315, 623],
  [629, 937],
  [943, 1253],
];
const cell = (r, c) => ({ left: COLS[c][0], top: ROWS[r][0], width: COLS[c][1] - COLS[c][0] + 1, height: ROWS[r][1] - ROWS[r][0] + 1 });

const OUT = path.join(root, "public", "assets");
const jobs = [
  // Comunicador: cabeza y cuello, sin cortar pelo ni mentón.
  { src: "retrato", out: "eva/eva-avatar-256.webp", extract: { left: 195, top: 50, width: 760, height: 760 }, resize: [256, 256] },
  { src: "retrato", out: "eva/eva-avatar-128.webp", extract: { left: 195, top: 50, width: 760, height: 760 }, resize: [128, 128] },
  { src: "retrato", out: "eva/eva-busto-600.webp", extract: { left: 60, top: 0, width: 1002, height: 1336 }, resize: [600, 800] },
  { src: "retrato", out: "eva/eva-busto-300.webp", extract: { left: 60, top: 0, width: 1002, height: 1336 }, resize: [300, 400] },
  // Portada: EVA en el escritorio de la Notaría.
  { src: "escritorio", out: "eva/eva-escritorio-540.webp", resize: [540, 960] },
  { src: "escritorio", out: "eva/eva-escritorio-alto-600.webp", extract: { left: 0, top: 40, width: 941, height: 1100 }, resize: [600, 701] },
  // Escenas contextuales del mosaico (un recorte por situación, sin alternarlos en el mismo marco).
  { src: "expresiones", out: "eva/escena-lectura.webp", extract: cell(0, 1) },
  { src: "expresiones", out: "eva/escena-cafe.webp", extract: cell(0, 2) },
  { src: "expresiones", out: "eva/escena-podio.webp", extract: cell(0, 3) },
  { src: "expresiones", out: "eva/escena-lluvia.webp", extract: cell(1, 0) },
  { src: "expresiones", out: "eva/escena-sonrisa.webp", extract: cell(1, 2) },
  { src: "expresiones", out: "eva/escena-pizarra.webp", extract: cell(2, 0) },
  { src: "expresiones", out: "eva/escena-libros.webp", extract: cell(2, 2) },
  { src: "expresiones", out: "eva/escena-mando.webp", extract: cell(3, 2) },
  { src: "expresiones", out: "eva/escena-pensando.webp", extract: cell(3, 3) },
  // Marca: círculo EVA del tríptico, emblemas ≡X y □X centrados.
  { src: "marcaTrio", out: "marca/eva-logo-480.webp", extract: { left: 1099, top: 21, width: 620, height: 620 }, resize: [480, 480] },
  { src: "marcaTrio", out: "marca/eva-logo-240.webp", extract: { left: 1099, top: 21, width: 620, height: 620 }, resize: [240, 240] },
  { src: "marcaTrio", out: "marca/eva-marca-trio-1600.webp", resize: [1600, 533] },
  { src: "lineasH", out: "marca/emblema-lineas-480.webp", extract: { left: 436, top: 37, width: 800, height: 800 }, resize: [480, 480] },
  { src: "cuadroH", out: "marca/simbolo-cuadro-480.webp", extract: { left: 436, top: 37, width: 800, height: 800 }, resize: [480, 480] },
  { src: "lineasV", out: "marca/emblema-lineas-vertical-540.webp", resize: [540, 960] },
  { src: "cuadroV", out: "marca/simbolo-cuadro-vertical-540.webp", resize: [540, 960] },
  // Iconos de la aplicación.
  { src: "lineasH", out: "../favicon-64.png", extract: { left: 586, top: 187, width: 500, height: 500 }, resize: [64, 64], png: true },
  { src: "lineasH", out: "../apple-touch-icon.png", extract: { left: 486, top: 87, width: 700, height: 700 }, resize: [180, 180], png: true },
];

for (const job of jobs) {
  const source = SOURCES[job.src];
  const input = path.join(source.dir, source.file);
  const target = path.join(OUT, job.out);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  let img = sharp(input).removeAlpha();
  if (job.extract) img = img.extract(job.extract);
  if (job.resize) img = img.resize(job.resize[0], job.resize[1], { fit: "cover", position: "attention" });
  img = job.png ? img.png({ compressionLevel: 9 }) : img.webp({ quality: 78, effort: 6 });
  await img.toFile(target);
  const size = fs.statSync(target).size;
  console.log(`${job.out.padEnd(40)} ← ${source.file} (${(size / 1024).toFixed(1)} KB)`);
}
