import { useNav } from "../../game/nav.jsx";
import Screen from "../../ui/Screen.jsx";
import Icon from "../../ui/Icon.jsx";

/**
 * Sala que aún no tiene escena propia: se dice con claridad y se vuelve al
 * archivo. Desaparece cuando todas las salas estén migradas.
 */
export default function LegacyScene({ sceneId }) {
  const { go } = useNav();
  return (
    <Screen
      title="Sala en preparación"
      subtitle={sceneId}
      dock={
        <button type="button" className="btn btn-primary flex-1" onClick={() => go("hub")} data-autofocus="">
          <Icon name="archive" />
          <span>Volver al archivo</span>
        </button>
      }
    >
      <div className="grid flex-1 place-items-center">
        <p className="max-w-[40ch] text-center text-dim">Esta sala se está reconstruyendo para el nuevo archivo. Mientras tanto, prueba otra.</p>
      </div>
    </Screen>
  );
}
