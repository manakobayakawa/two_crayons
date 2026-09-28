"use client";

import { CRAYONS } from "@/assets/crayon";
import { STICKER_MAP } from "@/assets/stickers";
import { BUBBLE_MAP } from "@/assets/bubbles";
import { useI18n } from "@/lib/i18n";
import { FONTS } from "@/lib/doc";
import type { FontKey, Item } from "@/lib/types";
import { Icon } from "./Icons";

const FONT_KEYS: FontKey[] = ["crayon", "pencil", "round", "pop"];
const FONT_LABEL = { crayon: "fontCrayon", pencil: "fontPencil", round: "fontRound", pop: "fontPop" } as const;

/** Context tray: tools for whatever is selected, like picking up a crayon box. */
export function Tray({
  item,
  editing,
  onPatch,
  onEdit,
  onFront,
  onBack,
  onDup,
  onDelete,
}: {
  item: Item | null;
  editing: boolean;
  onPatch: (p: Partial<Item>) => void;
  onEdit: () => void;
  onFront: () => void;
  onBack: () => void;
  onDup: () => void;
  onDelete: () => void;
}) {
  const { t, lang } = useI18n();
  if (!item) {
    return (
      <div className="tray tray-idle">
        <span className="tray-hint">{t("shortcuts")}</span>
      </div>
    );
  }
  const name =
    item.kind === "sticker"
      ? STICKER_MAP[item.ref]?.name[lang]
      : item.kind === "bubble"
        ? BUBBLE_MAP[item.ref]?.name[lang]
        : t("words");
  const hasText = item.kind !== "sticker";
  return (
    <div className="tray" onPointerDown={(e) => e.preventDefault()}>
      <span className="tray-name">{name}</span>
      <div className="tray-group swatches" role="group" aria-label={t("color")}>
        {CRAYONS.map((c) => (
          <button
            key={c.id}
            className={`swatch ${item.color.toLowerCase() === c.hex ? "on" : ""}`}
            style={{ ["--sw" as string]: c.hex }}
            onClick={() => onPatch({ color: c.hex })}
            title={c[lang]}
            aria-label={c[lang]}
          />
        ))}
      </div>
      {hasText && (
        <div className="tray-group">
          <button className={`tbtn ${editing ? "on" : ""}`} onClick={onEdit} title={t("editText")}>
            <Icon.pencil />
            <span>{t("editText")}</span>
          </button>
          <div className="fonts" role="group" aria-label={t("font")}>
            {FONT_KEYS.map((f) => (
              <button key={f} className={`fbtn ${item.font === f ? "on" : ""}`} style={{ fontFamily: FONTS[f] }} onClick={() => onPatch({ font: f })} title={t(FONT_LABEL[f])}>
                {lang === "ja" ? "あ" : "Aa"}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={() => onPatch({ size: Math.max(0.8, +(item.size / 1.15).toFixed(2)) })} title={t("smaller")} aria-label={t("smaller")}>
            <Icon.smaller />
          </button>
          <button className="icon-btn" onClick={() => onPatch({ size: Math.min(14, +(item.size * 1.15).toFixed(2)) })} title={t("bigger")} aria-label={t("bigger")}>
            <Icon.bigger />
          </button>
        </div>
      )}
      <div className="tray-group">
        <button className="icon-btn" onClick={() => onPatch({ flip: !item.flip })} title={item.kind === "bubble" ? t("flipTail") : t("flipH")} aria-label={t("flipH")}>
          <Icon.flip />
        </button>
        <button className="icon-btn" onClick={onFront} title={t("front")} aria-label={t("front")}>
          <Icon.up />
        </button>
        <button className="icon-btn" onClick={onBack} title={t("back")} aria-label={t("back")}>
          <Icon.down />
        </button>
        <button className="icon-btn" onClick={onDup} title={t("dup")} aria-label={t("dup")}>
          <Icon.copy />
        </button>
        <button className="icon-btn danger" onClick={onDelete} title={t("del")} aria-label={t("del")}>
          <Icon.trash />
        </button>
      </div>
    </div>
  );
}
