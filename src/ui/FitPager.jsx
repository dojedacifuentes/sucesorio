import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { splitSentences } from "../game/format.js";
import Icon from "./Icon.jsx";

// Posición de lectura por clave: al volver de una consulta o reanudar, la
// página que contiene el primer fragmento leído vuelve a mostrarse.
const anchors = new Map();

const CONTROL_GAP = 8;

/**
 * Pagina contenido para que quepa íntegro en el espacio disponible, sin
 * scroll ni recortes. Mide cada bloque con el ancho real y reparte en
 * páginas; los textos largos se dividen por oraciones (y, si hiciera falta,
 * por palabras) sin perder caracteres ni alterar el orden.
 *
 * items: [{ id, text?, render(text?) }]
 *   - con `text`, el bloque se puede partir; `render(fragmento)` pinta un trozo.
 *   - sin `text`, el bloque es indivisible (botón, tarjeta, figura).
 */
export default function FitPager({
  items,
  gap = 10,
  pageKey,
  label = "Página",
  className = "",
  controls = "below",
  onPagesChange,
  align = "start",
  resetOn,
}) {
  const boxRef = useRef(null);
  const measureRef = useRef(null);
  const controlsProbeRef = useRef(null);
  const liveRef = useRef(null);
  const prevBtn = useRef(null);
  const nextBtn = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [wordSplits, setWordSplits] = useState({});
  const [layout, setLayout] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const anchorRef = useRef(pageKey ? anchors.get(pageKey) ?? null : null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const read = () => {
      const w = Math.floor(el.clientWidth);
      const h = Math.floor(el.clientHeight);
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) setWordSplits((s) => ({ ...s }));
    });
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  // Segmentos medibles: bloque completo + oraciones (+ trozos por palabras).
  const model = useMemo(
    () =>
      items.map((item) => {
        if (typeof item.text !== "string") return { item, sentences: null };
        const sentences = splitSentences(item.text).flatMap((sentence, si) => {
          const pieces = wordSplits[`${item.id}:${si}`];
          if (!pieces) return [{ key: `${item.id}:${si}`, text: sentence }];
          const words = sentence.split(/\s+/);
          const size = Math.ceil(words.length / pieces);
          const out = [];
          for (let i = 0; i < words.length; i += size) out.push({ key: `${item.id}:${si}:${i}`, text: words.slice(i, i + size).join(" ") });
          return out;
        });
        return { item, sentences };
      }),
    [items, wordSplits],
  );

  const signature = useMemo(
    () => items.map((it) => `${it.id}:${typeof it.text === "string" ? it.text.length : "b"}`).join("|"),
    [items],
  );

  useLayoutEffect(() => {
    const root = measureRef.current;
    if (!root || box.w === 0 || box.h === 0) return;
    const heightOf = (sel) => {
      const el = root.querySelector(sel);
      return el ? Math.ceil(el.getBoundingClientRect().height) : 0;
    };
    const controlsH = (controlsProbeRef.current ? Math.ceil(controlsProbeRef.current.getBoundingClientRect().height) : 44) + CONTROL_GAP;

    const pack = (avail) => {
      const pages = [];
      let current = [];
      let used = 0;
      let overflow = false;
      const tooTall = [];
      const newPage = () => {
        if (current.length) pages.push(current);
        current = [];
        used = 0;
      };
      const place = (entry, h) => {
        const extra = current.length ? gap : 0;
        if (current.length && used + extra + h > avail) newPage();
        const add = current.length ? gap : 0;
        // Fragmentos consecutivos del mismo bloque se unen en un párrafo.
        const last = current[current.length - 1];
        if (entry.part && last && last.part && last.itemId === entry.itemId) {
          last.texts.push(entry.text);
          last.keys.push(entry.key);
          used += h + 2;
        } else {
          current.push(entry.part ? { ...entry, texts: [entry.text], keys: [entry.key] } : entry);
          used += add + h;
        }
        if (h > avail) overflow = true;
      };
      model.forEach(({ item, sentences }, index) => {
        const full = heightOf(`[data-fp-full="${index}"]`);
        const room = avail - used - (current.length ? gap : 0);
        const splittable = Boolean(sentences?.length);
        // Cabe entero aquí, o es indivisible: se coloca completo.
        if (full <= room || !splittable) {
          place({ itemId: item.id, key: `${item.id}`, whole: true }, full);
          return;
        }
        // Cabe entero en una página nueva y aquí queda poco sitio: se mueve
        // completo para no partir un párrafo breve.
        if (full <= avail && room < avail * 0.4) {
          place({ itemId: item.id, key: `${item.id}`, whole: true }, full);
          return;
        }
        sentences.forEach((sentence, si) => {
          const h = heightOf(`[data-fp-sent="${index}-${si}"]`);
          if (h > avail) tooTall.push(sentence.key);
          place({ itemId: item.id, key: sentence.key, text: sentence.text, part: true }, h);
        });
      });
      newPage();
      return { pages, overflow, tooTall };
    };

    let result = pack(box.h);
    if (result.pages.length > 1 && controls !== "none") result = pack(Math.max(40, box.h - controlsH));
    if (result.tooTall.length) {
      const next = { ...wordSplits };
      let changed = false;
      for (const key of result.tooTall) {
        const [id, si] = key.split(":");
        const k = `${id}:${si}`;
        const current = next[k] ?? 1;
        if (current < 12) {
          next[k] = current * 2;
          changed = true;
        }
      }
      if (changed) {
        setWordSplits(next);
        return;
      }
    }
    // Recupera la posición de lectura: la página que contiene el ancla.
    const anchor = anchorRef.current;
    let target = 0;
    if (anchor) {
      const found = result.pages.findIndex((page) => page.some((entry) => (entry.keys ?? [entry.key]).some((k) => k === anchor || k.startsWith(`${anchor}:`) || anchor.startsWith(`${k}:`))));
      if (found >= 0) target = found;
    }
    setLayout({ pages: result.pages, overflow: result.overflow, sig: `${signature}@${box.w}x${box.h}` });
    setPageIndex(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box.w, box.h, model, gap, controls, signature]);

  // Nuevo contenido (otra pregunta, otro documento): vuelve al principio.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    anchorRef.current = null;
    setPageIndex(0);
  }, [resetOn]);

  const pages = layout?.pages ?? [];
  const total = Math.max(1, pages.length);
  const index = Math.min(pageIndex, total - 1);
  const page = pages[index] ?? [];

  useEffect(() => {
    const first = page[0];
    if (!first) return;
    const key = (first.keys ?? [first.key])[0];
    anchorRef.current = key;
    if (pageKey) anchors.set(pageKey, key);
  }, [page, pageKey]);

  useEffect(() => {
    onPagesChange?.({ index, total });
  }, [index, total, onPagesChange]);

  const goTo = useCallback(
    (nextIndex, from) => {
      const clamped = Math.max(0, Math.min(total - 1, nextIndex));
      setPageIndex(clamped);
      window.requestAnimationFrame(() => {
        if (from === "next" && clamped >= total - 1) prevBtn.current?.focus({ preventScroll: true });
        if (from === "prev" && clamped <= 0) nextBtn.current?.focus({ preventScroll: true });
      });
    },
    [total],
  );

  const onKeyDown = (event) => {
    if (event.key === "PageDown") {
      event.preventDefault();
      goTo(index + 1, "next");
    } else if (event.key === "PageUp") {
      event.preventDefault();
      goTo(index - 1, "prev");
    }
  };

  const byId = useMemo(() => new Map(items.map((it) => [it.id, it])), [items]);
  const multi = total > 1 && controls !== "none";

  return (
    <div className={`relative flex min-h-0 min-w-0 flex-1 flex-col ${className}`} onKeyDown={onKeyDown} data-fitpager="">
      <div ref={boxRef} className="relative min-h-0 min-w-0 flex-1">
        <div
          key={`${index}-${layout?.sig ?? ""}`}
          className={`absolute inset-x-0 top-0 flex flex-col fp-page ${align === "center" ? "h-full justify-center" : ""}`}
          style={{ gap }}
          data-fp-page={index}
          data-fp-overflow={layout?.overflow ? "true" : undefined}
        >
          {layout &&
            page.map((entry) => {
              const item = byId.get(entry.itemId);
              if (!item) return null;
              if (entry.whole) return <div key={entry.key}>{typeof item.text === "string" ? item.render(item.text) : item.render()}</div>;
              return <div key={entry.keys[0]}>{item.render(entry.texts.join(" "), { continued: !entry.keys[0].endsWith(":0"), part: true })}</div>;
            })}
        </div>
        {/* Medidor invisible con el mismo ancho: nunca es interactivo. */}
        <div
          ref={measureRef}
          aria-hidden="true"
          inert=""
          className="pointer-events-none invisible absolute left-0 top-0"
          style={{ width: box.w || "100%" }}
          data-fp-measure=""
        >
          {model.map(({ item, sentences }, index) => (
            <div key={item.id}>
              <div data-fp-full={index}>{typeof item.text === "string" ? item.render(item.text) : item.render()}</div>
              {sentences?.map((s, si) => (
                <div key={s.key} data-fp-sent={`${index}-${si}`}>
                  {item.render(s.text, { part: true })}
                </div>
              ))}
            </div>
          ))}
          {controls !== "none" && (
            <div ref={controlsProbeRef}>
              <PageControls index={0} total={2} label={label} onPrev={() => {}} onNext={() => {}} probe />
            </div>
          )}
        </div>
      </div>
      {multi && (
        <div style={{ marginTop: CONTROL_GAP }}>
          <PageControls
            index={index}
            total={total}
            label={label}
            onPrev={() => goTo(index - 1, "prev")}
            onNext={() => goTo(index + 1, "next")}
            prevRef={prevBtn}
            nextRef={nextBtn}
            liveRef={liveRef}
          />
        </div>
      )}
    </div>
  );
}

export function PageControls({ index, total, label, onPrev, onNext, prevRef, nextRef, liveRef, probe = false }) {
  return (
    <div className="flex items-center justify-between gap-2" data-page-controls="">
      <button ref={prevRef} type="button" className="btn btn-ghost btn-sm" onClick={onPrev} disabled={index <= 0} tabIndex={probe ? -1 : undefined}>
        <Icon name="prev" />
        <span>Anterior</span>
      </button>
      <span ref={liveRef} className="label tabular-nums" aria-live={probe ? undefined : "polite"}>
        {label} {index + 1} / {total}
      </span>
      <button ref={nextRef} type="button" className="btn btn-cyan btn-sm" onClick={onNext} disabled={index >= total - 1} tabIndex={probe ? -1 : undefined}>
        <span>Siguiente</span>
        <Icon name="next" />
      </button>
    </div>
  );
}
