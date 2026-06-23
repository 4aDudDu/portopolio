const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GIST_ID = import.meta.env.VITE_GIST_ID;

const GIST_FILE = 'portfolio_data.json';

export function isCloudConfigured() {
  return !!(GITHUB_TOKEN && GIST_ID);
}

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 15000;

export function fetchCloudData() {
  return fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  }).then(async (res) => {
    if (res.status === 401) throw new Error('401: GitHub Token salah atau expired.');
    if (res.status === 404) throw new Error('404: Gist ID tidak ditemukan.');
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const json = await res.json();
    const raw = json.files?.[GIST_FILE]?.content;
    _cache = raw ? JSON.parse(raw) : { images: {}, customProjects: [], projectLinks: {} };
    _cacheTime = Date.now();
    return _cache;
  });
}

export async function saveCloudData(data) {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [GIST_FILE]: { content: JSON.stringify(data) } },
    }),
  });

  if (res.status === 401) throw new Error('401: GitHub Token salah.');
  if (res.status === 404) throw new Error('404: Gist tidak ditemukan.');
  if (!res.ok) throw new Error(`GitHub save error: ${res.status}`);

  _cache = data;
  _cacheTime = Date.now();
  return res.json();
}
