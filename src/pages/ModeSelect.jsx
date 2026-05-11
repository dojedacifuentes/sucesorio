import ArcadeFrame from "../components/ArcadeFrame";

const modes = [
  {
    id: "arcade",
    title: "Neón de artículos",
    copy: "Preguntas rapidas, cronometro, vidas, combo y humillacion academica en dosis eficientes.",
    tone: "primary",
  },
  {
    id: "detective",
    title: "El expediente del causante",
    copy: "Casos sucesorios con documentos, arbol familiar, sospechosos y resolucion argumentada.",
    tone: "gold",
  },
  {
    id: "boss",
    title: "Profesor Montecinos.exe",
    copy: "Combates contra instituciones juridicas que no perdonan una cronologia mal leida.",
    tone: "danger",
  },
  {
    id: "memory",
    title: "Cementerio de conceptos",
    copy: "Flashcards con repeticion espaciada simple y botones para confesar tu ruina.",
    tone: "cyan",
  },
  {
    id: "mnemonics",
    title: "Máquina de mnemotecnias",
    copy: "ULIFA, BILII, HCHCF, CDA, MICES, 5H y plazos clave bajo luz de arcade roto.",
    tone: "primary",
  },
  {
    id: "acervos",
    title: "Laboratorio de acervos",
    copy: "Calculo de conyuge, ordenes, acervo liquido, imaginarios, imputaciones y excesos con feedback paso a paso.",
    tone: "cyan",
  },
  {
    id: "oral",
    title: "Oral de grado",
    copy: "Ordena concepto, norma, doctrina y caso. Habla como civilista; sobrevive como humano.",
    tone: "gold",
  },
];

export default function ModeSelect({ navigate }) {
  return (
    <ArcadeFrame title="Selector de modos" kicker="Elige tu forma de sufrir con elegancia">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modes.map((mode, index) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => navigate(mode.id)}
            className="group pixel-corners border border-white/10 bg-black/30 p-5 text-left transition hover:-translate-y-1 hover:border-neonCyan/60 hover:bg-white/5"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-neonCyan">Modo {index + 1}</span>
              <span className="text-2xl text-neonPink">▣</span>
            </div>
            <h3 className="font-display text-2xl font-black text-white">{mode.title}</h3>
            <p className="mt-4 min-h-24 text-sm leading-7 text-zinc-400">{mode.copy}</p>
            <span className={`pixel-corners mt-5 block border px-4 py-3 text-sm font-black uppercase tracking-[0.08em] ${
              mode.tone === "cyan"
                ? "border-neonCyan/70 bg-neonCyan/12 text-white"
                : mode.tone === "gold"
                  ? "border-oldGold/75 bg-oldGold/12 text-amber-50"
                  : mode.tone === "danger"
                    ? "border-blood/80 bg-blood/14 text-red-50"
                    : "border-neonPink/70 bg-neonPink/14 text-white"
            }`}>
              Entrar
            </span>
          </button>
        ))}
      </div>
    </ArcadeFrame>
  );
}
