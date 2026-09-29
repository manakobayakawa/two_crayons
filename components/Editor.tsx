"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBook } from "@/lib/store";
import { LangToggle, useI18n } from "@/lib/i18n";
import type { Item, Page } from "@/lib/types";
import { PAGE_H } from "@/lib/types";
import { makeBubble, makeSticker, makeText } from "@/lib/doc";
import { setShelfTitle, type Profile } from "@/lib/profile";
import { playFlip } from "@/lib/sound";
import { safeGet, safeSet, uid } from "@/lib/util";
import { Canvas, type DropPayload } from "./Canvas";
import { Drawer } from "./Drawer";
import { Flip } from "./Flip";
import { PageStrip } from "./PageStrip";
import { Tray } from "./Tray";
import { ReadMode } from "./ReadMode";
import { Hearts } from "./Hearts";
import { PageView } from "./PageView";
import { Icon } from "./Icons";
import { SoloHelp } from "./SoloHelp";
import type { KeyProblem } from "@/lib/types";

function useStableByPage(pages: readonly Page[], items: readonly Item[]) {
  const prev = useRef(new Map<string, Item[]>());
  return useMemo(() => {
    const next = new Map<string, Item[]>();
    pages.forEach((p) => next.set(p.id, []));
    items.forEach((it) => next.get(it.pageId)?.push(it));
    next.forEach((arr, k) => {
      arr.sort((a, b) => a.z - b.z || (a.id < b.id ? -1 : 1));
      const old = prev.current.get(k);
      if (old && old.length === arr.length && old.every((x, i) => x === arr[i])) next.set(k, old);
    });
    prev.current = next;
    return next;
  }, [pages, items]);
}

/** Pick a free-ish spot for a new part: prefer its natural band (sky for bubbles, ground for friends). */
function findSpot(it: Item, existing: Item[]) {
  const h = it.kind === "text" ? it.size * 1.6 : it.h;
  const prefY = it.kind === "sticker" ? PAGE_H * 0.62 : it.kind === "bubble" ? PAGE_H * 0.3 : PAGE_H * 0.16;
  let best = { x: 50, y: prefY, score: Infinity };
  for (let x = 14; x <= 86; x += 6) {
    for (let y = 8; y <= PAGE_H - 7; y += 4) {
      let overlap = 0;
      for (const o of existing) {
        const oh = o.kind === "text" ? o.size * 1.6 : o.h;
        const ox = Math.max(0, Math.min(x + it.w / 2, o.x + o.w / 2) - Math.max(x - it.w / 2, o.x - o.w / 2));
        const oy = Math.max(0, Math.min(y + h / 2, o.y + oh / 2) - Math.max(y - h / 2, o.y - oh / 2));
        overlap += ox * oy;
      }
      const edge = x - it.w / 2 < 1 || x + it.w / 2 > 99 || y - h / 2 < 1 || y + h / 2 > PAGE_H - 1 ? 400 : 0;
      const gutter = Math.abs(x - 50) < 3 ? 30 : 0;
      const score = overlap * 3 + edge + gutter + Math.abs(y - prefY) * 6 + Math.abs(x - 50) * 1.5 + Math.random() * 20;
      if (score < best.score) best = { x, y, score };
    }
  }
  return { x: best.x, y: best.y };
}

export function Editor({ bookId, profile, keyProblem }: { bookId: string; profile: Profile; keyProblem: KeyProblem }) {
  const api = useBook();
  const { t, lang } = useI18n();
  const { pages, items, meta, others } = api;
  const byPage = useStableByPage(pages, items);

  const [curId, setCurId] = useState<string>(() => pages[0]?.id);
  const lastIdx = useRef(0);
  let idx = pages.findIndex((p) => p.id === curId);
  if (idx < 0) idx = Math.min(lastIdx.current, pages.length - 1);
  lastIdx.current = idx;
  const page = pages[idx];

  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [flip, setFlip] = useState<{ from: number; to: number; dir: 1 | -1 } | null>(null);
  const [reading, setReading] = useState(false);
  const [follow, setFollow] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sound, setSound] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [soloHidden, setSoloHidden] = useState(false);

  useEffect(() => setSound(safeGet("tc.sound", true)), []);
  useEffect(() => {
    if (page && page.id !== curId) setCurId(page.id);
  }, [page, curId]);

  // presence
  useEffect(() => {
    api.setPresence({ pageId: page?.id ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.id]);
  useEffect(() => {
    api.setPresence({ selected, editing });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, editing]);

  useEffect(() => setShelfTitle(bookId, meta.title), [bookId, meta.title]);
  // "Mana & …" → "Mana & Genzo" the first time the second author opens the book
  useEffect(() => {
    const a = meta.authors || "";
    if (a.endsWith(" & …") && profile.name && !a.startsWith(`${profile.name} `)) {
      api.setMeta({ authors: a.replace(/ & …$/, ` & ${profile.name}`) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.authors, profile.name]);
  useEffect(() => {
    document.title = `${meta.title || "Two Crayons"} · Two Crayons`;
  }, [meta.title]);

  // selection dies with its item
  const selItem = selected ? items.find((i) => i.id === selected) ?? null : null;
  useEffect(() => {
    if (selected && !selItem) {
      setSelected(null);
      setEditing(null);
    }
  }, [selected, selItem]);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((m) => (m === msg ? null : m)), 2600);
  }, []);

  /* ─── page navigation with a page turn ─── */
  const goTo = useCallback(
    (to: number) => {
      if (flip || to === idx || to < 0 || to >= pages.length) return;
      setSelected(null);
      setEditing(null);
      playFlip(sound);
      setFlip({ from: idx, to, dir: to > idx ? 1 : -1 });
    },
    [flip, idx, pages.length, sound],
  );
  const flipDone = useCallback(() => {
    setFlip((f) => {
      if (f) {
        const target = pagesRef.current[f.to];
        if (target) setCurId(target.id);
      }
      return null;
    });
  }, []);
  const pagesRef = useRef(pages);
  pagesRef.current = pages;

  // follow partner
  const partner = others[0];
  useEffect(() => {
    if (!follow || !partner?.pageId || reading) return;
    const i = pages.findIndex((p) => p.id === partner.pageId);
    if (i >= 0 && i !== idx && !flip) goTo(i);
  }, [follow, partner?.pageId, pages, idx, flip, goTo, reading]);
  useEffect(() => {
    if (!partner) setFollow(false);
  }, [partner]);

  /* ─── item ops ─── */
  const topZ = useCallback((pid: string) => Math.max(0, ...(byPage.get(pid) ?? []).map((i) => i.z)), [byPage]);

  const addPart = useCallback(
    (p: DropPayload & { font?: Item["font"]; color?: string }, at?: { x: number; y: number }) => {
      if (!page) return;
      const by = profile.name;
      let it: Item;
      if (p.type === "sticker") it = makeSticker(p.ref, page.id, by);
      else if (p.type === "bubble") it = makeBubble(p.ref, page.id, by);
      else it = { ...makeText(page.id, by, p.ref), ...(p.font ? { font: p.font } : {}), ...(p.color ? { color: p.color } : {}) };
      const spot = at ?? findSpot(it, byPage.get(page.id) ?? []);
      it.x = spot.x;
      it.y = spot.y;
      it.z = topZ(page.id) + 1;
      api.addItems([it]);
      setSelected(it.id);
      setDrawerOpen(false);
      if ((p.type === "bubble" || p.type === "text") && !it.text) setTimeout(() => setEditing(it.id), 30);
      else setEditing(null);
    },
    [page, profile.name, topZ, api, byPage],
  );

  const patchSel = useCallback((patch: Partial<Item>) => selected && api.updateItem(selected, patch), [selected, api]);
  const deleteSel = useCallback(() => {
    if (!selected) return;
    api.deleteItem(selected);
    setSelected(null);
    setEditing(null);
  }, [selected, api]);
  const dupSel = useCallback(() => {
    if (!selItem) return;
    const n = { ...selItem, id: uid(), x: selItem.x + 2.5, y: selItem.y + 2.5, z: topZ(selItem.pageId) + 1, bind: "" as const, text: selItem.bind ? meta[selItem.bind] : selItem.text };
    api.addItems([n]);
    setSelected(n.id);
  }, [selItem, topZ, api, meta]);
  const front = useCallback(() => selItem && api.updateItem(selItem.id, { z: topZ(selItem.pageId) + 1 }), [selItem, topZ, api]);
  const back = useCallback(() => {
    if (!selItem) return;
    const min = Math.min(...(byPage.get(selItem.pageId) ?? []).map((i) => i.z));
    api.updateItem(selItem.id, { z: min - 1 });
  }, [selItem, byPage, api]);

  /* ─── page ops ─── */
  const addPage = useCallback(() => {
    const np: Page = { id: uid(), bg: "paper" };
    api.insertPage(idx + 1, np);
    playFlip(sound);
    setFlip({ from: idx, to: idx + 1, dir: 1 });
  }, [api, idx, sound]);
  const dupPage = useCallback(() => {
    if (!page) return;
    const np: Page = { id: uid(), bg: page.bg };
    const copies = (byPage.get(page.id) ?? []).map((i) => ({ ...i, id: uid(), pageId: np.id, bind: "" as const, text: i.bind ? meta[i.bind] : i.text }));
    api.insertPage(idx + 1, np, copies);
    playFlip(sound);
    setFlip({ from: idx, to: idx + 1, dir: 1 });
  }, [api, page, byPage, idx, meta, sound]);
  const delPage = useCallback(() => {
    if (!page || pages.length <= 1) return;
    if (!window.confirm(t("confirmDeletePage"))) return;
    api.deletePage(page.id);
  }, [api, page, pages.length, t]);
  const movePage = useCallback((d: -1 | 1) => api.movePage(idx, idx + d), [api, idx]);

  /* ─── keyboard ─── */
  const K = useRef({ selected, editing, idx, deleteSel, dupSel, goTo, patchSel, selItem, api, reading });
  K.current = { selected, editing, idx, deleteSel, dupSel, goTo, patchSel, selItem, api, reading };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = K.current;
      if (k.reading) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, [contenteditable=true]")) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) k.api.redo();
        else k.api.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        k.api.redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "d" && k.selected) {
        e.preventDefault();
        k.dupSel();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && k.selected) {
        e.preventDefault();
        k.deleteSel();
        return;
      }
      if (e.key === "Escape") {
        setSelected(null);
        setEditing(null);
        return;
      }
      if (e.key === "Enter" && k.selItem && k.selItem.kind !== "sticker") {
        e.preventDefault();
        setEditing(k.selItem.id);
        return;
      }
      if (e.key.startsWith("Arrow")) {
        if (k.selItem) {
          e.preventDefault();
          const s = e.shiftKey ? 2 : 0.5;
          const dx = e.key === "ArrowLeft" ? -s : e.key === "ArrowRight" ? s : 0;
          const dy = e.key === "ArrowUp" ? -s : e.key === "ArrowDown" ? s : 0;
          k.patchSel({ x: +(k.selItem.x + dx).toFixed(2), y: +(k.selItem.y + dy).toFixed(2) });
        } else if (e.key === "ArrowRight") k.goTo(k.idx + 1);
        else if (e.key === "ArrowLeft") k.goTo(k.idx - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ─── share / print ─── */
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: meta.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash(t("copied"));
    } catch {
      window.prompt(t("share"), url);
    }
  };
  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    const tm = setTimeout(() => window.print(), 400);
    return () => {
      clearTimeout(tm);
      window.removeEventListener("afterprint", done);
    };
  }, [printing]);

  const onSelect = useCallback((id: string | null) => setSelected(id), []);
  const onEdit = useCallback((id: string | null) => setEditing(id), []);
  const onBg = useCallback((bg: string) => page && api.setPageBg(page.id, bg), [api, page]);

  const peersHere = others.filter((o) => o.pageId === page?.id);
  const statusLabel = api.status === "solo" ? t("solo") : api.status === "live" ? t("live") : api.status === "reconnecting" ? t("offline") : t("connecting");

  if (!page) return null;
  const spreadOf = (i: number) => ({ page: pages[i], items: byPage.get(pages[i].id) ?? [] });

  return (
    <div className={`app ${printing ? "is-printing" : ""}`}>
      <header className="topbar">
        <Link href="/" className="brand" title={t("home")}>
          <Logo />
        </Link>
        <input
          className="title-input"
          value={meta.title}
          onChange={(e) => api.setMeta({ title: e.target.value })}
          aria-label="title"
          placeholder={t("untitled")}
          maxLength={60}
        />
        <span className={`status status-${api.status}`}>
          <i />
          {statusLabel}
        </span>
        <div className="spacer" />
        <div className="people">
          <span className="avatar me" style={{ ["--pc" as string]: profile.color }} title={profile.name}>
            {profile.name.slice(0, 1).toUpperCase()}
          </span>
          {others.map((o) => {
            const pi = pages.findIndex((p) => p.id === o.pageId);
            return (
              <button
                key={o.id}
                className="avatar"
                style={{ ["--pc" as string]: o.color }}
                title={`${o.name} ${t("onPage")} ${pi === 0 ? t("cover") : pi}`}
                onClick={() => pi >= 0 && goTo(pi)}
              >
                {o.name.slice(0, 1).toUpperCase()}
                {o.editing && <span className="avatar-pen">✎</span>}
              </button>
            );
          })}
          {others.length === 0 && api.status !== "solo" && <span className="alone">{t("alone")}</span>}
          {partner && (
            <button className={`chip ${follow ? "on" : ""}`} onClick={() => setFollow((f) => !f)} title={t("follow")}>
              <Icon.eye />
              <span>{follow ? t("following") : t("follow")}</span>
            </button>
          )}
        </div>
        <button className="icon-btn love" onClick={() => api.sendReaction({ type: "love", name: profile.name, color: profile.color })} title={t("love")} aria-label={t("love")}>
          <Icon.heart />
        </button>
        <div className="divider" />
        <button className="icon-btn" onClick={api.undo} disabled={!api.canUndo} title={`${t("undo")} (⌘Z)`} aria-label={t("undo")}>
          <Icon.undo />
        </button>
        <button className="icon-btn redo-btn" onClick={api.redo} disabled={!api.canRedo} title={`${t("redo")} (⇧⌘Z)`} aria-label={t("redo")}>
          <Icon.redo />
        </button>
        <div className="divider" />
        <div className="top-lang">
          <LangToggle />
        </div>
        <button className="btn ghost share" onClick={share}>
          <Icon.link />
          <span>{t("share")}</span>
        </button>
        <button className="btn primary" onClick={() => setReading(true)}>
          <Icon.book />
          <span>{t("read")}</span>
        </button>
        <div className="menu-wrap">
          <button className="icon-btn" onClick={() => setMenu((m) => !m)} aria-label="menu" aria-expanded={menu}>
            <Icon.more />
          </button>
          {menu && (
            <div className="menu" onMouseLeave={() => setMenu(false)}>
              <button
                className="m-only"
                onClick={() => {
                  setMenu(false);
                  share();
                }}
              >
                <Icon.link /> {t("share")}
              </button>
              <button className="m-only" onClick={api.redo} disabled={!api.canRedo}>
                <Icon.redo /> {t("redo")}
              </button>
              <div className="m-only menu-lang">
                <LangToggle />
              </div>
              <button
                onClick={() => {
                  setMenu(false);
                  setPrinting(true);
                }}
              >
                <Icon.print /> {t("print")}
              </button>
              <button
                onClick={() => {
                  setSound((s) => {
                    safeSet("tc.sound", !s);
                    return !s;
                  });
                }}
              >
                {sound ? <Icon.sound /> : <Icon.mute />} {t("sound")}: {sound ? "ON" : "OFF"}
              </button>
              <Link href="/" onClick={() => setMenu(false)}>
                <Icon.home /> {t("home")}
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="workspace">
        <div className={`drawer-wrap ${drawerOpen ? "open" : ""}`}>
          <Drawer onAdd={addPart} onBg={onBg} currentBg={page.bg} onClose={drawerOpen ? () => setDrawerOpen(false) : undefined} />
        </div>

        <main className="stage-col">
          <Tray
            item={selItem}
            editing={!!editing}
            onPatch={patchSel}
            onEdit={() => selItem && setEditing(editing ? null : selItem.id)}
            onFront={front}
            onBack={back}
            onDup={dupSel}
            onDelete={deleteSel}
          />
          <div className="stage">
            <button className="turn turn-prev" onClick={() => goTo(idx - 1)} disabled={idx <= 0 || !!flip} aria-label={t("prev")}>
              <Icon.left />
            </button>
            <div className="book">
              <div className="book-edges" />
              <div className="spread">
                {flip ? (
                  <Flip from={spreadOf(flip.from)} to={spreadOf(Math.min(flip.to, pages.length - 1))} dir={flip.dir} meta={meta} onDone={flipDone} />
                ) : (
                  <Canvas
                    page={page}
                    items={byPage.get(page.id) ?? []}
                    meta={meta}
                    peers={peersHere}
                    selected={selected}
                    editing={editing}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDropPart={(p, at) => addPart(p, at)}
                    me={profile}
                  />
                )}
              </div>
              <div className="page-no">
                <span>{idx === 0 ? t("cover") : `${t("page")} ${idx}`}</span>
                {peersHere.length > 0 && (
                  <span className="together" style={{ ["--pc" as string]: peersHere[0].color }}>
                    ♡ {peersHere[0].name} {t("here")}
                  </span>
                )}
              </div>
            </div>
            <button className="turn turn-next" onClick={() => goTo(idx + 1)} disabled={idx >= pages.length - 1 || !!flip} aria-label={t("next")}>
              <Icon.right />
            </button>
          </div>
          <PageStrip
            pages={pages}
            byPage={byPage}
            meta={meta}
            current={idx}
            peers={others}
            myColor={profile.color}
            onGo={goTo}
            onAdd={addPage}
            onDuplicate={dupPage}
            onDelete={delPage}
            onMove={movePage}
          />
        </main>
        <button className="fab" onClick={() => setDrawerOpen(true)} aria-label={t("parts")}>
          <Icon.parts />
          <span>{t("parts")}</span>
        </button>
      </div>

      {reading && (
        <ReadMode
          pages={pages}
          byPage={byPage}
          meta={meta}
          start={idx}
          sound={sound}
          onMeta={api.setMeta}
          onPage={follow ? undefined : (i) => api.setPresence({ pageId: pages[i]?.id ?? null })}
          onClose={(i) => {
            setReading(false);
            const p = pages[i];
            if (p) setCurId(p.id);
            api.setPresence({ pageId: (p ?? page).id });
          }}
        />
      )}
      {api.status === "solo" && keyProblem && !soloHidden && (
        <div className="solo-float">
          <SoloHelp problem={keyProblem} compact onClose={() => setSoloHidden(true)} />
        </div>
      )}
      {api.error && api.status !== "live" && <div className="toast toast-err">Liveblocks: {api.error}</div>}
      <Hearts myName={profile.name} />
      {toast && <div className="toast">{toast}</div>}
      {printing && (
        <div className="print-root">
          {pages.map((p) => (
            <div className="print-sheet" key={p.id}>
              <PageView page={p} items={byPage.get(p.id) ?? []} meta={meta} />
            </div>
          ))}
        </div>
      )}
      <span hidden>{lang}</span>
    </div>
  );
}

export function Logo({ big }: { big?: boolean }) {
  return (
    <span className={`logo ${big ? "big" : ""}`}>
      <svg viewBox="0 0 64 40" className="logo-mark" aria-hidden>
        <g filter="url(#cr)">
          <g transform="rotate(-24 22 22)">
            <path d="M22 2 L27 11 L17 11 Z" fill="#ff5c93" stroke="#4a3a3a" strokeWidth={2} strokeLinejoin="round" />
            <rect x={16.5} y={11} width={11} height={27} rx={2} fill="#ff5c93" stroke="#4a3a3a" strokeWidth={2} />
            <rect x={16.5} y={17} width={11} height={12} fill="#fffdf8" />
          </g>
          <g transform="rotate(24 42 22)">
            <path d="M42 2 L47 11 L37 11 Z" fill="#5bc8f5" stroke="#4a3a3a" strokeWidth={2} strokeLinejoin="round" />
            <rect x={36.5} y={11} width={11} height={27} rx={2} fill="#5bc8f5" stroke="#4a3a3a" strokeWidth={2} />
            <rect x={36.5} y={17} width={11} height={12} fill="#fffdf8" />
          </g>
          <path d="M32 9 C29 6.5 28.5 4.5 30 3.5 C31 2.8 32 3.4 32 4.4 C32 3.4 33 2.8 34 3.5 C35.5 4.5 35 6.5 32 9 Z" fill="#ffd84d" stroke="#4a3a3a" strokeWidth={1.3} />
        </g>
      </svg>
      <span className="logo-word"><b>Two</b> Crayons</span>
    </span>
  );
}
