import { useMemo, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { BOSSES, CASES, MODULES } from "../../game/content.js";
import { getRank, masterySummary, nextRank, solvedCaseIds } from "../../game/progress.js";
import { EVA_LOG } from "../../eva/lines.js";
import Screen from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Icon from "../../ui/Icon.jsx";

const TABS = [
  ["resumen", "Resumen"],
  ["dominio", "Dominio"],
  ["bitacora", "Bitácora"],
  ["errores", "Errores"],
  ["historial", "Historial"],
];
const MODE = { arcade: "Arcade", detective: "Expediente", boss: "Duelo", memory: "Memoria", mnemonics: "Siglas", acervos: "Acervos", oral: "Oral" };

export default function ProgressScene() {
  const { save } = useGame();
  const { go } = useNav();
  const [tab, setTab] = useState("resumen");
  const p = save.profile;
  const rank = getRank(p.xp);
  const next = nextRank(p.xp);
  const solved = solvedCaseIds(save);
  const autonomous = Object.values(save.cases ?? {}).filter((c) => c.best === "autonomo").length;

  const items = useMemo(() => {
    if (tab === "resumen") {
      const stat = (label, value, note) => ({ label, value, note });
      const stats = [
        stat("Expedientes", `${solved.length}/${CASES.length}`, `${autonomous} sin ayuda`),
        stat("Duelos", `${(save.campaign?.bossesDefeated ?? []).length}/${BOSSES.length}`, "rivales vencidos"),
        stat("Aciertos", p.stats.correct ?? 0, `${p.stats.assisted ?? 0} con ayuda`),
        stat("Fichas", p.stats.flashcardsReviewed ?? 0, "autoevaluadas"),
        stat("Partidas arcade", p.stats.arcadeRuns ?? 0, ""),
        stat("Cálculos", p.stats.acervoLabs ?? 0, "distintos"),
      ];
      return [
        {
          id: "rank",
          render: () => (
            <div className="panel-raised grid gap-1 px-3 py-2">
              <p className="title-display text-lg leading-tight text-ink">
                <span className="label mr-2">Rango</span>
                {rank.title}
              </p>
              <div className="meter">
                <span style={{ width: `${next ? Math.min(100, ((p.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100) : 100}%`, background: "linear-gradient(90deg, rgb(var(--c-blue)), rgb(var(--c-violet)))" }} />
              </div>
              <p className="text-[0.875rem] text-dim">{p.xp} XP{next ? ` · faltan ${next.minXp - p.xp} para «${next.title}»` : " · rango máximo"}</p>
            </div>
          ),
        },
        ...[0, 2, 4].map((k) => ({
          id: `stats-${k}`,
          render: () => (
            <div className="grid grid-cols-2 gap-2">
              {stats.slice(k, k + 2).map((s) => (
                <div key={s.label} className="panel-raised px-3 py-1.5">
                  <p className="label">{s.label}</p>
                  <p className="title-display text-xl tabular-nums text-ink">{s.value}</p>
                  {s.note && <p className="text-[0.75rem] leading-tight text-faint">{s.note}</p>}
                </div>
              ))}
            </div>
          ),
        })),
        { id: "note", render: () => <p className="text-[0.8125rem] leading-snug text-faint">El XP premia jugar; el dominio (pestaña siguiente) solo cuenta respuestas autónomas. Lo resuelto con ayuda y tu autoevaluación se anotan aparte.</p> },
      ];
    }
    if (tab === "dominio") {
      const rows = MODULES.map((m) => ({ m, s: masterySummary(save.mastery?.[m.id]) }));
      const seen = rows.filter((r) => r.s.evaluated || r.s.selfKnow + r.s.selfDoubt + r.s.selfForgot || r.s.legacyScore);
      if (!seen.length) return [{ id: "none", render: () => <p className="text-dim">Aún no hay respuestas evaluadas. Juega cualquier sala y aparecerán aquí.</p> }];
      return seen.map(({ m, s }) => ({
        id: m.id,
        render: () => (
          <div className="panel-raised grid gap-1 px-3 py-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="min-w-0 font-semibold leading-snug text-ink">{m.title}</p>
              <p className="title-display tabular-nums text-cyan">{s.autonomy}%</p>
            </div>
            <div className="meter h-2">
              <span style={{ width: `${s.autonomy}%`, background: "rgb(var(--c-ok))" }} />
            </div>
            <p className="text-[0.8125rem] text-dim">
              {s.auto} solo · {s.assisted} con ayuda · {s.wrong} errores
              {s.selfKnow + s.selfDoubt + s.selfForgot ? ` · fichas: ${s.selfKnow} sabías, ${s.selfDoubt} dudas` : ""}
              {s.legacyScore ? ` · versión anterior: ${s.legacyScore}` : ""}
            </p>
          </div>
        ),
      }));
    }
    if (tab === "bitacora") {
      return EVA_LOG.map((l) => {
        const open = solved.length >= l.at;
        return {
          id: l.id,
          text: open ? l.text : undefined,
          render: (t, o) =>
            open ? (
              <div className="panel-raised px-3 py-2">
                {!o?.continued && <p className="label text-lilac">{l.title}</p>}
                <p className="text-[0.9688rem] leading-relaxed text-ink">{t}</p>
              </div>
            ) : (
              <p className="flex items-center gap-2 px-1 text-[0.875rem] text-faint">
                <Icon name="shield" size={16} /> {l.title.split("·")[0]}· se desbloquea al cerrar {l.at} expediente{l.at === 1 ? "" : "s"}
              </p>
            ),
        };
      });
    }
    if (tab === "errores") {
      const recent = save.recentErrors ?? [];
      if (!recent.length) return [{ id: "none", render: () => <p className="text-dim">Sin errores recientes. Sospechoso, pero lo acepto.</p> }];
      return recent.map((e, i) => ({
        id: `e${i}`,
        render: () => (
          <div className="panel-raised px-3 py-2">
            <p className="font-semibold leading-snug text-ink">{e.key}</p>
            <p className="text-[0.8125rem] text-dim">
              {MODE[e.mode] ?? e.mode}
              {e.article ? ` · ${e.article}` : ""}
            </p>
          </div>
        ),
      }));
    }
    const hist = save.history ?? [];
    if (!hist.length) return [{ id: "none", render: () => <p className="text-dim">Todavía no terminas ninguna partida.</p> }];
    return hist.map((h, i) => ({
      id: `h${i}`,
      render: () => (
        <div className="flex items-center gap-2 px-1">
          <span className="chip">{MODE[h.mode] ?? h.mode ?? "—"}</span>
          <span className="min-w-0 flex-1 text-[0.9375rem] leading-snug text-ink">{h.title ?? "Partida anterior"}</span>
          <span className="tabular-nums text-dim">{h.accuracy ?? 0}%</span>
        </div>
      ),
    }));
  }, [tab, save, solved, autonomous, rank, next, p]);

  return (
    <Screen
      title="Progreso"
      subtitle={`${rank.title} · ${p.xp} XP`}
      eva="compact"
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="archive" />
            <span>Archivo</span>
          </button>
          <button type="button" className="btn btn-primary flex-1" onClick={() => go("detective")} data-autofocus="">
            <Icon name="doc" />
            <span>Seguir jugando</span>
          </button>
        </>
      }
    >
      <div className="col min-h-0 flex-1 gap-2">
        <div className="tabbar shrink-0 overflow-hidden" role="tablist" aria-label="Secciones del progreso">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className="tab px-1 text-[0.8125rem]" onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        <FitPager key={tab} items={items} gap={8} pageKey={`progress:${tab}`} label="Página" />
      </div>
    </Screen>
  );
}
