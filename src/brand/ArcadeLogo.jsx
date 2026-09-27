import { useEffect, useRef } from "react";
import { usePaused } from "../game/nav.jsx";
import { useReducedMotion } from "../ui/motion.js";
import { ARCADE, BRAND_MEDIA } from "./arcade.js";

/**
 * El logotipo oficial de EVA ARCADE en bucle: □X → ≡X → EVA → □X (10 s).
 * Un solo vídeo en pantalla, sin audio, en línea. Se detiene mientras hay una
 * capa abierta o la pestaña está oculta, y con movimiento reducido se queda en
 * el póster (el símbolo quieto). Los bordes se funden con el fondo.
 */
export default function ArcadeLogo({ className = "", label = true }) {
  const ref = useRef(null);
  const paused = usePaused();
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused) video.pause();
    else video.play?.().catch(() => {});
  }, [paused]);

  return (
    <figure className={`arcade-logo ${className}`} aria-label={label ? `${ARCADE.nombre}: símbolo oficial` : undefined} role={label ? "img" : undefined}>
      {reduced ? (
        <img src={BRAND_MEDIA.poster} alt="" width="480" height="480" draggable="false" />
      ) : (
        <video ref={ref} autoPlay muted loop playsInline preload="auto" poster={BRAND_MEDIA.poster} aria-hidden="true" disablePictureInPicture>
          <source src={BRAND_MEDIA.loopWebm} type="video/webm" />
          <source src={BRAND_MEDIA.loopMp4} type="video/mp4" />
        </video>
      )}
    </figure>
  );
}

/** Sello fijo: el símbolo □X y «EVA ARCADE». Firma del juego, no su título. */
export function ArcadeSeal({ compact = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src={BRAND_MEDIA.simbolo} alt="" width="96" height="96" className="brand-img h-7 w-7" draggable="false" />
      {!compact && <span className="label tracking-[0.3em] text-lilac">{ARCADE.nombre}</span>}
    </span>
  );
}

/** Vínculo a la puerta del Arcade (en la misma pestaña, como en los otros juegos). */
export function MoreGamesLink({ className = "" }) {
  return (
    <a href={ARCADE.puerta} className={`btn btn-ghost ${className}`} aria-label={ARCADE.masJuegos}>
      <img src={BRAND_MEDIA.simbolo} alt="" width="96" height="96" className="brand-img h-6 w-6" draggable="false" />
      <span>{ARCADE.masJuegos}</span>
    </a>
  );
}
