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
