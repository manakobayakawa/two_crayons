"use client";

import { useEffect } from "react";
import type { Item, Meta, Page } from "@/lib/types";
import { PageView } from "./PageView";

export type Spread = { page: Page; items: readonly Item[] };

function Half({ s, side, meta }: { s: Spread; side: "l" | "r"; meta: Meta }) {
  return (
    <div className={`half half-${side}`}>
      <PageView page={s.page} items={s.items} meta={meta} className="half-page" />
    </div>
  );
}

/** A real picture-book page turn: the right (or left) half of the spread lifts and turns over. */
export function Flip({ from, to, dir, meta, onDone, ms = 900 }: { from: Spread; to: Spread; dir: 1 | -1; meta: Meta; onDone: () => void; ms?: number }) {
  useEffect(() => {
    const t = setTimeout(onDone, ms + 60);
    return () => clearTimeout(t);
  }, [onDone, ms]);
  return (
    <div className="flip" style={{ ["--flip-ms" as string]: `${ms}ms` }} aria-hidden>
      <div className="flip-under">
        <PageView page={to.page} items={to.items} meta={meta} />
        <div className={`flip-under-shade ${dir === 1 ? "r" : "l"}`} />
      </div>
      {dir === 1 ? (
        <>
          <div className="flip-static l">
            <Half s={from} side="l" meta={meta} />
          </div>
          <div className="leaf leaf-next">
            <div className="face front">
              <Half s={from} side="r" meta={meta} />
              <div className="face-shade" />
            </div>
            <div className="face back">
              <Half s={to} side="l" meta={meta} />
              <div className="face-shade" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flip-static r">
            <Half s={from} side="r" meta={meta} />
          </div>
          <div className="leaf leaf-prev">
            <div className="face front">
              <Half s={from} side="l" meta={meta} />
              <div className="face-shade" />
            </div>
            <div className="face back">
              <Half s={to} side="r" meta={meta} />
              <div className="face-shade" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
