"use client";

import { memo, type CSSProperties, type ReactNode } from "react";
import { STICKER_MAP, StickerSvg } from "@/assets/stickers";
import { BUBBLE_H, BUBBLE_MAP, BubbleSvg } from "@/assets/bubbles";
import { BgSvg } from "@/assets/backgrounds";
import type { Item, Meta, Page } from "@/lib/types";
import { FONTS, defaultTextColor, itemText } from "@/lib/doc";

export function itemStyle(it: Item): CSSProperties {
  return {
    left: `calc(${it.x} * 1cqw)`,
    top: `calc(${it.y} * 1cqw)`,
    width: `calc(${it.w} * 1cqw)`,
    height: it.kind === "text" ? undefined : `calc(${it.h} * 1cqw)`,
    transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
    zIndex: it.z,
  };
}

export function textStyle(it: Item): CSSProperties {
  return {
    fontFamily: FONTS[it.font] ?? FONTS.crayon,
    fontSize: `calc(${it.size} * 1cqw)`,
    color: defaultTextColor(it),
  };
}

/** The visible drawing of one item. `textSlot` lets the editor swap in an editable node. */
export const ItemBody = memo(function ItemBody({
  item,
  meta,
  textSlot,
  placeholder,
}: {
  item: Item;
  meta: Meta;
  textSlot?: ReactNode;
  placeholder?: string;
}) {
  const text = itemText(item, meta);
  const shown = textSlot ?? (text ? text : placeholder ? <span className="ph">{placeholder}</span> : null);
  if (item.kind === "sticker") {
    const def = STICKER_MAP[item.ref];
    if (!def) return null;
    return (
      <div className="it-art" style={{ transform: item.flip ? "scaleX(-1)" : undefined }}>
        <StickerSvg def={def} color={item.color} />
      </div>
    );
  }
  if (item.kind === "bubble") {
    const def = BUBBLE_MAP[item.ref];
    if (!def) return null;
    const W = BUBBLE_H * (item.w / item.h);
    const b = def.box(W, BUBBLE_H);
    return (
      <>
        <BubbleSvg def={def} W={W} H={BUBBLE_H} color={item.color} flip={item.flip} />
        <div
          className="bubble-text"
          style={{
            left: `${(b.x / W) * 100}%`,
            top: `${(b.y / BUBBLE_H) * 100}%`,
            width: `${(b.w / W) * 100}%`,
            height: `${(b.h / BUBBLE_H) * 100}%`,
            ...textStyle(item),
          }}
        >
          <div className="bubble-text-inner">{shown}</div>
        </div>
      </>
    );
  }
  return (
    <div className="free-text" style={textStyle(item)}>
      {shown}
    </div>
  );
});

/** Static, non-interactive render of a spread – used for thumbnails, page turns, reading, print. */
export const PageView = memo(function PageView({
  page,
  items,
  meta,
  className,
  children,
}: {
  page: Page;
  items: readonly Item[];
  meta: Meta;
  className?: string;
  children?: ReactNode;
}) {
  const sorted = [...items].sort((a, b) => a.z - b.z);
  return (
    <div className={`page ${className ?? ""}`} data-bg={page.bg}>
      <div className="page-paper" />
      <BgSvg id={page.bg} />
      <div className="page-items">
        {sorted.map((it) => (
          <div key={it.id} className={`it it-${it.kind}`} style={itemStyle(it)}>
            <ItemBody item={it} meta={meta} />
          </div>
        ))}
      </div>
      <div className="page-gutter" />
      {children}
    </div>
  );
});
