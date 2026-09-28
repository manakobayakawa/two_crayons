"use client";

import { useState } from "react";
import { CRAYONS } from "@/assets/crayon";
import { useI18n } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

export function ProfileForm({ initial, onSave, cta }: { initial: Profile | null; onSave: (p: Profile) => void; cta: string }) {
  const { t, lang } = useI18n();
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? CRAYONS[0].hex);
  return (
    <form
      className="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSave({ name: name.trim().slice(0, 24), color });
      }}
    >
      <label className="field">
        <span>{t("yourName")}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePh")} maxLength={24} required autoFocus />
      </label>
      <div className="field">
        <span>{t("yourCrayon")}</span>
        <div className="crayon-pick" role="radiogroup">
          {CRAYONS.filter((c) => c.id !== "white").map((c) => (
            <button
              type="button"
              key={c.id}
              role="radio"
              aria-checked={color === c.hex}
              className={`crayon-opt ${color === c.hex ? "on" : ""}`}
              style={{ ["--sw" as string]: c.hex }}
              onClick={() => setColor(c.hex)}
              title={c[lang]}
            >
              <svg viewBox="0 0 20 60" aria-hidden>
                <g filter="url(#cr)">
                  <path d="M10 2 L16 16 L4 16 Z" fill={c.hex} stroke="#4a3a3a" strokeWidth={1.6} strokeLinejoin="round" />
                  <rect x={3.5} y={16} width={13} height={42} rx={2.5} fill={c.hex} stroke="#4a3a3a" strokeWidth={1.6} />
                  <rect x={3.5} y={24} width={13} height={18} fill="#fffdf8" opacity={0.9} />
                </g>
              </svg>
            </button>
          ))}
        </div>
      </div>
      <button className="btn primary big" type="submit" disabled={!name.trim()}>
        {cta}
      </button>
    </form>
  );
}
