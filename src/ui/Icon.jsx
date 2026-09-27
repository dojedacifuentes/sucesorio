// Iconos lineales propios (trazo 1.8, 24×24), coherentes con el emblema EVA.
const PATHS = {
  menu: "M4 7h16M4 12h16M4 17h16",
  pause: "M9 5v14M15 5v14",
  play: "M8 5l11 7-11 7z",
  close: "M6 6l12 12M18 6L6 18",
  prev: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  up: "M5 15l7-7 7 7",
  down: "M5 9l7 7 7-7",
  check: "M4 12.5l5 5L20 6.5",
  undo: "M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-3",
  reset: "M4 4v6h6M20 20v-6h-6M5.5 15a7 7 0 0011.9 2.6M18.5 9A7 7 0 006.6 6.4",
  sound: "M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12",
  mute: "M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6",
  book: "M5 4h9a4 4 0 014 4v12H9a4 4 0 01-4-4zM5 16a4 4 0 014-4h9",
  hint: "M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0012 3z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  tree: "M12 3v5M12 8H6v4M12 8h6v4M6 12v3M18 12v3M4 15h4v5H4zM16 15h4v5h-4zM10 3h4v5h-4z",
  gavel: "M14 4l6 6M11 7l6 6M8.5 9.5l6 6M3 21l7-7M13 6l5 5-2 2-5-5z",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  timeline: "M4 12h16M7 8v8M12 6v12M17 9v6",
  home: "M4 11l8-7 8 7v9H4zM10 20v-6h4v6",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7 7 0 01-2 1.2l-.3 2h-3.9l-.3-2a7 7 0 01-2-1.2l-1.9.7-2-3.4 1.6-1.2a7 7 0 010-2.3L2.8 10l2-3.4 1.9.7a7 7 0 012-1.2l.3-2h3.9l.3 2a7 7 0 012 1.2l1.9-.7 2 3.4-1.6 1.2a7 7 0 010 2.3z",
  heart: "M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
  backspace: "M9 6h11v12H9l-6-6zM12 9l6 6M18 9l-6 6",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
  swap: "M7 7h12M15 3l4 4-4 4M17 17H5M9 13l-4 4 4 4",
  cards: "M8 4h11v14H8zM5 7v13h11",
  flask: "M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M7 15h10",
  mic: "M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4",
  puzzle: "M10 4a2 2 0 014 0v2h4v4h-2a2 2 0 000 4h2v4h-4v-2a2 2 0 00-4 0v2H6v-4h2a2 2 0 000-4H6V6h4z",
  swords: "M4 4l9 9M4 4v4M4 4h4M20 4l-9 9M20 4v4M20 4h-4M9 15l-4 4M15 15l4 4M7 13l4 4M17 13l-4 4",
  archive: "M3 5h18v4H3zM5 9v10h14V9M10 13h4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.5",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.5",
  exit: "M14 4h6v16h-6M4 12h11M10 7l-5 5 5 5",
  fullscreen: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  keyboard: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
  skull: "M12 3a7 7 0 00-7 7c0 2.4 1.2 4.5 3 5.7V19h8v-3.3c1.8-1.2 3-3.3 3-5.7a7 7 0 00-7-7zM9.5 11h.01M14.5 11h.01M10 19v2M14 19v2",
  target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01",
};

export default function Icon({ name, size = 20, className = "", title, strokeWidth = 1.8 }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  );
}

export const iconNames = Object.keys(PATHS);
