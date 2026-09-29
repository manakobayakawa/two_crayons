# Two Crayons — ふたりで描く絵本

遠距離のふたりが、クレヨンで描いたパーツを並べて、セリフを書いて、ページをめくりながら一緒に絵本を作れるサイトです。
A crayon picture-book maker for two people, live, from anywhere.

## できること

- **パーツ 32種**：なかま（くま・うさぎ・ねこ・きつね・ペンギン・ことり・かえる・くじら・おんなのこ・おとこのこ）、しぜん、もの（いとでんわ・ひこうき・おてがみ など）
- **ふきだし 9種**：おはなし／しかく／かんがえ／さけぶ／ひそひそ／すき（ハート）／ナレーション／メモ／リボン。大きさを変えても線の太さが崩れない
- **背景 12種**：はらっぱ、ほしぞら、うみべ、もり、ゆきのひ、ゆうやけ、おへや、まち、おそら、うちゅう、おはなばたけ、まっさら
- ドラッグで移動、角で拡大、上のハンドルで回転、色替え、反転、重なり順、複製、削除、元に戻す（⌘Z）
- ダブルクリックで文字入力。書体4種（クレヨン／えんぴつ／まるもじ／ポップ）、日英どちらも手書き風フォント
- **本物の絵本みたいなページめくり**（右ページが持ち上がってめくれる3Dアニメーション＋紙の音）
- **リアルタイム共同編集**：相手のクレヨン型カーソル、選択中のパーツ、どのページにいるかが見える。「ついていく」で相手のページに自動でめくる。♡ボタンで相手の画面にハートが飛ぶ
- 「よむ」モード（全画面で読む、最後に「おしまい」）、印刷・PDF保存、UIは **EN / 日本語** 切り替え、スマホ対応

## セットアップ（GitHub → Vercel）

1. **Liveblocks のキーを取る**（無料・カード不要）
   https://liveblocks.io にサインアップ → Dashboard → プロジェクトを作成 → **API keys** の **Public key**（`pk_prod_...` または `pk_dev_...`）をコピー
2. このフォルダを GitHub の新しいリポジトリに push
   ```bash
   git init && git add -A && git commit -m "Two Crayons"
   git branch -M main
   git remote add origin https://github.com/<you>/two-crayons.git
   git push -u origin main
   ```
3. Vercel で **Add New → Project** → そのリポジトリを Import
4. **Environment Variables** に追加して Deploy
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` | 手順1でコピーしたキー |
   - **あとから追加・変更したときは必ず Redeploy**（Deployments → 一番上の ⋯ → Redeploy）。環境変数は再デプロイしないと反映されません
   - Production と Preview の両方にチェック。値は `pk_` で始まるキーを、引用符やスペースなしで
   - `sk_` で始まる秘密キーは使いません（入れても安全のため無視され、画面に注意が出ます）
5. サイトを開いて名前とクレヨンの色を選び「新しい絵本をつくる」→ 右上の「共有」でリンクをコピーして相手に送る
6. 編集画面のタイトル横が **「つながってる / Live」** になっていれば同期OK。**「ひとりモード」** のままなら、右下に出る「直し方」を見てください

> キーを入れずに動かすと「ひとりモード」になり、絵本はそのブラウザにだけ保存されます（同じブラウザの別タブ同士では同期するので、お試しに使えます）。

## ローカルで動かす

```bash
npm install
cp .env.example .env.local   # キーを書き込む（なくても動く）
npm run dev                   # http://localhost:3000
```

## しくみ

- Next.js 16 (App Router) + React 19 + TypeScript
- リアルタイム同期：Liveblocks Storage（`LiveList` / `LiveMap` / `LiveObject`）＋ Presence ＋ Broadcast
- 絵はすべてコードで描いた SVG。`assets/crayon.tsx` の SVG フィルター（ゆらぎ＋ワックスの粒）でクレヨンの質感を出しています
- フォントは @fontsource でセルフホスト（Gochi Hand / Patrick Hand / Fredoka / Chewy ＋ Yusei Magic / Klee One / Kiwi Maru / Hachi Maru Pop / Zen Maru Gothic）
- 座標は「見開きの幅の 1% = 1U」で保存しているので、どの画面サイズでも同じレイアウトになります

| ファイル | 役割 |
|---|---|
| `assets/stickers.tsx` | キャラクター・しぜん・もの |
| `assets/bubbles.tsx` | ふきだし（縦横比に合わせて形を再計算） |
| `assets/backgrounds.tsx` | 背景 |
| `lib/store.tsx` | Liveblocks / ひとりモード の2つの保存方式を同じAPIで提供 |
| `components/Canvas.tsx` | 編集できるページ（ドラッグ・拡大・回転・文字入力・相手のカーソル） |
| `components/Flip.tsx` | ページめくりアニメーション |
| `lib/i18n.tsx` | 日英の文言 |

パーツを追加したいときは `STICKERS` 配列に1つ足すだけで、パーツ棚に自動で並びます。

## メモ

- 絵本のリンクを知っている人は誰でも開いて編集できます（ログインなし）。リンクはふたりだけで共有してください
- Liveblocks 無料プランは 1ルーム同時接続10人・ストレージ10MB。ふたりの絵本には十分です
