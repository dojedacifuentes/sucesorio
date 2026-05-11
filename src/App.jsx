import { useCallback, useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ModeSelect from "./pages/ModeSelect";
import ArcadeMode from "./pages/ArcadeMode";
import DetectiveMode from "./pages/DetectiveMode";
import BossFight from "./pages/BossFight";
import MemoryMode from "./pages/MemoryMode";
import MnemonicsMode from "./pages/MnemonicsMode";
import OralMode from "./pages/OralMode";
import AcervoLab from "./pages/AcervoLab";
import Codex from "./pages/Codex";
import Progress from "./pages/Progress";
import Results from "./pages/Results";
import { loadProgress, recordLearningEvent, saveResult } from "./utils/storage";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [progress, setProgress] = useState(() => loadProgress());

  const refreshProgress = useCallback(() => setProgress(loadProgress()), []);

  const navigate = useCallback((view) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentView(view);
    setProgress(loadProgress());
  }, []);

  const recordEvent = useCallback((event) => {
    const next = recordLearningEvent(event);
    setProgress(next);
    return next;
  }, []);

  const finishRun = useCallback(
    (result) => {
      const next = saveResult(result);
      setProgress(next);
      setCurrentView("results");
    },
    [],
  );

  const pageProps = {
    navigate,
    progress,
    refreshProgress,
    recordEvent,
    finishRun,
  };

  const page = {
    home: <Home {...pageProps} />,
    modes: <ModeSelect {...pageProps} />,
    arcade: <ArcadeMode {...pageProps} />,
    detective: <DetectiveMode {...pageProps} />,
    boss: <BossFight {...pageProps} />,
    memory: <MemoryMode {...pageProps} />,
    mnemonics: <MnemonicsMode {...pageProps} />,
    oral: <OralMode {...pageProps} />,
    acervos: <AcervoLab {...pageProps} />,
    codex: <Codex {...pageProps} />,
    progress: <Progress {...pageProps} />,
    results: <Results {...pageProps} />,
  }[currentView] ?? <Home {...pageProps} />;

  return (
    <Layout currentView={currentView} navigate={navigate} progress={progress}>
      {page}
    </Layout>
  );
}
