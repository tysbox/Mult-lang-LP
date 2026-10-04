# Japan Rediscover - Astro + TinaCMS

運用メモ: [TINA_EDITING_MEMO.md](./TINA_EDITING_MEMO.md)

## ⚡ ワンクリックで編集を始める

Finder で `start.command` をダブルクリックすると、以下が自動で行われます。

1. Node 22 の解決（nvm / volta / Homebrew を自動検出）
2. `node_modules` の健全性チェック（壊れていれば外部キャッシュから復旧）
3. Git インデックスの自己修復
4. 開発サーバーの起動（`http://127.0.0.1:3000`）
5. Safari で **編集画面（`/admin/`）** と **EN サイト（`/`）** を同一ウィンドウの別タブで起動

ターミナルから実行する場合:

```bash
npm run edit
```

| 環境変数 | 効果 |
| --- | --- |
| `MA_NO_OPEN=1` | ブラウザを開かない |
| `MA_OPEN_SITE=0` | 編集画面のみ開く（EN サイトを開かない） |
| `MA_SKIP_GIT=1` | Git インデックス修復をスキップ |

ログ: `${TMPDIR:-/tmp}/biscene-lp-start.log`

## 🧱 技術スタック（新仕様）

| パッケージ | バージョン | 備考 |
| --- | --- | --- |
| Astro | `^7.3.5` | Node >= 22.12.0 必須 |
| @astrojs/node | `^11.1.6` | ローカル開発用アダプタ |
| Tailwind CSS | `^4.3.3` | CSS-first 設定（`@tailwindcss/vite`） |
| @tailwindcss/vite | `^4.3.3` | v3 の `@astrojs/tailwind` を置換 |
| @tailwindcss/forms | `^0.5.11` | `@plugin` で読み込み |
| TinaCMS | `^3.14.2` | ローカル編集のみ（クラウドログインなし） |
| @tinacms/cli | `^3.1.0` | |
| TypeScript | `^5.9.3` | |

- Node バージョンは `.nvmrc`（`22`）で固定。
- Tailwind のテーマ設定は `src/styles/global.css` の `@theme` に集約（旧 `tailwind.config.mjs` は削除済み）。

## 🚀 初期セットアップ

### 1. リポジトリのクローンと依存関係のインストール

```bash
npm install
```

### 2. TinaCMSプロジェクトの設定

1. [TinaCMS Cloud](https://app.tina.io) にアクセス
2. 新規プロジェクトを作成
3. Client ID と Token を取得

### 3. 環境変数の設定

`.env` ファイルを作成:

```bash
TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token
TINA_BRANCH=main
TINA_PUBLIC_IS_LOCAL=true
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

以下が起動します:
- Astroサイト: `http://localhost:3000`
- 編集画面（カスタム管理画面）: `http://localhost:3000/admin/`

> ワンクリックで始める場合は `start.command` をダブルクリック（または `npm run edit`）。
> Safari で編集画面と EN サイトが同時に開きます。

## 📝 コンテンツ編集方法

### 編集画面（`/admin/`）から編集

1. `http://localhost:3000/admin/` にアクセス
2. 言語セレクタで `en` / `ja` / `zh` / `ko` / `fr` を切り替え
3. 各セクションを編集:
   - **ヒーローセクション**: タイトル、背景画像、CTAボタン
   - **創業者セクション**: プレヘッディング、説明文、画像
   - **ギャラリーセクション**: 各ギャラリーとアイテムを追加/編集
   - **FAQセクション**: 質問と回答を追加/編集
   - **お問い合わせ**: タイトルと説明文

4. 保存すると `content/pages/home.<lang>.json` に書き込まれ、EN サイトのタブが自動で反映されます（ホットリロード）。

### JSONファイルから直接編集

`content/pages/home.json` を直接編集することも可能です。

## 📁 ディレクトリ構造

```
project/
├── content/
│   ├── pages/
│   │   └── home.json          # ページコンテンツ
│   └── global/
│       └── settings.json       # グローバル設定
├── tina/
│   ├── config.ts              # TinaCMSメイン設定
│   └── fields/                # フィールド定義
│       ├── hero.ts
│       ├── contentBlock.ts
│       ├── gallery.ts
│       ├── faq.ts
│       ├── contact.ts
│       └── global.ts
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
│       ├── index.astro        # メインページ
│       └── admin/
│           └── index.astro    # TinaCMS管理画面
└── public/
    └── uploads/               # アップロード画像

```

## 🎨 セクションのカスタマイズ

### 新しいセクションの追加

1. `tina/config.ts` にフィールドを追加
2. `src/pages/index.astro` でデータを取得
3. 新しいコンポーネントを作成して配置

### 既存セクションの編集

TinaCMS管理画面から直接編集可能:
- テキストコンテンツ
- 画像のアップロード・変更
- セクションの表示/非表示
- 順序の入れ替え

## 🌐 デプロイ

### Cloudflare Pages（本番）

```bash
# 完全静的サイトを生成（API は functions/api/ が担当）
BUILD_TARGET=cloudflare npm run build
```

- `BUILD_TARGET=cloudflare` を付けると `output: 'static'` になり、アダプタ不要でビルドできます。
- 本番の `/api/*` は `functions/api/get-data.js` / `functions/api/save-file.js`（Cloudflare Pages Functions）が処理します。
- このとき `src/pages/api/*.ts` はビルド時に静的プリレンダリングされます（アダプタ未設定エラー回避のため）。
- ローカル開発時（`npm run dev`）は node アダプタが `/api/*` をオンデマンドで処理します。

### Vercel / Netlify（参考）

```bash
# Vercelにデプロイ
vercel

# 環境変数を設定
vercel env add TINA_CLIENT_ID
vercel env add TINA_TOKEN
vercel env add TINA_BRANCH
```

### Netlify

```bash
# Netlifyにデプロイ
netlify deploy --prod

# netlify.toml で環境変数を設定
```

## 🔧 トラブルシューティング

### TinaCMS管理画面が表示されない

1. `npm run dev` で両方のサーバーが起動しているか確認
2. `.env` ファイルの環境変数を確認
3. `tina/__generated__/` が生成されているか確認

### 画像が表示されない

1. 画像が `public/uploads/` にあるか確認
2. TinaCMSでアップロードした画像のパスを確認

## 📚 詳細ドキュメント

- [Astro公式ドキュメント](https://docs.astro.build)
- [TinaCMS公式ドキュメント](https://tina.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)