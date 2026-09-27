import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../../game/store.jsx";
import { useNav } from "../../game/nav.jsx";
import { useEva } from "../../eva/EvaProvider.jsx";
import { BOSSES, bossById, moduleTitle } from "../../game/content.js";
import { recordAnswer } from "../../game/progress.js";
import { finishRun, saveRun } from "../../game/session.js";
import { hashSeed, newSeed, seededShuffle } from "../../game/rng.js";
import Screen, { useLayout } from "../../ui/Screen.jsx";
import FitPager from "../../ui/FitPager.jsx";
import Choices from "../../ui/Choices.jsx";
import Verdict from "../../ui/Verdict.jsx";
import Icon from "../../ui/Icon.jsx";
import { useKeys } from "../../ui/hooks.js";
import { playSfx } from "../../audio/sfx.js";

const HEARTS = 3;
const REVEAL_MS = 450;

export default function BossScene({ param }) {
  const boss = param ? bossById(param) : null;
  if (!boss) return <BossSelect />;
  return <Duel key={boss.id} boss={boss} />;
}

function BossSelect() {
  const { save } = useGame();
  const { go } = useNav();
  const vp = useLayout();
  const beaten = new Set(save.campaign?.bossesDefeated ?? []);
  const cols = vp.width >= 1000 ? 3 : vp.width >= 600 ? 2 : 1;
  const next = BOSSES.find((b) => !beaten.has(b.id)) ?? BOSSES[0];
  const items = useMemo(() => {
    const rows = [];
    for (let i = 0; i < BOSSES.length; i += cols) rows.push(BOSSES.slice(i, i + cols));
    return rows.map((row, r) => ({
      id: `r${r}`,
      render: () => (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {row.map((b) => (
            <button key={b.id} type="button" className={`choice items-center ${b.id === next.id ? "is-selected" : ""}`} onClick={() => go("boss", b.id)}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2" style={{ borderColor: b.color, color: b.color }}>
                <Icon name="swords" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-ink">{b.name}</span>
                <span className="block text-[0.8125rem] leading-snug text-dim">{b.subtitle}</span>
              </span>
              {beaten.has(b.id) && <span className="chip chip-ok">Derrotado</span>}
            </button>
          ))}
        </div>
      ),
    }));
  }, [cols, go, beaten, next.id]);
  return (
    <Screen
      title="Duelos"
      subtitle={`${beaten.size} de ${BOSSES.length} derrotados`}
      dock={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => go("hub")}>
            <Icon name="prev" />
            <span>Archivo</span>
          </button>
          <button type="button" className="btn btn-primary min-w-0 flex-1" onClick={() => go("boss", next.id)} data-autofocus="">
            <Icon name="swords" />
            <span className="truncate-safe">Retar a {next.name}</span>
          </button>
        </>
      }
    >
      <FitPager items={items} gap={8} pageKey="bosses" label="Rivales" />
    </Screen>
  );
}

function freshDuel(boss) {
  const seed = newSeed();
  return {
    seed,
    queue: boss.questions.map((q) => q.id),
    retried: [],
    turn: 0,
    hp: 100,
    hearts: HEARTS,
    phase2: false,
    stage: "intro", // intro · attack · verdict · over
    last: null,
    log: [],
    correct: 0,
    answered: 0,
    assisted: 0,
  };
}

function Duel({ boss }) {
  const { save, update } = useGame();
  const { go, open } = useNav();
  const { say } = useEva();
  const vp = useLayout();
  const resumable = save.run?.scene === "boss" && save.run.param === boss.id && save.run.state?.stage;
  const [d, setD] = useState(() => (resumable ? save.run.state : freshDuel(boss)));
  const [reveal, setReveal] = useState(null);
  const [fx, setFx] = useState(null);
  const [evaLine, setEvaLine] = useState(null);
  const locked = useRef(false);
  const hit = 100 / boss.questions.length;
  const q = boss.questions.find((x) => x.id === d.queue[d.turn]);
  const options = useMemo(() => (q ? seededShuffle(q.options, hashSeed(`${d.seed}:${q.id}`)) : []), [q, d.seed]);
  // El ataque del rival: una confusión típica (una alternativa equivocada del propio banco).
  const attack = q ? seededShuffle(q.options.filter((o) => o !== q.answer), hashSeed(`${d.seed}:atk:${q.id}`))[0] : null;
  const retry = q && d.retried.includes(q.id) && d.log.some((e) => e.id === q.id);

  useEffect(() => {
    update((s) => saveRun(s, { scene: "boss", param: boss.id, title: `Duelo: ${boss.name}`, state: d }));
  }, [d, update, boss.id, boss.name]);

  useEffect(() => {
    if (!resumable) say("bossIntro", { boss: boss.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answer = useCallback(
    (option) => {
      if (d.stage !== "attack" || locked.current || !q) return;
      locked.current = true;
      const ok = option === q.answer;
      setReveal({ picked: option, answer: q.answer });
      setFx(ok ? "hit" : "damage");
      playSfx(ok ? "hit" : "damage");
      update((s) => recordAnswer(s, { key: `boss:${d.seed}:${q.id}:${retry ? "r" : "1"}`, correct: ok, assisted: Boolean(retry), module: boss.module, article: q.article, concept: boss.subtitle, mode: "boss", feedback: q.feedback, xp: ok ? (retry ? 6 : 18) : 2 }));
      const hp = ok ? Math.max(0, Math.round(d.hp - hit)) : d.hp;
      const hearts = ok ? d.hearts : d.hearts - 1;
      const phase2 = !d.phase2 && hp <= 60 && hp > 0;
      let line = null;
      if (hp <= 0) line = say("bossWin", { boss: boss.name });
      else if (hearts <= 0) line = say("bossLose", { boss: boss.name });
      else if (phase2) line = say("bossPhase", { boss: boss.name });
      else line = ok ? say("success") : say("error", { why: "El ataque era una confusión: no la aceptes." });
      setEvaLine(line ? { text: line.text, mood: line.mood } : null);
      window.setTimeout(() => {
        setD((s) => {
          const queue = [...s.queue];
          const retried = [...s.retried];
          // Una pregunta fallada vuelve al final una vez (segunda oportunidad, con ayuda).
          if (!ok && !retried.includes(q.id)) {
            queue.push(q.id);
            retried.push(q.id);
          }
          return {
            ...s,
            queue,
            retried,
            hp,
            hearts,
            phase2: s.phase2 || phase2,
            stage: "verdict",
            last: { ok, picked: option, phase2 },
            log: [...s.log, { id: q.id, ok, picked: option }],
            correct: s.correct + (ok ? 1 : 0),
            answered: s.answered + 1,
            assisted: s.assisted + (ok && retry ? 1 : 0),
          };
        });
        setReveal(null);
        setFx(null);
        locked.current = false;
      }, REVEAL_MS);
    },
    [d, q, retry, hit, boss, update, say],
  );

  const finish = useCallback(
    (won) => {
      update((s) => {
        let next = finishRun(s, {
          id: `boss:${d.seed}`,
          mode: "boss",
          title: `Duelo: ${boss.name}`,
          correct: d.correct,
          answered: d.answered,
          assisted: d.assisted,
          outcome: won ? "victoria" : "derrota",
          message: won ? `${boss.name} cae. No por fuerza: por precisión.` : `${boss.name} resistió. Los ataques que te dolieron son justo los conceptos que conviene repasar.`,
          details: d.log.map((e) => {
            const qq = boss.questions.find((x) => x.id === e.id);
            return { label: qq.prompt, ok: e.ok, note: e.ok ? qq.answer : `Correcta: ${qq.answer} · elegiste ${e.picked}` };
          }),
          replay: { scene: "boss", param: boss.id, label: won ? "Revancha" : "Reintentar el duelo" },
        });
        if (won) {
          const beaten = new Set(next.campaign?.bossesDefeated ?? []);
          const first = !beaten.has(boss.id);
          beaten.add(boss.id);
          next = { ...next, campaign: { ...next.campaign, bossesDefeated: [...beaten] } };
          if (first) next = { ...next, profile: { ...next.profile, stats: { ...next.profile.stats, bossKills: (next.profile.stats.bossKills ?? 0) + 1 } } };
        }
        return next;
      });
      playSfx(won ? "solve" : "damage");
      go("results", null, { replace: true });
    },
    [d, boss, update, go],
  );

  const next = useCallback(() => {
    if (d.stage !== "verdict") return;
    if (d.hp <= 0) return finish(true);
    if (d.hearts <= 0) return finish(false);
    if (d.turn + 1 >= d.queue.length) return finish(false);
    playSfx(d.last?.phase2 ? "phase" : "page");
    setD((s) => ({ ...s, stage: "attack", turn: s.turn + 1, last: null }));
  }, [d, finish]);

  useKeys({ Enter: () => (d.stage === "intro" ? setD((s) => ({ ...s, stage: "attack" })) : next()) });

  const narrow = vp.width < 420;
  const low = vp.height < 560;
  const hud = (
    <>
      <span className="chip chip-bad tabular-nums" aria-label={`${d.hearts} vidas`}>
        <Icon name="heart" size={15} /> {d.hearts}
      </span>
      {d.phase2 && <span className="chip chip-warn">Fase 2</span>}
    </>
  );

  const bossCard = (
    <section className={`panel flex shrink-0 items-center gap-3 ${low ? "px-3 py-1.5" : "p-3"} ${fx === "hit" ? "boss-hit" : ""}`} style={{ borderColor: boss.color }} aria-label={`${boss.name}: ${Math.round(d.hp)} % de resistencia`}>
      {!low && (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2" style={{ borderColor: boss.color, color: boss.color, boxShadow: `0 0 18px ${boss.color}55` }}>
          <Icon name="swords" size={24} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="title-display leading-tight text-ink">{boss.name}</p>
        {!low && <p className="label leading-tight">{boss.subtitle}</p>}
        <div className="meter mt-1.5">
          <span style={{ width: `${d.hp}%`, background: boss.color }} />
        </div>
      </div>
      <p className="title-display w-12 shrink-0 text-right text-lg tabular-nums text-ink">{Math.round(d.hp)}%</p>
    </section>
  );

  if (d.stage === "intro") {
    return (
      <Screen
        title={`Duelo · ${boss.name}`}
        subtitle={moduleTitle(boss.module)}
        hud={hud}
        eva="compact"
        dock={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => go("boss")}>
              <Icon name="prev" />
              <span className={narrow ? "sr-only" : ""}>Rivales</span>
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={() => { playSfx("phase"); setD((s) => ({ ...s, stage: "attack" })); }} data-autofocus="">
              <Icon name="swords" />
              <span>Empezar el duelo</span>
            </button>
          </>
        }
      >
        <div className="col min-h-0 flex-1 justify-center gap-3">
          {bossCard}
          <p className="text-[1.0625rem] leading-relaxed text-ink">{boss.intro}</p>
          <p className="text-[0.9375rem] leading-snug text-dim">
            Cada turno, {boss.name} lanza una confusión. Respóndele con lo correcto: cada acierto le quita resistencia; cada error te cuesta una vida. Lo que falles vuelve al final una vez.
          </p>
        </div>
      </Screen>
    );
  }

  const inVerdict = d.stage === "verdict";
  return (
    <Screen
      title={`Duelo · ${boss.name}`}
      subtitle={`Turno ${d.turn + 1}${retry ? " · segunda oportunidad" : ""}`}
      hud={hud}
      eva="compact"
      dock={
        inVerdict ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => open("pause")} aria-label="Pausa">
              <Icon name="pause" />
            </button>
            <button type="button" className="btn btn-primary flex-1" onClick={next} data-autofocus="">
              <span>{d.hp <= 0 ? "Victoria" : d.hearts <= 0 || d.turn + 1 >= d.queue.length ? "Ver resultado" : "Siguiente ataque"}</span>
              <Icon name="next" />
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-ghost" onClick={() => open("pause")}>
              <Icon name="pause" />
              <span>Pausa</span>
            </button>
            <p className="label flex-1 text-right">Sin reloj: piensa</p>
          </>
        )
      }
    >
      <div className={`col min-h-0 flex-1 gap-2 ${fx === "damage" ? "player-hit" : ""}`}>
        {!(inVerdict && (low || vp.height < 700)) && bossCard}
        {inVerdict ? (
          <Verdict
            resetKey={`${d.turn}`}
            tone={d.last?.ok ? "ok" : "bad"}
            verdict={d.last?.ok ? (d.hp <= 0 ? "Golpe final" : d.last.phase2 ? "Impacto · cambia de fase" : "Impacto") : d.hearts <= 0 ? "Sin vidas" : "Te alcanzó"}
            picked={d.last?.picked}
            answer={q.answer}
            what={q.prompt}
            why={q.feedback}
            article={q.article}
            concept={boss.subtitle}
            eva={evaLine}
          />
        ) : (
          <section className="panel col min-h-0 flex-1 gap-2 p-3" key={`${q.id}-${d.turn}`}>
            <p className="shrink-0 text-[0.9375rem] leading-snug text-ink">
              <span className="label mr-1" style={{ color: boss.color }}>
                Ataque
              </span>
              {boss.name} grita: <strong className="text-bad">«{attack}»</strong>
            </p>
            <div className="col min-h-0 flex-1">
              <FitPager items={[{ id: q.id, text: q.prompt, render: (t) => <h2 className="title-display text-[1.25rem] leading-snug text-ink md:text-[1.5rem]">{t}</h2> }]} resetOn={`${q.id}-${d.turn}`} label="Enunciado" />
            </div>
            <Choices options={options} onPick={answer} disabled={Boolean(reveal)} reveal={reveal} columns={low ? 2 : undefined} />
          </section>
        )}
      </div>
    </Screen>
  );
}
