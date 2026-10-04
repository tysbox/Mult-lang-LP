import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// For Cloudflare Pages production build, set BUILD_TARGET=cloudflare.
// Cloudflare Pages では functions/api/ が API を担当するため、
// src/pages/api/ 配下の API ルートをビルドに含めません。
// （API ソースは src/api/ に保管し、ローカル開発時のみ src/pages/api/ へ複製）
//
// Astro 5+ removed `output: 'hybrid'`; `'static'` now supports opting individual
// routes out of prerendering via `export const prerender = false`.
const isCloudflare = process.env.BUILD_TARGET === 'cloudflare';

export default defineConfig({
  output: 'static',
  ...(isCloudflare ? {} : { adapter: node({ mode: 'standalone' }) }),
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
    plugins: [tailwindcss()],
    server: {
      watch: {
        // content/以下のJSONファイルを監視して変更時に再ビルド
        ignored: ['!**/content/**/*.json'],
      },
    },
  },
});
