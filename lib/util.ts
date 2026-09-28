export const uid = (n = 10) => {
  const a = "abcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  const r = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(n)) : null;
  for (let i = 0; i < n; i++) s += a[(r ? r[i] : Math.floor(Math.random() * 256)) % a.length];
  return s;
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function safeGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function safeSet(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}
