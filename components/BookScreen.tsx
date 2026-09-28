"use client";

import { useEffect, useState } from "react";
import { BookProvider } from "@/lib/store";
import { useI18n, LangToggle } from "@/lib/i18n";
import { getProfile, setProfile, touchShelf, type Profile } from "@/lib/profile";
import { Editor, Logo } from "./Editor";
import { ProfileForm } from "./ProfileForm";

export function BookScreen({ bookId }: { bookId: string }) {
  const { t, lang } = useI18n();
  const [profile, setP] = useState<Profile | null | undefined>(undefined);
  useEffect(() => {
    setP(getProfile());
    touchShelf(bookId);
  }, [bookId]);

  if (profile === undefined) return <Loading label={t("connecting")} />;
  if (!profile)
    return (
      <div className="gate">
        <div className="gate-top">
          <Logo />
          <LangToggle />
        </div>
        <div className="gate-card paper-card">
          <h2 className="hand">{t("whoAreYou")}</h2>
          <ProfileForm
            initial={null}
            cta={t("letsGo")}
            onSave={(p) => {
              setProfile(p);
              setP(p);
            }}
          />
        </div>
      </div>
    );

  return (
    <BookProvider bookId={bookId} seed={{ lang, name: profile.name, color: profile.color }} fallback={<Loading label={t("connecting")} />}>
      <Editor bookId={bookId} profile={profile} />
    </BookProvider>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div className="loading">
      <div className="loading-book">
        <span />
        <span />
        <span />
      </div>
      <p className="hand">{label}</p>
    </div>
  );
}
