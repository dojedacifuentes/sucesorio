import { useEffect, useMemo } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";

const OUTCOME = {
  victoria: { label: "Victoria", cls: "text-ok", icon: "star" },
  derrota: { label: "Derrota", cls: "text-bad", icon: "skull" },
  completado: { label: "Completado", cls: "text-cyan", icon: "check" },
};

/**
 * Cierre de una partida: lo conseguido, qué falló y cómo seguir. La precisión
 * se calcula sobre lo realmente respondido; las ayudas se cuentan aparte.
 */
export default function ResultsScene() {
  const { save } = useGame();
  const { go } = useNav();
  const { say, speak } = useEva();
  const vp = useLayout();
  const r = save.lastResult;

  useEffect(() => {
    if (!r) return;
    if (r.outcome === "derrota") say("bossLose", { boss: r.title });
    else if (r.message) speak(r.message, { mood: r.outcome === "victoria" ? "complacida" : "neutral", id: `res-${r.id}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r?.id]);

  const replay = () => (r?.replay ? go(r.replay.scene, r.replay.param ?? null) : go("hub"));
  useKeys({ Enter: replay });

  const items = useMemo(() => {
    if (!r) return [];
    const list = [];
    list.push({
      id: "sum",
      render: () => (
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Precisión" value={`${r.accuracy}%`} note={`${r.correct} de ${r.answered}`} />
          <Stat label={r.score ? "Puntaje" : "Aciertos"} value={r.score ? r.score.toLocaleString("es-CL") : r.correct} />
          <Stat label="Con ayuda" value={r.assisted ?? 0} note="no cuenta como dominio" />
        </div>
      ),
    });
    if (r.message) list.push({ id: "msg", text: r.message, render: (t) => <p className="text-[1rem] leading-relaxed text-ink">{t}</p> });
    const misses = (r.details ?? []).filter((d) => d.ok === false);
    const hits = (r.details ?? []).filter((d) => d.ok);
    if (misses.length) list.push({ id: "mh", render: () => <p className="label text-bad">Para repasar ({misses.length})</p> });
    misses.forEach((d, i) =>
      list.push({
        id: `m${i}`,
        render: () => (
          <div className="panel-raised flex items-start gap-2 px-3 py-2">
            <Icon name="close" size={18} className="mt-0.5 text-bad" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] leading-snug text-ink">{d.label}</p>
              {d.note && <p className="text-[0.8125rem] leading-snug text-dim">{d.note}</p>}
            </div>
          </div>
        ),
      }),
    );
    if (hits.length) list.push({ id: "hh", render: () => <p className="label text-ok">Resuelto ({hits.length})</p> });
    hits.forEach((d, i) =>
      list.push({
        id: `h${i}`,
        render: () => (
          <div className="flex items-start gap-2 px-1">
            <Icon name="check" size={18} className="mt-0.5 text-ok" />
            <p className="min-w-0 flex-1 text-[0.9375rem] leading-snug text-dim">{d.label}</p>
          </div>
        ),
      }),
    );
    return list;
  }, [r]);

  if (!r) {
    return (
      <Screen title="Resultados" dock={<button type="button" className="btn btn-primary flex-1" onClick={() => go("hub")}>Volver al archivo</button>}>
        <p className="m-auto text-dim">Aún no hay partidas terminadas.</p>
      </Screen>
    );
  }

  const o = OUTCOME[r.outcome] ?? OUTCOME.completado;
  return (
    <Screen
      title={r.title}
      subtitle="Resultado"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="archive" />
            <span className={vp.width < 380 ? "sr-only" : ""}>Archivo</span>
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => go("progress")}>
            <Icon name="chart" />
            <span className={vp.width < 480 ? "sr-only" : ""}>Progreso</span>
          </button>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={replay} data-autofocus="">
            <Icon name="reset" />
            <span>{r.replay?.label ?? "Seguir"}</span>
          </button>
        </>
      }
    >
      <div className="col min-h-0 flex-1 gap-2">
        <div className="flex shrink-0 items-center gap-3">
          <span className={`grid h-11 w-11 place-items-center rounded-full border-2 border-current ${o.cls}`}>
            <Icon name={o.icon} size={22} strokeWidth={2.2} />
          </span>
          <h2 className={`title-display text-3xl ${o.cls}`}>{o.label}</h2>
        </div>
        <FitPager items={items} gap={8} pageKey={`res:${r.id}`} label="Página" />
      </div>
    </Screen>
  );
}

function Stat({ label, value, note }) {
  return (
    <div className="panel-raised px-2 py-2">
      <p className="label">{label}</p>
      <p className="title-display text-2xl tabular-nums text-ink">{value}</p>
      {note && <p className="text-[0.75rem] leading-tight text-faint">{note}</p>}
    </div>
  );
}
