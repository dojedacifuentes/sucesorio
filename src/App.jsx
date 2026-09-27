import { Suspense, lazy, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { GameProvider, useGame } from "./game/store.jsx";
import { NavProvider, useNav } from "./game/nav.jsx";
import { EvaProvider } from "./eva/EvaProvider.jsx";
import { useViewport } from "./ui/useViewport.js";
import { ViewportContext } from "./ui/Screen.jsx";
import { audio } from "./audio/sfx.js";
import TitleScene from "./scenes/title/TitleScene.jsx";
import HubScene from "./scenes/hub/HubScene.jsx";
import PauseOverlay from "./scenes/overlays/PauseOverlay.jsx";
import SettingsOverlay from "./scenes/overlays/SettingsOverlay.jsx";
import EvaOverlay from "./scenes/overlays/EvaOverlay.jsx";
import SaveNotice from "./scenes/overlays/SaveNotice.jsx";

const CodexOverlay = lazy(() => import("./scenes/codex/CodexOverlay.jsx"));
const ArcadeScene = lazy(() => import("./scenes/arcade/ArcadeScene.jsx"));
const ResultsScene = lazy(() => import("./scenes/results/ResultsScene.jsx"));
const DetectiveScene = lazy(() => import("./scenes/detective/DetectiveScene.jsx"));
const BossScene = lazy(() => import("./scenes/boss/BossScene.jsx"));
const MemoryScene = lazy(() => import("./scenes/memory/MemoryScene.jsx"));
const MnemonicsScene = lazy(() => import("./scenes/mnemonics/MnemonicsScene.jsx"));
const AcervosScene = lazy(() => import("./scenes/acervos/AcervosScene.jsx"));
const OralScene = lazy(() => import("./scenes/oral/OralScene.jsx"));
const ProgressScene = lazy(() => import("./scenes/progress/ProgressScene.jsx"));

const SCENES = {
  title: TitleScene,
  hub: HubScene,
  arcade: ArcadeScene,
  detective: DetectiveScene,
  boss: BossScene,
  memory: MemoryScene,
  mnemonics: MnemonicsScene,
  acervos: AcervosScene,
  oral: OralScene,
  progress: ProgressScene,
  results: ResultsScene,
};

const OVERLAYS = {
  pause: PauseOverlay,
  settings: SettingsOverlay,
  eva: EvaOverlay,
  codex: CodexOverlay,
};

export default function App() {
  return (
    <GameProvider>
      <NavProvider>
        <EvaProvider>
          <Shell />
        </EvaProvider>
      </NavProvider>
    </GameProvider>
  );
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function Shell() {
  const vp = useViewport();
  const { save } = useGame();
  const { scene, overlays, open } = useNav();
  const { settings } = save;
  const reduced = settings.effects === "reduced" || (settings.effects === "auto" && prefersReducedMotion());

  useEffect(() => {
    document.documentElement.style.setProperty("--text-scale", String(settings.textScale ?? 1));
  }, [settings.textScale]);

  useEffect(() => {
    audio.configure({ volume: settings.volume, muted: !settings.sound, ambience: settings.ambience && settings.sound });
  }, [settings.volume, settings.sound, settings.ambience]);

  // El audio solo arranca tras un gesto del jugador.
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Escape abre la pausa (salvo en portada o escribiendo).
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape" || overlays.length) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (scene.id === "title") return;
      open("pause");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlays.length, scene.id, open]);

  const SceneComponent = SCENES[scene.id] ?? HubScene;
  const blocked = overlays.length > 0;

  return (
    <ViewportContext.Provider value={vp}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <div className="game-shell" data-effects={settings.effects} data-layout={vp.layout} data-short={vp.short ? "true" : "false"}>
          <div className="backdrop" aria-hidden="true" data-decor="" />
          <div className="scene-grid" inert={blocked ? "" : undefined} aria-hidden={blocked ? "true" : undefined}>
            <Suspense fallback={<Loading />}>
              <SceneComponent key={`${scene.id}-${scene.param ?? ""}-${scene.nonce ?? 0}`} param={scene.param} sceneId={scene.id} />
            </Suspense>
          </div>
          {overlays.map((overlay, index) => {
            const Overlay = OVERLAYS[overlay.id];
            if (!Overlay) return null;
            const isTop = index === overlays.length - 1;
            return (
              <div key={overlay.id} className="contents" inert={isTop ? undefined : ""}>
                <Suspense fallback={null}>
                  <Overlay {...overlay.params} />
                </Suspense>
              </div>
            );
          })}
          <SaveNotice />
        </div>
      </MotionConfig>
    </ViewportContext.Provider>
  );
}

function Loading() {
  return (
    <div className="row-span-3 grid place-items-center">
      <p className="label">Abriendo archivo…</p>
    </div>
  );
}
