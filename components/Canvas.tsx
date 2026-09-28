"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties, type PointerEvent as RPE } from "react";
import { BgSvg } from "@/assets/backgrounds";
import type { Item, Meta, Page, Peer } from "@/lib/types";
import { PAGE_H } from "@/lib/types";
import { useBook } from "@/lib/store";
import { clamp } from "@/lib/util";
import { useI18n } from "@/lib/i18n";
import { itemText } from "@/lib/doc";
import { ItemBody, itemStyle, textStyle } from "./PageView";
import { CrayonCursor, Icon } from "./Icons";

type Mode = "move" | "scale" | "resize" | "width" | "rotate";
type Drag = {
  mode: Mode;
  id: string;
  start: { x: number; y: number };
  orig: Item;
  moved: boolean;
  pointerId: number;
};

export type DropPayload = { type: "sticker" | "bubble" | "text"; ref: string };

export function Canvas({
  page,
  items,
  meta,
  peers,
  selected,
  editing,
  onSelect,
  onEdit,
  onDropPart,
  me,
}: {
  page: Page;
  items: readonly Item[];
  meta: Meta;
  peers: Peer[];
  selected: string | null;
  editing: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (id: string | null) => void;
  onDropPart: (p: DropPayload, at: { x: number; y: number }) => void;
  me: { name: string };
}) {
  const api = useBook();
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const pending = useRef<{ id: string; patch: Partial<Item> } | null>(null);
  const raf = useRef(0);
  const lastCursor = useRef(0);
  const L = useRef({ api, editing, peers, onSelect, onEdit });
  L.current = { api, editing, peers, onSelect, onEdit };

  const toU = useCallback((cx: number, cy: number) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((cx - r.left) / r.width) * 100, y: ((cy - r.top) / r.width) * 100 };
  }, []);

  const flush = useCallback(() => {
    raf.current = 0;
    const p = pending.current;
    if (p) {
      pending.current = null;
      L.current.api.updateItem(p.id, p.patch);
    }
  }, []);

  const queue = useCallback(
    (id: string, patch: Partial<Item>) => {
      pending.current = { id, patch: { ...(pending.current?.id === id ? pending.current.patch : {}), ...patch } };
      if (!raf.current) raf.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const dragMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId || !ref.current) return;
      const p = toU(e.clientX, e.clientY);
      const o = d.orig;
      const dx = p.x - d.start.x,
        dy = p.y - d.start.y;
      if (!d.moved && Math.hypot(dx, dy) < 0.3) return;
      d.moved = true;
      const vx = p.x - o.x,
        vy = p.y - o.y;
      const a = (-o.rot * Math.PI) / 180;
      const lx = vx * Math.cos(a) - vy * Math.sin(a);
      const ly = vx * Math.sin(a) + vy * Math.cos(a);
      if (d.mode === "move") {
        queue(d.id, { x: +clamp(o.x + dx, -2, 102).toFixed(2), y: +clamp(o.y + dy, -2, PAGE_H + 2).toFixed(2) });
      } else if (d.mode === "scale") {
        const d0 = Math.hypot(d.start.x - o.x, d.start.y - o.y) || 1;
        const f = Math.hypot(vx, vy) / d0;
        const w = clamp(o.w * f, 3, 150);
        const k = w / o.w;
        queue(
          d.id,
          o.kind === "sticker"
            ? { w: +w.toFixed(2), h: +(o.h * k).toFixed(2) }
            : o.kind === "text"
              ? { w: +w.toFixed(2), size: +clamp(o.size * k, 0.8, 14).toFixed(2) }
              : { w: +w.toFixed(2), h: +(o.h * k).toFixed(2), size: +clamp(o.size * k, 0.8, 14).toFixed(2) },
        );
      } else if (d.mode === "resize") {
        queue(d.id, { w: +clamp(Math.abs(lx) * 2, 6, 150).toFixed(2), h: +clamp(Math.abs(ly) * 2, 4, 90).toFixed(2) });
      } else if (d.mode === "width") {
        queue(d.id, { w: +clamp(Math.abs(lx) * 2, 5, 150).toFixed(2) });
      } else if (d.mode === "rotate") {
        const a0 = Math.atan2(d.start.y - o.y, d.start.x - o.x);
        const a1 = Math.atan2(vy, vx);
        let r = o.rot + ((a1 - a0) * 180) / Math.PI;
        r = ((((r + 180) % 360) + 360) % 360) - 180;
        const snap = Math.round(r / 45) * 45;
        if (Math.abs(r - snap) < 4) r = snap;
        queue(d.id, { rot: +r.toFixed(1) });
      }
    },
    [queue, toU],
  );

  const endDrag = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId) return;
      drag.current = null;
      window.removeEventListener("pointermove", dragMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        flush();
      }
      L.current.api.resume();
    },
    [dragMove, flush],
  );

  const begin = useCallback(
    (e: RPE, it: Item, mode: Mode) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      const { editing, peers, onSelect, onEdit, api } = L.current;
      if (editing === it.id && mode === "move") return;
      if (peers.some((p) => p.editing === it.id)) return;
      onSelect(it.id);
      if (editing && editing !== it.id) onEdit(null);
      drag.current = { mode, id: it.id, start: toU(e.clientX, e.clientY), orig: { ...it }, moved: false, pointerId: e.pointerId };
      api.pause();
      window.addEventListener("pointermove", dragMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
    },
    [toU, dragMove, endDrag],
  );

  const onMove = (e: RPE) => {
    const now = performance.now();
    if (now - lastCursor.current < 40) return;
    lastCursor.current = now;
    const p = toU(e.clientX, e.clientY);
    api.setPresence({ cursor: { x: +p.x.toFixed(2), y: +p.y.toFixed(2) } });
  };

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", dragMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    },
    [dragMove, endDrag],
  );

  const peerSel: Record<string, Peer[]> = {};
  peers.forEach((p) => {
    const id = p.editing || p.selected;
    if (id) (peerSel[id] ||= []).push(p);
  });

  const sorted = [...items].sort((a, b) => a.z - b.z);

  return (
    <div
      ref={ref}
      className="page page-live"
      data-bg={page.bg}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".page-hit")) {
          onSelect(null);
          onEdit(null);
        }
      }}
      onPointerMove={onMove}
      onPointerLeave={() => api.setPresence({ cursor: null })}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("application/x-tc")) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }
      }}
      onDrop={(e) => {
        const raw = e.dataTransfer.getData("application/x-tc");
        if (!raw) return;
        e.preventDefault();
        onDropPart(JSON.parse(raw) as DropPayload, toU(e.clientX, e.clientY));
      }}
    >
      <div className="page-paper page-hit" />
      <div className="page-hit page-bg-hit">
        <BgSvg id={page.bg} />
      </div>
      <div className="page-items">
        {sorted.map((it) => (
          <LiveItem
            key={it.id}
            item={it}
            meta={meta}
            selected={selected === it.id}
            editing={editing === it.id}
            peers={peerSel[it.id]}
            onBegin={begin}
            onEdit={onEdit}
            placeholder={t("writeHere")}
          />
        ))}
      </div>
      <div className="page-gutter" />
      {peers.map((p) =>
        p.cursor ? (
          <div key={p.id} className="peer-cursor" style={{ left: `${p.cursor.x}%`, top: `calc(${p.cursor.y} * 1cqw)`, "--pc": p.color } as CSSProperties}>
            <CrayonCursor color={p.color} />
            <span className="peer-name">{p.name}</span>
          </div>
        ) : null,
      )}
      <span className="sr-only">{me.name}</span>
    </div>
  );
}

const LiveItem = memo(function LiveItem({
  item,
  meta,
  selected,
  editing,
  peers,
  onBegin,
  onEdit,
  placeholder,
}: {
  item: Item;
  meta: Meta;
  selected: boolean;
  editing: boolean;
  peers?: Peer[];
  onBegin: (e: RPE, it: Item, m: Mode) => void;
  onEdit: (id: string | null) => void;
  placeholder: string;
}) {
  const hasText = item.kind !== "sticker";
  const peer = peers?.[0];
  const locked = !!peers?.some((p) => p.editing === item.id);
  return (
    <div
      className={`it it-${item.kind} live ${selected ? "is-sel" : ""} ${editing ? "is-editing" : ""} ${peer ? "peer-sel" : ""}`}
      style={{ ...itemStyle(item), ...(peer ? ({ "--pc": peer.color } as CSSProperties) : {}) }}
      onPointerDown={(e) => onBegin(e, item, "move")}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (hasText && !locked) onEdit(item.id);
      }}
      data-id={item.id}
    >
      <ItemBody item={item} meta={meta} placeholder={placeholder} textSlot={editing ? <EditableText item={item} onDone={() => onEdit(null)} /> : undefined} />
      {peer && (
        <span className="peer-tag">
          {peer.name}
          {locked ? " ✎" : ""}
        </span>
      )}
      {selected && !editing && (
        <>
          <div className="sel-box" />
          <button className="h h-rot" aria-label="rotate" onPointerDown={(e) => onBegin(e, item, "rotate")}>
            <Icon.rotate />
          </button>
          {item.kind === "bubble" ? (
            <button className="h h-br" aria-label="resize" onPointerDown={(e) => onBegin(e, item, "resize")} />
          ) : (
            <button className="h h-br" aria-label="scale" onPointerDown={(e) => onBegin(e, item, "scale")} />
          )}
          {item.kind === "text" && <button className="h h-r" aria-label="width" onPointerDown={(e) => onBegin(e, item, "width")} />}
          {item.kind === "bubble" && <button className="h h-tl" aria-label="scale" onPointerDown={(e) => onBegin(e, item, "scale")} />}
        </>
      )}
    </div>
  );
});

function EditableText({ item, onDone }: { item: Item; onDone: () => void }) {
  const api = useBook();
  const ref = useRef<HTMLDivElement>(null);
  const initial = useRef(itemText(item, api.meta));
  useLayoutEffect(() => {
    const el = ref.current!;
    el.innerText = initial.current;
    el.focus();
    const sel = window.getSelection();
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const push = () => {
    const v = ref.current!.innerText.replace(/\n$/, "");
    if (item.bind) api.setMeta({ [item.bind]: v });
    else api.updateItem(item.id, { text: v });
  };
  return (
    <div
      ref={ref}
      className="edit-text"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      style={{ ...textStyle(item), fontSize: "inherit" }}
      onInput={push}
      onBlur={onDone}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") (e.target as HTMLElement).blur();
      }}
      onPaste={(e) => {
        e.preventDefault();
        document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
      }}
    />
  );
}
