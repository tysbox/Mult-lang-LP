export async function onRequest(context) {
  const { request, env } = context;
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const GITHUB_REPOSITORY = env.GITHUB_REPOSITORY; // owner/repo
  const GITHUB_BRANCH = env.GITHUB_BRANCH || 'master';

  function b64Decode(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    return new Response(JSON.stringify({ success: false, error: 'Server not configured for GitHub reads' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // 言語パラメータ（未指定・不正値は en にフォールバック）
  const TRANSLATED_LOCALES = ['ja', 'zh', 'ko', 'fr'];
  const requested = new URL(request.url).searchParams.get('lang') || 'en';
  const lang = TRANSLATED_LOCALES.includes(requested) ? requested : 'en';
  const suffix = lang === 'en' ? '' : `.${lang}`;

  const homeRepoPath = `content/pages/home${suffix}.json`;
  const settingsRepoPath = `content/global/settings${suffix}.json`;

  try {
    const base = `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents`;

    const homeRes = await fetch(`${base}/${homeRepoPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    });

    if (!homeRes.ok) {
      const t = await homeRes.text();
      return new Response(JSON.stringify({ success: false, error: `Failed to fetch ${homeRepoPath}`, detail: t }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const homeJson = await homeRes.json();
    const pageData = JSON.parse(b64Decode(homeJson.content));

    const settingsRes = await fetch(`${base}/${settingsRepoPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    });
    if (!settingsRes.ok) {
      const t = await settingsRes.text();
      return new Response(JSON.stringify({ success: false, error: `Failed to fetch ${settingsRepoPath}`, detail: t }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const settingsJson = await settingsRes.json();
    const globalSettings = JSON.parse(b64Decode(settingsJson.content));

    return new Response(JSON.stringify({ success: true, lang, page: pageData, settings: globalSettings }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
