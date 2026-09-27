// Escenas y estados que recorre qa/fit.mjs. Cada caso: ruta (hash), pasos
// previos (clic por texto, teclas, esperas) y, si hace falta, un guardado.
const investigar = [{ click: "Investigar" }];
const decidir = [...investigar, { click: "Decisión" }, { click: "Reconocer representación" }];
const arcadeAnswers = (n) => Array.from({ length: n }, () => [{ key: "1", wait: 0 }, { wait: 700 }, { key: "Enter" }, { wait: 350 }]).flat();

export const CASES = [
  { id: "portada", route: "#/" },
  { id: "archivo", route: "#/hub" },
  { id: "pausa", route: "#/hub", steps: [{ click: "Pausa y menú" }] },
  { id: "ajustes", route: "#/", steps: [{ click: "Ajustes" }] },
  { id: "codex", route: "#/hub", steps: [{ click: "Abrir el Codex" }] },
  { id: "codex-articulo", route: "#/hub", steps: [{ click: "Abrir el Codex" }, { click: "Artículos" }, { click: "Art. 951" }] },
  // Expedientes: «El hijo premuerto» de principio a fin.
  { id: "exp-lista", route: "#/detective" },
  { id: "exp-intro", route: "#/detective/premuerto" },
  { id: "exp-pruebas", route: "#/detective/premuerto", steps: investigar },
  { id: "exp-documento", route: "#/detective/premuerto", steps: [...investigar, { click: "Certificado de defunción" }] },
  { id: "exp-cronologia", route: "#/detective/premuerto", steps: [...investigar, { click: "Reconstruir la cronología" }] },
  { id: "exp-familia", route: "#/detective/premuerto", steps: [...investigar, { click: "Familia" }, { click: "Tomás" }] },
  { id: "exp-decision", route: "#/detective/premuerto", steps: [...investigar, { click: "Decisión" }] },
  { id: "exp-fundamento", route: "#/detective/premuerto", steps: decidir },
  { id: "exp-cerrado", route: "#/detective/premuerto", steps: [...decidir, { click: "art. 984" }, { click: "Confirmar decisión", after: 600 }] },
  { id: "exp-cerrado-fundamento", route: "#/detective/premuerto", steps: [...decidir, { click: "art. 984" }, { click: "Confirmar decisión", after: 600 }, { click: "Fundamento", after: 700 }] },
  { id: "exp-error", route: "#/detective/premuerto", steps: [...investigar, { click: "Decisión" }, { click: "Excluir a las nietas" }, { click: "art. 984" }, { click: "Confirmar decisión", after: 600 }] },
  // Arcade.
  { id: "arcade-inicio", route: "#/arcade" },
  { id: "arcade-pregunta", route: "#/arcade/rapida" },
  { id: "arcade-consecuencia", route: "#/arcade/rapida", steps: [{ key: "1" }, { wait: 700 }] },
  { id: "resultados", route: "#/arcade/rapida", steps: arcadeAnswers(8), settle: 900 },
  // Duelos.
  { id: "duelo-lista", route: "#/boss" },
  { id: "duelo-intro", route: "#/boss/montecinos" },
  { id: "duelo-ataque", route: "#/boss/montecinos", steps: [{ click: "Empezar el duelo" }] },
  { id: "duelo-impacto", route: "#/boss/montecinos", steps: [{ click: "Empezar el duelo" }, { key: "1" }, { wait: 700 }] },
  // Memoria.
  { id: "memoria-inicio", route: "#/memory" },
  { id: "memoria-ficha", route: "#/memory", steps: [{ click: "Repaso del día" }] },
  { id: "memoria-volteada", route: "#/memory", steps: [{ click: "Repaso del día" }, { click: "Voltear la ficha" }] },
  // Siglas.
  { id: "siglas", route: "#/mnemonics" },
  { id: "siglas-pista", route: "#/mnemonics", steps: [{ click: "Pista" }] },
  // Acervos.
  { id: "acervos-lista", route: "#/acervos" },
  { id: "acervos-intro", route: "#/acervos/calc-10" },
  { id: "acervos-paso", route: "#/acervos/calc-10", steps: [{ click: "Calcular" }, { click: "3" }, { click: "0" }, { click: "0" }] },
  { id: "acervos-error", route: "#/acervos/calc-10", steps: [{ click: "Calcular" }, { click: "5" }, { click: "Comprobar" }] },
  { id: "acervos-final", route: "#/acervos/calc-1", steps: [{ click: "Calcular" }, { key: "6" }, { key: "0" }, { key: "Enter" }, { wait: 300 }, { key: "6" }, { key: "0" }, { key: "Enter" }, { wait: 500 }] },
  // Oral.
  { id: "oral-armar", route: "#/oral" },
  { id: "oral-elegida", route: "#/oral", steps: [{ key: "1" }, { key: "2" }] },
  { id: "oral-sintesis", route: "#/oral", steps: [{ key: "1" }, { key: "2" }, { key: "3" }, { key: "4" }, { click: "Ver síntesis" }] },
  { id: "oral-repregunta", route: "#/oral", steps: [{ key: "1" }, { key: "2" }, { key: "3" }, { key: "4" }, { click: "Ver síntesis" }, { click: "Presentar" }] },
  // Progreso.
  { id: "progreso", route: "#/progress" },
  { id: "progreso-bitacora", route: "#/progress", steps: [{ click: "Bitácora" }] },
];
