import { searchShows } from "../api.js";
import { useAsync } from "../hooks.js";
import ShowGrid, { SkeletonGrid } from "./ShowGrid.jsx";

export default function SearchResults({ query, isSaved, onToggleSave }) {
  const { loading, error, data } = useAsync(() => searchShows(query), [query]);

  return (
    <>
      <div className="section-head">
        <h2>Results for “{query}”</h2>
        <a href="#/" className="btn ghost sm">✕ Clear</a>
      </div>
      {loading && <SkeletonGrid count={6} />}
      {error && <p className="error">⚠️ {error.message}</p>}
      {data && data.length === 0 && (
        <div className="empty-state">
          <span>🔍</span>
          <p>No shows found for “{query}”. Check the spelling or try another title.</p>
        </div>
      )}
      {data && data.length > 0 && <ShowGrid shows={data} isSaved={isSaved} onToggleSave={onToggleSave} />}
    </>
  );
}
