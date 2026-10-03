export async function onRequest(context) {
  const { env } = context;
  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const GITHUB_REPOSITORY = env.GITHUB_REPOSITORY; // owner/repo
  const GITHUB_BRANCH = env.GITHUB_BRANCH || 'master';

  function b64Decode(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    return new Response(JSON.stringify({ success: false, error: 'Server not configured for GitHub reads' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const base = `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents`;

    const homeRes = await fetch(`${base}/content/pages/home.json?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    });

    if (!homeRes.ok) {
      const t = await homeRes.text();
      return new Response(JSON.stringify({ success: false, error: 'Failed to fetch home.json', detail: t }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const homeJson = await homeRes.json();
    const pageData = JSON.parse(b64Decode(homeJson.content));

    const settingsRes = await fetch(`${base}/content/global/settings.json?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    });
    if (!settingsRes.ok) {
      const t = await settingsRes.text();
      return new Response(JSON.stringify({ success: false, error: 'Failed to fetch settings.json', detail: t }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const settingsJson = await settingsRes.json();
    const globalSettings = JSON.parse(b64Decode(settingsJson.content));

    return new Response(JSON.stringify({ success: true, page: pageData, settings: globalSettings }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
