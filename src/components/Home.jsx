import { useMemo, useState } from "react";
import { popularShows } from "../api.js";
import { useAsync } from "../hooks.js";
import ShowGrid, { SkeletonGrid } from "./ShowGrid.jsx";

const SORTS = {
  rating: { label: "Top rated", fn: (a, b) => b.rating.average - a.rating.average },
  newest: { label: "Newest", fn: (a, b) => (b.premiered ?? "").localeCompare(a.premiered ?? "") },
  name: { label: "A–Z", fn: (a, b) => a.name.localeCompare(b.name) },
};

const PAGE = 24;

export default function Home({ isSaved, onToggleSave }) {
  const { loading, error, data } = useAsync(popularShows, []);
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("rating");
  const [limit, setLimit] = useState(PAGE);

  const genres = useMemo(() => {
    const counts = {};
    for (const s of data ?? []) for (const g of s.genres) counts[g] = (counts[g] ?? 0) + 1;
    return ["All", ...Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([g]) => g)];
  }, [data]);

  const shows = useMemo(() => {
    const list = (data ?? []).filter((s) => genre === "All" || s.genres.includes(genre));
    return [...list].sort(SORTS[sort].fn);
  }, [data, genre, sort]);

  const featured = data?.[0];

  return (
    <>
      {featured && (
        <a className="hero" href={`#/show/${featured.id}`} style={{ "--bg": `url(${featured.image.original})` }}>
          <div className="hero-content">
            <span className="hero-kicker">⭐ Highest rated</span>
            <h2>{featured.name}</h2>
            <p>{featured.genres.join(" · ")} · ★ {featured.rating.average.toFixed(1)}</p>
            <span className="btn primary">View details →</span>
          </div>
        </a>
      )}

      <div className="section-head">
        <h2>Discover shows</h2>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort shows">
          {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
      </div>

      <div className="chips" role="group" aria-label="Filter by genre">
        {genres.map((g) => (
          <button
            key={g}
            className={`chip ${genre === g ? "active" : ""}`}
            onClick={() => { setGenre(g); setLimit(PAGE); }}
          >
            {g}
          </button>
        ))}
      </div>

      {loading && <SkeletonGrid />}
      {error && <p className="error">⚠️ {error.message}</p>}
      {data && (
        <>
          <ShowGrid shows={shows.slice(0, limit)} isSaved={isSaved} onToggleSave={onToggleSave} />
          {limit < shows.length && (
            <div className="center">
              <button className="btn ghost" onClick={() => setLimit((l) => l + PAGE)}>
                Load more ({shows.length - limit} left)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
