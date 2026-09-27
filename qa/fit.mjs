// Control de «todo cabe en pantalla» con Chrome sin interfaz (protocolo
// DevTools, sin dependencias). Para cada escena y tamaño comprueba que:
//  1. el documento no se desplaza (ni vertical ni horizontal);
//  2. ningún elemento visible de la escena sale del área visible;
//  3. ningún texto o control queda recortado por un contenedor;
//  4. ningún panel tiene desplazamiento interno;
//  5. el paginador no marca desborde.
// Guarda una captura por caso en qa/out/.
//
//   node qa/fit.mjs [url-base] [--only=ruta] [--sizes=390x844,1366x768]
//
// Rutas: se definen en CASES. Cada caso puede ejecutar pasos antes de medir
// (clic por texto visible, tecla, espera) y sembrar un guardado.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "qa", "out");
fs.mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const base = args.find((a) => !a.startsWith("--")) ?? "http://localhost:5174/";
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];

export const SIZES = ["320x568", "360x640", "390x844", "430x932", "667x375", "844x390", "768x1024", "1024x768", "1366x768", "1920x1080"];
const sizes = (opt("sizes") ?? SIZES.join(",")).split(",");

const { CASES } = await import("./cases.mjs");
const only = opt("only");
const cases = only ? CASES.filter((c) => only.split(",").some((o) => c.id.includes(o))) : CASES;

const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9300 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "lm-qa-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--autoplay-policy=no-user-gesture-required",
  "--hide-scrollbars",
  "about:blank",
]);

async function waitForChrome() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      /* aún arrancando */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Chrome no respondió");
}

const ws = new WebSocket(await waitForChrome());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = (seq += 1);
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (expression) => {
  const res = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (res.exceptionDetails) throw new Error(res.exceptionDetails.exception?.description ?? res.exceptionDetails.text);
  return res.result.value;
};

await send("Page.enable");
await send("Runtime.enable");

// Se ejecuta dentro de la página: devuelve la lista de problemas.
const CHECK = String(function check() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const issues = [];
  const se = document.scrollingElement;
  if (se.scrollHeight > vh + 1) issues.push(`documento desplazable en vertical (${se.scrollHeight} > ${vh})`);
  if (se.scrollWidth > vw + 1) issues.push(`documento desplazable en horizontal (${se.scrollWidth} > ${vw})`);
  const label = (el) => {
    const text = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50);
    return `<${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? ` .${el.className.split(" ").slice(0, 2).join(".")}` : ""}> «${text}»`;
  };
  const skip = (el) => el.closest("[data-fp-measure],[data-decor],.sr-only,[aria-hidden='true']");
  const rootEl = document.querySelector(".overlay-root:last-of-type .overlay-card") || document.querySelector(".scene-grid");
  if (!rootEl) return ["sin escena"];
  const all = rootEl.querySelectorAll("*");
  for (const el of all) {
    if (skip(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const scrollable = /(auto|scroll)/.test(cs.overflowY + cs.overflowX);
    if (scrollable && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)) issues.push(`desplazamiento interno en ${label(el)}`);
    const interactive = el.matches("button, a, input, select, textarea, [role=button], [role=tab], [role=radio]");
    const textLeaf = !interactive && el.childElementCount === 0 && el.textContent.trim().length > 0;
    if (!interactive && !textLeaf) continue;
    if (r.left < -1 || r.top < -1 || r.right > vw + 1 || r.bottom > vh + 1) {
      issues.push(`fuera de pantalla ${label(el)} [${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)}]`);
      continue;
    }
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.overflowX === "visible" && ps.overflowY === "visible") continue;
      const pr = p.getBoundingClientRect();
      if (r.left < pr.left - 1 || r.top < pr.top - 1 || r.right > pr.right + 1 || r.bottom > pr.bottom + 1) {
        issues.push(`recortado ${label(el)} por ${label(p).slice(0, 40)}`);
      }
      break;
    }
    if (interactive && !el.disabled) {
      // En un vínculo partido en dos líneas, el centro de la caja cae fuera del texto.
      const first = el.getClientRects()[0] ?? r;
      const cx = Math.min(vw - 1, Math.max(0, first.left + first.width / 2));
      const cy = Math.min(vh - 1, Math.max(0, first.top + first.height / 2));
      const hit = document.elementFromPoint(cx, cy);
      if (hit && hit !== el && !el.contains(hit) && !hit.closest("[data-decor]")) issues.push(`tapado ${label(el)} por ${label(hit).slice(0, 40)}`);
    }
  }
  document.querySelectorAll("[data-fp-overflow='true']").forEach((el) => {
    const fp = el.closest("[data-fitpager]");
    const box = fp?.firstElementChild?.clientHeight;
    const tall = [...(fp?.querySelectorAll("[data-fp-full]") ?? [])].map((e) => Math.round(e.getBoundingClientRect().height) + ":" + e.textContent.trim().slice(0, 18)).join(", ");
    issues.push(`paginador desbordado ${label(el)} (caja ${box}px; bloques ${tall})`);
  });
  return Array.from(new Set(issues)).slice(0, 25);
});

async function runStep(step) {
  if (step.wait) return sleep(step.wait);
  if (step.key) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: step.key, code: step.code ?? step.key, windowsVirtualKeyCode: step.vk ?? 0 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: step.key, code: step.code ?? step.key, windowsVirtualKeyCode: step.vk ?? 0 });
    return sleep(250);
  }
  if (step.eval) return evaluate(step.eval);
  if (step.click) {
    let ok = false;
    for (let attempt = 0; attempt < 24 && !ok; attempt += 1) {
      if (attempt) await sleep(250);
      ok = await evaluate(`(() => {
      const want = ${JSON.stringify(step.click)}.toLowerCase();
      const root = document.querySelector(".overlay-root:last-of-type") || document;
      const els = [...root.querySelectorAll("button, a, [role=button], [role=tab]")].filter((e) => !e.closest("[data-fp-measure]") && !e.disabled);
      const el = els.find((e) => (e.getAttribute("aria-label") || e.textContent || "").trim().toLowerCase().includes(want));
      if (!el) return false;
      el.click();
      return true;
    })()`);
    }
    if (!ok && !step.optional) throw new Error(`no encontré «${step.click}»`);
    return sleep(step.after ?? 350);
  }
  return undefined;
}

const report = [];
for (const c of cases) {
  for (const size of sizes) {
    const [w, h] = size.split("x").map(Number);
    const mobile = w < 768;
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
    await send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    // Partida limpia: se borra el almacenamiento con la página cerrada (si no,
    // el juego lo reescribe al ocultarse) y el guardado de prueba se siembra
    // antes de que cargue la app.
    await send("Page.navigate", { url: "about:blank" });
    await sleep(150);
    await send("Storage.clearDataForOrigin", { origin: new URL(base).origin, storageTypes: "local_storage,session_storage" });
    const seedScript = c.seed || c.legacy
      ? await send("Page.addScriptToEvaluateOnNewDocument", {
          source: `if (!sessionStorage.getItem("qa-seeded")) { sessionStorage.setItem("qa-seeded", "1"); ${c.seed ? `localStorage.setItem("lex-mortis-save-v2", ${JSON.stringify(JSON.stringify(c.seed))});` : ""} ${c.legacy ? `localStorage.setItem("lex-mortis-progress-v1", ${JSON.stringify(JSON.stringify(c.legacy))});` : ""} }`,
        })
      : null;
    await send("Page.navigate", { url: new URL(c.route ?? "#/", base).href });
    if (seedScript) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: seedScript.identifier });
    await sleep(c.load ?? 1100);
    let issues;
    try {
      for (const step of c.steps ?? []) await runStep(step);
      await sleep(c.settle ?? 450);
      issues = await evaluate(`(${CHECK})()`);
    } catch (err) {
      issues = [`error en el recorrido: ${err.message}`];
    }
    const shot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(outDir, `${c.id}-${size}.png`), Buffer.from(shot.data, "base64"));
    report.push({ case: c.id, size, issues });
    console.log(`${issues.length ? "✗" : "✓"} ${c.id.padEnd(28)} ${size.padEnd(10)} ${issues.length ? issues.join(" | ") : ""}`);
  }
}

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 1));
const failed = report.filter((r) => r.issues.length).length;
console.log(`\n${report.length - failed}/${report.length} casos sin problemas`);
ws.close();
chrome.kill();
process.exit(failed ? 1 : 0);
