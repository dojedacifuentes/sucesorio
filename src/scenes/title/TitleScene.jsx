import { useEffect, useMemo } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { solvedCaseIds } from "../../game/progress.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import Icon from "../../ui/Icon.jsx";
import { playSfx } from "../../audio/sfx.js";
import ArcadeLogo, { ArcadeSeal, MoreGamesLink } from "../../brand/ArcadeLogo.jsx";
import { ARCADE } from "../../brand/arcade.js";

export const RUN_LABELS = {
  detective: "Expediente",
  arcade: "Neón de artículos",
  boss: "Duelo",
  memory: "Cementerio de conceptos",
  mnemonics: "Máquina de siglas",
  acervos: "Laboratorio de acervos",
  oral: "Sala oral",
};

/**
 * Portada: el logotipo de EVA ARCADE en bucle, el título del juego y, a un
 * toque, la historia (o su continuación) y la partida rápida.
 */
export default function TitleScene() {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const run = save.run;
  const firstTime = !save.profile.firstVisitAt;

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
      return { label: "Continuar", detail: run.title ?? RUN_LABELS[run.scene] ?? "Partida en curso", action: () => go(run.scene, run.param ?? null) };
    }
    if (firstTime || !save.cases?.premuerto) {
      return { label: firstTime ? "Empezar" : "Jugar", detail: "Expediente 01 · El hijo premuerto", action: () => go("detective", "premuerto") };
    }
    return { label: "Jugar", detail: "Elige sala en el archivo", action: () => go("hub") };
  }, [run, firstTime, save.cases, go]);

  const start = () => {
    playSfx("confirm");
    primary.action();
  };
  const quick = () => {
    playSfx("confirm");
    go("arcade", "rapida");
  };

  const wide = vp.layout !== "stack";
  const narrow = vp.width < 440;

  return (
    <Screen
      brandOnly
      dock={
        <>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={start} data-autofocus="">
            <Icon name="play" />
            <span>{primary.label}</span>
          </button>
          <button type="button" className="btn btn-cyan min-w-0 flex-1" onClick={quick}>
            <Icon name="bolt" />
            <span>{narrow ? "Rápida" : "Partida rápida"}</span>
          </button>
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => go("hub")} aria-label="Archivo: todas las salas" title="Archivo">
            <Icon name="archive" />
          </button>
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => open("settings")} aria-label="Ajustes" title="Ajustes">
            <Icon name="gear" />
          </button>
        </>
      }
    >
      {wide ? (
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-6">
          <TitleCopy primary={primary} big tiny={vp.height < 560} />
          <div className="grid h-full min-h-0 place-items-center">
            <ArcadeLogo className="h-full max-h-[520px]" />
          </div>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-2">
          <div className="grid min-h-0 place-items-center">
            <ArcadeLogo className="h-full" />
          </div>
          <TitleCopy primary={primary} tiny={vp.height < 640} />
        </div>
      )}
    </Screen>
  );
}

function TitleCopy({ primary, big = false, tiny = false }) {
  return (
    <div className="col min-w-0 justify-center gap-2">
      <p className="flex items-center gap-2">
        <ArcadeSeal />
        <span className="sr-only">un juego de {ARCADE.nombre}</span>
      </p>
      <h1 className="title-display tracking-[0.06em] text-ink" style={{ fontSize: big ? "min(4.75rem, 12vh, 7vw)" : "min(3.25rem, 8vh, 14vw)" }}>
        LEX <span className="text-magenta">MORTIS</span>
      </h1>
      <p className={`max-w-[36ch] leading-snug text-dim ${tiny ? "text-[0.9375rem]" : "text-[1.0625rem]"}`}>
        Expedientes de la <strong className="font-semibold text-ink">Notaría Nocturna 404</strong>. Investiga, decide y descubre quién hereda.
      </p>
      <p className="label text-cyan">
        <span className="text-faint">Siguiente · </span>
        {primary.detail}
      </p>
      {big && !tiny && (
        <div className="mt-2">
          <MoreGamesLink />
        </div>
      )}
    </div>
  );
}
