// Escenas y estados que recorre qa/fit.mjs. Cada caso: ruta (hash), pasos
// previos (clic por texto, teclas, esperas) y, si hace falta, un guardado.
export const CASES = [
  { id: "portada", route: "#/" },
  { id: "archivo", route: "#/hub" },
  { id: "pausa", route: "#/hub", steps: [{ click: "Pausa y menú" }] },
  { id: "ajustes", route: "#/", steps: [{ click: "Ajustes" }] },
  { id: "codex", route: "#/hub", steps: [{ click: "Abrir el Codex" }] },
  { id: "codex-articulo", route: "#/hub", steps: [{ click: "Abrir el Codex" }, { click: "Artículos" }, { click: "Art. 951" }] },
];
