// Free TVMaze API: https://www.tvmaze.com/api (no key needed)
const BASE = "https://api.tvmaze.com";
const cache = new Map();

async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const request = fetch(`${BASE}${path}`).then((res) => {
    if (res.status === 429) throw new Error("Too many requests, please wait a few seconds and try again.");
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
  });
  cache.set(path, request);
  request.catch(() => cache.delete(path)); // don't cache failures
  return request;
}

export const searchShows = (query) =>
  get(`/search/shows?q=${encodeURIComponent(query)}`).then((results) => results.map((r) => r.show));

// The API lists shows in pages of 250, sorted by id. We take the first few pages and rank them.
export async function popularShows() {
  const pages = await Promise.all([0, 1, 2].map((p) => get(`/shows?page=${p}`)));
  return pages
    .flat()
    .filter((s) => s.rating?.average && s.image && s.weight >= 90)
    .sort((a, b) => b.rating.average - a.rating.average || b.weight - a.weight);
}

export const showDetails = (id) => get(`/shows/${id}?embed[]=cast&embed[]=seasons`);

export const seasonEpisodes = (seasonId) => get(`/seasons/${seasonId}/episodes`);

// Summaries come as HTML. Turn them into plain text safely.
export function stripHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.trim() ?? "";
}

export const year = (date) => (date ? date.slice(0, 4) : "");

export function yearRange(show) {
  const start = year(show.premiered);
  if (!start) return "";
  if (show.status === "Running") return `${start}–present`;
  const end = year(show.ended);
  return end && end !== start ? `${start}–${end}` : start;
}
