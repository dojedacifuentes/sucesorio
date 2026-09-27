import { useEffect, useMemo, useState } from "react";
import { stripVerdict } from "../game/format.js";
import { useNav } from "../game/nav.jsx";
import { EvaAvatar } from "../eva/EvaComm.jsx";
import FitPager from "./FitPager.jsx";
import Icon from "./Icon.jsx";

let corpusPromise = null;
const loadCorpus = () => {
  corpusPromise ??= import("../data/legal/corpus.js");
  return corpusPromise;
};

/** Números de artículo del Código Civil citados en una referencia («arts. 1014, 1015», «951/1115»). */
export function articleNumbers(ref) {
  const text = String(ref ?? "");
  if (/ley\s*20\.?830/i.test(text) && !/\b(9\d\d|1[0-4]\d\d)\b/.test(text)) return [];
  return Array.from(new Set(text.match(/\b(9[5-9]\d|1[0-4]\d\d|577|688|722)\b/g) ?? []));
}

/** Texto oficial (BCN) de los artículos citados, cargado solo cuando hace falta. */
export function useArticles(ref, enabled = true) {
  const [list, setList] = useState(null);
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    const nums = articleNumbers(ref);
    const wantsAuc = /20\.?830/.test(String(ref ?? ""));
    loadCorpus().then(({ legalArticles }) => {
      if (!alive) return;
      const found = nums.map((n) => legalArticles.find((a) => a.law === "cc" && a.num === n)).filter(Boolean);
      if (wantsAuc) found.push(...legalArticles.filter((a) => a.law !== "cc" && a.num === "16"));
      setList(found);
    });
    return () => {
      alive = false;
    };
  }, [ref, enabled]);
  return list;
}

const TONES = {
  ok: { icon: "check", label: "Correcto", cls: "border-ok text-ok" },
  bad: { icon: "close", label: "Incorrecto", cls: "border-bad text-bad" },
  time: { icon: "clock", label: "Se acabó el tiempo", cls: "border-warn text-warn" },
  info: { icon: "info", label: "Resultado", cls: "border-cyan text-cyan" },
};

/**
 * La consecuencia de una decisión, en el mismo espacio donde estaba la
 * pregunta (nunca debajo). Tres capas: qué pasó → por qué → fundamento
 * (texto oficial del artículo). El jugador pasa de una a otra con pestañas.
 *
 * props:
 *  tone: ok | bad | time | info       verdict: texto del titular (opcional)
 *  picked, answer: lo elegido y lo correcto (opcional)
 *  what: texto de «qué pasó» (opcional)   why: explicación   article: referencia
 *  eva: { text, mood } reacción de EVA    extra: nodo adicional en «qué pasó»
 */
export default function Verdict({ tone = "info", verdict, picked, answer, what, why, article, concept, eva, extra, resetKey }) {
  const [tab, setTab] = useState("what");
  const { open } = useNav();
  const articles = useArticles(article, tab === "law");
  const t = TONES[tone] ?? TONES.info;
  const cleanWhy = stripVerdict(why);

  useEffect(() => setTab("what"), [resetKey]);

  const whatItems = useMemo(() => {
    const items = [];
    if (eva?.text) {
      items.push({
        id: "eva",
        text: eva.text,
        render: (chunk, o) => (
          <div className="flex items-start gap-3">
            {!o?.continued && <EvaAvatar size={36} mood={eva.mood} />}
            <p className="flex-1 text-[0.975rem] leading-snug text-ink">{chunk}</p>
          </div>
        ),
      });
    }
    if (picked !== undefined && answer !== undefined) {
      items.push({
        id: "pick",
        render: () => (
          <dl className="grid gap-1.5">
            <div className="panel-raised flex items-start gap-2 px-3 py-2">
              <dt className="label w-24 shrink-0 pt-0.5">Elegiste</dt>
              <dd className={`flex-1 font-semibold ${picked === answer ? "text-ok" : "text-bad"}`}>{picked ?? "— (sin respuesta)"}</dd>
            </div>
            {picked !== answer && (
              <div className="panel-raised flex items-start gap-2 px-3 py-2">
                <dt className="label w-24 shrink-0 pt-0.5">Correcta</dt>
                <dd className="flex-1 font-semibold text-ok">{answer}</dd>
              </div>
            )}
          </dl>
        ),
      });
    }
    if (what) items.push({ id: "what", text: what, render: (chunk) => <p className="text-[1rem] leading-relaxed text-ink">{chunk}</p> });
    if (extra) items.push({ id: "extra", render: () => extra });
    return items;
  }, [eva, picked, answer, what, extra]);

  const whyItems = useMemo(
    () => [
      { id: "why", text: cleanWhy || "Sin explicación adicional.", render: (chunk) => <p className="text-[1rem] leading-relaxed text-ink">{chunk}</p> },
      ...(concept ? [{ id: "concept", render: () => <p className="label">Concepto · <span className="text-lilac">{concept}</span></p> }] : []),
    ],
    [cleanWhy, concept],
  );

  const lawItems = useMemo(() => {
    const head = { id: "ref", render: () => <p className="label">Fundamento · <span className="text-cyan">{article || "sin cita"}</span></p> };
    if (!articles) return [head, { id: "loading", render: () => <p className="text-dim">Abriendo el Código…</p> }];
    if (!articles.length) {
      return [head, { id: "none", render: () => <p className="text-[0.9375rem] leading-relaxed text-dim">Esta cita no corresponde a un artículo del Libro III del Código Civil (p. ej., una regla procesal o una sistematización doctrinal). Búscala en el Codex.</p> }];
    }
    return [
      head,
      ...articles.flatMap((a) => [
        { id: `h-${a.id}`, render: () => <p className="title-display text-base text-ink">{a.law === "cc" ? `Art. ${a.num} del Código Civil` : `Ley 20.830, art. ${a.num}`}</p> },
        ...a.text.split(/\n{2,}/).map((p, i) => ({ id: `${a.id}-${i}`, text: p, render: (chunk) => <p className="text-[0.9688rem] leading-relaxed text-ink">{chunk}</p> })),
      ]),
      { id: "src", render: () => <p className="text-[0.8125rem] text-faint">Texto oficial vigente · BCN LeyChile, consultado el 26-09-2026.</p> },
    ];
  }, [articles, article]);

  const items = tab === "what" ? whatItems : tab === "why" ? whyItems : lawItems;

  return (
    <section className={`panel col min-h-0 flex-1 gap-2 border-l-4 p-3 ${t.cls.split(" ")[0]}`} aria-live="polite" data-verdict={tone}>
      <header className="flex shrink-0 items-center gap-2">
        <span className={`grid h-9 w-9 place-items-center rounded-full border-2 ${t.cls}`}>
          <Icon name={t.icon} size={20} strokeWidth={2.4} />
        </span>
        <h2 className={`title-display min-w-0 flex-1 text-xl ${t.cls.split(" ")[1]}`}>{verdict ?? t.label}</h2>
        {article && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => open("codex", { article })} title="Abrir el artículo en el Codex">
            <Icon name="book" size={18} />
            <span className="hidden sm:inline">Codex</span>
          </button>
        )}
      </header>
      <div className="tabbar shrink-0" role="tablist" aria-label="Explicación">
        {[
          ["what", "Qué pasó"],
          ["why", "Por qué"],
          ["law", "Fundamento"],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className="tab" onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <FitPager key={`${tab}-${resetKey ?? ""}`} items={items} gap={10} label="Página" />
    </section>
  );
}
