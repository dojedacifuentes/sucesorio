import { useEffect, useState } from "react";

/**
 * Ajusta el armazón al área visible real: barras dinámicas del navegador,
 * teclado virtual (visualViewport) y áreas seguras. No bloquea el zoom: si
 * el jugador amplía con los dedos, se usa el alto del layout y no el visual.
 * Devuelve una descripción del formato para decidir composiciones.
 */
export function useViewport() {
  const [info, setInfo] = useState(() => measure());

  useEffect(() => {
    let frame = 0;
    const root = document.documentElement;
    const apply = () => {
      frame = 0;
      const next = measure();
      root.style.setProperty("--app-h", `${next.height}px`);
      root.style.setProperty("--app-top", `${next.top}px`);
      setInfo((prev) =>
        prev.width === next.width && prev.height === next.height && prev.keyboard === next.keyboard && prev.top === next.top ? prev : next,
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    apply();
    const vv = window.visualViewport;
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    vv?.addEventListener("resize", schedule);
    vv?.addEventListener("scroll", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      vv?.removeEventListener("resize", schedule);
      vv?.removeEventListener("scroll", schedule);
    };
  }, []);

  return info;
}

function measure() {
  const vv = window.visualViewport;
  const layoutH = window.innerHeight;
  const width = window.innerWidth;
  let height = layoutH;
  let top = 0;
  let keyboard = false;
  if (vv && Math.abs(vv.scale - 1) < 0.01) {
    height = Math.round(vv.height);
    top = Math.max(0, Math.round(vv.offsetTop));
    keyboard = layoutH - vv.height > 120;
  }
  const short = height < 520;
  const tiny = height < 420;
  const orientation = width > height ? "landscape" : "portrait";
  const layout = width >= 900 && height >= 560 ? "wide" : width >= 600 && orientation === "landscape" ? "split" : "stack";
  return { width, height, top, keyboard, short, tiny, orientation, layout };
}
