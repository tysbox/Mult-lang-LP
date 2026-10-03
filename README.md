# Japan Rediscover - Astro + TinaCMS

運用メモ: [TINA_EDITING_MEMO.md](/Users/tysbox/Desktop/biscene-lp-new/TINA_EDITING_MEMO.md)

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
- Astroサイト: `http://localhost:4321`
- TinaCMS管理画面: `http://localhost:4321/admin/index.html`

## 📝 コンテンツ編集方法

### TinaCMS管理画面から編集

1. `http://localhost:4321/admin/index.html` にアクセス
2. "Pages" → "home" を選択
3. 各セクションを編集:
   - **ヒーローセクション**: タイトル、背景画像、CTAボタン
   - **創業者セクション**: プレヘッディング、説明文、画像
   - **ギャラリーセクション**: 各ギャラリーとアイテムを追加/編集
   - **FAQセクション**: 質問と回答を追加/編集
   - **お問い合わせ**: タイトルと説明文

4. "Global Settings" で以下を編集:
   - サイト名
   - ナビゲーションメニュー
   - ソーシャルリンク
   - コピーライト

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

### Vercel

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