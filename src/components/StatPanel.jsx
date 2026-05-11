export default function StatPanel({ label, value, detail, tone = "cyan" }) {
  const toneClass = {
    cyan: "text-neonCyan border-neonCyan/35",
    pink: "text-neonPink border-neonPink/35",
    gold: "text-oldGold border-oldGold/40",
    acid: "text-acid border-acid/35",
    blood: "text-blood border-blood/40",
  }[tone];

  return (
    <div className={`pixel-corners border bg-black/25 p-4 ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-current">{value}</p>
      {detail && <p className="mt-1 text-xs leading-relaxed text-zinc-400">{detail}</p>}
    </div>
  );
}
