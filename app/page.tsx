"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LangToggle, useI18n } from "@/lib/i18n";
import { getProfile, getShelf, removeFromShelf, setProfile, type Profile, type ShelfEntry } from "@/lib/profile";
import { LIVEBLOCKS_KEY } from "@/lib/store";
import { makeBubble, makeSticker } from "@/lib/doc";
import { uid } from "@/lib/util";
import type { Item } from "@/lib/types";
import { Logo } from "@/components/Editor";
import { ProfileForm } from "@/components/ProfileForm";
import { PageView } from "@/components/PageView";
import { STICKER_MAP, StickerSvg } from "@/assets/stickers";
import { Icon } from "@/components/Icons";

const SHELF_COLORS = ["#ff5c93", "#5bc8f5", "#ffd84d", "#6dd47e", "#a77bf3", "#ffa24c", "#ff8fb8"];

export default function Home() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [profile, setP] = useState<Profile | null>(null);
  const [shelf, setShelf] = useState<ShelfEntry[]>([]);
  const [link, setLink] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setP(getProfile());
    setShelf(getShelf());
    setReady(true);
  }, []);

  const demo = useMemo(() => {
    const pid = "demo";
    const items: Item[] = [
      { ...makeSticker("cloud", pid, "", 13), x: 20, y: 11, z: 1 },
      { ...makeSticker("cloud", pid, "", 10), x: 80, y: 9, z: 1, flip: true },
      { ...makeSticker("plane", pid, "", 13), x: 50, y: 10, z: 2, rot: -6 },
      { ...makeSticker("girl", pid, "", 14), x: 17, y: 43, z: 3 },
      { ...makeSticker("boy", pid, "", 14), x: 83, y: 43, z: 3, flip: true },
      { ...makeSticker("canphone", pid, "", 52), x: 50, y: 41, z: 2 },
      { ...makeBubble("talk", pid, "", lang === "ja" ? "きこえる？" : "Can you hear me?"), x: 26, y: 20, w: 22, h: 14.6, z: 4, size: 2.7 },
      { ...makeBubble("heart", pid, "", lang === "ja" ? "ばっちり♡" : "Loud & clear!"), x: 74, y: 21, w: 18, h: 15.6, z: 4, size: 2.4, flip: true },
      { ...makeSticker("flower", pid, "", 5), x: 38, y: 55, z: 3 },
      { ...makeSticker("flower", pid, "", 4), x: 64, y: 57, z: 3, color: "#ffd84d" },
    ];
    return { page: { id: pid, bg: "meadow" }, items };
  }, [lang]);

  const start = (p: Profile) => {
    setProfile(p);
    router.push(`/book/${uid(10)}`);
  };
  const openLink = () => {
    const m = link.trim().match(/book\/([a-z0-9-]+)/i) ?? link.trim().match(/^([a-z0-9-]{4,40})$/i);
    if (m) router.push(`/book/${m[1]}`);
  };

  return (
    <div className="home">
      <header className="home-top">
        <Logo />
        <LangToggle />
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1 className="hand hero-title">
            {lang === "ja" ? (
              <>
                <span className="c2">はなれて</span>いても、
                <br />
                <span className="scribble">ふたりで</span>描く<span className="c1">絵本</span>。
              </>
            ) : (
              <>
                A <span className="c1">picture</span> book
                <br />
                for <span className="scribble">two</span>, drawn
                <br />
                from <span className="c2">far</span> <span className="c3">away</span>.
              </>
            )}
          </h1>
          <p className="lead">{t("heroLead")}</p>
          <div className="start-card paper-card">
            {ready && (
              <ProfileForm
                key={profile?.name ?? "new"}
                initial={profile}
                cta={t("newBook")}
                onSave={start}
              />
            )}
          </div>
        </div>
        <div className="hero-art">
          <div className="book hero-book">
            <div className="book-edges" />
            <div className="spread">
              <PageView page={demo.page} items={demo.items} meta={{ title: "", authors: "" }} />
            </div>
          </div>
          <div className="tape tape-a" />
          <div className="tape tape-b" />
          <span className="deco deco-1"><StickerSvg def={STICKER_MAP.star} /></span>
          <span className="deco deco-2"><StickerSvg def={STICKER_MAP.heart} /></span>
          <span className="deco deco-3"><StickerSvg def={STICKER_MAP.balloon} color="#a77bf3" /></span>
          <span className="deco deco-4"><StickerSvg def={STICKER_MAP.heart} color="#ffd84d" /></span>
        </div>
      </section>

      <section className="home-grid">
        <div className="paper-card open-card">
          <h2 className="hand">{t("openLink")}</h2>
          <form
            className="row"
            onSubmit={(e) => {
              e.preventDefault();
              openLink();
            }}
          >
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={t("linkPh")} />
            <button className="btn" type="submit">
              {t("open")}
            </button>
          </form>
          <h2 className="hand shelf-title">{t("shelf")}</h2>
          {shelf.length === 0 ? (
            <p className="muted">{t("shelfEmpty")}</p>
          ) : (
            <div className="shelf">
              {shelf.map((b, i) => (
                <div key={b.id} className="spine-wrap">
                  <button className="spine" style={{ ["--sc" as string]: SHELF_COLORS[i % SHELF_COLORS.length] }} onClick={() => router.push(`/book/${b.id}`)}>
                    <span className="spine-title">{b.title || t("untitled")}</span>
                    <span className="spine-date">{new Date(b.openedAt).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", { month: "short", day: "numeric" })}</span>
                  </button>
                  <button
                    className="spine-x"
                    title={t("forget")}
                    aria-label={t("forget")}
                    onClick={() => {
                      removeFromShelf(b.id);
                      setShelf(getShelf());
                    }}
                  >
                    <Icon.close />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="paper-card how-card">
          <h2 className="hand">{t("howTitle")}</h2>
          <ol className="how">
            <li>
              <b>1</b>
              {t("how1")}
            </li>
            <li>
              <b>2</b>
              {t("how2")}
            </li>
            <li>
              <b>3</b>
              {t("how3")}
            </li>
          </ol>
          {!LIVEBLOCKS_KEY && <p className="solo-note">{t("soloNote")}</p>}
        </div>
      </section>
      <footer className="home-foot hand">♡ Two Crayons</footer>
    </div>
  );
}
