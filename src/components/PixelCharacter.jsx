export default function PixelCharacter({ color = "#2cf7ff", skin = "#f0d09a", label = "NPC", className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} aria-label={label}>
      <div className="pixel-character" style={{ "--coat": color, "--skin": skin }} />
      <span className="pixel-corners border border-white/10 bg-black/35 px-3 py-1 text-center text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">
        {label}
      </span>
    </div>
  );
}
