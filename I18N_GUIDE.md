# 多言語対応（i18n）ガイド

このプロジェクトは Astro の組み込み i18n 機能と、独自のコンテンツ読み込みレイヤーを
組み合わせて多言語化しています。

## 対応言語

| コード | 言語     | URL          | 状態             |
| ------ | -------- | ------------ | ---------------- |
| `en`   | English  | `/`          | ✅ デフォルト    |
| `ja`   | 日本語   | `/ja/`       | ✅ 翻訳済み      |
| `zh`   | 中文     | `/zh/`       | ⏳ スロット（en にフォールバック） |
| `ko`   | 한국어   | `/ko/`       | ⏳ スロット（en にフォールバック） |
| `fr`   | Français | `/fr/`       | ⏳ スロット（en にフォールバック） |

- デフォルト言語 `en` はプレフィックス無し（`/`）。
- その他の言語は `/[lang]/` プレフィックス付き。
- 翻訳ファイルが無い言語は、自動的に `en` のコンテンツを表示します。

## ディレクトリ構成

```
src/
  i18n/
    config.ts     # ロケール定義・ファイル命名規則
    ui.ts         # 画面部品の文言辞書（Contact ボタン、フォーム等）
    content.ts    # ロケール別 JSON コンテンツの読み込み
    utils.ts      # パス生成ヘルパー（localePath / localizedHref / switchLocalePath）
    index.ts      # 再エクスポート
  components/
    HomePage.astro            # ロケール対応のホームページ本体
    global/
      LanguageSwitcher.astro  # 言語切替 UI
content/
  pages/
    home.json       # en（デフォルト）
    home.ja.json    # ja
  global/
    settings.json       # en
    settings.ja.json    # ja
```

## コンテンツの翻訳を追加する

### 1. ページコンテンツ

`content/pages/home.json` をコピーして `content/pages/home.<lang>.json` を作成し、
各フィールドを翻訳します。

```
content/pages/home.zh.json   # 中国語
content/pages/home.ko.json   # 韓国語
content/pages/home.fr.json   # フランス語
```

### 2. グローバル設定（ヘッダー/フッター）

`content/global/settings.json` をコピーして `content/global/settings.<lang>.json` を作成します。

### 3. UI 文言（画面部品）

`src/i18n/ui.ts` の `dictionaries` にロケールを追加します。

```ts
const zh: UIStrings = {
  contact: '联系我们',
  copyright: '© 2025. All rights reserved.',
  // ... en と同じキーをすべて定義
};

const dictionaries: Partial<Record<Locale, UIStrings>> = {
  en,
  ja,
  zh,   // ← 追加
};
```

未定義のキーは自動的に `en` にフォールバックします。

## 新しい言語を追加する

1. `src/i18n/config.ts` の `locales` 配列に言語コードを追加
2. `localeNames` / `localeShort` に表示名を追加
3. 上記「コンテンツの翻訳を追加する」を実施
4. `astro.config.mjs` の `i18n.locales` にも同じコードを追加

## 重要な設計上の注意

### `i18n.fallback` は設定しない

Astro の `i18n.fallback` は「既存ページを各フォールバック言語へ自動複製」します。
これを `[lang]` 動的ルートと併用すると `/zh/ja/` のような意図しないルートが
生成されるため、このプロジェクトでは **設定していません**。

未翻訳コンテンツのフォールバックは `src/i18n/content.ts` の
`loadPageData()` / `loadGlobalSettings()` が担当します。

### ファイル命名規則

`src/i18n/config.ts` の `contentFile()` を参照:

- デフォルト言語: `home.json`
- その他: `home.<lang>.json`

## 言語切替 UI

`LanguageSwitcher.astro` は現在のパスを保ったまま別言語へリンクします。

- `/ja/#faq` で EN を選ぶ → `/#faq`
- `/` で JA を選ぶ → `/ja/`

ヘッダー（デスクトップ・モバイル）に自動で組み込まれています。

## 技術スタック（新仕様）

このプロジェクトは以下のバージョンで動作します（旧プロジェクト `Biscene-LP` は旧仕様のまま凍結）。

| パッケージ | バージョン |
| --- | --- |
| Astro | `^7.3.5`（Node >= 22.12.0） |
| @astrojs/node | `^11.1.6` |
| Tailwind CSS | `^4.3.3`（`@tailwindcss/vite`） |
| TinaCMS | `^3.14.2` / `@tinacms/cli ^3.1.0` |

### Astro 7 への移行で変更した点

- `output: 'hybrid'` は廃止 → 常に `output: 'static'`（`export const prerender = false` で個別にオプトアウト可能）。
- `@astrojs/tailwind` 統合を削除 → `@tailwindcss/vite` プラグインに置換。
- `tsconfig.json` に `include: [".astro/types.d.ts", "**/*"]` / `exclude: ["dist"]` を追加。
- `src/pages/api/*.ts` の `prerender` を `process.env.BUILD_TARGET === 'cloudflare'` に変更。
  - Cloudflare ビルド時は静的化（アダプタ不要）、ローカル開発時のみオンデマンド。

### Tailwind 4 への移行で変更した点

- `tailwind.config.mjs` を削除し、`src/styles/global.css` の CSS-first 設定へ移植。
  - `theme.extend` → `@theme`、`plugins` → `@plugin`、`darkMode: 'class'` → `@custom-variant dark`。
- `MainLayout.astro` で `import '../styles/global.css';` を読み込み。
- v3 のデフォルト border 色（gray-200）を `@layer base` で維持（v4 は `currentColor` が既定）。
- クラス名の変更を適用: `shadow-sm`→`shadow-xs`、`rounded-sm`→`rounded-xs`、`backdrop-blur-sm`→`backdrop-blur-xs`、`outline-none`→`outline-hidden`、`ring`→`ring-3`、`flex-shrink-0`→`shrink-0`、`bg-gradient-to-b`→`bg-linear-to-b`。

### 検証済み

- `BUILD_TARGET=cloudflare npx astro build` → 6 ページ生成（`/`, `/ja/`, `/zh/`, `/ko/`, `/fr/`, `/admin/`）。
- `npx astro check` → 0 errors / 0 warnings。
- 開発サーバー全ルート HTTP 200。
