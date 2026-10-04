import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Cloudflare Pages では functions/api/ が API を担当するため、
// ビルド時は静的プリレンダリングに切り替える（アダプタ不要）。
// ローカル開発時のみオンデマンド（node アダプタ）で動作させる。
export const prerender = process.env.BUILD_TARGET === 'cloudflare';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY; // owner/repo
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || process.env.GITHUB_REF || 'master';

function encodeRepoPath(p: string) {
  return p.split('/').map(encodeURIComponent).join('/');
}

function base64Decode(b64: string) {
  if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf-8');
  if (typeof atob !== 'undefined') return decodeURIComponent(escape(atob(b64)));
  throw new Error('Base64 decode not available');
}

export const GET: APIRoute = async ({ url }) => {
  try {
    // 言語パラメータ（未指定・不正値は en にフォールバック）
    const TRANSLATED_LOCALES = ['ja', 'zh', 'ko', 'fr'];
    const requested = url.searchParams.get('lang') || 'en';
    const lang = TRANSLATED_LOCALES.includes(requested) ? requested : 'en';
    const suffix = lang === 'en' ? '' : `.${lang}`;

    const homeRepoPath = `content/pages/home${suffix}.json`;
    const settingsRepoPath = `content/global/settings${suffix}.json`;

    // If GitHub env is available, prefer GitHub API to fetch content (works on Cloudflare too)
    if (GITHUB_TOKEN && GITHUB_REPOSITORY) {
      try {
        const base = `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents`;
        const homeRes = await fetch(`${base}/${encodeRepoPath(homeRepoPath)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
        });
        if (!homeRes.ok) {
          console.error('GitHub home GET failed:', homeRes.status, await homeRes.text());
          throw new Error('GitHub home fetch failed');
        }
        const homeJson = await homeRes.json();
        const pageData = JSON.parse(base64Decode(homeJson.content));

        const settingsRes = await fetch(`${base}/${encodeRepoPath(settingsRepoPath)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
        });
        if (!settingsRes.ok) {
          console.error('GitHub settings GET failed:', settingsRes.status, await settingsRes.text());
          throw new Error('GitHub settings fetch failed');
        }
        const settingsJson = await settingsRes.json();
        const globalSettings = JSON.parse(base64Decode(settingsJson.content));

        return new Response(
          JSON.stringify({ success: true, lang, page: pageData, settings: globalSettings }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('GitHub fetch error, falling back to local files:', error);
        // fallthrough to local read
      }
    }

    // If not configured with a GitHub token, try to fetch from public raw.githubusercontent.com as a read-only fallback
    try {
      const publicRepo = process.env.PUBLIC_GITHUB_REPOSITORY || 'tysbox/BiScene--LP';
      const branch = GITHUB_BRANCH || 'master';
      const rawHomeUrl = `https://raw.githubusercontent.com/${publicRepo}/${encodeURIComponent(branch)}/${homeRepoPath}`;
      const rawSettingsUrl = `https://raw.githubusercontent.com/${publicRepo}/${encodeURIComponent(branch)}/${settingsRepoPath}`;

      const rawHome = await fetch(rawHomeUrl);
      const rawSettings = await fetch(rawSettingsUrl);
      if (rawHome.ok && rawSettings.ok) {
        const pageData = await rawHome.json();
        const globalSettings = await rawSettings.json();
        return new Response(
          JSON.stringify({ success: true, lang, page: pageData, settings: globalSettings }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (err) {
      console.error('Public raw.githubusercontent fallback failed:', err);
      // proceed to local fallback
    }

    // Fallback: local filesystem read（指定言語が無ければ en にフォールバック）
    const readLocal = (relPath: string) => {
      const abs = path.join(process.cwd(), relPath);
      return fs.existsSync(abs) ? JSON.parse(fs.readFileSync(abs, 'utf-8')) : null;
    };

    const pageData =
      readLocal(homeRepoPath) ?? readLocal('content/pages/home.json');
    const globalSettings =
      readLocal(settingsRepoPath) ?? readLocal('content/global/settings.json');

    return new Response(
      JSON.stringify({ success: true, lang, page: pageData, settings: globalSettings }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Data load error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to load data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
