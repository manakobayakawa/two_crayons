// All geometry is expressed in "U" units: 1U = 1% of the spread's width.
// A spread is 100U wide and PAGE_H U tall (16:10), so pages scale at any size.
export const PAGE_W = 100;
export const PAGE_H = 62.5;

export type FontKey = "crayon" | "pencil" | "round" | "pop";

export type ItemKind = "sticker" | "bubble" | "text";

export type Item = {
  id: string;
  pageId: string;
  kind: ItemKind;
  /** asset id (sticker / bubble). empty for plain text */
  ref: string;
  /** center point */
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  flip: boolean;
  z: number;
  /** main crayon colour (recolourable stickers, bubble fill, text colour) */
  color: string;
  text: string;
  font: FontKey;
  /** font size in U */
  size: number;
  /** display name of whoever added it */
  by: string;
  /** "title" / "authors" → text is bound to the book meta */
  bind: "" | "title" | "authors";
};

export type Page = {
  id: string;
  bg: string;
};

export type Meta = {
  title: string;
  authors: string;
  /** closing words on the last page (empty → "The End" / "おしまい") */
  ending?: string;
};

export type Peer = {
  id: number;
  name: string;
  color: string;
  pageId: string | null;
  cursor: { x: number; y: number } | null;
  selected: string | null;
  editing: string | null;
};

export type Presence = Omit<Peer, "id">;

export type Reaction = { type: "love"; name: string; color: string };

export type KeyProblem = "" | "missing" | "secret" | "invalid";
