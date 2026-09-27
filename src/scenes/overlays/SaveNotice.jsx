import { useGame } from "../../game/store.jsx";

const TEXT = {
  migrado: "Encontré tu progreso de la versión anterior y lo traje. La copia original sigue guardada en este navegador.",
  corrupto: "Tu guardado estaba dañado. Lo aparté intacto (no lo borré) y empezamos una partida limpia.",
  "legado-ilegible": "Había un progreso antiguo que no pude leer. Lo dejé intacto y empezamos una partida limpia.",
  "sin-almacenamiento": "Este navegador no permite guardar. Puedes jugar igual; el avance durará mientras la pestaña siga abierta.",
};

/** Aviso no bloqueante sobre el estado del guardado. */
export default function SaveNotice() {
  const { notice, dismissNotice } = useGame();
  if (!notice || !TEXT[notice]) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[56px] z-50 flex justify-center px-3" role="status">
      <div className="panel pointer-events-auto flex max-w-[560px] items-center gap-3 px-3 py-2 shadow-glow">
        <p className="flex-1 text-[0.875rem] leading-snug text-ink">{TEXT[notice]}</p>
        <button type="button" className="btn btn-sm btn-ghost" onClick={dismissNotice}>
          Entendido
        </button>
      </div>
    </div>
  );
}
