import type { ReactNode } from "react";
import { C, INK } from "./crayon";

export type BgDef = { id: string; name: { en: string; ja: string }; swatch: string; draw: () => ReactNode };

const OB = { stroke: INK, strokeWidth: 9, strokeLinejoin: "round", strokeLinecap: "round" } as const;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Hatch({ d }: { d: string }) {
  return <path d={d} fill="url(#hatch-bg)" />;
}

function Stars({ n, seed, color = C.lemon, maxY = 700 }: { n: number; seed: number; color?: string; maxY?: number }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * 1600,
          y = r() * maxY,
          s = 6 + r() * 12;
        return i % 3 === 0 ? (
          <path key={i} d={`M${x} ${y - s} L${x} ${y + s} M${x - s} ${y} L${x + s} ${y}`} stroke={color} strokeWidth={5} strokeLinecap="round" />
        ) : (
          <circle key={i} cx={x} cy={y} r={s * 0.35} fill={color} />
        );
      })}
    </g>
  );
}

function Tuft({ x, y, c = C.leaf }: { x: number; y: number; c?: string }) {
  return <path d={`M${x - 16} ${y} q6 -26 10 -34 M${x} ${y} q0 -30 2 -44 M${x + 16} ${y} q-4 -24 -8 -32`} stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />;
}

function CloudShape({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke={INK} strokeWidth={14} fill={INK}>
        <circle cx={0} cy={0} r={48} />
        <circle cx={60} cy={-26} r={62} />
        <circle cx={130} cy={0} r={50} />
        <rect x={-30} y={0} width={190} height={46} rx={23} />
      </g>
      <g fill={C.white}>
        <circle cx={0} cy={0} r={48} />
        <circle cx={60} cy={-26} r={62} />
        <circle cx={130} cy={0} r={50} />
        <rect x={-30} y={0} width={190} height={46} rx={23} />
      </g>
    </g>
  );
}

export const BACKGROUNDS: BgDef[] = [
  { id: "paper", name: { en: "Blank", ja: "まっさら" }, swatch: "#fffaf0", draw: () => null },
  {
    id: "meadow",
    name: { en: "Meadow", ja: "はらっぱ" },
    swatch: C.mint,
    draw: () => (
      <g>
        <rect x={-20} y={-20} width={1640} height={1040} fill={C.pale} />
        <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
        <CloudShape x={220} y={170} s={0.9} />
        <CloudShape x={1240} y={130} s={0.7} />
        <path d="M-20 640 Q300 520 640 610 T1620 560 V1020 H-20 Z" fill={C.mint} {...OB} />
        <path d="M-20 760 Q420 640 860 730 T1620 700 V1020 H-20 Z" fill={C.green} {...OB} />
        <Hatch d="M-20 760 Q420 640 860 730 T1620 700 V1020 H-20 Z" />
        {[
          [160, 880],
          [420, 820],
          [700, 900],
          [980, 830],
          [1260, 910],
          [1480, 820],
        ].map(([x, y], i) => (
          <g key={i}>
            <Tuft x={x} y={y} />
            <circle cx={x + 60} cy={y - 10} r={12} fill={[C.pink, C.yellow, C.white][i % 3]} stroke={INK} strokeWidth={5} />
          </g>
        ))}
      </g>
    ),
  },
  {
    id: "night",
    name: { en: "Starry night", ja: "ほしぞら" },
    swatch: C.navy,
    draw: () => (
      <g>
        <rect x={-20} y={-20} width={1640} height={1040} fill={C.navy} />
        <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
        <Stars n={70} seed={7} />
        <path d="M-20 780 Q380 660 800 760 T1620 720 V1020 H-20 Z" fill="#5b5fd6" {...OB} />
        <path d="M-20 880 Q500 800 1000 870 T1620 850 V1020 H-20 Z" fill="#3f3fb0" {...OB} />
        {[180, 520, 1120, 1440].map((x, i) => (
          <g key={i}>
            <rect x={x} y={770 - (i % 2) * 30} width={40} height={60} fill={C.lemon} stroke={INK} strokeWidth={7} opacity={0.9} />
          </g>
        ))}
      </g>
    ),
  },
  {
    id: "sea",
    name: { en: "Seaside", ja: "うみべ" },
    swatch: C.sky,
    draw: () => (
      <g>
        <rect x={-20} y={-20} width={1640} height={1040} fill={C.pale} />
        <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
        <CloudShape x={1150} y={180} s={0.8} />
        <path d="M-20 480 H1620 V1020 H-20 Z" fill={C.sky} {...OB} />
        <Hatch d="M-20 480 H1620 V1020 H-20 Z" />
        {[560, 640, 720].map((y, j) => (
          <path
            key={j}
            d={Array.from({ length: 18 }, (_, i) => `${i === 0 ? "M" : "q"}${i === 0 ? `${-20 + j * 40} ${y}` : `${45} ${i % 2 ? -22 : 22} 90 0`}`).join(" ")}
            stroke={C.white}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}
        <path d="M-20 800 Q400 740 820 790 T1620 770 V1020 H-20 Z" fill={C.lemon} {...OB} />
        <path d="M-20 800 Q400 740 820 790 T1620 770 V1020 H-20 Z" fill="url(#hatch-dark)" />
        {[
          [260, 900],
          [900, 930],
          [1350, 880],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l14 -30 l14 30 l-28 -18 h28 z`} fill={C.orange} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        ))}
      </g>
    ),
  },
  {
    id: "forest",
    name: { en: "Forest", ja: "もり" },
    swatch: C.leaf,
    draw: () => {
      const r = rng(21);
      const trees = Array.from({ length: 14 }, (_, i) => ({ x: i * 120 + r() * 60 - 20, h: 320 + r() * 200 }));
      return (
        <g>
          <rect x={-20} y={-20} width={1640} height={1040} fill="#e6fbd9" />
          <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
          {trees.map((t, i) => (
            <g key={i}>
              <rect x={t.x - 12} y={800 - 60} width={24} height={90} fill={C.brown} stroke={INK} strokeWidth={7} />
              <path d={`M${t.x} ${800 - t.h} L${t.x + 90} ${760} L${t.x - 90} ${760} Z`} fill={i % 2 ? "#86dc7c" : "#4fc46a"} {...OB} />
            </g>
          ))}
          <path d="M-20 780 Q500 740 900 790 T1620 770 V1020 H-20 Z" fill={C.leaf} {...OB} />
          <Hatch d="M-20 780 Q500 740 900 790 T1620 770 V1020 H-20 Z" />
          {[120, 480, 840, 1200, 1500].map((x, i) => (
            <Tuft key={i} x={x} y={920 - (i % 2) * 40} c={C.mint} />
          ))}
        </g>
      );
    },
  },
  {
    id: "snow",
    name: { en: "Snowy day", ja: "ゆきのひ" },
    swatch: "#e3f1ff",
    draw: () => {
      const r = rng(5);
      return (
        <g>
          <rect x={-20} y={-20} width={1640} height={1040} fill="#cfe6ff" />
          <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
          <path d="M-20 640 Q360 540 760 630 T1620 590 V1020 H-20 Z" fill="#f5faff" {...OB} />
          <path d="M-20 790 Q520 700 1000 780 T1620 760 V1020 H-20 Z" fill={C.white} {...OB} />
          {Array.from({ length: 90 }, (_, i) => (
            <circle key={i} cx={r() * 1600} cy={r() * 1000} r={5 + r() * 9} fill={C.white} stroke={INK} strokeWidth={2.5} strokeOpacity={0.35} />
          ))}
        </g>
      );
    },
  },
  {
    id: "sunset",
    name: { en: "Sunset", ja: "ゆうやけ" },
    swatch: C.orange,
    draw: () => (
      <g>
        <rect x={-20} y={-20} width={1640} height={1040} fill={C.lilac} />
        <path d="M-20 250 Q400 200 800 250 T1620 240 V760 H-20 Z" fill={C.pink} />
        <path d="M-20 470 Q420 420 820 470 T1620 460 V760 H-20 Z" fill="#ffb36b" />
        <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
        <circle cx={1100} cy={700} r={170} fill={C.orange} {...OB} />
        <path d="M-20 700 Q420 620 820 690 T1620 660 V1020 H-20 Z" fill="#a15cc9" {...OB} />
        <path d="M-20 840 Q520 770 1040 830 T1620 820 V1020 H-20 Z" fill="#6e3fa8" {...OB} />
        {[
          [300, 200],
          [380, 170],
          [460, 210],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q16 -16 30 0 q16 -16 30 0`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </g>
    ),
  },
  {
    id: "room",
    name: { en: "Cozy room", ja: "おへや" },
    swatch: C.lemon,
    draw: () => {
      const r = rng(9);
      return (
        <g>
          <rect x={-20} y={-20} width={1640} height={1040} fill={C.cream} />
          {Array.from({ length: 60 }, (_, i) => (
            <circle key={i} cx={(i % 12) * 140 + 40 + (Math.floor(i / 12) % 2) * 70} cy={Math.floor(i / 12) * 140 + 60} r={10} fill={C.pink} opacity={0.5} />
          ))}
          <rect x={1080} y={120} width={360} height={300} rx={10} fill={C.navy} {...OB} />
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={1110 + r() * 300} cy={150 + r() * 240} r={5} fill={C.lemon} />
          ))}
          <path d="M1260 120 V420 M1080 270 H1440" stroke={C.white} strokeWidth={16} />
          <path d="M1260 120 V420 M1080 270 H1440" stroke={INK} strokeWidth={4} opacity={0.3} />
          <path d="M1050 100 Q1100 300 1060 450 L1030 450 L1030 100 Z M1470 100 Q1420 300 1460 450 L1490 450 L1490 100 Z" fill={C.red} {...OB} />
          <rect x={1010} y={86} width={500} height={22} rx={10} fill={C.brown} {...OB} />
          <path d="M-20 700 H1620 V1020 H-20 Z" fill={C.tan} {...OB} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M${-20 + i * 240} 700 L${-120 + i * 260} 1020`} stroke={C.brown} strokeWidth={5} opacity={0.6} />
          ))}
          <ellipse cx={560} cy={880} rx={380} ry={80} fill={C.sky} {...OB} />
          <ellipse cx={560} cy={880} rx={290} ry={52} fill="none" stroke={C.white} strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" />
          <rect x={120} y={380} width={200} height={320} fill={C.brown} {...OB} />
          <path d="M120 480 H320 M120 580 H320" stroke={INK} strokeWidth={6} />
          {[140, 175, 212, 250, 280].map((x, i) => (
            <rect key={i} x={x} y={400 + (i % 2) * 10} width={26} height={72 - (i % 2) * 10} fill={[C.red, C.blue, C.yellow, C.green, C.purple][i]} stroke={INK} strokeWidth={4} />
          ))}
        </g>
      );
    },
  },
  {
    id: "town",
    name: { en: "Little town", ja: "まち" },
    swatch: C.tan,
    draw: () => {
      const cols = [C.red, C.lemon, C.sky, C.pink, C.mint, C.orange, C.lilac, C.yellow];
      return (
        <g>
          <rect x={-20} y={-20} width={1640} height={1040} fill={C.pale} />
          <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
          <CloudShape x={640} y={150} s={0.7} />
          {cols.map((c, i) => {
            const x = i * 205 - 20,
              w = 180,
              h = 260 + ((i * 53) % 140);
            const top = 760 - h;
            return (
              <g key={i}>
                <rect x={x} y={top} width={w} height={h} fill={c} {...OB} />
                <path d={`M${x - 14} ${top + 4} L${x + w / 2} ${top - 90} L${x + w + 14} ${top + 4} Z`} fill={i % 2 ? C.brown : C.red} {...OB} />
                {[0, 1].map((k) => (
                  <rect key={k} x={x + 30 + k * 76} y={top + 50} width={44} height={50} fill={C.white} stroke={INK} strokeWidth={6} />
                ))}
                <rect x={x + 68} y={760 - 100} width={44} height={100} fill={C.brown} stroke={INK} strokeWidth={6} />
              </g>
            );
          })}
          <path d="M-20 760 H1620 V1020 H-20 Z" fill={C.gray} {...OB} />
          <path d="M-20 880 H1620" stroke={C.white} strokeWidth={14} strokeDasharray="70 60" />
        </g>
      );
    },
  },
  {
    id: "sky",
    name: { en: "Up in the sky", ja: "おそら" },
    swatch: C.sky,
    draw: () => (
      <g>
        <rect x={-20} y={-20} width={1640} height={1040} fill={C.sky} />
        <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
        <CloudShape x={120} y={220} s={1.1} />
        <CloudShape x={900} y={140} s={0.8} />
        <CloudShape x={560} y={620} s={1.2} />
        <CloudShape x={1320} y={520} s={0.9} />
        <CloudShape x={60} y={860} s={0.9} />
        <CloudShape x={1200} y={900} s={1.1} />
      </g>
    ),
  },
  {
    id: "space",
    name: { en: "Outer space", ja: "うちゅう" },
    swatch: "#3d2a80",
    draw: () => (
      <g>
        <rect x={-20} y={-20} width={1640} height={1040} fill="#3a2878" />
        <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
        <Stars n={90} seed={13} maxY={1000} />
        <circle cx={1320} cy={260} r={130} fill={C.orange} {...OB} />
        <ellipse cx={1320} cy={260} rx={230} ry={44} fill="none" stroke={C.lemon} strokeWidth={22} transform="rotate(-14 1320 260)" />
        <ellipse cx={1320} cy={260} rx={230} ry={44} fill="none" stroke={INK} strokeWidth={4} transform="rotate(-14 1320 260)" opacity={0.5} />
        <circle cx={240} cy={820} r={90} fill={C.sky} {...OB} />
        <path d="M180 780 q30 -20 60 0 t60 10 M170 850 q40 20 90 0" stroke={C.green} strokeWidth={16} fill="none" strokeLinecap="round" />
        <circle cx={520} cy={200} r={38} fill={C.pink} {...OB} />
      </g>
    ),
  },
  {
    id: "garden",
    name: { en: "Flower garden", ja: "おはなばたけ" },
    swatch: C.pink,
    draw: () => {
      const r = rng(31);
      return (
        <g>
          <rect x={-20} y={-20} width={1640} height={1040} fill="#ffe6f0" />
          <Hatch d="M-20 -20 H1620 V1020 H-20 Z" />
          <path d="M-20 560 Q400 500 800 560 T1620 540 V1020 H-20 Z" fill="#9be8a8" {...OB} />
          <path d="M-20 560 Q400 500 800 560 T1620 540 V1020 H-20 Z" fill="url(#hatch-dark)" />
          {Array.from({ length: 22 }, (_, i) => {
            const x = r() * 1600,
              y = 640 + r() * 340,
              col = [C.pink, C.yellow, C.red, C.white, C.lilac][i % 5],
              s = 0.55 + ((y - 640) / 340) * 0.5;
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                <path d="M0 0 V60" stroke={C.leaf} strokeWidth={7} />
                {[0, 1, 2, 3, 4].map((k) => {
                  const a = (k / 5) * Math.PI * 2;
                  return <circle key={k} cx={Math.cos(a) * 16} cy={Math.sin(a) * 16} r={13} fill={col} stroke={INK} strokeWidth={4} />;
                })}
                <circle r={9} fill={C.yellow} stroke={INK} strokeWidth={4} />
              </g>
            );
          })}
        </g>
      );
    },
  },
];

export const BG_MAP: Record<string, BgDef> = Object.fromEntries(BACKGROUNDS.map((b) => [b.id, b]));

export function BgSvg({ id }: { id: string }) {
  const def = BG_MAP[id];
  if (!def || id === "paper") return null;
  return (
    <svg className="bg-svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g filter="url(#cr-bg)">{def.draw()}</g>
    </svg>
  );
}
