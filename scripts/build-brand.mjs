// La marca de EVA ARCADE en LEX MORTIS sale de un solo original: el vídeo
// oficial del logotipo (720×1280, 10 s, bucle □X → ≡X → EVA → □X).
//
//   node scripts/build-brand.mjs "<ruta a mp4.mp4>" "<ruta a ffmpeg>"
//
// ffmpeg no es dependencia del proyecto: basta el binario de `ffmpeg-static`
// instalado en una carpeta temporal. El vídeo original no se versiona.
//
// Qué hace:
// - Recorta un cuadrado de 720 px centrado en la órbita (y = 230). Así queda
//   fuera la marca de agua ✦ de la esquina inferior derecha del original.
// - Lo reduce a 480 px, sin audio, en MP4 (H.264) y WebM (VP9): de 3,2 MB a
//   ~0,3 y ~0,14 MB. El bucle ya es perfecto en el original (fotograma 0 = final).
// - Del primer fotograma (el símbolo □X en reposo) salen el póster, el logo fijo
//   de la cabecera, los iconos y la imagen para compartir en redes.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [video, ffmpeg] = process.argv.slice(2);
if (!video || !ffmpeg) {
  console.error('Uso: node scripts/build-brand.mjs "<mp4.mp4>" "<ffmpeg>"');
  process.exit(1);
}

const CROP = "crop=720:720:0:230";
const media = path.join(root, "public", "media");
const marca = path.join(root, "public", "assets", "marca");
fs.mkdirSync(media, { recursive: true });
fs.mkdirSync(marca, { recursive: true });

const ff = (...args) => execFileSync(ffmpeg, ["-v", "error", "-y", ...args], { stdio: "inherit" });
const scale = `${CROP},scale=480:480:flags=lanczos,format=yuv420p`;

ff("-i", video, "-an", "-vf", scale, "-c:v", "libx264", "-preset", "veryslow", "-crf", "27", "-profile:v", "high", "-movflags", "+faststart", "-g", "48", path.join(media, "eva-arcade-loop-480.mp4"));
ff("-i", video, "-an", "-vf", scale, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", path.join(media, "eva-arcade-loop-480.webm"));

const frame = path.join(os.tmpdir(), `lm-frame-${Date.now()}.png`);
ff("-ss", "0", "-i", video, "-frames:v", "1", "-vf", CROP, frame);

const out = [];
const save = async (img, file) => {
  await img.toFile(file);
  out.push(`${path.relative(root, file)} (${(fs.statSync(file).size / 1024).toFixed(1)} KB)`);
};

// Póster del vídeo: se ve mientras carga y con movimiento reducido.
await save(sharp(frame).resize(480, 480).webp({ quality: 82, effort: 6 }), path.join(media, "eva-arcade-poster-480.webp"));
// Símbolo con su órbita, fijo (cabecera, botones).
await save(sharp(frame).resize(160, 160).webp({ quality: 85, effort: 6 }), path.join(marca, "eva-arcade-orbita-160.webp"));
// Solo el □X, ajustado, para tamaños chicos (a 32 px la órbita es ruido).
const tight = { left: 180, top: 195, width: 360, height: 360 };
await save(sharp(frame).extract(tight).resize(96, 96).webp({ quality: 88, effort: 6 }), path.join(marca, "eva-arcade-simbolo-96.webp"));
await save(sharp(frame).extract(tight).resize(64, 64).png({ compressionLevel: 9 }), path.join(root, "public", "favicon-64.png"));
await save(sharp(frame).extract(tight).resize(32, 32).png({ compressionLevel: 9 }), path.join(root, "public", "favicon-32.png"));
await save(sharp(frame).extract({ left: 60, top: 60, width: 600, height: 600 }).resize(180, 180).png({ compressionLevel: 9 }), path.join(root, "public", "apple-touch-icon.png"));

// Vista previa para redes (1200×630): la marca a la izquierda, el juego a la derecha.
const W = 1200;
const H = 630;
const logo = await sharp(frame).resize(H, H).toBuffer();
const fade = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="f" x1="0" x2="1"><stop offset="0.38" stop-color="#03050d" stop-opacity="0"/><stop offset="0.56" stop-color="#03050d"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#f)"/>
    <g font-family="Segoe UI, Arial, sans-serif" fill="#f4f6ff">
      <text x="640" y="232" font-size="26" font-weight="600" letter-spacing="9" fill="#a9b8ff">EVA ARCADE</text>
      <text x="636" y="330" font-size="80" font-weight="800" letter-spacing="2">LEX <tspan fill="#ea6fe0">MORTIS</tspan></text>
      <text x="640" y="392" font-size="30" font-weight="600" fill="#dfe5ff">Derecho Sucesorio chileno</text>
      <text x="640" y="440" font-size="26" fill="#b9c3e8">Investiga. Decide. Descubre quién hereda.</text>
    </g>
  </svg>`,
);
await save(
  sharp({ create: { width: W, height: H, channels: 3, background: "#03050d" } })
    .composite([{ input: logo, left: 0, top: 0 }, { input: fade, left: 0, top: 0 }])
    .jpeg({ quality: 84, mozjpeg: true }),
  path.join(root, "public", "og-image.jpg"),
);

fs.rmSync(frame, { force: true });
for (const file of ["eva-arcade-loop-480.mp4", "eva-arcade-loop-480.webm"]) {
  out.unshift(`public/media/${file} (${(fs.statSync(path.join(media, file)).size / 1024).toFixed(1)} KB)`);
}
console.log(out.join("\n"));
