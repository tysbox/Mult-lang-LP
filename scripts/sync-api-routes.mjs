/**
 * API ルートの同期スクリプト
 *
 * 背景:
 *   Astro 7 はルートファイル内の `export const prerender = <動的式>` を
 *   静的解析で評価できないため、process.env.BUILD_TARGET を使った
 *   条件分岐はビルド時に無視されます。
 *
 *   そこで API ソースを src/api/ に保管し、ビルド対象外の Cloudflare
 *   ビルドでは src/pages/api/ から除去、ローカル開発では複製して
 *   `prerender = false` リテラルを付与します。
 *
 * 動作:
 *   - BUILD_TARGET=cloudflare → src/pages/api/ を削除（functions/api/ が担当）
 *   - それ以外（ローカル開発）→ src/api/*.ts を src/pages/api/ へ複製
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcApiDir = path.join(root, 'src', 'api');
const pagesApiDir = path.join(root, 'src', 'pages', 'api');

const isCloudflare = process.env.BUILD_TARGET === 'cloudflare';

if (isCloudflare) {
  // Cloudflare Pages ビルド: API は functions/api/ が担当するため除去
  if (fs.existsSync(pagesApiDir)) {
    fs.rmSync(pagesApiDir, { recursive: true });
    console.log('[sync-api-routes] removed src/pages/api/ (Cloudflare build)');
  } else {
    console.log('[sync-api-routes] src/pages/api/ already absent (Cloudflare build)');
  }
} else {
  // ローカル開発: src/api/ から src/pages/api/ へ複製し prerender=false を付与
  fs.mkdirSync(pagesApiDir, { recursive: true });
  const files = fs.readdirSync(srcApiDir).filter((f) => f.endsWith('.ts'));
  for (const file of files) {
    const src = fs.readFileSync(path.join(srcApiDir, file), 'utf-8');
    let out = src;
    // 既存の prerender 行をリテラル false に置換（無ければ先頭に挿入）
    if (/export const prerender\s*=\s*[^;]+;/.test(out)) {
      out = out.replace(/export const prerender\s*=\s*[^;]+;/, 'export const prerender = false;');
    } else {
      out = `export const prerender = false;\n\n${out}`;
    }
    fs.writeFileSync(path.join(pagesApiDir, file), out, 'utf-8');
    console.log(`[sync-api-routes] synced ${file} -> src/pages/api/ (prerender=false)`);
  }
}
