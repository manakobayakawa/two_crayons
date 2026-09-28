import type { ReactNode } from "react";

const I = ({ children, size = 22 }: { children: ReactNode; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ width: size, height: size }}>
    {children}
  </svg>
);

export const Icon = {
  undo: () => (
    <I>
      <path d="M9 14 4 9.5 9 5" />
      <path d="M4.5 9.6h9.8a5.2 5.2 0 0 1 0 10.4H11" />
    </I>
  ),
  redo: () => (
    <I>
      <path d="m15 14 5-4.5L15 5" />
      <path d="M19.5 9.6H9.7a5.2 5.2 0 0 0 0 10.4H13" />
    </I>
  ),
  trash: () => (
    <I>
      <path d="M4.5 6.5h15M9.5 6.3V4.2h5v2.1M6.3 6.8l1 13h9.4l1-13M10 10.5v6M14 10.5v6" />
    </I>
  ),
  copy: () => (
    <I>
      <rect x="8.5" y="8.3" width="11.5" height="11.6" rx="2.2" />
      <path d="M15.5 8.2V5.8a1.9 1.9 0 0 0-1.9-1.9H5.9A1.9 1.9 0 0 0 4 5.8v7.7a1.9 1.9 0 0 0 1.9 1.9h2.4" />
    </I>
  ),
  flip: () => (
    <I>
      <path d="M12 3v18" strokeDasharray="2 3" />
      <path d="M9 7 3.5 17.5H9zM15 7l5.5 10.5H15z" />
    </I>
  ),
  up: () => (
    <I>
      <path d="M5 16.5 12 20l7-3.5" />
      <path d="M12 4 5 7.6l7 3.6 7-3.6z" fill="currentColor" fillOpacity={0.25} />
      <path d="M5 12l7 3.6 7-3.6" />
    </I>
  ),
  down: () => (
    <I>
      <path d="M5 7.5 12 4l7 3.5" />
      <path d="M12 20 5 16.4l7-3.6 7 3.6z" fill="currentColor" fillOpacity={0.25} />
      <path d="M5 12l7-3.6 7 3.6" />
    </I>
  ),
  book: () => (
    <I>
      <path d="M12 6.4C9.6 4.6 6.6 4.3 3.4 5v13.5c3.2-.7 6.2-.4 8.6 1.4 2.4-1.8 5.4-2.1 8.6-1.4V5c-3.2-.7-6.2-.4-8.6 1.4zM12 6.4v13.4" />
    </I>
  ),
  link: () => (
    <I>
      <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1.2 1.2" />
      <path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1.2-1.2" />
    </I>
  ),
  heart: () => (
    <I>
      <path d="M12 20s-7.8-4.6-8.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 20.5 10C19.8 15.4 12 20 12 20z" fill="currentColor" fillOpacity={0.9} />
    </I>
  ),
  plus: () => (
    <I>
      <path d="M12 5v14M5 12h14" />
    </I>
  ),
  left: () => (
    <I>
      <path d="M15 5 8 12l7 7" />
    </I>
  ),
  right: () => (
    <I>
      <path d="m9 5 7 7-7 7" />
    </I>
  ),
  print: () => (
    <I>
      <path d="M7 9V3.8h10V9M7 17.5H4.5v-7a1.6 1.6 0 0 1 1.6-1.6h11.8a1.6 1.6 0 0 1 1.6 1.6v7H17" />
      <rect x="7" y="14" width="10" height="6.5" rx="1" />
    </I>
  ),
  pencil: () => (
    <I>
      <path d="m15.2 5.2 3.6 3.6M4 20l1-4.6L16.2 4.2a2 2 0 0 1 2.9 0l.7.7a2 2 0 0 1 0 2.9L8.6 19 4 20z" />
    </I>
  ),
  close: () => (
    <I>
      <path d="M6 6l12 12M18 6 6 18" />
    </I>
  ),
  home: () => (
    <I>
      <path d="M4 11.2 12 4.5l8 6.7M6.2 9.8V19.5h11.6V9.8M10 19.5v-5h4v5" />
    </I>
  ),
  sound: () => (
    <I>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </I>
  ),
  mute: () => (
    <I>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </I>
  ),
  eye: () => (
    <I>
      <path d="M2.8 12S6 5.8 12 5.8 21.2 12 21.2 12 18 18.2 12 18.2 2.8 12 2.8 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </I>
  ),
  text: () => (
    <I>
      <path d="M5 6.5V5h14v1.5M12 5v14M9 19h6" />
    </I>
  ),
  bigger: () => (
    <I>
      <path d="M3.5 18 8 6l4.5 12M5.2 14h5.6M16 9v6M13 12h6" />
    </I>
  ),
  smaller: () => (
    <I>
      <path d="M3.5 18 8 6l4.5 12M5.2 14h5.6M13 12h6" />
    </I>
  ),
  rotate: () => (
    <I size={16}>
      <path d="M19 12a7 7 0 1 1-2.1-5" />
      <path d="M19.5 4.5v4h-4" />
    </I>
  ),
  more: () => (
    <I>
      <circle cx="5.5" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="18.5" cy="12" r="1.3" fill="currentColor" />
    </I>
  ),
  parts: () => (
    <I>
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <circle cx="16.5" cy="7.5" r="3.5" />
      <path d="M7.5 13.5 4 20h7zM13.5 14h7v6h-7z" />
    </I>
  ),
};

/** A small crayon, used as the partner's cursor */
export function CrayonCursor({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" width={34} height={34} style={{ width: 34, height: 34 }} aria-hidden>
      <g transform="rotate(-45 20 20)">
        <path d="M20 2 L25 12 L15 12 Z" fill={color} stroke="#4a3a3a" strokeWidth={1.8} strokeLinejoin="round" />
        <rect x={14.5} y={12} width={11} height={24} rx={2} fill={color} stroke="#4a3a3a" strokeWidth={1.8} />
        <rect x={14.5} y={17} width={11} height={11} fill="#fffdf8" opacity={0.85} />
        <path d="M16 20.5h8M16 24.5h8" stroke={color} strokeWidth={1.6} />
      </g>
    </svg>
  );
}
