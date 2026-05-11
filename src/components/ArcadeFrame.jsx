import { motion } from "framer-motion";

export default function ArcadeFrame({ title, kicker, action, children, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className={`arcade-panel pixel-corners pixel-border overflow-hidden ${className}`}
    >
      {(title || kicker || action) && (
        <header className="flex flex-col gap-4 border-b border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between md:p-5">
          <div>
            {kicker && <p className="text-xs font-bold uppercase tracking-[0.24em] text-neonCyan">{kicker}</p>}
            {title && <h2 className="mt-1 font-display text-2xl font-black text-amber-50 md:text-3xl">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </motion.section>
  );
}
