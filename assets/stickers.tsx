import type { ReactNode } from "react";
import { C, INK } from "./crayon";

export type StickerCat = "characters" | "nature" | "things";

export type StickerDef = {
  id: string;
  cat: StickerCat;
  name: { en: string; ja: string };
  /** viewBox: minX minY width height */
  vb: [number, number, number, number];
  /** default main colour; recolourable part uses the item colour */
  color: string;
  draw: (c: string) => ReactNode;
};

// outline props
const O = { stroke: INK, strokeWidth: 4.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const L = (w = 4.5) => ({ stroke: INK, strokeWidth: w, strokeLinejoin: "round", strokeLinecap: "round", fill: "none" }) as const;
const SKIN = "#ffd9bf";
const HAIR = "#6b4232";
const DARK = "#6b4232";

/** Eyes with a tiny highlight – gives everything the same friendly face. */
function Eye({ x, y, r = 5.2 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x + r * 0.35} cy={y - r * 0.38} r={r * 0.32} fill="#fff" />
    </g>
  );
}
function Cheek({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={C.pink} opacity={0.85} />;
}
/** Union outline: draw thick ink strokes of all parts first, then fills on top. */
function Blob({ fill, children, w = 9 }: { fill: string; children: ReactNode; w?: number }) {
  return (
    <g>
      <g stroke={INK} strokeWidth={w} fill={INK} strokeLinejoin="round">
        {children}
      </g>
      <g fill={fill} stroke="none">
        {children}
      </g>
      <g fill="url(#hatch)" stroke="none">
        {children}
      </g>
    </g>
  );
}

export const STICKERS: StickerDef[] = [
  // ───────────── characters ─────────────
  {
    id: "bear",
    cat: "characters",
    name: { en: "Bear", ja: "くま" },
    vb: [0, 0, 200, 205],
    color: C.brown,
    draw: (c) => (
      <g>
        <ellipse cx={62} cy={150} rx={13} ry={21} transform="rotate(25 62 150)" fill={c} {...O} />
        <ellipse cx={138} cy={150} rx={13} ry={21} transform="rotate(-25 138 150)" fill={c} {...O} />
        <ellipse cx={100} cy={160} rx={44} ry={36} fill={c} {...O} />
        <ellipse cx={100} cy={166} rx={25} ry={21} fill={C.tan} />
        <ellipse cx={78} cy={193} rx={17} ry={9} fill={c} {...O} />
        <ellipse cx={122} cy={193} rx={17} ry={9} fill={c} {...O} />
        <circle cx={60} cy={50} r={22} fill={c} {...O} />
        <circle cx={140} cy={50} r={22} fill={c} {...O} />
        <circle cx={60} cy={50} r={10} fill={C.tan} />
        <circle cx={140} cy={50} r={10} fill={C.tan} />
        <ellipse cx={100} cy={92} rx={57} ry={50} fill={c} {...O} />
        <ellipse cx={100} cy={109} rx={22} ry={16} fill={C.tan} />
        <ellipse cx={100} cy={101} rx={8} ry={6} fill={INK} />
        <path d="M100 107 q0 8 -7 9 M100 107 q0 8 7 9" {...L(3.5)} />
        <Eye x={80} y={86} />
        <Eye x={120} y={86} />
        <Cheek x={68} y={104} />
        <Cheek x={132} y={104} />
      </g>
    ),
  },
  {
    id: "bunny",
    cat: "characters",
    name: { en: "Bunny", ja: "うさぎ" },
    vb: [0, 0, 200, 205],
    color: C.white,
    draw: (c) => (
      <g>
        <ellipse cx={78} cy={48} rx={15} ry={38} transform="rotate(-10 78 48)" fill={c} {...O} />
        <ellipse cx={122} cy={48} rx={15} ry={38} transform="rotate(10 122 48)" fill={c} {...O} />
        <ellipse cx={78} cy={50} rx={6} ry={25} transform="rotate(-10 78 50)" fill={C.pink} />
        <ellipse cx={122} cy={50} rx={6} ry={25} transform="rotate(10 122 50)" fill={C.pink} />
        <ellipse cx={100} cy={166} rx={38} ry={30} fill={c} {...O} />
        <ellipse cx={66} cy={160} rx={10} ry={15} transform="rotate(30 66 160)" fill={c} {...O} />
        <ellipse cx={134} cy={160} rx={10} ry={15} transform="rotate(-30 134 160)" fill={c} {...O} />
        <ellipse cx={80} cy={194} rx={16} ry={8} fill={c} {...O} />
        <ellipse cx={120} cy={194} rx={16} ry={8} fill={c} {...O} />
        <ellipse cx={100} cy={110} rx={50} ry={42} fill={c} {...O} />
        <Eye x={82} y={106} />
        <Eye x={118} y={106} />
        <ellipse cx={100} cy={118} rx={5.5} ry={4.2} fill={C.pink} {...O} strokeWidth={2.5} />
        <path d="M100 122 q-4 8 -10 5 M100 122 q4 8 10 5" {...L(3.2)} />
        <Cheek x={72} y={122} />
        <Cheek x={128} y={122} />
      </g>
    ),
  },
  {
    id: "cat",
    cat: "characters",
    name: { en: "Cat", ja: "ねこ" },
    vb: [0, 0, 200, 205],
    color: C.orange,
    draw: (c) => (
      <g>
        <path d="M136 178 C186 178 192 130 172 110" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M136 178 C186 178 192 130 172 110" stroke={c} strokeWidth={13} fill="none" strokeLinecap="round" />
        <ellipse cx={100} cy={162} rx={40} ry={32} fill={c} {...O} />
        <ellipse cx={100} cy={168} rx={20} ry={18} fill={C.cream} />
        <ellipse cx={84} cy={192} rx={14} ry={8} fill={c} {...O} />
        <ellipse cx={116} cy={192} rx={14} ry={8} fill={c} {...O} />
        <path d="M54 82 L58 28 L94 58 Z" fill={c} {...O} />
        <path d="M146 82 L142 28 L106 58 Z" fill={c} {...O} />
        <path d="M63 60 L65 42 L80 55 Z" fill={C.pink} />
        <path d="M137 60 L135 42 L120 55 Z" fill={C.pink} />
        <ellipse cx={100} cy={98} rx={53} ry={45} fill={c} {...O} />
        <path d="M100 56 v14 M86 58 l3 11 M114 58 l-3 11" {...L(4)} />
        <ellipse cx={80} cy={96} rx={5.2} ry={7} fill={INK} />
        <ellipse cx={120} cy={96} rx={5.2} ry={7} fill={INK} />
        <circle cx={82} cy={93} r={1.8} fill="#fff" />
        <circle cx={122} cy={93} r={1.8} fill="#fff" />
        <path d="M95 108 h10 l-5 6 z" fill={C.pink} {...O} strokeWidth={2.5} />
        <path d="M100 114 q-6 7 -12 3 M100 114 q6 7 12 3" {...L(3.2)} />
        <path d="M68 110 L42 106 M68 117 L43 121 M132 110 L158 106 M132 117 L157 121" {...L(2.8)} />
        <Cheek x={70} y={112} r={6} />
        <Cheek x={130} y={112} r={6} />
      </g>
    ),
  },
  {
    id: "fox",
    cat: "characters",
    name: { en: "Fox", ja: "きつね" },
    vb: [0, 0, 205, 205],
    color: C.orange,
    draw: (c) => (
      <g>
        <ellipse cx={156} cy={150} rx={22} ry={42} transform="rotate(42 156 150)" fill={c} {...O} />
        <ellipse cx={180} cy={124} rx={13} ry={15} transform="rotate(42 180 124)" fill={C.white} {...O} />
        <ellipse cx={100} cy={164} rx={36} ry={30} fill={c} {...O} />
        <ellipse cx={100} cy={162} rx={18} ry={20} fill={C.white} />
        <ellipse cx={86} cy={192} rx={12} ry={7} fill={DARK} {...O} />
        <ellipse cx={114} cy={192} rx={12} ry={7} fill={DARK} {...O} />
        <path d="M100 138 C70 138 44 112 42 80 L58 36 L86 64 Q100 58 114 64 L142 36 L158 80 C156 112 130 138 100 138 Z" fill={c} {...O} />
        <path d="M60 48 L64 70 L78 62 Z M140 48 L136 70 L122 62 Z" fill={DARK} />
        <path d="M45 88 Q72 98 100 120 Q128 98 155 88 Q148 128 100 137 Q52 128 45 88 Z" fill={C.white} />
        <path d="M100 138 C70 138 44 112 42 80 M158 80 C156 112 130 138 100 138" {...L()} />
        <ellipse cx={80} cy={90} rx={4.6} ry={6.4} fill={INK} />
        <ellipse cx={120} cy={90} rx={4.6} ry={6.4} fill={INK} />
        <ellipse cx={100} cy={119} rx={6.5} ry={5} fill={INK} />
        <path d="M100 124 q-4 6 -9 4 M100 124 q4 6 9 4" {...L(3)} />
        <Cheek x={68} y={106} r={6} />
        <Cheek x={132} y={106} r={6} />
      </g>
    ),
  },
  {
    id: "penguin",
    cat: "characters",
    name: { en: "Penguin", ja: "ペンギン" },
    vb: [0, 20, 200, 185],
    color: C.navy,
    draw: (c) => (
      <g>
        <ellipse cx={50} cy={124} rx={12} ry={30} transform="rotate(22 50 124)" fill={c} {...O} />
        <ellipse cx={150} cy={124} rx={12} ry={30} transform="rotate(-22 150 124)" fill={c} {...O} />
        <ellipse cx={84} cy={192} rx={15} ry={7} fill={C.orange} {...O} />
        <ellipse cx={116} cy={192} rx={15} ry={7} fill={C.orange} {...O} />
        <ellipse cx={100} cy={116} rx={55} ry={74} fill={c} {...O} />
        <ellipse cx={100} cy={132} rx={38} ry={54} fill={C.white} />
        <ellipse cx={100} cy={84} rx={35} ry={27} fill={C.white} />
        <Eye x={86} y={80} />
        <Eye x={114} y={80} />
        <path d="M91 92 L109 92 L100 103 Z" fill={C.orange} {...O} strokeWidth={3} />
        <Cheek x={74} y={96} r={6} />
        <Cheek x={126} y={96} r={6} />
      </g>
    ),
  },
  {
    id: "bird",
    cat: "characters",
    name: { en: "Bluebird", ja: "ことり" },
    vb: [5, 30, 185, 160],
    color: C.sky,
    draw: (c) => (
      <g>
        <path d="M92 158 L88 180 M80 182 h16 M112 158 L112 180 M104 182 h16" stroke={C.orange} strokeWidth={5} strokeLinecap="round" />
        <path d="M48 100 L18 84 L26 116 Z" fill={c} {...O} />
        <ellipse cx={100} cy={110} rx={58} ry={50} fill={c} {...O} />
        <ellipse cx={112} cy={126} rx={36} ry={27} fill={C.cream} />
        <path d="M66 98 Q56 140 102 138 Q92 114 66 98 Z" fill={c} {...O} />
        <path d="M66 98 Q56 140 102 138 Q92 114 66 98 Z" fill="url(#hatch-dark)" />
        <path d="M108 62 q-6 -18 8 -24 q-2 12 8 18" {...L(4)} />
        <Eye x={128} y={96} />
        <path d="M154 102 L178 111 L154 120 Z" fill={C.orange} {...O} strokeWidth={3.5} />
        <Cheek x={136} y={114} r={6.5} />
      </g>
    ),
  },
  {
    id: "frog",
    cat: "characters",
    name: { en: "Frog", ja: "かえる" },
    vb: [0, 40, 200, 160],
    color: C.green,
    draw: (c) => (
      <g>
        <ellipse cx={62} cy={186} rx={21} ry={8} fill={c} {...O} />
        <ellipse cx={138} cy={186} rx={21} ry={8} fill={c} {...O} />
        <ellipse cx={100} cy={150} rx={50} ry={36} fill={c} {...O} />
        <ellipse cx={100} cy={158} rx={31} ry={23} fill={C.lemon} />
        <circle cx={66} cy={74} r={22} fill={c} {...O} />
        <circle cx={134} cy={74} r={22} fill={c} {...O} />
        <ellipse cx={100} cy={110} rx={62} ry={40} fill={c} {...O} />
        <circle cx={66} cy={74} r={14} fill={C.white} />
        <circle cx={134} cy={74} r={14} fill={C.white} />
        <Eye x={68} y={76} r={6.5} />
        <Eye x={132} y={76} r={6.5} />
        <path d="M62 116 Q100 144 138 116" {...L(4.5)} />
        <Cheek x={54} y={108} />
        <Cheek x={146} y={108} />
      </g>
    ),
  },
  {
    id: "whale",
    cat: "characters",
    name: { en: "Whale", ja: "くじら" },
    vb: [8, 4, 212, 144],
    color: C.blue,
    draw: (c) => (
      <g>
        <path d="M70 38 q-6 -14 -20 -16 M70 38 q0 -16 0 -26 M70 38 q6 -14 20 -16" stroke={C.sky} strokeWidth={5.5} strokeLinecap="round" fill="none" />
        <path d="M168 90 C188 82 198 62 210 52 C212 72 206 84 196 92 C208 96 214 106 214 120 C200 110 188 104 168 106 Z" fill={c} {...O} />
        <path d="M20 92 C20 42 92 32 140 52 C168 62 180 80 180 96 C180 126 140 140 90 138 C45 136 20 122 20 92 Z" fill={c} {...O} />
        <path d="M28 108 C60 130 122 134 164 116 C140 142 58 144 28 108 Z" fill={C.pale} />
        <path d="M20 92 C20 42 92 32 140 52" fill="url(#hatch)" stroke="none" />
        <Eye x={62} y={82} />
        <Cheek x={74} y={98} />
        <path d="M38 100 q14 10 30 4" {...L(3.5)} />
      </g>
    ),
  },
  {
    id: "girl",
    cat: "characters",
    name: { en: "Girl", ja: "おんなのこ" },
    vb: [0, 18, 160, 204],
    color: C.red,
    draw: (c) => (
      <g>
        <circle cx={34} cy={82} r={16} fill={HAIR} {...O} />
        <circle cx={126} cy={82} r={16} fill={HAIR} {...O} />
        <path d="M62 188 v18 M98 188 v18" {...L(6)} />
        <ellipse cx={60} cy={210} rx={11} ry={6} fill={INK} />
        <ellipse cx={100} cy={210} rx={11} ry={6} fill={INK} />
        <path d="M54 130 L30 164 M106 130 L130 164" stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <path d="M54 130 L30 164 M106 130 L130 164" stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <path d="M52 116 L108 116 L134 190 L26 190 Z" fill={c} {...O} />
        <path d="M40 176 L120 176" stroke={C.white} strokeWidth={5} strokeDasharray="2 9" strokeLinecap="round" />
        <circle cx={80} cy={72} r={40} fill={SKIN} {...O} />
        <path d="M40 70 Q44 30 80 30 Q116 30 120 70 Q104 50 86 54 Q82 44 72 52 Q54 50 40 70 Z" fill={HAIR} {...O} />
        <path d="M112 42 l12 -8 l-2 12 z M112 42 l12 8 l-10 4 z" fill={C.pink} {...O} strokeWidth={3} />
        <Eye x={66} y={78} r={4.6} />
        <Eye x={94} y={78} r={4.6} />
        <Cheek x={57} y={90} r={6} />
        <Cheek x={103} y={90} r={6} />
        <path d="M72 94 q8 7 16 0" {...L(3.2)} />
      </g>
    ),
  },
  {
    id: "boy",
    cat: "characters",
    name: { en: "Boy", ja: "おとこのこ" },
    vb: [0, 18, 160, 204],
    color: C.blue,
    draw: (c) => (
      <g>
        <path d="M64 186 v20 M96 186 v20" {...L(6)} />
        <ellipse cx={62} cy={210} rx={11} ry={6} fill={INK} />
        <ellipse cx={98} cy={210} rx={11} ry={6} fill={INK} />
        <path d="M52 128 L30 160 M108 128 L130 160" stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <path d="M52 128 L30 160 M108 128 L130 160" stroke={SKIN} strokeWidth={7} strokeLinecap="round" />
        <path d="M44 166 L116 166 L118 190 L84 190 L80 182 L76 190 L42 190 Z" fill={C.tan} {...O} />
        <path d="M48 118 Q80 110 112 118 L118 170 L42 170 Z" fill={c} {...O} />
        <path d="M46 140 H114 M44 156 H116" stroke={C.white} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        <circle cx={40} cy={78} r={8} fill={SKIN} {...O} />
        <circle cx={120} cy={78} r={8} fill={SKIN} {...O} />
        <circle cx={80} cy={72} r={40} fill={SKIN} {...O} />
        <path d="M40 68 Q38 28 80 28 Q124 28 120 68 Q112 50 96 52 Q86 40 72 50 Q52 48 40 68 Z" fill={HAIR} {...O} />
        <path d="M82 30 q2 -12 12 -12" {...L(4)} />
        <Eye x={66} y={78} r={4.6} />
        <Eye x={94} y={78} r={4.6} />
        <Cheek x={57} y={90} r={6} />
        <Cheek x={103} y={90} r={6} />
        <path d="M70 92 q10 11 20 0 z" fill={INK} {...O} strokeWidth={2.5} />
      </g>
    ),
  },

  // ───────────── nature ─────────────
  {
    id: "sun",
    cat: "nature",
    name: { en: "Sun", ja: "おひさま" },
    vb: [0, 0, 200, 200],
    color: C.yellow,
    draw: (c) => (
      <g>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r1 = 64,
            r2 = 90;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * r2}
              y2={100 + Math.sin(a) * r2}
              stroke={C.orange}
              strokeWidth={10}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={100} cy={100} r={52} fill={c} {...O} />
        <circle cx={100} cy={100} r={52} fill="url(#hatch)" />
        <path d="M76 94 q7 -8 14 0 M110 94 q7 -8 14 0" {...L(4)} />
        <path d="M86 112 q14 14 28 0" {...L(4)} />
        <Cheek x={72} y={110} />
        <Cheek x={128} y={110} />
      </g>
    ),
  },
  {
    id: "moon",
    cat: "nature",
    name: { en: "Moon", ja: "おつきさま" },
    vb: [0, 0, 200, 200],
    color: C.lemon,
    draw: (c) => (
      <g>
        <path d="M128 22 A80 80 0 1 0 178 150 A64 64 0 1 1 128 22 Z" fill={c} {...O} />
        <path d="M128 22 A80 80 0 1 0 178 150 A64 64 0 1 1 128 22 Z" fill="url(#hatch)" />
        <path d="M58 100 q8 7 16 0" {...L(4)} />
        <Cheek x={60} y={118} />
        <path d="M70 136 q10 6 18 0" {...L(3.5)} />
        <path d="M160 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill={C.yellow} {...O} strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "star",
    cat: "nature",
    name: { en: "Star", ja: "ほし" },
    vb: [0, 0, 200, 200],
    color: C.yellow,
    draw: (c) => {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
        const r = i % 2 ? 40 : 88;
        return `${100 + Math.cos(a) * r},${108 + Math.sin(a) * r}`;
      }).join(" ");
      return (
        <g>
          <polygon points={pts} fill={c} {...O} strokeWidth={5} />
          <polygon points={pts} fill="url(#hatch)" />
          <Eye x={86} y={108} r={4.6} />
          <Eye x={114} y={108} r={4.6} />
          <path d="M92 122 q8 8 16 0" {...L(3.5)} />
        </g>
      );
    },
  },
  {
    id: "cloud",
    cat: "nature",
    name: { en: "Cloud", ja: "くも" },
    vb: [10, 40, 190, 120],
    color: C.white,
    draw: (c) => (
      <Blob fill={c}>
        <circle cx={62} cy={120} r={34} />
        <circle cx={100} cy={92} r={40} />
        <circle cx={144} cy={108} r={34} />
        <circle cx={168} cy={130} r={22} />
        <rect x={40} y={118} width={140} height={32} rx={16} />
      </Blob>
    ),
  },
  {
    id: "tree",
    cat: "nature",
    name: { en: "Tree", ja: "き" },
    vb: [0, 0, 200, 215],
    color: C.green,
    draw: (c) => (
      <g>
        <path d="M86 210 L91 118 L109 118 L114 210 Z" fill={C.brown} {...O} />
        <path d="M100 150 L80 128 M104 140 L122 124" {...L(4)} />
        <Blob fill={c}>
          <circle cx={66} cy={100} r={38} />
          <circle cx={134} cy={100} r={38} />
          <circle cx={100} cy={64} r={46} />
          <circle cx={100} cy={118} r={34} />
        </Blob>
        <circle cx={72} cy={96} r={7} fill={C.red} {...O} strokeWidth={3} />
        <circle cx={126} cy={82} r={7} fill={C.red} {...O} strokeWidth={3} />
        <circle cx={104} cy={120} r={7} fill={C.red} {...O} strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "pine",
    cat: "nature",
    name: { en: "Pine", ja: "もみのき" },
    vb: [20, 0, 160, 215],
    color: C.leaf,
    draw: (c) => (
      <g>
        <rect x={90} y={170} width={20} height={40} fill={C.brown} {...O} />
        <Blob fill={c}>
          <path d="M100 10 L140 70 L60 70 Z" strokeLinejoin="round" />
          <path d="M100 44 L154 118 L46 118 Z" strokeLinejoin="round" />
          <path d="M100 84 L168 176 L32 176 Z" strokeLinejoin="round" />
        </Blob>
        <path d="M70 150 q30 -12 60 0 M80 102 q20 -10 40 0" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "flower",
    cat: "nature",
    name: { en: "Flower", ja: "おはな" },
    vb: [30, 10, 140, 195],
    color: C.pink,
    draw: (c) => (
      <g>
        <path d="M100 90 C96 130 108 160 100 200" {...L(10)} />
        <path d="M100 90 C96 130 108 160 100 200" stroke={C.green} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M102 158 C120 140 146 144 150 150 C140 166 118 168 102 158 Z" fill={C.green} {...O} />
        <path d="M98 138 C80 122 56 126 52 132 C62 148 84 150 98 138 Z" fill={C.green} {...O} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <circle key={i} cx={100 + Math.cos(a) * 26} cy={62 + Math.sin(a) * 26} r={20} fill={c} {...O} />;
        })}
        <circle cx={100} cy={62} r={17} fill={C.yellow} {...O} />
        <path d="M93 60 q3 -3 6 0 M103 60 q3 -3 6 0 M95 68 q5 5 10 0" {...L(2.6)} />
      </g>
    ),
  },
  {
    id: "mushroom",
    cat: "nature",
    name: { en: "Mushroom", ja: "きのこ" },
    vb: [10, 20, 180, 180],
    color: C.red,
    draw: (c) => (
      <g>
        <path d="M76 110 Q70 170 80 190 L120 190 Q130 170 124 110 Z" fill={C.cream} {...O} />
        <Eye x={90} y={150} r={4.2} />
        <Eye x={110} y={150} r={4.2} />
        <path d="M95 162 q5 5 10 0" {...L(3)} />
        <path d="M22 114 Q24 34 100 34 Q176 34 178 114 Q100 132 22 114 Z" fill={c} {...O} />
        <circle cx={70} cy={70} r={12} fill={C.white} />
        <circle cx={118} cy={58} r={9} fill={C.white} />
        <circle cx={146} cy={92} r={10} fill={C.white} />
        <circle cx={96} cy={98} r={8} fill={C.white} />
        <circle cx={48} cy={100} r={6} fill={C.white} />
      </g>
    ),
  },
  {
    id: "mountain",
    cat: "nature",
    name: { en: "Mountains", ja: "やま" },
    vb: [0, 20, 260, 150],
    color: C.green,
    draw: (c) => (
      <g>
        <path d="M110 166 L180 42 L254 166 Z" fill={C.lilac} {...O} />
        <path d="M160 78 L180 42 L200 78 Q190 70 180 80 Q170 70 160 78 Z" fill={C.white} {...O} strokeWidth={3.5} />
        <path d="M6 166 L92 34 L178 166 Z" fill={c} {...O} />
        <path d="M6 166 L92 34 L178 166 Z" fill="url(#hatch)" />
        <path d="M68 72 L92 34 L116 72 Q104 62 92 74 Q80 62 68 72 Z" fill={C.white} {...O} strokeWidth={3.5} />
      </g>
    ),
  },
  {
    id: "rainbow",
    cat: "nature",
    name: { en: "Rainbow", ja: "にじ" },
    vb: [0, 20, 260, 140],
    color: C.red,
    draw: (c) => {
      const cols = [c, C.orange, C.yellow, C.green, C.sky, C.purple];
      return (
        <g>
          <path d="M56.5 150 A73.5 73.5 0 0 1 203.5 150" stroke={INK} strokeWidth={87} fill="none" />
          {cols.map((col, i) => (
            <path key={i} d={`M${24 + i * 13} 150 A${106 - i * 13} ${106 - i * 13} 0 0 1 ${236 - i * 13} 150`} stroke={col} strokeWidth={12.5} fill="none" />
          ))}
          <Blob fill={C.white}>
            <circle cx={30} cy={146} r={20} />
            <circle cx={56} cy={150} r={16} />
            <circle cx={12} cy={154} r={12} />
            <circle cx={230} cy={146} r={20} />
            <circle cx={204} cy={150} r={16} />
            <circle cx={250} cy={154} r={12} />
          </Blob>
        </g>
      );
    },
  },

  // ───────────── things ─────────────
  {
    id: "house",
    cat: "things",
    name: { en: "House", ja: "おうち" },
    vb: [10, 10, 180, 190],
    color: C.red,
    draw: (c) => (
      <g>
        <rect x={130} y={34} width={20} height={42} fill={C.brown} {...O} />
        <rect x={42} y={96} width={116} height={96} fill={C.lemon} {...O} />
        <rect x={42} y={96} width={116} height={96} fill="url(#hatch)" />
        <path d="M24 104 L100 32 L176 104 Z" fill={c} {...O} />
        <path d="M24 104 L100 32 L176 104 Z" fill="url(#hatch)" />
        <rect x={60} y={116} width={32} height={30} fill={C.sky} {...O} />
        <path d="M76 116 V146 M60 131 H92" {...L(3.5)} />
        <path d="M112 192 V142 Q124 128 136 142 V192" fill={C.brown} {...O} />
        <circle cx={130} cy={168} r={3} fill={INK} />
        <path d="M66 24 q6 -10 0 -18 M140 26 q8 -8 2 -18" stroke={C.gray} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "balloon",
    cat: "things",
    name: { en: "Balloon", ja: "ふうせん" },
    vb: [0, 0, 120, 220],
    color: C.red,
    draw: (c) => (
      <g>
        <path d="M60 116 C50 140 72 156 58 176 C46 194 66 204 60 218" {...L(3)} />
        <path d="M54 118 L66 118 L60 108 Z" fill={c} {...O} strokeWidth={3.5} />
        <ellipse cx={60} cy={60} rx={45} ry={52} fill={c} {...O} />
        <ellipse cx={60} cy={60} rx={45} ry={52} fill="url(#hatch)" />
        <ellipse cx={42} cy={40} rx={9} ry={15} transform="rotate(25 42 40)" fill="#fff" opacity={0.7} />
      </g>
    ),
  },
  {
    id: "heart",
    cat: "things",
    name: { en: "Heart", ja: "ハート" },
    vb: [15, 30, 170, 150],
    color: C.red,
    draw: (c) => (
      <g>
        <path d="M100 172 C40 132 20 102 30 72 C40 42 80 38 100 68 C120 38 160 42 170 72 C180 102 160 132 100 172 Z" fill={c} {...O} strokeWidth={5} />
        <path d="M100 172 C40 132 20 102 30 72 C40 42 80 38 100 68 C120 38 160 42 170 72 C180 102 160 132 100 172 Z" fill="url(#hatch)" />
        <path d="M48 76 q6 -16 22 -16" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.75} />
      </g>
    ),
  },
  {
    id: "gift",
    cat: "things",
    name: { en: "Present", ja: "プレゼント" },
    vb: [10, 10, 180, 185],
    color: C.purple,
    draw: (c) => (
      <g>
        <path d="M100 60 C70 20 40 40 58 60 Z M100 60 C130 20 160 40 142 60 Z" fill={C.yellow} {...O} />
        <rect x={40} y={92} width={120} height={96} fill={c} {...O} />
        <rect x={40} y={92} width={120} height={96} fill="url(#hatch)" />
        <rect x={30} y={62} width={140} height={34} rx={4} fill={c} {...O} />
        <rect x={88} y={62} width={24} height={126} fill={C.yellow} {...O} />
        <circle cx={100} cy={60} r={9} fill={C.yellow} {...O} />
      </g>
    ),
  },
  {
    id: "letter",
    cat: "things",
    name: { en: "Letter", ja: "おてがみ" },
    vb: [10, 20, 180, 120],
    color: C.cream,
    draw: (c) => (
      <g>
        <rect x={20} y={30} width={160} height={102} rx={6} fill={c} {...O} />
        <path d="M20 132 L84 80 M180 132 L116 80" {...L(3.5)} />
        <path d="M22 34 L100 96 L178 34" fill={c} {...O} />
        <path d="M100 108 C84 98 80 88 86 82 C92 76 98 80 100 86 C102 80 108 76 114 82 C120 88 116 98 100 108 Z" fill={C.red} {...O} strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "plane",
    cat: "things",
    name: { en: "Airplane", ja: "ひこうき" },
    vb: [10, 10, 205, 120],
    color: C.sky,
    draw: (c) => (
      <g>
        <path d="M44 56 L30 18 L54 18 L74 56 Z" fill={C.red} {...O} />
        <path d="M112 72 L90 20 L112 20 L146 72 Z" fill={c} {...O} opacity={0.9} />
        <path d="M30 72 Q30 52 62 52 L168 54 Q200 58 200 72 Q200 86 168 90 L62 92 Q30 92 30 72 Z" fill={C.white} {...O} />
        <path d="M34 80 Q100 86 198 78" stroke={C.red} strokeWidth={6} fill="none" />
        <circle cx={120} cy={68} r={7} fill={C.pale} {...O} strokeWidth={3} />
        <circle cx={142} cy={68} r={7} fill={C.pale} {...O} strokeWidth={3} />
        <path d="M168 58 Q186 60 192 70 L170 70 Z" fill={C.pale} {...O} strokeWidth={3} />
        <path d="M100 76 L136 76 L112 116 L90 116 Z" fill={c} {...O} />
        <ellipse cx={204} cy={72} rx={4} ry={22} fill={C.gray} {...O} strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "boat",
    cat: "things",
    name: { en: "Sailboat", ja: "ヨット" },
    vb: [10, 10, 180, 190],
    color: C.red,
    draw: (c) => (
      <g>
        <path d="M100 26 V138" {...L(5)} />
        <path d="M104 30 L104 128 L164 128 Z" fill={C.white} {...O} />
        <path d="M96 48 L96 128 L50 128 Z" fill={C.lemon} {...O} />
        <path d="M100 26 L126 34 L100 42 Z" fill={C.yellow} {...O} strokeWidth={3} />
        <path d="M26 138 L174 138 L150 176 L50 176 Z" fill={c} {...O} />
        <path d="M26 138 L174 138 L150 176 L50 176 Z" fill="url(#hatch)" />
        <path d="M16 186 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0 q14 -10 28 0 q14 10 28 0" stroke={C.blue} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "umbrella",
    cat: "things",
    name: { en: "Umbrella", ja: "かさ" },
    vb: [10, 10, 180, 190],
    color: C.blue,
    draw: (c) => (
      <g>
        <path d="M100 96 L100 172 Q100 192 84 192 Q70 192 70 178" {...L(6)} />
        <path d="M100 18 v14" {...L(5)} />
        <path d="M20 100 Q20 30 100 30 Q180 30 180 100 Q160 86 140 100 Q120 86 100 100 Q80 86 60 100 Q40 86 20 100 Z" fill={c} {...O} />
        <path d="M60 100 Q62 50 100 30 Q138 50 140 100 Q120 86 100 100 Q80 86 60 100 Z" fill={C.white} opacity={0.55} />
        <path d="M60 100 Q62 50 100 30 Q138 50 140 100" {...L(3.5)} />
      </g>
    ),
  },
  {
    id: "cake",
    cat: "things",
    name: { en: "Cake", ja: "ケーキ" },
    vb: [10, 0, 180, 195],
    color: C.pink,
    draw: (c) => (
      <g>
        <path d="M100 22 q-8 -10 0 -18 q8 8 0 18" fill={C.orange} {...O} strokeWidth={3} />
        <rect x={94} y={26} width={12} height={34} fill={C.sky} {...O} strokeWidth={3.5} />
        <rect x={30} y={110} width={140} height={74} rx={8} fill={c} {...O} />
        <rect x={30} y={110} width={140} height={74} rx={8} fill="url(#hatch)" />
        <path d="M30 140 H170" stroke={C.cream} strokeWidth={8} />
        <rect x={46} y={62} width={108} height={52} rx={8} fill={c} {...O} />
        <path d="M46 72 Q46 60 58 60 H142 Q154 60 154 72 V80 Q148 92 142 80 Q136 94 128 80 Q120 94 112 80 Q104 94 96 80 Q88 94 80 80 Q72 94 64 80 Q56 94 50 82 Z" fill={C.white} {...O} strokeWidth={3.5} />
        <circle cx={72} cy={62} r={8} fill={C.red} {...O} strokeWidth={3} />
        <circle cx={128} cy={62} r={8} fill={C.red} {...O} strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "mug",
    cat: "things",
    name: { en: "Cocoa", ja: "ココア" },
    vb: [10, 0, 180, 190],
    color: C.orange,
    draw: (c) => (
      <g>
        <path d="M76 44 q-10 -14 0 -26 q10 -12 0 -24 M104 44 q-10 -14 0 -26 q10 -12 0 -24" stroke={C.gray} strokeWidth={4.5} fill="none" strokeLinecap="round" transform="translate(0 6)" />
        <path d="M140 84 Q178 84 176 116 Q174 146 138 144" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" />
        <path d="M140 84 Q178 84 176 116 Q174 146 138 144" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" />
        <path d="M34 62 H146 L138 170 Q136 182 122 182 H58 Q44 182 42 170 Z" fill={c} {...O} />
        <path d="M34 62 H146 L138 170 Q136 182 122 182 H58 Q44 182 42 170 Z" fill="url(#hatch)" />
        <ellipse cx={90} cy={64} rx={56} ry={10} fill={C.brown} {...O} strokeWidth={3.5} />
        <path d="M90 142 C74 132 70 122 76 116 C82 110 88 114 90 120 C92 114 98 110 104 116 C110 122 106 132 90 142 Z" fill={C.white} />
      </g>
    ),
  },
  {
    id: "canphone",
    cat: "things",
    name: { en: "Can phone", ja: "いとでんわ" },
    vb: [0, 20, 260, 120],
    color: C.red,
    draw: (c) => (
      <g>
        <path d="M58 80 C110 110 150 110 202 80" stroke={INK} strokeWidth={2.6} fill="none" strokeDasharray="1 0" />
        <g transform="rotate(-18 40 80)">
          <path d="M14 58 L66 64 L66 96 L14 102 Z" fill={c} {...O} />
          <ellipse cx={14} cy={80} rx={8} ry={22} fill={C.gray} {...O} />
          <path d="M40 62 V99" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} />
        </g>
        <g transform="rotate(18 220 80)">
          <path d="M246 58 L194 64 L194 96 L246 102 Z" fill={C.blue} {...O} />
          <ellipse cx={246} cy={80} rx={8} ry={22} fill={C.gray} {...O} />
          <path d="M220 62 V99" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} />
        </g>
        <path d="M130 50 C122 44 120 38 124 35 C127 32 130 34 130 37 C130 34 133 32 136 35 C140 38 138 44 130 50 Z" fill={C.pink} {...O} strokeWidth={2.5} />
      </g>
    ),
  },
  {
    id: "kite",
    cat: "things",
    name: { en: "Kite", ja: "たこ" },
    vb: [10, 0, 170, 225],
    color: C.yellow,
    draw: (c) => (
      <g>
        <path d="M96 150 C80 170 112 180 92 200 C78 214 96 222 104 222" {...L(3)} />
        <path d="M84 176 l-10 -6 l2 12 z M96 194 l-10 -6 l2 12 z" fill={C.red} {...O} strokeWidth={2.5} />
        <path d="M96 8 L156 70 L96 150 L36 70 Z" fill={c} {...O} />
        <path d="M96 8 L96 150 M36 70 L156 70" {...L(3.5)} />
        <path d="M96 8 L156 70 L96 70 Z M96 70 L36 70 L96 150 Z" fill={C.red} opacity={0.75} />
      </g>
    ),
  },
];

export const STICKER_MAP: Record<string, StickerDef> = Object.fromEntries(STICKERS.map((s) => [s.id, s]));

export function StickerSvg({ def, color, className }: { def: StickerDef; color?: string; className?: string }) {
  const [x, y, w, h] = def.vb;
  return (
    <svg className={className} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
      <g filter="url(#cr-w)" className="svg-base">
        {def.draw(color || def.color)}
      </g>
      <g filter="url(#cr)">{def.draw(color || def.color)}</g>
    </svg>
  );
}
