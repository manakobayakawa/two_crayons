"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useBroadcastEvent,
  useCanRedo,
  useCanUndo,
  useErrorListener,
  useEventListener,
  useHistory,
  useMutation,
  useUpdateMyPresence,
  useOthers,
  useStatus,
  useStorage,
} from "@liveblocks/react/suspense";
import type { Item, Meta, Page, Peer, Presence, Reaction } from "./types";
import { seedDoc, type Doc } from "./doc";
import { safeGet, safeSet, uid } from "./util";


export type Status = "connecting" | "live" | "reconnecting" | "solo";

export type BookApi = {
  status: Status;
  error: string | null;
  meta: Meta;
  pages: readonly Page[];
  items: readonly Item[];
  others: Peer[];
  setPresence: (p: Partial<Presence>) => void;
  addItems: (items: Item[]) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  setMeta: (patch: Partial<Meta>) => void;
  insertPage: (index: number, page: Page, items?: Item[]) => void;
  deletePage: (pageId: string) => void;
  movePage: (from: number, to: number) => void;
  setPageBg: (pageId: string, bg: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pause: () => void;
  resume: () => void;
  sendReaction: (r: Reaction) => void;
  onReaction: (fn: (r: Reaction) => void) => () => void;
};

const Ctx = createContext<BookApi | null>(null);
export const useBook = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBook outside provider");
  return v;
};

type Seed = { lang: "en" | "ja"; name: string; color: string };

export function BookProvider({
  bookId,
  seed,
  children,
  fallback,
  liveKey,
}: {
  bookId: string;
  seed: Seed;
  children: ReactNode;
  fallback: ReactNode;
  liveKey: string;
}) {
  if (!liveKey) return <SoloBook bookId={bookId} seed={seed}>{children}</SoloBook>;
  return (
    <LiveProvider bookId={bookId} seed={seed} liveKey={liveKey} fallback={fallback}>
      {children}
    </LiveProvider>
  );
}

function LiveProvider({ bookId, seed, children, fallback, liveKey }: { bookId: string; seed: Seed; children: ReactNode; fallback: ReactNode; liveKey: string }) {
  const [error, setError] = useState<string | null>(null);
  const initialPresence: Presence = { name: seed.name, color: seed.color, pageId: null, cursor: null, selected: null, editing: null };
  return (
    <LiveblocksProvider publicApiKey={liveKey} throttle={32}>
      <RoomProvider
        id={`two-crayons-${bookId}`}
        initialPresence={initialPresence}
        initialStorage={() => {
          const d = seedDoc(seed.lang, seed.name);
          return {
            meta: new LiveObject(d.meta),
            pages: new LiveList(d.pages.map((p) => new LiveObject(p))),
            items: new LiveMap(Object.values(d.items).map((i) => [i.id, new LiveObject(i)] as [string, LiveObject<Item>])),
          };
        }}
      >
        <ErrorWatch onError={setError} />
        <ClientSideSuspense fallback={error ? <LiveError message={error} /> : fallback}>
          <LiveBook error={error}>{children}</LiveBook>
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function ErrorWatch({ onError }: { onError: (m: string) => void }) {
  useErrorListener((err) => {
    console.error("[two-crayons] Liveblocks:", err);
    onError(err.message || String(err));
  });
  return null;
}

function LiveError({ message }: { message: string }) {
  return (
    <div className="loading">
      <div className="solo-help" role="alert" style={{ maxWidth: 520 }}>
        <div className="solo-help-head">
          <span className="solo-dot" />
          <strong>Liveblocks に接続できません / Can’t connect to Liveblocks</strong>
        </div>
        <p>{message}</p>
        <p>
          キーが正しい Public key（pk_…）か、Liveblocks のプロジェクトで Public key が有効になっているか確認してください。 / Check that the Public key (pk_…) is correct and enabled in your Liveblocks project.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Liveblocks backend ─────────────────────────── */

function useReactionBus() {
  const subs = useRef(new Set<(r: Reaction) => void>());
  const emit = useCallback((r: Reaction) => subs.current.forEach((f) => f(r)), []);
  const on = useCallback((fn: (r: Reaction) => void) => {
    subs.current.add(fn);
    return () => {
      subs.current.delete(fn);
    };
  }, []);
  return useMemo(() => ({ emit, on }), [emit, on]);
}

function LiveBook({ children, error }: { children: ReactNode; error: string | null }) {
  const meta = useStorage((r) => r.meta);
  const pages = useStorage((r) => r.pages);
  const itemMap = useStorage((r) => r.items);
  const items = useMemo(() => Object.values(itemMap) as Item[], [itemMap]);
  const rawOthers = useOthers();
  const others = useMemo<Peer[]>(
    () => rawOthers.map((o) => ({ id: o.connectionId, ...(o.presence as Presence) })).filter((o) => o.name !== undefined),
    [rawOthers],
  );
  const updatePresence = useUpdateMyPresence();
  const lbStatus = useStatus();
  const status: Status = lbStatus === "connected" ? "live" : lbStatus === "reconnecting" ? "reconnecting" : "connecting";
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const broadcast = useBroadcastEvent();
  const bus = useReactionBus();
  useEventListener(({ event }) => bus.emit(event));

  const addItems = useMutation(({ storage }, list: Item[]) => {
    const m = storage.get("items");
    list.forEach((it) => m.set(it.id, new LiveObject(it)));
  }, []);
  const updateItem = useMutation(({ storage }, id: string, patch: Partial<Item>) => {
    storage.get("items").get(id)?.update(patch);
  }, []);
  const deleteItem = useMutation(({ storage }, id: string) => {
    storage.get("items").delete(id);
  }, []);
  const setMeta = useMutation(({ storage }, patch: Partial<Meta>) => {
    storage.get("meta").update(patch);
  }, []);
  const insertPage = useMutation(({ storage }, index: number, page: Page, list?: Item[]) => {
    storage.get("pages").insert(new LiveObject(page), index);
    const m = storage.get("items");
    list?.forEach((it) => m.set(it.id, new LiveObject(it)));
  }, []);
  const deletePage = useMutation(({ storage }, pageId: string) => {
    const pl = storage.get("pages");
    const idx = pl.findIndex((p) => p.get("id") === pageId);
    if (idx < 0 || pl.length <= 1) return;
    pl.delete(idx);
    const m = storage.get("items");
    Array.from(m.entries()).forEach(([k, v]) => {
      if (v.get("pageId") === pageId) m.delete(k);
    });
  }, []);
  const movePage = useMutation(({ storage }, from: number, to: number) => {
    const pl = storage.get("pages");
    if (to < 0 || to >= pl.length) return;
    pl.move(from, to);
  }, []);
  const setPageBg = useMutation(({ storage }, pageId: string, bg: string) => {
    storage
      .get("pages")
      .find((p) => p.get("id") === pageId)
      ?.set("bg", bg);
  }, []);

  const api: BookApi = {
    status,
    error,
    meta,
    pages,
    items,
    others,
    setPresence: updatePresence,
    addItems,
    updateItem,
    deleteItem,
    setMeta,
    insertPage,
    deletePage,
    movePage,
    setPageBg,
    undo: history.undo,
    redo: history.redo,
    canUndo,
    canRedo,
    pause: history.pause,
    resume: history.resume,
    sendReaction: (r) => {
      broadcast(r);
      bus.emit(r);
    },
    onReaction: bus.on,
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

/* ─────────────────────────── Solo backend ───────────────────────────
   No server: the book lives in localStorage. Tabs in the same browser
   sync through BroadcastChannel (handy for trying it out alone). */

type Msg =
  | { t: "doc"; doc: Doc; from: string }
  | { t: "presence"; from: string; p: Presence }
  | { t: "bye"; from: string }
  | { t: "hello"; from: string }
  | { t: "reaction"; r: Reaction };

function SoloBook({ bookId, seed, children }: { bookId: string; seed: Seed; children: ReactNode }) {
  const key = `tc.book.${bookId}`;
  const tab = useRef(uid(6));
  const [doc, setDoc] = useState<Doc>(() => safeGet<Doc | null>(key, null) ?? seedDoc(seed.lang, seed.name));
  const docRef = useRef(doc);
  docRef.current = doc;
  const undoStack = useRef<Doc[]>([]);
  const redoStack = useRef<Doc[]>([]);
  const paused = useRef<{ pushed: boolean } | null>(null);
  const [histTick, setHistTick] = useState(0);
  const meRef = useRef<Presence>({ name: seed.name, color: seed.color, pageId: null, cursor: null, selected: null, editing: null });
  const [peers, setPeers] = useState<Record<string, { p: Presence; at: number; id: number }>>({});
  const chan = useRef<BroadcastChannel | null>(null);
  const bus = useReactionBus();

  useEffect(() => {
    safeSet(key, doc);
  }, [key, doc]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(`tc:${bookId}`);
    chan.current = ch;
    ch.onmessage = (e: MessageEvent<Msg>) => {
      const m = e.data;
      if (m.t === "doc" && m.from !== tab.current) setDoc(m.doc);
      else if (m.t === "presence")
        setPeers((ps) => ({ ...ps, [m.from]: { p: m.p, at: Date.now(), id: ps[m.from]?.id ?? Math.floor(Math.random() * 1e6) } }));
      else if (m.t === "bye")
        setPeers((ps) => {
          const n = { ...ps };
          delete n[m.from];
          return n;
        });
      else if (m.t === "hello") ch.postMessage({ t: "presence", from: tab.current, p: meRef.current } satisfies Msg);
      else if (m.t === "reaction") bus.emit(m.r);
    };
    ch.postMessage({ t: "hello", from: tab.current } satisfies Msg);
    const beat = setInterval(() => {
      ch.postMessage({ t: "presence", from: tab.current, p: meRef.current } satisfies Msg);
      setPeers((ps) => {
        const now = Date.now();
        const n = Object.fromEntries(Object.entries(ps).filter(([, v]) => now - v.at < 7000));
        return Object.keys(n).length === Object.keys(ps).length ? ps : n;
      });
    }, 2500);
    const bye = () => ch.postMessage({ t: "bye", from: tab.current } satisfies Msg);
    window.addEventListener("pagehide", bye);
    return () => {
      bye();
      clearInterval(beat);
      window.removeEventListener("pagehide", bye);
      ch.close();
      chan.current = null;
    };
  }, [bookId, bus]);

  const commit = useCallback((fn: (d: Doc) => Doc) => {
    const prev = docRef.current;
    const next = fn(prev);
    if (next === prev) return;
    if (!paused.current || !paused.current.pushed) {
      undoStack.current.push(prev);
      if (undoStack.current.length > 120) undoStack.current.shift();
      redoStack.current = [];
      if (paused.current) paused.current.pushed = true;
      setHistTick((t) => t + 1);
    }
    docRef.current = next;
    setDoc(next);
    chan.current?.postMessage({ t: "doc", doc: next, from: tab.current } satisfies Msg);
  }, []);

  const setPresence = useCallback((p: Partial<Presence>) => {
    const n = { ...meRef.current, ...p };
    meRef.current = n;
    chan.current?.postMessage({ t: "presence", from: tab.current, p: n } satisfies Msg);
  }, []);

  const api = useMemo<BookApi>(() => {
    const items = Object.values(doc.items);
    const restore = (from: React.MutableRefObject<Doc[]>, to: React.MutableRefObject<Doc[]>) => {
      const d = from.current.pop();
      if (!d) return;
      to.current.push(docRef.current);
      docRef.current = d;
      setDoc(d);
      setHistTick((t) => t + 1);
      chan.current?.postMessage({ t: "doc", doc: d, from: tab.current } satisfies Msg);
    };
    return {
      status: "solo",
      error: null,
      meta: doc.meta,
      pages: doc.pages,
      items,
      others: Object.values(peers).map((v) => ({ id: v.id, ...v.p })),
      setPresence,
      addItems: (list) => commit((d) => ({ ...d, items: { ...d.items, ...Object.fromEntries(list.map((i) => [i.id, i])) } })),
      updateItem: (id, patch) =>
        commit((d) => (d.items[id] ? { ...d, items: { ...d.items, [id]: { ...d.items[id], ...patch } } } : d)),
      deleteItem: (id) =>
        commit((d) => {
          if (!d.items[id]) return d;
          const n = { ...d.items };
          delete n[id];
          return { ...d, items: n };
        }),
      setMeta: (patch) => commit((d) => ({ ...d, meta: { ...d.meta, ...patch } })),
      insertPage: (index, page, list) =>
        commit((d) => {
          const pages = [...d.pages];
          pages.splice(index, 0, page);
          return { ...d, pages, items: { ...d.items, ...Object.fromEntries((list ?? []).map((i) => [i.id, i])) } };
        }),
      deletePage: (pageId) =>
        commit((d) => {
          if (d.pages.length <= 1) return d;
          return {
            ...d,
            pages: d.pages.filter((p) => p.id !== pageId),
            items: Object.fromEntries(Object.entries(d.items).filter(([, v]) => v.pageId !== pageId)),
          };
        }),
      movePage: (from, to) =>
        commit((d) => {
          if (to < 0 || to >= d.pages.length) return d;
          const pages = [...d.pages];
          const [p] = pages.splice(from, 1);
          pages.splice(to, 0, p);
          return { ...d, pages };
        }),
      setPageBg: (pageId, bg) => commit((d) => ({ ...d, pages: d.pages.map((p) => (p.id === pageId ? { ...p, bg } : p)) })),
      undo: () => restore(undoStack, redoStack),
      redo: () => restore(redoStack, undoStack),
      canUndo: undoStack.current.length > 0,
      canRedo: redoStack.current.length > 0,
      pause: () => {
        paused.current = { pushed: false };
      },
      resume: () => {
        paused.current = null;
      },
      sendReaction: (r) => {
        chan.current?.postMessage({ t: "reaction", r } satisfies Msg);
        bus.emit(r);
      },
      onReaction: bus.on,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, peers, histTick, commit, setPresence, bus]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
