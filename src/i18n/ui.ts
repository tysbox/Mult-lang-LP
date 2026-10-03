/**
 * UI 文言辞書
 *
 * コンポーネント内にハードコードされていた文言をここに集約します。
 * コンテンツ（home.json / settings.json）に含まれない「画面の部品」の文言用です。
 *
 * 新しい言語を追加する場合は、下記オブジェクトに同じキーを持つロケールを追加してください。
 * 未定義のキーは defaultLocale (en) にフォールバックします。
 */

import { defaultLocale, type Locale } from './config';

export interface UIStrings {
  /** ヘッダーの Contact ボタン */
  contact: string;
  /** フッターのデフォルト著作権表示 */
  copyright: string;
  /** 言語切替のラベル（スクリーンリーダー用） */
  languageSwitcherLabel: string;
  /** お問い合わせフォーム */
  form: {
    name: string;
    email: string;
    message: string;
    optional: string;
    optionalPlaceholder: string;
    send: string;
    sending: string;
    honeypot: string;
    fallbackPrefix: string;
    fallbackSuffix: string;
    fallbackPlaceholder: string;
    success: string;
    error: string;
    /** クライアントサイドのメッセージ */
    sendingInfo: string;
    verificationUnavailable: string;
    spamDetected: string;
    messageRequired: string;
    tooFast: string;
    wrongAnswer: string;
  };
  /** ページのデフォルト meta */
  meta: {
    title: string;
    description: string;
  };
}

const en: UIStrings = {
  contact: 'Contact',
  copyright: '© 2025. All rights reserved.',
  languageSwitcherLabel: 'Language',
  form: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    optional: '(optional)',
    optionalPlaceholder: 'Optional',
    send: 'Send Message',
    sending: 'Sending...',
    honeypot: 'Leave this field empty',
    fallbackPrefix: 'To send, please type the first letter of',
    fallbackSuffix: '(required if verification fails)',
    fallbackPlaceholder: 'Enter the first letter',
    success: 'Thank you. Your message has been sent.',
    error: 'Sorry, something went wrong. Please try again.',
    sendingInfo: 'Sending...',
    verificationUnavailable:
      'Verification is unavailable. Please complete the quick check below to send your message.',
    spamDetected: 'Spam detected. Submission blocked.',
    messageRequired: 'Message is required.',
    tooFast: 'Please take a moment before submitting.',
    wrongAnswer: 'Wrong answer. Please try again.',
  },
  meta: {
    title: 'Hidden Treasure Kyoto – A Personal Journey into Japanese Spiritual Culture',
    description:
      'A personal exploration of the quiet spiritual and aesthetic layers of Kyoto proposed by someone who grew up in Kyoto and later lived in London and Paris, it reflects on Shinto, traditional rituals, seasonal beauty, and the subtle side of Japanese culture.',
  },
};

const ja: UIStrings = {
  contact: 'お問い合わせ',
  copyright: '© 2025. All rights reserved.',
  languageSwitcherLabel: '言語',
  form: {
    name: 'お名前',
    email: 'メールアドレス',
    message: 'メッセージ',
    optional: '（任意）',
    optionalPlaceholder: '任意',
    send: '送信する',
    sending: '送信中...',
    honeypot: 'この欄は空のままにしてください',
    fallbackPrefix: '送信するには、次の単語の最初の文字を入力してください:',
    fallbackSuffix: '（認証に失敗した場合のみ必須）',
    fallbackPlaceholder: '最初の文字を入力',
    success: 'ありがとうございます。メッセージを送信しました。',
    error: '申し訳ありません。送信に失敗しました。もう一度お試しください。',
    sendingInfo: '送信中...',
    verificationUnavailable:
      '認証を利用できません。送信するには下の簡単な確認を完了してください。',
    spamDetected: 'スパムを検出しました。送信をブロックしました。',
    messageRequired: 'メッセージは必須です。',
    tooFast: '送信まで少しお待ちください。',
    wrongAnswer: '回答が正しくありません。もう一度お試しください。',
  },
  meta: {
    title: 'Hidden Treasure Kyoto – 日本の精神文化への個人的な旅',
    description:
      '京都で育ち、後にロンドンとパリで暮らした者が提案する、京都の静かな精神的・美的な層への個人的な探求。神道、伝統的な儀式、季節の美しさ、そして日本文化の繊細な側面を考察します。',
  },
};

/**
 * ロケール別辞書。
 * zh / ko / fr はスロットのみ用意（未定義の場合は en にフォールバック）。
 * 翻訳が用意でき次第、ここに追加してください。
 */
const dictionaries: Partial<Record<Locale, UIStrings>> = {
  en,
  ja,
  // zh: { ... },
  // ko: { ... },
  // fr: { ... },
};

/** 指定ロケールの UI 文言を取得（未定義キーは en にフォールバック） */
export function getUIStrings(lang: Locale): UIStrings {
  const base = dictionaries[defaultLocale] as UIStrings;
  const target = dictionaries[lang];
  if (!target) return base;
  // 浅いマージ（form などのネストは target 優先、無ければ base）
  return {
    ...base,
    ...target,
    form: { ...base.form, ...target.form },
    meta: { ...base.meta, ...target.meta },
  };
}
