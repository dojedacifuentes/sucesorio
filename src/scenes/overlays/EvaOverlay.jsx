import { useMemo } from "react";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { EvaAvatar } from "../../eva/EvaComm.jsx";
import Overlay from "../../ui/Overlay.jsx";
import FitPager from "../../ui/FitPager.jsx";

/** Intervención de EVA en su propia capa: mensaje actual y los anteriores, paginados. */
export default function EvaOverlay() {
  const { close } = useNav();
  const { message, history } = useEva();

  const items = useMemo(() => {
    const list = history.length ? history : message ? [message] : [];
    if (!list.length) {
      return [{ id: "empty", render: () => <p className="text-dim">EVA aún no ha dicho nada. Milagro.</p> }];
    }
    return list.map((entry, i) => ({
      id: entry.key,
      text: entry.text,
      render: (chunk) => (
        <div className={`flex gap-3 ${i === 0 ? "" : "opacity-80"}`}>
          <EvaAvatar size={36} mood={entry.mood} />
          <p className="flex-1 text-[0.975rem] leading-relaxed text-ink">
            {i === 0 && <span className="label mr-2 text-cyan">Ahora</span>}
            {chunk}
          </p>
        </div>
      ),
    }));
  }, [history, message]);

  return (
    <Overlay title="EVA" kicker="Comunicador" onClose={() => close("eva")}>
      <FitPager items={items} gap={14} label="Mensajes" resetOn={message?.key} />
    </Overlay>
  );
}
