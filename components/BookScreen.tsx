"use client";

import { useEffect, useState } from "react";
import { BookProvider } from "@/lib/store";
import { useI18n, LangToggle } from "@/lib/i18n";
import { getProfile, setProfile, touchShelf, type Profile } from "@/lib/profile";
import { Editor, Logo } from "./Editor";
import { ProfileForm } from "./ProfileForm";
import type { KeyProblem } from "@/lib/types";

export function BookScreen({ bookId, liveKey, keyProblem }: { bookId: string; liveKey: string; keyProblem: KeyProblem }) {
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
    <BookProvider liveKey={liveKey} bookId={bookId} seed={{ lang, name: profile.name, color: profile.color }} fallback={<Loading label={t("connecting")} slowHint={t("slowConnect")} />}>
      <Editor bookId={bookId} profile={profile} keyProblem={keyProblem} />
    </BookProvider>
  );
}

export function Loading({ label, slowHint }: { label: string; slowHint?: string }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!slowHint) return;
    const t = setTimeout(() => setSlow(true), 10000);
    return () => clearTimeout(t);
  }, [slowHint]);
  return (
    <div className="loading">
      <div className="loading-book">
        <span />
        <span />
        <span />
      </div>
      <p className="hand">{label}</p>
      {slow && <p className="loading-slow">{slowHint}</p>}
    </div>
  );
}
