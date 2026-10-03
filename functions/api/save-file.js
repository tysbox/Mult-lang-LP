export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const GITHUB_TOKEN = env.GITHUB_TOKEN;
  const GITHUB_REPOSITORY = env.GITHUB_REPOSITORY; // owner/repo
  const GITHUB_BRANCH = env.GITHUB_BRANCH || 'master';

  try {
    const raw = await request.text();
    if (!raw) return new Response(JSON.stringify({ success: false, error: 'Empty body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { filename, content } = data;
    if (!filename || !content) return new Response(JSON.stringify({ success: false, error: 'filename and content required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Basic path validation
    if (filename.includes('..') && !filename.includes('../global/settings.json')) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid file path' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // resolve repo path
    let repoPath;
    if (filename.includes('global/settings.json')) {
      repoPath = 'content/global/settings.json';
    } else {
      // strip leading slashes
      const clean = filename.replace(/^\/+/, '');
      repoPath = `content/pages/${clean}`;
    }

    if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
      return new Response(JSON.stringify({ success: false, error: 'Server not configured for GitHub writes' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    function b64Encode(str) {
      // safe base64 for Workers
      return btoa(unescape(encodeURIComponent(str)));
    }

    const apiBase = `https://api.github.com/repos/${GITHUB_REPOSITORY}/contents/${encodeURIComponent(repoPath)}`;

    // check existing file to get sha
    const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    });

    let sha;
    if (getRes.ok) {
      const bodyJson = await getRes.json();
      sha = bodyJson.sha;
    } else if (getRes.status !== 404) {
      const text = await getRes.text();
      return new Response(JSON.stringify({ success: false, error: 'GitHub read error', detail: text }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const putBody = {
      message: `Update ${repoPath}`,
      content: b64Encode(typeof content === 'string' ? content : JSON.stringify(content, null, 2)),
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
      return new Response(JSON.stringify({ success: false, error: 'GitHub write error', detail: text }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const resJson = await putRes.json();
    return new Response(JSON.stringify({ success: true, message: 'Saved to GitHub', path: repoPath, sha: resJson.content?.sha }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
