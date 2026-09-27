import { useMemo, useState } from "react";
import { useNav } from "../../game/nav.jsx";
import { useGame } from "../../game/store.jsx";
import Overlay from "../../ui/Overlay.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Icon from "../../ui/Icon.jsx";
import { audio, playSfx } from "../../audio/sfx.js";

function Segmented({ label, value, options, onChange, hint }) {
  return (
    <fieldset className="grid gap-1.5">
      <legend className="label mb-1">{label}</legend>
      <div className="tabbar" role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            aria-selected={value === opt.value}
            className="tab"
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {hint && <p className="text-[0.8125rem] leading-snug text-dim">{hint}</p>}
    </fieldset>
  );
}

export default function SettingsOverlay() {
  const { close } = useNav();
  const { save, setSetting, reset } = useGame();
  const [confirming, setConfirming] = useState(false);
  const s = save.settings;

  const set = (key, value) => {
    audio.unlock();
    setSetting(key, value);
    playSfx("tap");
  };

  const items = useMemo(
    () => [
      {
        id: "sound",
        render: () => (
          <Segmented
            label="Sonido"
            value={s.sound}
            onChange={(v) => {
              set("sound", v);
              audio.configure({ muted: !v });
            }}
            options={[
              { value: true, label: "Activado" },
              { value: false, label: "Silencio" },
            ]}
          />
        ),
      },
      {
        id: "volume",
        render: () => (
          <Segmented
            label="Volumen"
            value={s.volume}
            onChange={(v) => {
              set("volume", v);
              audio.configure({ volume: v });
            }}
            options={[
              { value: 0.3, label: "Bajo" },
              { value: 0.6, label: "Medio" },
              { value: 0.9, label: "Alto" },
            ]}
          />
        ),
      },
      {
        id: "ambience",
        render: () => (
          <Segmented
            label="Ambiente sonoro"
            value={s.ambience}
            onChange={(v) => set("ambience", v)}
            options={[
              { value: true, label: "Con zumbido de archivo" },
              { value: false, label: "Solo efectos" },
            ]}
          />
        ),
      },
      {
        id: "effects",
        render: () => (
          <Segmented
            label="Efectos visuales"
            value={s.effects}
            onChange={(v) => set("effects", v)}
            hint="«Reducidos» quita movimiento ambiental y transiciones; el juego es el mismo."
            options={[
              { value: "auto", label: "Según sistema" },
              { value: "full", label: "Completos" },
              { value: "reduced", label: "Reducidos" },
            ]}
          />
        ),
      },
      {
        id: "text",
        render: () => (
          <Segmented
            label="Tamaño del texto"
            value={s.textScale}
            onChange={(v) => set("textScale", v)}
            hint="La escena se repagina para que todo siga cabiendo."
            options={[
              { value: 1, label: "Normal" },
              { value: 1.15, label: "Grande" },
              { value: 1.3, label: "Muy grande" },
            ]}
          />
        ),
      },
      {
        id: "timer",
        render: () => (
          <Segmented
            label="Tiempo en desafíos"
            value={s.timer}
            onChange={(v) => set("timer", v)}
            hint="Investigar y leer nunca tiene reloj. Esto afecta solo a los modos que lo anuncian."
            options={[
              { value: "normal", label: "Normal" },
              { value: "relaxed", label: "Holgado" },
              { value: "off", label: "Sin reloj" },
            ]}
          />
        ),
      },
      {
        id: "evaSpeed",
        render: () => (
          <Segmented
            label="Velocidad del texto de EVA"
            value={s.evaSpeed}
            onChange={(v) => set("evaSpeed", v)}
            options={[
              { value: "normal", label: "Normal" },
              { value: "fast", label: "Rápida" },
              { value: "instant", label: "Inmediata" },
            ]}
          />
        ),
      },
      {
        id: "evaChatter",
        render: () => (
          <Segmented
            label="Comentarios de EVA"
            value={s.evaChatter}
            onChange={(v) => set("evaChatter", v)}
            hint="En «Solo lo útil» EVA mantiene pistas y reacciones, sin comentarios de ambiente."
            options={[
              { value: "normal", label: "Con personalidad" },
              { value: "quiet", label: "Solo lo útil" },
            ]}
          />
        ),
      },
      {
        id: "reset",
        render: () =>
          confirming ? (
            <div className="panel-raised grid gap-2 p-3" role="alertdialog" aria-label="Confirmar reinicio">
              <p className="text-[0.9375rem] text-ink">
                Se borrarán tu XP, expedientes cerrados, dominio por módulo, errores, fichas programadas y la partida en curso. Tus ajustes se conservan y queda una copia de respaldo en este navegador.
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost flex-1" onClick={() => setConfirming(false)} data-autofocus="">
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger flex-1"
                  onClick={() => {
                    reset();
                    setConfirming(false);
                    playSfx("close");
                  }}
                >
                  Sí, reiniciar
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn-danger w-full" onClick={() => setConfirming(true)}>
              <Icon name="reset" />
              <span>Reiniciar progreso…</span>
            </button>
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s, confirming],
  );

  return (
    <Overlay title="Ajustes" kicker="Accesibilidad y sonido" onClose={() => close("settings")}>
      <FitPager items={items} gap={14} pageKey="settings" label="Ajustes" />
    </Overlay>
  );
}
