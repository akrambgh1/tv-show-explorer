import ShowCard from "./ShowCard.jsx";

export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="show-card skeleton">
          <div className="poster-fallback" />
          <div className="show-info">
            <span className="sk-line" />
            <span className="sk-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShowGrid({ shows, isSaved, onToggleSave }) {
  return (
    <div className="grid">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} saved={isSaved(show.id)} onToggleSave={onToggleSave} />
      ))}
    </div>
  );
}
