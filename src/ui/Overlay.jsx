import { useEffect, useId, useRef } from "react";
import Icon from "./Icon.jsx";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Capa modal accesible: foco atrapado, Escape para cerrar y retorno del foco
 * al control de origen (lo gestiona useNav().close). El contenido de abajo
 * queda inerte mientras la capa está abierta, así que no quedan botones
 * activos ocultos detrás.
 */
export default function Overlay({ title, kicker, onClose, children, size = "full", footer, closeLabel = "Cerrar", initialFocus }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const target = (initialFocus && el.querySelector(initialFocus)) || el.querySelector("[data-autofocus]") || el.querySelector(FOCUSABLE) || el;
    target.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null && !n.closest("[inert]"));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [onClose, initialFocus]);

  const sizeClass = size === "compact" ? "is-compact" : size === "wide" ? "is-wide" : "";

  return (
    <div className="overlay-root" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <section ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`overlay-card ${sizeClass}`}>
        <header className="flex items-center gap-3 border-b border-line/50 px-4 py-2">
          <div className="min-w-0 flex-1">
            {kicker && <p className="label">{kicker}</p>}
            <h2 id={titleId} className="title-display text-lg text-ink">
              {title}
            </h2>
          </div>
          {onClose && (
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label={closeLabel} title={`${closeLabel} (Esc)`}>
              <Icon name="close" />
            </button>
          )}
        </header>
        <div className="col min-h-0 flex-1 px-4 py-3">{children}</div>
        {footer && <footer className="border-t border-line/50 px-4 py-2">{footer}</footer>}
      </section>
    </div>
  );
}
