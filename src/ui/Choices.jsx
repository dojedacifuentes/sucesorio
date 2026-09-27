import { useLayout } from "./Screen.jsx";
import { useKeys } from "./hooks.js";
import Icon from "./Icon.jsx";

const LETTERS = ["1", "2", "3", "4", "5", "6"];

/**
 * Alternativas de respuesta. Teclas 1–6 (o A–F) eligen; tras elegir, la
 * opción marcada muestra un instante si acertó (icono + color + texto para
 * lectores de pantalla) antes de que la escena pase a la consecuencia.
 */
export default function Choices({ options, onPick, disabled = false, reveal = null, columns }) {
  const vp = useLayout();
  const longest = Math.max(...options.map((o) => String(o).length));
  const cols = columns ?? (vp.width >= 720 && longest <= 42 ? 2 : 1);

  const keys = {};
  options.forEach((option, i) => {
    keys[LETTERS[i]] = () => !disabled && onPick(option);
    keys[String.fromCharCode(97 + i)] = () => !disabled && onPick(option);
  });
  useKeys(keys, !disabled);

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="group" aria-label="Alternativas">
      {options.map((option, i) => {
        const isPicked = reveal?.picked === option;
        const isAnswer = reveal && option === reveal.answer;
        const state = reveal ? (isAnswer ? "is-right" : isPicked ? "is-wrong" : "opacity-60") : "";
        return (
          <button key={option} type="button" className={`choice items-center ${state}`} onClick={() => onPick(option)} disabled={disabled} data-choice="">
            <span className="choice-key" aria-hidden="true">
              {reveal && isAnswer ? <Icon name="check" size={16} /> : reveal && isPicked ? <Icon name="close" size={16} /> : LETTERS[i]}
            </span>
            <span className="min-w-0 flex-1 font-medium text-ink">{option}</span>
            {reveal && isAnswer && <span className="sr-only">(respuesta correcta)</span>}
            {reveal && isPicked && !isAnswer && <span className="sr-only">(tu respuesta, incorrecta)</span>}
          </button>
        );
      })}
    </div>
  );
}
