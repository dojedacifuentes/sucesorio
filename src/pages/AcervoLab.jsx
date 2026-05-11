import { useMemo, useState } from "react";
import ArcadeFrame from "../components/ArcadeFrame";
import PixelButton from "../components/PixelButton";
import ProgressBar from "../components/ProgressBar";
import StatPanel from "../components/StatPanel";
import { calculationScenarios } from "../data/advancedContent";
import { buildResult, shuffle } from "../utils/gameLogic";
import { incrementStat } from "../utils/storage";

const tolerance = 0.02;

export default function AcervoLab({ navigate, recordEvent, finishRun }) {
  const scenarios = useMemo(() => shuffle(calculationScenarios), []);
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const scenario = scenarios[index];
  const fields = Object.entries(scenario.answers);

  function updateField(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function check() {
    const results = fields.map(([key, expected]) => {
      const raw = String(values[key] ?? "").replace(",", ".");
      const numeric = Number(raw);
      return { key, expected, numeric, ok: Number.isFinite(numeric) && Math.abs(numeric - expected) <= tolerance };
    });
    const ok = results.every((item) => item.ok);
    setFeedback({ ok, results });
    setCorrect((value) => value + (ok ? 1 : 0));
    setScore((value) => value + (ok ? 260 : 35));
    recordEvent({
      correct: ok,
      module: "acervos-calculo",
      article: scenario.article,
      concept: scenario.title,
      mode: "acervos",
      xp: ok ? 36 : 7,
      feedback: scenario.steps.join(" "),
    });
    if (ok) incrementStat("acervoLabs");
  }

  function next() {
    if (index >= scenarios.length - 1) {
      finishRun(
        buildResult({
          mode: "Acervos",
          title: "Laboratorio de calculo",
          score,
          correct,
          total: scenarios.length,
          message:
            correct >= 9
              ? "La masa hereditaria obedecio. La planilla dejo de sangrar neon."
              : "Hay que repasar la secuencia: separar, deducir, agregar, calcular y recien repartir.",
        }),
      );
      return;
    }
    setIndex((value) => value + 1);
    setValues({});
    setFeedback(null);
  }

  return (
    <ArcadeFrame
      title="Laboratorio de acervos"
      kicker="Calculo sucesorio / cuotas / imputaciones"
      action={<PixelButton variant="ghost" onClick={() => navigate("modes")}>Salir</PixelButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Puntaje" value={score} tone="gold" />
            <StatPanel label="Correctos" value={correct} tone="acid" />
          </div>
          <ProgressBar value={index + 1} max={scenarios.length} label="Expedientes de calculo" tone="cyan" />
          <div className="pixel-corners border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-400">
            Ingresa montos sin signo peso. Acepta decimales con punto o coma. El objetivo no es contabilidad fina:
            es automatizar la estructura mental del calculo sucesorio.
          </div>
        </aside>

        <section className="pixel-corners border border-neonCyan/30 bg-black/40 p-5 shadow-neon">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-oldGold">
            Caso {index + 1}/{scenarios.length} · art. {scenario.article}
          </p>
          <h3 className="mt-2 font-display text-3xl font-black text-white">{scenario.title}</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-300">{scenario.prompt}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {fields.map(([key, expected]) => {
              const result = feedback?.results.find((item) => item.key === key);
              return (
                <label key={key} className="block">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-neonCyan">{labelFor(key)}</span>
                  <input
                    value={values[key] ?? ""}
                    onChange={(event) => updateField(key, event.target.value)}
                    disabled={Boolean(feedback)}
                    className={`mt-2 w-full border bg-black/55 px-4 py-3 text-xl font-black text-white outline-none focus:border-neonCyan ${
                      result ? (result.ok ? "border-acid" : "border-blood") : "border-white/10"
                    }`}
                    inputMode="decimal"
                  />
                  {result && (
                    <p className={`mt-2 text-xs ${result.ok ? "text-acid" : "text-blood"}`}>
                      Esperado: {formatNumber(expected)}
                    </p>
                  )}
                </label>
              );
            })}
          </div>

          {feedback && (
            <div className={`mt-6 pixel-corners border p-4 ${feedback.ok ? "border-acid/50 bg-acid/10" : "border-blood/60 bg-blood/10"}`}>
              <p className="text-sm font-bold text-white">{feedback.ok ? "Calculo correcto." : "Calculo incorrecto. Revisa la ruta:"}</p>
              <ol className="mt-3 grid gap-2 text-sm leading-6 text-zinc-300">
                {scenario.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {!feedback ? (
              <PixelButton variant="primary" onClick={check}>Verificar</PixelButton>
            ) : (
              <PixelButton variant="cyan" onClick={next}>{index >= scenarios.length - 1 ? "Resultados" : "Siguiente"}</PixelButton>
            )}
            <PixelButton
              variant="gold"
              onClick={() =>
                setValues(
                  Object.fromEntries(fields.map(([key, expected]) => [key, String(expected)])),
                )
              }
            >
              Mostrar modelo
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => { setValues({}); setFeedback(null); }}>
              Limpiar
            </PixelButton>
          </div>
        </section>
      </div>
    </ArcadeFrame>
  );
}

function labelFor(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase())
    .replace("AMejora", " a mejora");
}

function formatNumber(value) {
  return Number(value).toLocaleString("es-CL", { maximumFractionDigits: 2 });
}
