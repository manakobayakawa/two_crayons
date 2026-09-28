"use client";

import { useEffect, useState } from "react";
import { useBook } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

type Burst = { id: number; color: string; name: string; hearts: { x: number; d: number; s: number; r: number }[] };

export function Hearts({ myName }: { myName: string }) {
  const { onReaction } = useBook();
  const { lang } = useI18n();
  const [bursts, setBursts] = useState<Burst[]>([]);
  useEffect(
    () =>
      onReaction((r) => {
        const id = Date.now() + Math.random();
        const hearts = Array.from({ length: 16 }, () => ({ x: 8 + Math.random() * 84, d: Math.random() * 0.9, s: 0.7 + Math.random() * 1.1, r: Math.random() * 40 - 20 }));
        setBursts((b) => [...b, { id, color: r.color, name: r.name, hearts }]);
        setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 3600);
      }),
    [onReaction],
  );
  return (
    <div className="hearts" aria-live="polite">
      {bursts.map((b) => (
        <div key={b.id}>
          {b.hearts.map((h, i) => (
            <svg
              key={i}
              className="float-heart"
              viewBox="0 0 24 24"
              style={{ left: `${h.x}%`, animationDelay: `${h.d}s`, width: 34 * h.s, height: 34 * h.s, ["--r" as string]: `${h.r}deg` }}
            >
              <path d="M12 21s-8.5-5-9.3-11A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 9.3 3C20.5 16 12 21 12 21z" fill={b.color} stroke="#4a3a3a" strokeWidth={1.4} filter="url(#cr)" />
            </svg>
          ))}
          {b.name !== myName && (
            <div className="toast toast-love" style={{ ["--pc" as string]: b.color }}>
              {lang === "ja" ? `${b.name}からハートがとどいたよ ♡` : `${b.name} sent you love ♡`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
