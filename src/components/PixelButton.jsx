import { motion } from "framer-motion";

const variants = {
  primary: "border-neonPink/70 bg-neonPink/14 text-white shadow-pink hover:bg-neonPink/24",
  cyan: "border-neonCyan/70 bg-neonCyan/12 text-white shadow-neon hover:bg-neonCyan/22",
  gold: "border-oldGold/75 bg-oldGold/12 text-amber-50 shadow-gold hover:bg-oldGold/20",
  danger: "border-blood/80 bg-blood/14 text-red-50 hover:bg-blood/24",
  ghost: "border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10",
};

export default function PixelButton({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { y: -2, scale: 1.01 }}
      whileTap={disabled ? undefined : { y: 1, scale: 0.99 }}
      disabled={disabled}
      className={`pixel-corners border px-4 py-3 text-left text-sm font-black uppercase tracking-[0.08em] transition focus:outline-none focus:ring-2 focus:ring-neonCyan disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
