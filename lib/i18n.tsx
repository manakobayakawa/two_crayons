"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ja";

const dict = {
  tagline: { en: "A picture book for two, drawn from far away.", ja: "はなれていても、ふたりで描く絵本。" },
  heroLead: {
    en: "Pick crayon-drawn characters, speech bubbles and scenery, write your lines, and turn the pages together — live, wherever you are.",
    ja: "クレヨンで描いたキャラクター、ふきだし、背景をならべて、セリフを書いて、いっしょにページをめくろう。どこにいても、リアルタイムで。",
  },
  yourName: { en: "Your name", ja: "あなたの名前" },
  namePh: { en: "e.g. Mana", ja: "例：まな" },
  yourCrayon: { en: "Your crayon", ja: "あなたのクレヨン" },
  newBook: { en: "Start a new book", ja: "新しい絵本をつくる" },
  openLink: { en: "Open a shared book", ja: "共有された絵本をひらく" },
  linkPh: { en: "Paste a book link or code", ja: "リンクかコードを貼りつけ" },
  open: { en: "Open", ja: "ひらく" },
  shelf: { en: "Your bookshelf", ja: "わたしの本棚" },
  shelfEmpty: { en: "No books yet. Start one above!", ja: "まだ絵本はありません。上からつくってみよう！" },
  forget: { en: "Remove from shelf", ja: "本棚からはずす" },
  soloNote: {
    en: "Solo mode: no Liveblocks key is set, so books are saved in this browser only. Add NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY to draw together.",
    ja: "ひとりモード：Liveblocksのキーが未設定のため、このブラウザにだけ保存されます。ふたりで描くには NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY を設定してください。",
  },
  howTitle: { en: "How it works", ja: "あそびかた" },
  how1: { en: "Start a book and send the link to your person.", ja: "絵本をつくって、リンクを相手に送る" },
  how2: { en: "Drop in characters, bubbles and backgrounds.", ja: "キャラクターやふきだし、背景をならべる" },
  how3: { en: "Write the story together and flip the pages.", ja: "ふたりで物語を書いて、ページをめくる" },

  // editor
  untitled: { en: "Our Little Story", ja: "ふたりのおはなし" },
  byline: { en: "by", ja: "さく・え" },
  authorsPh: { en: "authors", ja: "さくしゃ" },
  cover: { en: "Cover", ja: "表紙" },
  page: { en: "Page", ja: "ページ" },
  characters: { en: "Friends", ja: "なかま" },
  nature: { en: "Nature", ja: "しぜん" },
  things: { en: "Things", ja: "もの" },
  bubbles: { en: "Bubbles", ja: "ふきだし" },
  words: { en: "Words", ja: "もじ" },
  scenes: { en: "Scenes", ja: "はいけい" },
  dragHint: { en: "Tap or drag onto the page", ja: "タップかドラッグでページへ" },
  addText: { en: "Add words", ja: "もじを入れる" },
  textSample: { en: "Once upon a time…", ja: "むかしむかし…" },
  bubbleSample: { en: "Hello!", ja: "やあ！" },
  addPage: { en: "Add page", ja: "ページを追加" },
  duplicatePage: { en: "Duplicate page", ja: "ページを複製" },
  deletePage: { en: "Delete page", ja: "ページを削除" },
  moveLeft: { en: "Move earlier", ja: "前へ移動" },
  moveRight: { en: "Move later", ja: "後ろへ移動" },
  confirmDeletePage: { en: "Delete this page and everything on it?", ja: "このページと、のっているものをすべて削除しますか？" },
  read: { en: "Read", ja: "よむ" },
  edit: { en: "Edit", ja: "つくる" },
  share: { en: "Share", ja: "共有" },
  copied: { en: "Link copied! Send it to your person.", ja: "リンクをコピーしました。相手に送ってね。" },
  undo: { en: "Undo", ja: "もとに戻す" },
  redo: { en: "Redo", ja: "やり直す" },
  print: { en: "Print / PDF", ja: "印刷・PDF" },
  love: { en: "Send love", ja: "ハートを送る" },
  follow: { en: "Follow", ja: "ついていく" },
  following: { en: "Following", ja: "ついていってる" },
  onPage: { en: "is on", ja: "がいるページ：" },
  here: { en: "here", ja: "ここ" },
  writing: { en: "writing…", ja: "かいてる…" },
  alone: { en: "Waiting for your person…", ja: "相手を待っています…" },
  together: { en: "together", ja: "いっしょ" },
  front: { en: "Bring forward", ja: "前へ" },
  back: { en: "Send backward", ja: "後ろへ" },
  flipH: { en: "Flip", ja: "反転" },
  dup: { en: "Duplicate", ja: "複製" },
  del: { en: "Delete", ja: "削除" },
  editText: { en: "Write", ja: "書く" },
  bigger: { en: "Bigger text", ja: "文字を大きく" },
  smaller: { en: "Smaller text", ja: "文字を小さく" },
  font: { en: "Letters", ja: "書体" },
  fontCrayon: { en: "Crayon", ja: "クレヨン" },
  fontPencil: { en: "Pencil", ja: "えんぴつ" },
  fontRound: { en: "Round", ja: "まるもじ" },
  fontPop: { en: "Pop", ja: "ポップ" },
  color: { en: "Color", ja: "いろ" },
  theEnd: { en: "The End", ja: "おしまい" },
  exitRead: { en: "Back to editing", ja: "編集にもどる" },
  connecting: { en: "Opening the book…", ja: "絵本をひらいています…" },
  solo: { en: "Solo mode", ja: "ひとりモード" },
  live: { en: "Live", ja: "つながってる" },
  offline: { en: "Reconnecting…", ja: "再接続中…" },
  prev: { en: "Previous page", ja: "前のページ" },
  next: { en: "Next page", ja: "次のページ" },
  home: { en: "Bookshelf", ja: "本棚" },
  whoAreYou: { en: "Before you draw — who are you?", ja: "描くまえに、あなたはだれ？" },
  letsGo: { en: "Let's draw", ja: "はじめる" },
  shortcuts: {
    en: "Double-click to write · Del to remove · ⌘Z undo · ← → turn pages",
    ja: "ダブルクリックで書く・Delで削除・⌘Zで戻す・← →でページ",
  },
  parts: { en: "Parts", ja: "パーツ" },
  close: { en: "Close", ja: "とじる" },
  sound: { en: "Page sound", ja: "めくる音" },
  slowConnect: {
    en: "Taking a while… Check your internet, and that the Liveblocks Public key (pk_…) on Vercel is correct and the site was redeployed.",
    ja: "時間がかかっています…ネット接続と、Vercel に入れた Liveblocks の Public key（pk_…）が正しいか、再デプロイ済みかを確認してください。",
  },
  writeHere: { en: "write here…", ja: "ここに書く…" },
  bg: { en: "Scene for this page", ja: "このページの背景" },
  flipTail: { en: "Flip tail", ja: "しっぽ反転" },
} as const;

export type DictKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string };

const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => dict[k].en });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tc.lang") as Lang | null;
      if (saved === "en" || saved === "ja") setLangState(saved);
      else if (navigator.language?.startsWith("ja")) setLangState("ja");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("tc.lang", l);
    } catch {}
  }, []);
  const t = useCallback((k: DictKey) => dict[k][lang], [lang]);
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
        EN
      </button>
      <button className={lang === "ja" ? "on" : ""} onClick={() => setLang("ja")} aria-pressed={lang === "ja"}>
        日本語
      </button>
    </div>
  );
}
