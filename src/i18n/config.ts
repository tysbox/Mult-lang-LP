/**
 * i18n 設定
 *
 * 対応ロケールの一覧と、デフォルトロケールを定義します。
 * 新しい言語を追加する場合は `locales` にコードを追加し、
 * `localeNames` / `localeShort` に表示名を追加してください。
 *
 * コンテンツファイルの命名規則:
 *   - デフォルトロケール (en)  → content/pages/home.json        （既存ファイルをそのまま使用）
 *   - その他のロケール (ja 等) → content/pages/home.ja.json
 *   - グローバル設定も同様     → content/global/settings.ja.json
 *
 * これにより、既存の CMS / API パイプライン（home.json / settings.json を参照）は
 * そのまま動作しつつ、他言語を追加できます。
 */

export const locales = ['en', 'ja', 'zh', 'ko', 'fr'] as const;

export type Locale = (typeof locales)[number];

/** ルート `/` で表示される言語 */
export const defaultLocale: Locale = 'en';

/** 言語切替 UI に表示する名称 */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  ko: '한국어',
  fr: 'Français',
};

/** コンパクト表示用（ヘッダー等） */
export const localeShort: Record<Locale, string> = {
  en: 'EN',
  ja: 'JA',
  zh: 'ZH',
  ko: 'KO',
  fr: 'FR',
};

/**
 * 翻訳が完了しているロケール。
 * ここに含まれないロケールは、コンテンツが無い場合デフォルト言語へフォールバックします。
 * （zh / ko / fr は「スロット」として用意済み。翻訳ファイルを置けば即座に有効になります）
 */
export const translatedLocales: Locale[] = ['en', 'ja'];

/** ロケールが有効か判定 */
export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * コンテンツのベース名からロケール別ファイル名を生成。
 *   contentFile('home', 'en') → 'home.json'
 *   contentFile('home', 'ja') → 'home.ja.json'
 */
export function contentFile(base: string, lang: Locale): string {
  return lang === defaultLocale ? `${base}.json` : `${base}.${lang}.json`;
}
