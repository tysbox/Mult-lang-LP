import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// For Cloudflare Pages production build, set BUILD_TARGET=cloudflare
// to generate a fully static site (API handled by functions/api/).
// For local dev, hybrid mode is used so /api/* routes are served by Astro dev server.
const isCloudflare = process.env.BUILD_TARGET === 'cloudflare';

export default defineConfig({
  output: isCloudflare ? 'static' : 'hybrid',
  ...(isCloudflare ? {} : { adapter: node({ mode: 'standalone' }) }),
  integrations: [tailwind()],
  // 多言語対応 (i18n)
  //   - defaultLocale: ルート `/` で表示する言語
  //   - locales: 対応言語（zh/ko/fr はスロット。翻訳ファイルを置けば有効化）
  //   - routing.prefixDefaultLocale: false → デフォルト言語はプレフィックス無し (/)
  //
  // 注意: i18n.fallback は「設定しない」。
  //   Astro の fallback は、既存ページを各フォールバック言語へ自動複製するため、
  //   [lang] 動的ルートと組み合わさると /zh/ja/ のような意図しないルートを生成する。
  //   未翻訳コンテンツのフォールバックは src/i18n/content.ts 側で処理している。
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'zh', 'ko', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  vite: {
    server: {
      watch: {
        // content/以下のJSONファイルを監視して変更時に再ビルド
        ignored: ['!**/content/**/*.json'],
      },
    },
  },
});
