import "server-only";

import type { KeyProblem } from "./types";
export type { KeyProblem };

/**
 * Read the Liveblocks public key on the server at request time.
 * Accepts a few common variable names, trims stray spaces/quotes, and never
 * forwards a secret (sk_) key to the browser.
 */
export function resolveLiveKey(): { key: string; problem: KeyProblem } {
  const raw = (process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || process.env.LIVEBLOCKS_PUBLIC_KEY || process.env.LIVEBLOCKS_KEY || "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
  if (!raw) return { key: "", problem: "missing" };
  if (raw.startsWith("sk_")) return { key: "", problem: "secret" };
  if (!raw.startsWith("pk_")) return { key: "", problem: "invalid" };
  return { key: raw, problem: "" };
}
