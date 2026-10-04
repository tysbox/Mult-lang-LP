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
  // encode each segment but keep slashes
  return p.split('/').map(encodeURIComponent).join('/');
}

function base64Encode(str: string) {
  if (typeof Buffer !== 'undefined') return Buffer.from(str).toString('base64');
  if (typeof btoa !== 'undefined') return btoa(unescape(encodeURIComponent(str)));
  throw new Error('Base64 encode not available');
}

function base64Decode(b64: string) {
  if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf-8');
  if (typeof atob !== 'undefined') return decodeURIComponent(escape(atob(b64)));
  throw new Error('Base64 decode not available');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // ボディは一度だけ読む（request.json() 失敗時に request.text() が空になるのを防ぐ）
    let data: any;
    try {
      const rawBody = await request.text();
      if (!rawBody) {
        console.error('Empty request body received');
        return new Response(
          JSON.stringify({ success: false, error: 'Empty request body' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { filename, content } = data;

    if (!filename || !content) {
      return new Response(
        JSON.stringify({ success: false, error: 'filename と content は必須です' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ファイル名のホワイトリスト検証（ディレクトリトラバーサル対策）
    // 許可: home.json / home.<lang>.json / settings.json / settings.<lang>.json
    const TRANSLATED_LOCALES = ['ja', 'zh', 'ko', 'fr'];
    const allowedPageFiles = new Set(['home.json', ...TRANSLATED_LOCALES.map((l) => `home.${l}.json`)]);
    const allowedSettingsFiles = new Set(['settings.json', ...TRANSLATED_LOCALES.map((l) => `settings.${l}.json`)]);

    // basename でディレクトリ部分を除去（../global/settings.json も settings.json として扱う）
    const baseName = path.basename(filename);

    let contentPathLocal: string;
    let contentPathRepo: string;
    if (allowedSettingsFiles.has(baseName)) {
      contentPathLocal = path.join(process.cwd(), 'content/global', baseName);
      contentPathRepo = `content/global/${baseName}`;
    } else if (allowedPageFiles.has(baseName)) {
      contentPathLocal = path.join(process.cwd(), 'content/pages', baseName);
      contentPathRepo = `content/pages/${baseName}`;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: `不正なファイル名です: ${baseName}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // JSONのバリデーション
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: '無効なJSON形式です' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If GitHub env is available, use GitHub Contents API to create/update file
    if (GITHUB_TOKEN && GITHUB_REPOSITORY) {
      try {
        const apiBase = `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents/${encodeRepoPath(contentPathRepo)}`;

        // Check if file exists to obtain sha
        const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
        });

        let sha: string | undefined;
        if (getRes.ok) {
          const bodyJson = await getRes.json();
          sha = bodyJson.sha;
        } else if (getRes.status !== 404) {
          const text = await getRes.text();
          console.error('GitHub GET error:', getRes.status, text);
          return new Response(
            JSON.stringify({ success: false, error: 'GitHub API エラー（読み取り）' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const putBody: any = {
          message: `Update ${contentPathRepo}`,
          content: base64Encode(JSON.stringify(parsed, null, 2)),
          branch: GITHUB_BRANCH,
        };
        if (sha) putBody.sha = sha;

        const putRes = await fetch(apiBase, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
          body: JSON.stringify(putBody),
        });

        if (!putRes.ok) {
          const text = await putRes.text();
          console.error('GitHub PUT error:', putRes.status, text);
          return new Response(
            JSON.stringify({ success: false, error: 'GitHub API エラー（書き込み）' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const resJson = await putRes.json();
        console.log(`[save-file API] GitHub updated: ${contentPathRepo} (${resJson.content?.sha}) at ${new Date().toISOString()}`);

        return new Response(
          JSON.stringify({ success: true, message: 'GitHub に保存しました', path: contentPathRepo, sha: resJson.content?.sha }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('GitHub save error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'GitHub への保存に失敗しました' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Fallback: local filesystem write (for local editing / dev)
    try {
      fs.writeFileSync(contentPathLocal, JSON.stringify(parsed, null, 2), 'utf-8');
      console.log(`[save-file API] Saved locally to: ${contentPathLocal} at ${new Date().toISOString()}`);

      return new Response(
        JSON.stringify({ success: true, message: 'ファイルをローカルに保存しました', path: contentPathLocal }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Local save error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'ローカルへの保存に失敗しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Save file error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
