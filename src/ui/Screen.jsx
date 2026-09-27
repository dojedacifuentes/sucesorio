import { createContext, useContext } from "react";
import { useGame } from "../game/store.jsx";
import { useNav } from "../game/nav.jsx";
import EvaComm, { EvaButton } from "../eva/EvaComm.jsx";
import { audio, playSfx } from "../audio/sfx.js";
import Icon from "./Icon.jsx";
import { BRAND_MEDIA } from "../brand/arcade.js";

export const ViewportContext = createContext({ layout: "stack", short: false, tiny: false, width: 390, height: 844 });
export const useLayout = () => useContext(ViewportContext);

/**
 * Plantilla de escena: HUD compacto · escenario flexible · barra de acciones.
 * En móvil vertical EVA ocupa una franja fija sobre las acciones; en
 * escritorio, una columna lateral; en pantallas bajas, un botón en el HUD
 * cuyo mensaje se lee en su propia capa.
 */
export default function Screen({ title, subtitle, hud, dock, children, eva = "auto", aside, stageClassName = "", brandOnly = false }) {
  const vp = useLayout();
  // "compact": en salas de juego, un celular de altura media deja a EVA como
  // botón de la cabecera; sus reacciones aparecen dentro de la consecuencia.
  const compactEva = (eva === "compact" && vp.layout === "stack" && vp.height < 780) || (eva === "compact-sm" && vp.layout === "stack" && vp.height < 700);
  const evaMode = eva === "none" ? "none" : vp.short || vp.layout === "split" || compactEva ? "icon" : vp.layout === "wide" ? "panel" : "strip";
  const showPanel = evaMode === "panel" && !aside;
  // En pantallas estrechas el estado de la partida (vidas, puntaje…) y el
  // subtítulo bajan a una franja propia: la cabecera queda con el título.
  const statusRow = vp.width < 640 && (hud || (subtitle && title && !brandOnly));

  return (
    <>
      <Hud title={title} subtitle={statusRow ? null : subtitle} extra={statusRow ? null : hud} evaIcon={evaMode === "icon"} brandOnly={brandOnly} />
      <main className="stage" data-stage="">
        <div className={`stage-inner ${stageClassName}`}>
          {statusRow && (
            <div className="mb-2 flex min-h-[28px] shrink-0 items-center gap-1.5" data-status="">
              {subtitle && <p className="label min-w-0 flex-1 leading-tight">{subtitle}</p>}
              {hud && <div className="flex shrink-0 items-center gap-1.5">{hud}</div>}
            </div>
          )}
          {showPanel || aside ? (
            <div className="grid min-h-0 flex-1 gap-3" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(250px, 300px)" }}>
              <div className="col min-h-0 min-w-0">{children}</div>
              <div className="col min-h-0 min-w-0 gap-3">
                {aside}
                {evaMode === "panel" && (
                  <div className={aside ? "h-[210px] shrink-0" : "col min-h-0 flex-1"}>
                    <EvaComm variant="panel" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="col min-h-0 flex-1">{children}</div>
          )}
          {evaMode === "strip" && (
            <div className="mt-2 shrink-0">
              <EvaComm variant="strip" />
            </div>
          )}
        </div>
      </main>
      <footer className="dock" data-dock="">
        <div className={`mx-auto flex w-full max-w-[1280px] items-center gap-2 px-[var(--gutter)] ${vp.short ? "min-h-[52px] py-1" : "min-h-[60px] py-2"}`}>{dock}</div>
      </footer>
    </>
  );
}

function Hud({ title, subtitle, extra, evaIcon, brandOnly }) {
  const { save, setSetting } = useGame();
  const vp = useLayout();
  const roomy = vp.width >= 560;
  const { open, go, scene } = useNav();
  const sound = save.settings.sound;

  const toggleSound = () => {
    audio.unlock();
    const next = !sound;
    setSetting("sound", next);
    audio.configure({ muted: !next });
    if (next) playSfx("select");
  };

  return (
    <header className="hud" data-hud="">
      <div className={`mx-auto flex w-full max-w-[1280px] items-center gap-2 px-[var(--gutter)] ${vp.short ? "min-h-[48px] py-0.5" : "min-h-[52px] py-1"}`}>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-lg"
          onClick={() => (scene.id === "hub" ? open("pause") : go("hub"))}
          aria-label={scene.id === "hub" ? "Menú" : "Volver al archivo (inicio de LEX MORTIS)"}
          title="LEX MORTIS · EVA ARCADE"
        >
          <img src={BRAND_MEDIA.simbolo} alt="" width="96" height="96" className="brand-img h-9 w-9" draggable="false" />
          {(brandOnly || !title) && (
            <span className="leading-none">
              <span className="title-display block text-[0.95rem] tracking-[0.12em] text-ink">
                LEX <span className="text-magenta">MORTIS</span>
              </span>
              <span className="label block text-[0.625rem] tracking-[0.28em] text-lilac">EVA ARCADE</span>
            </span>
          )}
        </button>
        {title && !brandOnly && (
          <div className="min-w-0 flex-1">
            <p className="title-display truncate-safe text-[0.95rem] leading-tight text-ink">{title}</p>
            {subtitle && <p className="label text-[0.625rem] leading-tight">{subtitle}</p>}
          </div>
        )}
        {(brandOnly || !title) && <div className="flex-1" />}
        {extra && <div className="flex shrink-0 items-center gap-1.5">{extra}</div>}
        {evaIcon && <EvaButton />}
        <button type="button" className="btn btn-ghost btn-icon" onClick={() => open("codex")} aria-label="Abrir el Codex" title="Codex">
          <Icon name="book" />
        </button>
        {roomy && (
          <button type="button" className="btn btn-ghost btn-icon" onClick={toggleSound} aria-label={sound ? "Silenciar sonido" : "Activar sonido"} aria-pressed={!sound} title={sound ? "Silenciar" : "Activar sonido"}>
            <Icon name={sound ? "sound" : "mute"} />
          </button>
        )}
        <button type="button" className="btn btn-ghost btn-icon" onClick={() => open("pause")} aria-label="Pausa y menú" title="Pausa (Esc)">
          <Icon name="pause" />
        </button>
      </div>
    </header>
  );
}
