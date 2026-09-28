import { STICKER_MAP } from "@/assets/stickers";
import { BUBBLE_MAP } from "@/assets/bubbles";
import { C, INK } from "@/assets/crayon";
import type { FontKey, Item, Meta, Page } from "./types";
import { uid } from "./util";

export type Doc = { meta: Meta; pages: Page[]; items: Record<string, Item> };

export const FONTS: Record<FontKey, string> = {
  crayon: '"Gochi Hand", "Yusei Magic", cursive',
  pencil: '"Patrick Hand", "Klee One", cursive',
  round: '"Fredoka", "Kiwi Maru", sans-serif',
  pop: '"Chewy", "Hachi Maru Pop", cursive',
};

const base = (pageId: string, by: string): Omit<Item, "kind" | "ref" | "w" | "h" | "color"> => ({
  id: uid(),
  pageId,
  x: 50,
  y: 31,
  rot: 0,
  flip: false,
  z: 1,
  text: "",
  font: "crayon",
  size: 2.6,
  by,
  bind: "",
});

export function makeSticker(ref: string, pageId: string, by: string, w?: number): Item {
  const def = STICKER_MAP[ref];
  const width = w ?? (def.vb[2] > def.vb[3] * 1.3 ? 22 : 15);
  return { ...base(pageId, by), kind: "sticker", ref, w: width, h: (width * def.vb[3]) / def.vb[2], color: def.color };
}

export function makeBubble(ref: string, pageId: string, by: string, text = ""): Item {
  const def = BUBBLE_MAP[ref];
  return {
    ...base(pageId, by),
    kind: "bubble",
    ref,
    w: def.width,
    h: def.width / def.aspect,
    color: def.color,
    text,
    size: ref === "banner" ? 3.4 : 2.5,
    font: ref === "caption" || ref === "note" ? "pencil" : "crayon",
  };
}

export function makeText(pageId: string, by: string, text = ""): Item {
  return { ...base(pageId, by), kind: "text", ref: "", w: 30, h: 6, color: INK, text, size: 3.2 };
}

export function seedDoc(lang: "en" | "ja", name: string): Doc {
  const cover: Page = { id: uid(), bg: "garden" };
  const p1: Page = { id: uid(), bg: "meadow" };
  const p2: Page = { id: uid(), bg: "paper" };
  const items: Item[] = [];
  const title = { ...makeBubble("banner", cover.id, name), x: 50, y: 15, w: 52, h: 14.4, bind: "title" as const, size: 3.6, z: 5 };
  const authors = { ...makeText(cover.id, name), x: 50, y: 26.5, w: 40, size: 2.4, bind: "authors" as const, z: 5 };
  const bear = { ...makeSticker("bear", cover.id, name, 15), x: 38, y: 44, z: 3 };
  const bunny = { ...makeSticker("bunny", cover.id, name, 15), x: 62, y: 44, z: 3, flip: true };
  const heart = { ...makeSticker("heart", cover.id, name, 6), x: 50, y: 38, z: 4, rot: -8 };
  const cap = {
    ...makeBubble("caption", p1.id, name, lang === "ja" ? "むかしむかし、あるところに…" : "Once upon a time…"),
    x: 28,
    y: 10,
    z: 2,
  };
  const sun = { ...makeSticker("sun", p1.id, name, 11), x: 88, y: 11, z: 1 };
  items.push(title, authors, bear, bunny, heart, cap, sun);
  return {
    meta: { title: lang === "ja" ? "ふたりのおはなし" : "Our Little Story", authors: name ? `${name} & …` : "" },
    pages: [cover, p1, p2],
    items: Object.fromEntries(items.map((i) => [i.id, i])),
  };
}

export const itemText = (it: Item, meta: Meta) => (it.bind ? meta[it.bind] : it.text);

export const defaultTextColor = (it: Item) => (it.kind === "bubble" ? BUBBLE_MAP[it.ref]?.textColor ?? INK : it.color);

export { C };
