import { useEffect, useMemo } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { solvedCaseIds } from "../../game/progress.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import Icon from "../../ui/Icon.jsx";
import { playSfx } from "../../audio/sfx.js";
import IntroSequence from "./IntroSequence.jsx";

const RUN_LABELS = {
  detective: "Expediente",
  arcade: "Neón de artículos",
  boss: "Duelo",
  memory: "Cementerio de conceptos",
  mnemonics: "Máquina de siglas",
  acervos: "Laboratorio de acervos",
  oral: "Sala oral",
};

export default function TitleScene() {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const run = save.run;
  const firstTime = !save.profile.firstVisitAt;
  const reduced = save.settings.effects === "reduced" || (save.settings.effects === "auto" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (firstTime) {
      say("firstVisit");
      update((s) => ({ ...s, profile: { ...s.profile, firstVisitAt: new Date().toISOString(), visits: (s.profile.visits ?? 0) + 1 } }));
    } else {
      say("welcomeBack", { caseTitle: run?.title, solved: solvedCaseIds(save).length });
      update((s) => ({ ...s, profile: { ...s.profile, visits: (s.profile.visits ?? 0) + 1 } }));
    }
    // Solo al entrar en la portada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primary = useMemo(() => {
    if (run?.scene) {
      return { label: `Continuar: ${run.title ?? RUN_LABELS[run.scene] ?? "partida"}`, action: () => go(run.scene, run.param ?? null) };
    }
    if (firstTime || !save.cases?.premuerto) {
      return { label: "Abrir expediente: El hijo premuerto", action: () => go("detective", "premuerto") };
    }
    return { label: "Entrar al archivo", action: () => go("hub") };
  }, [run, firstTime, save.cases, go]);

  const start = () => {
    playSfx("confirm");
    primary.action();
  };

  const wide = vp.layout !== "stack";

  return (
    <Screen
      brandOnly
      dock={
        <>
          <button type="button" className="btn btn-primary flex-1" onClick={start} data-autofocus="">
            <Icon name="play" />
            <span>{primary.label}</span>
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")} aria-label="Archivo: todas las salas">
            <Icon name="archive" />
            <span className={vp.width < 400 ? "sr-only" : ""}>Archivo</span>
          </button>
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => open("settings")} aria-label="Ajustes">
            <Icon name="gear" />
          </button>
        </>
      }
    >
      <div className={`relative grid min-h-0 flex-1 gap-3 ${wide ? "grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center" : "grid-rows-[auto_minmax(0,1fr)]"}`}>
        <div className="col min-w-0 justify-center gap-2">
          <div className="flex items-center gap-2">
            <img src="/assets/marca/eva-logo-240.webp" alt="" width="44" height="44" className="brand-img h-11 w-11" />
            <p className="title-display text-sm tracking-[0.34em] text-cyan">EVA ARCADE</p>
          </div>
          <h1 className={`title-display neon-text ${vp.tiny ? "text-4xl" : "text-5xl"} tracking-[0.08em] text-ink md:text-7xl`}>
            LEX <span className="text-magenta">MORTIS</span>
          </h1>
          <p className="max-w-[34ch] text-[0.975rem] leading-snug text-dim">
            Expedientes sucesorios de la <strong className="font-semibold text-ink">Notaría Nocturna 404</strong>. Investiga, decide y descubre quién hereda de verdad.
          </p>
        </div>
        <figure className="relative min-h-0 overflow-hidden rounded-panel border border-line/50" data-decor="">
          <img
            src="/assets/eva/eva-escritorio-alto-600.webp"
            alt="EVA, sentada en el escritorio de la Notaría Nocturna 404"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 12%" }}
            draggable="false"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
        </figure>
      </div>
      <IntroSequence reduced={reduced} />
    </Screen>
  );
}
