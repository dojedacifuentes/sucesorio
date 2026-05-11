export default function ProgressBar({ value = 0, max = 100, label, tone = "cyan" }) {
  const percent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const fill = {
    cyan: "from-neonCyan to-acid",
    pink: "from-neonPink to-violet-400",
    gold: "from-oldGold to-amber-200",
    blood: "from-blood to-neonPink",
  }[tone];

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-none border border-white/10 bg-black/45">
        <div className={`h-full bg-gradient-to-r ${fill}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
