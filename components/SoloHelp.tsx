"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { KeyProblem } from "@/lib/types";
import { Icon } from "./Icons";

const TXT = {
  title: { en: "Solo mode — not syncing yet", ja: "ひとりモード（まだ同期されていません）" },
  missing: {
    en: "This deployment has no Liveblocks key, so each person's book only lives in their own browser.",
    ja: "公開中のサイトに同期用のキーが入っていないため、絵本はそれぞれのブラウザにしか保存されていません。",
  },
  secret: {
    en: "A secret key (sk_…) was set. Use the Public key (pk_…) instead — and roll the secret key in Liveblocks to be safe.",
    ja: "秘密キー（sk_…）が入っています。Public key（pk_…）に替えてください。念のため Liveblocks で秘密キーを作り直しておくと安心です。",
  },
  invalid: {
    en: "The key doesn't look right. It should start with pk_ (watch for spaces or quotes).",
    ja: "キーの形式が違います。pk_ で始まるキーを、前後のスペースや引用符なしで貼ってください。",
  },
  how: { en: "How to fix", ja: "直し方" },
  s1: {
    en: "Liveblocks dashboard → API keys → copy the Public key (starts with pk_).",
    ja: "Liveblocks のダッシュボード → API keys → Public key（pk_ で始まる）をコピー",
  },
  s2: {
    en: "Vercel → your project → Settings → Environment Variables → add NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY = pk_… (tick Production and Preview) → Save.",
    ja: "Vercel → プロジェクト → Settings → Environment Variables → 名前 NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY、値 pk_… を追加（Production と Preview にチェック）→ Save",
  },
  s3: {
    en: "Deployments → latest → ⋯ → Redeploy. New variables only apply after a redeploy.",
    ja: "Deployments → 一番上 → ⋯ → Redeploy。環境変数は再デプロイしないと反映されません",
  },
  s4: {
    en: "Both of you reload and open the same book link. The badge should say “Live”.",
    ja: "ふたりともページを再読み込みして、同じ絵本のリンクを開く。「つながってる」と出ればOK",
  },
} as const;

export function SoloHelp({ problem, compact, onClose }: { problem: Exclude<KeyProblem, "">; compact?: boolean; onClose?: () => void }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(!compact);
  return (
    <div className={`solo-help ${compact ? "compact" : ""}`} role="status">
      <div className="solo-help-head">
        <span className="solo-dot" />
        <strong>{TXT.title[lang]}</strong>
        {compact && (
          <button className="solo-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {TXT.how[lang]} {open ? "▴" : "▾"}
          </button>
        )}
        {onClose && (
          <button className="solo-x" onClick={onClose} aria-label="close">
            <Icon.close />
          </button>
        )}
      </div>
      {open && (
        <>
          <p>{TXT[problem][lang]}</p>
          <ol>
            <li>{TXT.s1[lang]}</li>
            <li>{TXT.s2[lang]}</li>
            <li>{TXT.s3[lang]}</li>
            <li>{TXT.s4[lang]}</li>
          </ol>
        </>
      )}
    </div>
  );
}
