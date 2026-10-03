/**
 * コンテンツ読み込みユーティリティ
 *
 * ロケール別の JSON コンテンツを読み込みます。
 * 指定ロケールのファイルが存在しない場合は、デフォルトロケール (en) にフォールバックします。
 *
 * ファイル命名規則（src/i18n/config.ts の contentFile を参照）:
 *   en → content/pages/home.json
 *   ja → content/pages/home.ja.json
 */

import fs from 'fs';
import path from 'path';
import type { SiteData } from '../types';
import { defaultLocale, contentFile, type Locale } from './config';

export interface GlobalSettings {
  siteName?: string;
  header: {
    logo: { image?: string; text?: string };
    menuItems: { label: string; href: string }[];
  };
  footer: {
    copyright?: string;
    description?: string;
    socialLinks?: { icon: string; href: string; label: string }[];
    footerLinks?: { label: string; href: string }[];
  };
  navigation?: { label: string; href: string }[];
  socialLinks?: { icon: string; href: string; label: string }[];
}

const contentRoot = path.join(process.cwd(), 'content');

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

/**
 * ロケール別のページコンテンツを読み込む。
 * 見つからなければ defaultLocale のファイルにフォールバック。
 */
export function loadPageData(lang: Locale, base = 'home'): SiteData | null {
  const candidates = [contentFile(base, lang)];
  if (lang !== defaultLocale) candidates.push(contentFile(base, defaultLocale));

  for (const file of candidates) {
    const data = readJson<SiteData>(path.join(contentRoot, 'pages', file));
    if (data) return data;
  }
  return null;
}

/**
 * ロケール別のグローバル設定を読み込む。
 * 見つからなければ defaultLocale のファイルにフォールバック。
 */
export function loadGlobalSettings(lang: Locale): GlobalSettings | null {
  const candidates = [contentFile('settings', lang)];
  if (lang !== defaultLocale) candidates.push(contentFile('settings', defaultLocale));

  for (const file of candidates) {
    const data = readJson<GlobalSettings>(path.join(contentRoot, 'global', file));
    if (data) return data;
  }
  return null;
}

/** 指定ロケールのコンテンツが実在するか */
export function hasLocaleContent(lang: Locale, base = 'home'): boolean {
  return fs.existsSync(path.join(contentRoot, 'pages', contentFile(base, lang)));
}
