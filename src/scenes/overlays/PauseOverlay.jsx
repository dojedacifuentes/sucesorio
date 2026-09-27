import { useNav } from "../../game/nav.jsx";
import { useGame } from "../../game/store.jsx";
import Overlay from "../../ui/Overlay.jsx";
import Icon from "../../ui/Icon.jsx";

/** Pausa: el desafío se detiene mientras esta capa está abierta. */
export default function PauseOverlay() {
  const { close, open, go, scene } = useNav();
  const { flush, saveFailed } = useGame();
  const inGame = !["title", "hub"].includes(scene.id);

  const leave = (target) => {
    flush();
    go(target);
  };

  return (
    <Overlay title="Pausa" kicker="LEX MORTIS · EVA Arcade" size="compact" onClose={() => close("pause")} closeLabel="Seguir jugando">
      <div className="grid gap-2 py-1">
        <p className="text-[0.9375rem] text-dim">
          {saveFailed ? "El navegador no permite guardar: tu avance se conserva solo mientras esta pestaña siga abierta." : "Tu avance queda guardado en este navegador."}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => close("pause")} data-autofocus="">
          <Icon name="play" />
          <span>Continuar</span>
        </button>
        <button type="button" className="btn" onClick={() => open("codex")}>
          <Icon name="book" />
          <span>Codex</span>
        </button>
        <button type="button" className="btn" onClick={() => open("settings")}>
          <Icon name="gear" />
          <span>Ajustes</span>
        </button>
        {inGame && (
          <button type="button" className="btn btn-ghost" onClick={() => leave("hub")}>
            <Icon name="archive" />
            <span>Guardar y volver al archivo</span>
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={() => leave("title")}>
          <Icon name="exit" />
          <span>Guardar y salir a la portada</span>
        </button>
      </div>
    </Overlay>
  );
}
