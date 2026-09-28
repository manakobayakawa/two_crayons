"use client";

import { memo, useEffect, useRef } from "react";
import type { Item, Meta, Page, Peer } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PageView } from "./PageView";
import { Icon } from "./Icons";

const Thumb = memo(function Thumb({ page, items, meta }: { page: Page; items: readonly Item[]; meta: Meta }) {
  return <PageView page={page} items={items} meta={meta} className="thumb-page" />;
});

export function PageStrip({
  pages,
  byPage,
  meta,
  current,
  peers,
  myColor,
  onGo,
  onAdd,
  onDuplicate,
  onDelete,
  onMove,
}: {
  pages: readonly Page[];
  byPage: Map<string, Item[]>;
  meta: Meta;
  current: number;
  peers: Peer[];
  myColor: string;
  onGo: (i: number) => void;
  onAdd: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (d: -1 | 1) => void;
}) {
  const { t } = useI18n();
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-idx="${current}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [current]);
  return (
    <div className="strip">
      <div className="strip-actions">
        <button className="icon-btn" onClick={() => onMove(-1)} disabled={current <= 0} title={t("moveLeft")} aria-label={t("moveLeft")}>
          <Icon.left />
        </button>
        <button className="icon-btn" onClick={() => onMove(1)} disabled={current >= pages.length - 1} title={t("moveRight")} aria-label={t("moveRight")}>
          <Icon.right />
        </button>
        <button className="icon-btn" onClick={onDuplicate} title={t("duplicatePage")} aria-label={t("duplicatePage")}>
          <Icon.copy />
        </button>
        <button className="icon-btn danger" onClick={onDelete} disabled={pages.length <= 1} title={t("deletePage")} aria-label={t("deletePage")}>
          <Icon.trash />
        </button>
      </div>
      <div className="strip-scroll" ref={scroller}>
        {pages.map((p, i) => {
          const here = peers.filter((o) => o.pageId === p.id);
          return (
            <button key={p.id} data-idx={i} className={`thumb ${i === current ? "on" : ""}`} onClick={() => onGo(i)} aria-current={i === current}>
              <span className="thumb-frame">
                <Thumb page={p} items={byPage.get(p.id) ?? EMPTY} meta={meta} />
              </span>
              <span className="thumb-label">{i === 0 ? t("cover") : `${i}`}</span>
              <span className="thumb-dots">
                {i === current && <i style={{ background: myColor }} />}
                {here.map((o) => (
                  <i key={o.id} style={{ background: o.color }} title={o.name} />
                ))}
              </span>
            </button>
          );
        })}
        <button className="thumb thumb-add" onClick={onAdd} title={t("addPage")}>
          <span className="thumb-frame">
            <Icon.plus />
          </span>
          <span className="thumb-label">{t("addPage")}</span>
        </button>
      </div>
    </div>
  );
}

const EMPTY: Item[] = [];
