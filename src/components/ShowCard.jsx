import { yearRange } from "../api.js";

export default function ShowCard({ show, saved, onToggleSave }) {
  const rating = show.rating?.average;
  return (
    <article className="show-card">
      <a href={`#/show/${show.id}`} className="poster-link" aria-label={`${show.name} details`}>
        {show.image ? (
          <img src={show.image.medium} alt="" loading="lazy" width="210" height="295" />
        ) : (
          <div className="poster-fallback">📺</div>
        )}
        {rating && <span className="rating-badge">★ {rating.toFixed(1)}</span>}
      </a>
      <button
        className={`save-btn ${saved ? "saved" : ""}`}
        onClick={() => onToggleSave(show)}
        aria-label={saved ? `Remove ${show.name} from watchlist` : `Add ${show.name} to watchlist`}
        title={saved ? "Remove from watchlist" : "Add to watchlist"}
      >
        {saved ? "♥" : "♡"}
      </button>
      <div className="show-info">
        <a href={`#/show/${show.id}`} className="show-name">{show.name}</a>
        <span className="show-meta">
          {[yearRange(show), show.genres?.slice(0, 2).join(", ")].filter(Boolean).join(" · ")}
        </span>
      </div>
    </article>
  );
}
