"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Item, Meta, Page } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { makeText } from "@/lib/doc";
import { playFlip } from "@/lib/sound";
import { Flip, type Spread } from "./Flip";
import { PageView } from "./PageView";
import { Icon } from "./Icons";

export function ReadMode({
  pages,
  byPage,
  meta,
  start,
  sound,
  onClose,
  onPage,
}: {
  pages: readonly Page[];
  byPage: Map<string, Item[]>;
  meta: Meta;
  start: number;
  sound: boolean;
  onClose: (lastIndex: number) => void;
  onPage?: (i: number) => void;
}) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(start);
  const [flip, setFlip] = useState<{ to: number; dir: 1 | -1 } | null>(null);
  const endSpread = useMemo<Spread>(() => {
    const id = "__end";
    const a = { ...makeText(id, ""), text: t("theEnd"), size: 8, x: 50, y: 27, w: 60, font: "crayon" as const, color: "#ff5a5f" };
    const b = { ...makeText(id, ""), x: 50, y: 38, w: 60, size: 2.6, bind: "authors" as const, font: "pencil" as const };
    const c = { ...makeText(id, ""), x: 50, y: 45, w: 40, size: 3.4, text: "♡", color: "#ff8fb8" };
    return { page: { id, bg: "paper" }, items: [a, b, c] };
  }, [t]);
  const total = pages.length + 1;
  const spreadAt = useCallback(
    (i: number): Spread => (i >= pages.length ? endSpread : { page: pages[i], items: byPage.get(pages[i].id) ?? [] }),
    [pages, byPage, endSpread],
  );

  const go = useCallback(
    (to: number) => {
      if (flip || to < 0 || to >= total || to === idx) return;
      playFlip(sound);
      setFlip({ to, dir: to > idx ? 1 : -1 });
    },
    [flip, idx, total, sound],
  );
  const done = useCallback(() => {
    setFlip((f) => {
      if (f) setIdx(f.to);
      return null;
    });
  }, []);
  const idxRef = useRef(idx);
  idxRef.current = idx;
  useEffect(() => {
    if (idx < pages.length) onPage?.(idx);
  }, [idx, pages.length, onPage]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(idxRef.current + 1);
      } else if (e.key === "ArrowLeft") go(idxRef.current - 1);
      else if (e.key === "Escape") onClose(Math.min(idxRef.current, pages.length - 1));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, onClose, pages.length]);

  // swipe
  const touch = useRef<number | null>(null);

  const cur = spreadAt(idx);
  return (
    <div
      className="reader"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      <div className="reader-top">
        <div className="reader-title">
          <strong>{meta.title}</strong>
          <span>{meta.authors}</span>
        </div>
        <button className="btn ghost" onClick={() => onClose(Math.min(idx, pages.length - 1))}>
          <Icon.pencil /> {t("exitRead")}
        </button>
      </div>
      <div className="reader-stage">
        <button className="turn turn-prev" onClick={() => go(idx - 1)} disabled={idx <= 0} aria-label={t("prev")}>
          <Icon.left />
        </button>
        <div className="book book-read">
          <div className="book-edges" />
          <div className="spread">
            {flip ? <Flip from={cur} to={spreadAt(flip.to)} dir={flip.dir} meta={meta} onDone={done} ms={1000} /> : <PageView page={cur.page} items={cur.items} meta={meta} />}
            {!flip && (
              <>
                <button className="hot hot-l" onClick={() => go(idx - 1)} aria-label={t("prev")} />
                <button className="hot hot-r" onClick={() => go(idx + 1)} aria-label={t("next")} />
              </>
            )}
          </div>
        </div>
        <button className="turn turn-next" onClick={() => go(idx + 1)} disabled={idx >= total - 1} aria-label={t("next")}>
          <Icon.right />
        </button>
      </div>
      <div className="reader-dots">
        {Array.from({ length: total }, (_, i) => (
          <button key={i} className={i === idx ? "on" : ""} onClick={() => go(i)} aria-label={`${i}`} />
        ))}
      </div>
    </div>
  );
}
