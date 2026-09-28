import type { ReactNode } from "react";
import { C, INK } from "./crayon";

export type Box = { x: number; y: number; w: number; h: number };

export type BubbleDef = {
  id: string;
  name: { en: string; ja: string };
  color: string;
  textColor: string;
  /** default width / height */
  aspect: number;
  /** default width in U */
  width: number;
  /** text area in viewBox units */
  box: (W: number, H: number) => Box;
  draw: (W: number, H: number, c: string) => ReactNode;
};

export const BUBBLE_H = 150;

const SW = 4.5; // visible outline width

/** union outline trick: thick ink stroke underneath, fill on top */
function Union({ fill, children, dash }: { fill: string; children: ReactNode; dash?: string }) {
  return (
    <g>
      <g stroke={INK} strokeWidth={SW * 2} fill={INK} strokeLinejoin="round" strokeDasharray={dash} fillOpacity={dash ? 0 : 1}>
        {children}
      </g>
      <g fill={fill} stroke="none">
        {children}
      </g>
    </g>
  );
}

function ellipseBody(W: number, H: number, tail: number) {
  const top = 7,
    bottom = H - tail;
  const cx = W / 2,
    cy = (top + bottom) / 2;
  const rx = W / 2 - 8,
    ry = (bottom - top) / 2;
  return { cx, cy, rx, ry };
}

function inscribed(cx: number, cy: number, rx: number, ry: number, k = 0.72): Box {
  return { x: cx - rx * k, y: cy - ry * k, w: rx * 2 * k, h: ry * 2 * k };
}

function spikes(W: number, H: number, n: number, inner: number) {
  const cx = W / 2,
    cy = H / 2;
  const rx = W / 2 - 7,
    ry = H / 2 - 7;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const jitter = i % 2 ? 1 : 1 - ((i * 37) % 7) / 60;
    const k = i % 2 ? inner : jitter;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return pts.join(" ");
}

function heartPath(W: number, H: number) {
  const X = (x: number) => (((x - 22) / 156) * (W - 14) + 7).toFixed(1);
  const Y = (y: number) => (((y - 40) / 134) * (H - 14) + 7).toFixed(1);
  return `M${X(100)} ${Y(172)} C${X(40)} ${Y(132)} ${X(20)} ${Y(102)} ${X(30)} ${Y(72)} C${X(40)} ${Y(42)} ${X(80)} ${Y(38)} ${X(100)} ${Y(68)} C${X(120)} ${Y(38)} ${X(160)} ${Y(42)} ${X(170)} ${Y(72)} C${X(180)} ${Y(102)} ${X(160)} ${Y(132)} ${X(100)} ${Y(172)} Z`;
}

export const BUBBLES: BubbleDef[] = [
  {
    id: "talk",
    name: { en: "Talk", ja: "おはなし" },
    color: C.white,
    textColor: INK,
    aspect: 1.5,
    width: 24,
    box: (W, H) => {
      const e = ellipseBody(W, H, 34);
      return inscribed(e.cx, e.cy, e.rx, e.ry);
    },
    draw: (W, H, c) => {
      const e = ellipseBody(W, H, 34);
      return (
        <Union fill={c}>
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
          <path d={`M${W * 0.3} ${e.cy + e.ry * 0.6} L${W * 0.17} ${H - 7} L${W * 0.46} ${e.cy + e.ry * 0.8} Z`} />
        </Union>
      );
    },
  },
  {
    id: "box",
    name: { en: "Square", ja: "しかく" },
    color: C.white,
    textColor: INK,
    aspect: 1.6,
    width: 24,
    box: (W, H) => ({ x: 22, y: 20, w: W - 44, h: H - 76 }),
    draw: (W, H, c) => (
      <Union fill={c}>
        <rect x={7} y={7} width={W - 14} height={H - 42} rx={24} />
        <path d={`M${W * 0.2} ${H - 40} L${W * 0.12} ${H - 7} L${W * 0.36} ${H - 40} Z`} />
      </Union>
    ),
  },
  {
    id: "think",
    name: { en: "Think", ja: "かんがえ" },
    color: C.white,
    textColor: INK,
    aspect: 1.5,
    width: 25,
    box: (W, H) => {
      const cx = W / 2,
        cy = (H - 34) / 2 + 4,
        rx = W / 2 - 30,
        ry = (H - 34) / 2 - 22;
      return inscribed(cx, cy, rx, ry, 0.84);
    },
    draw: (W, H, c) => {
      const cx = W / 2,
        cy = (H - 34) / 2 + 4,
        rx = W / 2 - 30,
        ry = (H - 34) / 2 - 22;
      const r = 23;
      const per = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
      const n = Math.max(8, Math.round(per / 34));
      return (
        <Union fill={c}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2;
            return <circle key={i} cx={cx + Math.cos(a) * rx} cy={cy + Math.sin(a) * ry} r={r} />;
          })}
          <circle cx={W * 0.22} cy={H - 24} r={10} />
          <circle cx={W * 0.13} cy={H - 10} r={6} />
        </Union>
      );
    },
  },
  {
    id: "shout",
    name: { en: "Shout", ja: "さけぶ" },
    color: C.yellow,
    textColor: INK,
    aspect: 1.45,
    width: 25,
    box: (W, H) => inscribed(W / 2, H / 2, W / 2 - 7, H / 2 - 7, 0.5),
    draw: (W, H, c) => (
      <Union fill={c}>
        <polygon points={spikes(W, H, 15, 0.74)} strokeLinejoin="miter" />
      </Union>
    ),
  },
  {
    id: "whisper",
    name: { en: "Whisper", ja: "ひそひそ" },
    color: C.white,
    textColor: INK,
    aspect: 1.5,
    width: 22,
    box: (W, H) => {
      const e = ellipseBody(W, H, 34);
      return inscribed(e.cx, e.cy, e.rx, e.ry);
    },
    draw: (W, H, c) => {
      const e = ellipseBody(W, H, 34);
      return (
        <Union fill={c} dash="12 11">
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
          <path d={`M${W * 0.3} ${e.cy + e.ry * 0.6} L${W * 0.17} ${H - 7} L${W * 0.46} ${e.cy + e.ry * 0.8} Z`} />
        </Union>
      );
    },
  },
  {
    id: "heart",
    name: { en: "Love", ja: "すき" },
    color: C.blush,
    textColor: INK,
    aspect: 1.15,
    width: 20,
    box: (W, H) => ({ x: W * 0.22, y: H * 0.24, w: W * 0.56, h: H * 0.4 }),
    draw: (W, H, c) => (
      <Union fill={c}>
        <path d={heartPath(W, H)} />
      </Union>
    ),
  },
  {
    id: "caption",
    name: { en: "Narration", ja: "ナレーション" },
    color: C.cream,
    textColor: INK,
    aspect: 2.8,
    width: 34,
    box: (W, H) => ({ x: 22, y: 18, w: W - 44, h: H - 36 }),
    draw: (W, H, c) => (
      <g>
        <rect x={13} y={13} width={W - 20} height={H - 20} rx={8} fill={INK} opacity={0.18} />
        <Union fill={c}>
          <rect x={7} y={7} width={W - 20} height={H - 20} rx={8} />
        </Union>
      </g>
    ),
  },
  {
    id: "note",
    name: { en: "Note", ja: "メモ" },
    color: C.lemon,
    textColor: INK,
    aspect: 1.25,
    width: 20,
    box: (W, H) => ({ x: 22, y: 34, w: W - 44, h: H - 56 }),
    draw: (W, H, c) => (
      <g>
        <Union fill={c}>
          <path d={`M10 18 L${W - 10} 14 L${W - 12} ${H - 10} L${W * 0.3} ${H - 7} L12 ${H - 14} Z`} />
        </Union>
        <rect x={W / 2 - 34} y={2} width={68} height={24} fill={C.sky} opacity={0.65} transform={`rotate(-5 ${W / 2} 14)`} />
      </g>
    ),
  },
  {
    id: "banner",
    name: { en: "Banner", ja: "リボン" },
    color: C.red,
    textColor: C.white,
    aspect: 3.6,
    width: 40,
    box: (W, H) => ({ x: W * 0.14, y: 26, w: W * 0.72, h: H - 58 }),
    draw: (W, H, c) => (
      <g>
        <Union fill={c}>
          <path d={`M7 42 L${W * 0.16} 42 L${W * 0.16} ${H - 7} L7 ${H - 7} L${W * 0.07} ${(42 + H - 7) / 2} Z`} />
          <path d={`M${W - 7} 42 L${W * 0.84} 42 L${W * 0.84} ${H - 7} L${W - 7} ${H - 7} L${W * 0.93} ${(42 + H - 7) / 2} Z`} />
        </Union>
        <path d={`M7 42 L${W * 0.16} 42 L${W * 0.16} ${H - 7} L7 ${H - 7} L${W * 0.07} ${(42 + H - 7) / 2} Z M${W - 7} 42 L${W * 0.84} 42 L${W * 0.84} ${H - 7} L${W - 7} ${H - 7} L${W * 0.93} ${(42 + H - 7) / 2} Z`} fill="#000" opacity={0.18} />
        <Union fill={c}>
          <rect x={W * 0.12} y={10} width={W * 0.76} height={H - 42} rx={4} />
        </Union>
      </g>
    ),
  },
];

export const BUBBLE_MAP: Record<string, BubbleDef> = Object.fromEntries(BUBBLES.map((b) => [b.id, b]));

export function BubbleSvg({ def, W, H, color, flip }: { def: BubbleDef; W: number; H: number; color: string; flip?: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${W.toFixed(1)} ${H}`}
      preserveAspectRatio="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      className="bubble-svg"
      aria-hidden
    >
      <g filter="url(#cr-soft-w)" className="svg-base">
        {def.draw(W, H, color)}
      </g>
      <g filter="url(#cr-soft)">{def.draw(W, H, color)}</g>
    </svg>
  );
}
