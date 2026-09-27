import { useEffect, useMemo, useRef, useState } from "react";
import { useNav } from "../../game/nav.jsx";
import { useGame } from "../../game/store.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import Overlay from "../../ui/Overlay.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Icon from "../../ui/Icon.jsx";
import { playSfx } from "../../audio/sfx.js";
import { articleTitle, articles, concepts, findArticle, modules, search, sources } from "./codexIndex.js";

// La consulta sobrevive a cerrar y reabrir el Codex: se vuelve al mismo punto.
const memory = { query: "", filter: "todo", view: null };

const FILTERS = [
  { id: "todo", label: "Todo" },
  { id: "modulos", label: "Módulos" },
  { id: "conceptos", label: "Conceptos" },
  { id: "articulos", label: "Artículos" },
];

/**
 * Codex: consulta de módulos, conceptos y texto oficial de los artículos.
 * Se abre sobre cualquier escena sin desmontarla; params.article o
 * params.module abren directamente lo pertinente al momento.
 */
export default function CodexOverlay({ article, module, query: initialQuery }) {
  const { close } = useNav();
  const { save } = useGame();
  const { say } = useEva();
  const [query, setQuery] = useState(initialQuery ?? memory.query);
  const [filter, setFilter] = useState(memory.filter);
  const [view, setView] = useState(() => {
    if (article) {
      const found = findArticle(article);
      if (found) return { kind: "articulo", id: found.id };
    }
    if (module && modules.some((m) => m.id === module)) return { kind: "modulo", id: module };
    return memory.view;
  });
  const inputRef = useRef(null);

  useEffect(() => {
    say("codexOpen");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    memory.query = query;
    memory.filter = filter;
    memory.view = view;
  }, [query, filter, view]);

  const results = useMemo(() => search(query, filter), [query, filter]);
  const unlocked = useMemo(() => new Set(save.profile.unlockedArticles ?? []), [save.profile.unlockedArticles]);

  const openView = (next) => {
    playSfx("open");
    setView(next);
  };

  const resultItems = useMemo(() => {
    if (!results.length) {
      return [{ id: "none", render: () => <p className="text-dim">Sin resultados para «{query}». Prueba con un número de artículo (955) o un concepto (legítima, representación).</p> }];
    }
    return results.map((r) => ({
      id: `${r.kind}-${r.id}`,
      render: () => (
        <button type="button" className="choice" onClick={() => openView({ kind: r.kind, id: r.id })}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-cyan">
            <Icon name={r.kind === "articulo" ? "gavel" : r.kind === "modulo" ? "archive" : "cards"} size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">{r.title}</span>
            <span className="block text-[0.8125rem] leading-snug text-dim">{r.snippet}</span>
          </span>
        </button>
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const detail = view ? <Detail view={view} unlocked={unlocked} onOpen={openView} /> : null;

  return (
    <Overlay
      title="Codex"
      kicker="Consulta · el juego sigue en pausa"
      size="wide"
      onClose={() => close("codex")}
      footer={
        view ? (
          <button type="button" className="btn btn-ghost" onClick={() => setView(null)}>
            <Icon name="prev" />
            <span>Volver a resultados</span>
          </button>
        ) : null
      }
    >
      {detail ?? (
        <div className="col min-h-0 flex-1 gap-2">
          <label className="relative block shrink-0">
            <span className="sr-only">Buscar en el Codex</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: 955, legítima, representación…"
              className="h-11 w-full rounded-xl border border-line bg-bg pl-10 pr-3 text-[1rem] text-ink outline-none focus:border-cyan"
              enterKeyHint="search"
              autoComplete="off"
            />
          </label>
          <div className="tabbar shrink-0" role="tablist" aria-label="Filtrar resultados">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} className="tab" onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <p className="label shrink-0" aria-live="polite">
            {results.length} resultado{results.length === 1 ? "" : "s"}
          </p>
          <FitPager items={resultItems} gap={6} pageKey={`codex:${filter}:${query}`} label="Resultados" resetOn={`${filter}|${query}`} />
        </div>
      )}
    </Overlay>
  );
}

function Detail({ view, unlocked, onOpen }) {
  if (view.kind === "articulo") {
    const a = articles.find((x) => x.id === view.id);
    if (!a) return <p className="text-dim">Artículo no encontrado.</p>;
    const src = sources[a.law];
    const paragraphs = a.text.split(/\n{2,}/);
    const items = [
      {
        id: "head",
        render: () => (
          <div>
            <p className="label text-cyan">{src?.title}</p>
            <h3 className="title-display text-xl text-ink">{articleTitle(a)}</h3>
            {a.law === "cc" && !unlocked.has(a.num) && <p className="mt-1 text-[0.8125rem] text-dim">Aún no aparece en tus partidas: consúltalo igual, el Codex no guarda secretos.</p>}
          </div>
        ),
      },
      ...paragraphs.map((p, i) => ({
        id: `p${i}`,
        text: p,
        render: (chunk) => <p className="text-[1rem] leading-relaxed text-ink">{chunk}</p>,
      })),
      {
        id: "src",
        render: () => (
          <p className="text-[0.8125rem] leading-snug text-dim">
            Texto oficial vigente · última modificación del artículo: {a.version || "sin dato"} · consultado el {src?.consultedAt} en{" "}
            <a className="text-cyan underline" href={src?.url} target="_blank" rel="noreferrer">
              BCN LeyChile
            </a>
            . Se omitieron las notas marginales de modificación.
          </p>
        ),
      },
    ];
    return <FitPager items={items} gap={12} pageKey={`art:${a.id}`} label="Página" />;
  }

  if (view.kind === "modulo") {
    const m = modules.find((x) => x.id === view.id);
    if (!m) return <p className="text-dim">Módulo no encontrado.</p>;
    const items = [
      { id: "h", render: () => <h3 className="title-display text-xl text-ink">{m.title}</h3> },
      { id: "sum", text: m.summary, render: (t) => <p className="text-[1rem] leading-relaxed text-ink">{t}</p> },
      {
        id: "mn",
        text: m.mnemonic,
        render: (t, o) => (
          <div className="panel-raised p-3">
            {!o?.continued && <p className="label text-lilac">Mnemotecnia</p>}
            <p className="text-[0.975rem] leading-relaxed text-ink">{t}</p>
          </div>
        ),
      },
      {
        id: "err",
        text: m.commonError,
        render: (t, o) => (
          <div className="panel-raised border-bad/50 p-3">
            {!o?.continued && <p className="label text-bad">Error frecuente</p>}
            <p className="text-[0.975rem] leading-relaxed text-ink">{t}</p>
          </div>
        ),
      },
      {
        id: "arts",
        render: () => (
          <div>
            <p className="label mb-1">Artículos del módulo</p>
            <div className="flex flex-wrap gap-2">
              {m.articles.map((num) => {
                const a = findArticle(num);
                return a ? (
                  <button key={num} type="button" className="btn btn-sm btn-cyan" onClick={() => onOpen({ kind: "articulo", id: a.id })}>
                    art. {num}
                  </button>
                ) : (
                  <span key={num} className="chip">
                    art. {num}
                  </span>
                );
              })}
            </div>
          </div>
        ),
      },
    ];
    return <FitPager items={items} gap={12} pageKey={`mod:${m.id}`} label="Página" />;
  }

  const c = concepts.find((x) => x.id === view.id);
  if (!c) return <p className="text-dim">Concepto no encontrado.</p>;
  const a = findArticle(c.article);
  const items = [
    {
      id: "h",
      render: () => (
        <div>
          <p className="label text-cyan">Concepto · {c.article}</p>
          <h3 className="title-display text-xl text-ink">{c.concept}</h3>
        </div>
      ),
    },
    { id: "def", text: c.definition, render: (t) => <p className="text-[1rem] leading-relaxed text-ink">{t}</p> },
    {
      id: "ex",
      text: c.example,
      render: (t, o) => (
        <div className="panel-raised p-3">
          {!o?.continued && <p className="label text-cyan">Ejemplo</p>}
          <p className="text-[0.975rem] leading-relaxed text-ink">{t}</p>
        </div>
      ),
    },
    {
      id: "err",
      text: c.commonError,
      render: (t, o) => (
        <div className="panel-raised p-3">
          {!o?.continued && <p className="label text-bad">Error frecuente</p>}
          <p className="text-[0.975rem] leading-relaxed text-ink">{t}</p>
        </div>
      ),
    },
    ...(a
      ? [
          {
            id: "go",
            render: () => (
              <button type="button" className="btn btn-cyan" onClick={() => onOpen({ kind: "articulo", id: a.id })}>
                <Icon name="gavel" />
                <span>Leer {articleTitle(a)}</span>
              </button>
            ),
          },
        ]
      : []),
  ];
  return <FitPager items={items} gap={12} pageKey={`con:${c.id}`} label="Página" />;
}
