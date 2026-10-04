/**
 * パスヘルパー
 *
 * ロケール別の URL を生成します。
 *   - デフォルトロケール (en) はルート直下:  /        /#faq
 *   - その他のロケール (ja)  はプレフィックス: /ja/    /ja/#faq
 */

import { defaultLocale, type Locale } from './config';

/** ロケールのベースパスを返す（末尾スラッシュ付き） */
export function localePath(lang: Locale): string {
  return lang === defaultLocale ? '/' : `/${lang}/`;
}

/**
 * ロケール内のアンカー/パスを生成。
 *   localizedHref('ja', '#faq')  → '/ja/#faq'
 *   localizedHref('en', '#faq')  → '/#faq'
 *   localizedHref('ja', '/')     → '/ja/'
 */
export function localizedHref(lang: Locale, href: string): string {
  // 外部リンク・絶対URLはそのまま
  if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }
  const base = localePath(lang);
  if (href.startsWith('#')) return `${base}${href}`;
  if (href === '/' || href === '') return base;
  // 先頭スラッシュを除去して結合
  return `${base}${href.replace(/^\//, '')}`;
}

/**
 * 現在のパスから別ロケールの同等パスを生成（言語切替用）。
 * 例: currentPath='/ja/#faq', target='en' → '/#faq'
 */
export function switchLocalePath(currentPath: string, target: Locale): string {
  // ハッシュを分離
  const [pathPart, hash = ''] = currentPath.split('#');
  const hashSuffix = hash ? `#${hash}` : '';

  // 先頭のロケールセグメントを除去
  const segments = pathPart.split('/').filter(Boolean);
  const knownLocales = ['en', 'ja', 'zh', 'ko', 'fr'];
  if (segments.length > 0 && knownLocales.includes(segments[0])) {
    segments.shift();
  }
  const rest = segments.join('/');

  const base = localePath(target);
  if (!rest) return `${base}${hashSuffix}`;
  return `${base}${rest}${hashSuffix}`;
}

/**
 * 画像などの静的アセットパスを正規化。
 *
 * コンテンツ JSON 内の画像パスは歴史的経緯で複数の形式が混在しています:
 *   - "images/hero/x.png"        （相対パス — ルートでは動くが /ja/ では壊れる）
 *   - "/images/hero/x.png"       （絶対パス — どこでも動く）
 *
 * この関数は先頭にスラッシュを付与して常に絶対パスへ正規化します。
 * これにより /ja/ や /zh/ などロケールプレフィックス付きの URL でも
 * 画像が正しく解決されます。
 *
 * 例:
 *   normalizeAssetPath('images/hero/x.png')  → '/images/hero/x.png'
 *   normalizeAssetPath('/images/hero/x.png') → '/images/hero/x.png'
 *   normalizeAssetPath('https://example.com/x.png') → そのまま返す
 */
export function normalizeAssetPath(p: string | undefined | null): string {
  if (!p) return '';
  // 外部URL・data URI はそのまま
  if (/^(https?:)?\/\//.test(p) || p.startsWith('data:')) return p;
  // 先頭スラッシュを正規化
  return `/${p.replace(/^\/+/, '')}`;
}
