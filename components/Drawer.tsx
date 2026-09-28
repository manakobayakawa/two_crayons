"use client";

import { memo, useState } from "react";
import { STICKERS, StickerSvg, type StickerCat } from "@/assets/stickers";
import { BUBBLES, BUBBLE_H, BubbleSvg } from "@/assets/bubbles";
import { BACKGROUNDS, BgSvg } from "@/assets/backgrounds";
import { useI18n, type DictKey } from "@/lib/i18n";
import { FONTS } from "@/lib/doc";
import type { FontKey } from "@/lib/types";
import type { DropPayload } from "./Canvas";
import { Icon } from "./Icons";

type Tab = StickerCat | "bubbles" | "words" | "scenes";
const TABS: { id: Tab; label: DictKey }[] = [
  { id: "characters", label: "characters" },
  { id: "nature", label: "nature" },
  { id: "things", label: "things" },
  { id: "bubbles", label: "bubbles" },
  { id: "words", label: "words" },
  { id: "scenes", label: "scenes" },
];

const WORDS: { en: string; ja: string; font: FontKey; color: string }[] = [
  { en: "Once upon a time…", ja: "むかしむかし…", font: "pencil", color: "#4a3a3a" },
  { en: "The End", ja: "おしまい", font: "crayon", color: "#ff5a5f" },
  { en: "Hooray!", ja: "やったー！", font: "pop", color: "#ffa24c" },
  { en: "Zzz…", ja: "すやすや…", font: "round", color: "#4c8dff" },
  { en: "Ba-dump!", ja: "ドキドキ", font: "pop", color: "#ff5a5f" },
  { en: "I miss you", ja: "あいたいな", font: "crayon", color: "#a77bf3" },
  { en: "Whoosh!", ja: "びゅーん！", font: "pop", color: "#6dd47e" },
  { en: "♡ ♡ ♡", ja: "♡ ♡ ♡", font: "round", color: "#ff8fb8" },
];

export const Drawer = memo(function Drawer({
  onAdd,
  onBg,
  currentBg,
  onClose,
}: {
  onAdd: (p: DropPayload & { font?: FontKey; color?: string }) => void;
  onBg: (id: string) => void;
  currentBg: string;
  onClose?: () => void;
}) {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>("characters");

  const drag = (p: DropPayload) => (e: React.DragEvent) => {
    e.dataTransfer.setData("application/x-tc", JSON.stringify(p));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <aside className="drawer" aria-label={t("parts")}>
      <div className="drawer-tabs" role="tablist">
        {TABS.map((tb) => (
          <button key={tb.id} role="tab" aria-selected={tab === tb.id} className={`dtab dtab-${tb.id} ${tab === tb.id ? "on" : ""}`} onClick={() => setTab(tb.id)}>
            <span className="dtab-ico">
              <TabIcon id={tb.id} />
            </span>
            <span className="dtab-label">{t(tb.label)}</span>
          </button>
        ))}
        {onClose && (
          <button className="drawer-close" onClick={onClose} aria-label={t("close")}>
            <Icon.close />
          </button>
        )}
      </div>
      <div className="drawer-body">
        <p className="drawer-hint">{tab === "scenes" ? t("bg") : t("dragHint")}</p>
        {(tab === "characters" || tab === "nature" || tab === "things") && (
          <div className="grid">
            {STICKERS.filter((s) => s.cat === tab).map((s) => (
              <button
                key={s.id}
                className="part"
                draggable
                onDragStart={drag({ type: "sticker", ref: s.id })}
                onClick={() => onAdd({ type: "sticker", ref: s.id })}
                title={s.name[lang]}
              >
                <span className="part-art">
                  <StickerSvg def={s} />
                </span>
                <span className="part-name">{s.name[lang]}</span>
              </button>
            ))}
          </div>
        )}
        {tab === "bubbles" && (
          <div className="grid grid-bubbles">
            {BUBBLES.map((b) => (
              <button
                key={b.id}
                className="part part-bubble"
                draggable
                onDragStart={drag({ type: "bubble", ref: b.id })}
                onClick={() => onAdd({ type: "bubble", ref: b.id })}
                title={b.name[lang]}
              >
                <span className="part-art" style={{ aspectRatio: String(Math.min(b.aspect, 2.2)) }}>
                  <BubbleSvg def={b} W={BUBBLE_H * Math.min(b.aspect, 2.2)} H={BUBBLE_H} color={b.color} />
                </span>
                <span className="part-name">{b.name[lang]}</span>
              </button>
            ))}
          </div>
        )}
        {tab === "words" && (
          <div className="words">
            <button className="word word-new" onClick={() => onAdd({ type: "text", ref: "" })} draggable onDragStart={drag({ type: "text", ref: "" })}>
              <Icon.text /> {t("addText")}
            </button>
            {WORDS.map((w, i) => (
              <button
                key={i}
                className="word"
                style={{ fontFamily: FONTS[w.font], color: w.color }}
                onClick={() => onAdd({ type: "text", ref: w[lang], font: w.font, color: w.color })}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/x-tc", JSON.stringify({ type: "text", ref: w[lang], font: w.font, color: w.color }));
                }}
              >
                {w[lang]}
              </button>
            ))}
          </div>
        )}
        {tab === "scenes" && (
          <div className="grid grid-scenes">
            {BACKGROUNDS.map((b) => (
              <button key={b.id} className={`scene ${currentBg === b.id ? "on" : ""}`} onClick={() => onBg(b.id)} aria-pressed={currentBg === b.id}>
                <span className="scene-art">
                  <BgSvg id={b.id} />
                </span>
                <span className="part-name">{b.name[lang]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

function TabIcon({ id }: { id: Tab }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 2.1, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const paths: Record<Tab, React.ReactNode> = {
    characters: (
      <>
        <circle cx="6.5" cy="6.5" r="2.6" {...s} />
        <circle cx="17.5" cy="6.5" r="2.6" {...s} />
        <circle cx="12" cy="13" r="7" {...s} />
        <circle cx="9.5" cy="12" r=".8" fill="currentColor" />
        <circle cx="14.5" cy="12" r=".8" fill="currentColor" />
        <path d="M10.5 15.5q1.5 1.3 3 0" {...s} />
      </>
    ),
    nature: (
      <>
        <path d="M12 21v-8" {...s} />
        <circle cx="12" cy="8" r="2.4" {...s} />
        <path d="M12 5.6a2.4 2.4 0 1 1 2.3 3.1M12 5.6a2.4 2.4 0 1 0-2.3 3.1M9.7 8.7a2.4 2.4 0 1 0 2.3 1.7M14.3 8.7a2.4 2.4 0 1 1-2.3 1.7M12 16c-2-2-5-2-6-1 1 2 4 2.5 6 1zM12 17c2-2 5-2 6-1-1 2-4 2.5-6 1z" {...s} />
      </>
    ),
    things: (
      <>
        <ellipse cx="12" cy="8.5" rx="5.5" ry="6" {...s} />
        <path d="M11 14.8h2l-1 1.2zM12 16c-1 2 1 3 0 5" {...s} />
      </>
    ),
    bubbles: <path d="M4 11c0-3.8 3.6-6.5 8-6.5s8 2.7 8 6.5-3.6 6.5-8 6.5c-.9 0-1.8-.1-2.6-.3L5.5 20l.9-3.9C4.9 14.8 4 13 4 11z" {...s} />,
    words: <path d="M5 7V5.5h14V7M12 5.5V19M9 19h6" {...s} />,
    scenes: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" {...s} />
        <path d="m3 16 5-5 4 4 3-3 6 6" {...s} />
        <circle cx="16" cy="9" r="1.5" {...s} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} style={{ width: 22, height: 22 }} aria-hidden>
      {paths[id]}
    </svg>
  );
}
