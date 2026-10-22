// IndexNow (Bing, Yandex, Seznam, Naver; shared with other participating engines).
// The key is public by design: search engines verify it by fetching KEY_LOCATION,
// which is served from public/. Changing the key means renaming that file too.

export const INDEXNOW_KEY = "fba95bfa9b335a83cbfc56b6f018e1da";
export const INDEXNOW_HOST = "www.draftly.blog";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** One request accepts up to 10,000 URLs, all on the key's host. */
export async function submitToIndexNow(urls: string[], fetchImpl: typeof fetch = fetch): Promise<{ status: number; submitted: number }> {
  const urlList = [...new Set(urls)].filter((u) => new URL(u).host === INDEXNOW_HOST).slice(0, 10_000);
  if (urlList.length === 0) return { status: 204, submitted: 0 };
  const res = await fetchImpl(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: INDEXNOW_KEY_LOCATION, urlList }),
  });
  return { status: res.status, submitted: urlList.length };
}
