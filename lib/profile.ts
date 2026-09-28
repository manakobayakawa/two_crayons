"use client";
import { CRAYONS } from "@/assets/crayon";
import { safeGet, safeSet } from "./util";

export type Profile = { name: string; color: string };
export type ShelfEntry = { id: string; title: string; openedAt: number };

export const getProfile = (): Profile | null => {
  const p = safeGet<Profile | null>("tc.profile", null);
  return p && p.name ? p : null;
};
export const setProfile = (p: Profile) => safeSet("tc.profile", p);
export const defaultColor = CRAYONS[0].hex;

export const getShelf = (): ShelfEntry[] => safeGet<ShelfEntry[]>("tc.shelf", []);
export function touchShelf(id: string) {
  const shelf = getShelf();
  const prev = shelf.find((s) => s.id === id);
  const rest = shelf.filter((s) => s.id !== id);
  safeSet("tc.shelf", [{ id, title: prev?.title ?? "", openedAt: Date.now() }, ...rest].slice(0, 40));
}
export function setShelfTitle(id: string, title: string) {
  const shelf = getShelf();
  const e = shelf.find((s) => s.id === id);
  if (e && e.title !== title) {
    e.title = title;
    safeSet("tc.shelf", shelf);
  }
}
export function removeFromShelf(id: string) {
  safeSet(
    "tc.shelf",
    getShelf().filter((s) => s.id !== id),
  );
}
