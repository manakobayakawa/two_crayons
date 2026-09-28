// Crayon look: every drawing is plain SVG shapes run through these filters.
// - wobble: displaces edges slightly so lines look hand-drawn
// - grain:  punches waxy speckles into fills so paper shows through
// Filters are defined once per document and referenced by id.

export const INK = "#4a3a3a";

export const CRAYONS = [
  { id: "red", hex: "#ff5a5f", en: "Red", ja: "あか" },
  { id: "orange", hex: "#ffa24c", en: "Orange", ja: "だいだい" },
  { id: "yellow", hex: "#ffd84d", en: "Yellow", ja: "きいろ" },
  { id: "green", hex: "#6dd47e", en: "Green", ja: "みどり" },
  { id: "sky", hex: "#5bc8f5", en: "Sky", ja: "みずいろ" },
  { id: "blue", hex: "#4c8dff", en: "Blue", ja: "あお" },
  { id: "purple", hex: "#a77bf3", en: "Purple", ja: "むらさき" },
  { id: "pink", hex: "#ff8fb8", en: "Pink", ja: "ももいろ" },
  { id: "brown", hex: "#c0825a", en: "Brown", ja: "ちゃいろ" },
  { id: "black", hex: "#4a3a3a", en: "Black", ja: "くろ" },
  { id: "white", hex: "#fffdf8", en: "White", ja: "しろ" },
] as const;

export const C = {
  red: "#ff5a5f",
  orange: "#ffa24c",
  yellow: "#ffd84d",
  lemon: "#ffec9e",
  green: "#6dd47e",
  leaf: "#3fb86a",
  mint: "#b4efc2",
  sky: "#5bc8f5",
  pale: "#cdefff",
  blue: "#4c8dff",
  navy: "#3d4fb8",
  purple: "#a77bf3",
  lilac: "#dcc8ff",
  pink: "#ff8fb8",
  blush: "#ffc6da",
  brown: "#c0825a",
  tan: "#f5c28e",
  cream: "#fff3d6",
  white: "#fffdf8",
  gray: "#b9b4cc",
  ink: INK,
};

export function CrayonDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden focusable="false">
      <defs>
        {/* stickers & bubbles (viewBox ~200) */}
        <filter id="cr" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="wob" />
          <feTurbulence type="fractalNoise" baseFrequency="1.1 0.32" numOctaves="2" seed="11" result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.9 0 0 0 2.3"
            result="mask"
          />
          <feComposite in="wob" in2="mask" operator="in" />
        </filter>
        {/* same wobble as #cr / #cr-soft but no grain – used for the opaque paper base under drawings */}
        <filter id="cr-w" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="cr-soft-w" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* backgrounds (viewBox 1600x1000) */}
        <filter id="cr-bg" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="2" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="14" xChannelSelector="R" yChannelSelector="G" result="wob" />
          <feTurbulence type="fractalNoise" baseFrequency="0.42 0.11" numOctaves="2" seed="7" result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.15"
            result="mask"
          />
          <feComposite in="wob" in2="mask" operator="in" />
        </filter>
        {/* soft wobble only – for text-bearing bubbles so writing area stays clean */}
        <filter id="cr-soft" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" result="wob" />
          <feTurbulence type="fractalNoise" baseFrequency="1.2 0.3" numOctaves="2" seed="5" result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.2 0 0 0 1.95"
            result="mask"
          />
          <feComposite in="wob" in2="mask" operator="in" />
        </filter>
        {/* scribble hatch used as an overlay texture on big fills */}
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#fff" strokeWidth="1.6" strokeOpacity="0.28" />
        </pattern>
        <pattern id="hatch-bg" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <line x1="0" y1="0" x2="0" y2="26" stroke="#fff" strokeWidth="6" strokeOpacity="0.16" />
        </pattern>
        <pattern id="hatch-dark" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="22" stroke="#000" strokeWidth="5" strokeOpacity="0.07" />
        </pattern>
      </defs>
    </svg>
  );
}
