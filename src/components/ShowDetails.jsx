import { useEffect, useState } from "react";
import { seasonEpisodes, showDetails, stripHtml, yearRange } from "../api.js";
import { useAsync } from "../hooks.js";

function Episodes({ seasonId }) {
  const { loading, error, data } = useAsync(() => seasonEpisodes(seasonId), [seasonId]);
  if (loading) return <p className="muted">Loading episodes…</p>;
  if (error) return <p className="error">⚠️ {error.message}</p>;
  if (!data.length) return <p className="muted">No episodes listed for this season yet.</p>;

  return (
    <ol className="episodes">
      {data.map((ep) => (
        <li key={ep.id} className="episode">
          {ep.image ? (
            <img src={ep.image.medium} alt="" loading="lazy" width="160" height="90" />
          ) : (
            <div className="ep-fallback">E{ep.number ?? "–"}</div>
          )}
          <div className="ep-body">
            <div className="ep-head">
              <strong>{ep.number ? `${ep.number}. ` : ""}{ep.name}</strong>
              {ep.rating?.average && <span className="ep-rating">★ {ep.rating.average}</span>}
            </div>
            <span className="muted small">
              {[ep.airdate && new Date(`${ep.airdate}T00:00`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), ep.runtime && `${ep.runtime} min`].filter(Boolean).join(" · ")}
            </span>
            {ep.summary && <p className="ep-summary">{stripHtml(ep.summary)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ShowDetails({ id, isSaved, onToggleSave }) {
  const { loading, error, data: show } = useAsync(() => showDetails(id), [id]);
  const [seasonId, setSeasonId] = useState(null);

  const seasons = show?._embedded?.seasons ?? [];
  useEffect(() => {
    if (seasons.length) setSeasonId(seasons[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show?.id]);

  useEffect(() => {
    if (show) document.title = `${show.name} — Binge`;
    return () => { document.title = "Binge — TV Show Explorer"; };
  }, [show]);

  if (loading) return <div className="details-skeleton"><div className="poster-fallback" /><div><span className="sk-line" /><span className="sk-line short" /></div></div>;
  if (error) return <p className="error">⚠️ {error.message} <a href="#/">Back home</a></p>;

  const cast = show._embedded?.cast ?? [];
  const network = show.network?.name ?? show.webChannel?.name;
  const saved = isSaved(show.id);
  const facts = [
    ["Status", show.status],
    ["Network", network],
    ["Runtime", show.averageRuntime && `${show.averageRuntime} min`],
    ["Language", show.language],
    ["Schedule", show.schedule?.days?.length ? `${show.schedule.days.join(", ")}${show.schedule.time ? ` at ${show.schedule.time}` : ""}` : null],
    ["Type", show.type],
  ].filter(([, v]) => v);

  return (
    <article className="details">
      <a href="#/" className="back" onClick={(e) => { if (history.length > 1) { e.preventDefault(); history.back(); } }}>← Back</a>

      <header className="details-hero" style={show.image ? { "--bg": `url(${show.image.original})` } : undefined}>
        {show.image ? (
          <img className="details-poster" src={show.image.medium} alt={`${show.name} poster`} width="210" height="295" />
        ) : (
          <div className="details-poster poster-fallback">📺</div>
        )}
        <div className="details-main">
          <h1>{show.name}</h1>
          <p className="details-meta">
            {[yearRange(show), show.genres.join(", ")].filter(Boolean).join(" · ")}
          </p>
          <div className="details-badges">
            {show.rating?.average && <span className="big-rating">★ {show.rating.average.toFixed(1)}<small>/10</small></span>}
            <button className={`btn ${saved ? "ghost" : "primary"}`} onClick={() => onToggleSave(show)}>
              {saved ? "♥ In watchlist" : "♡ Add to watchlist"}
            </button>
          </div>
          <p className="summary">{stripHtml(show.summary) || "No summary available."}</p>
          <div className="links">
            {show.officialSite && <a href={show.officialSite} target="_blank" rel="noopener noreferrer">Official site ↗</a>}
            <a href={show.url} target="_blank" rel="noopener noreferrer">View on TVMaze ↗</a>
          </div>
        </div>
      </header>

      <dl className="facts">
        {facts.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      {cast.length > 0 && (
        <section className="block">
          <h2>Cast</h2>
          <div className="cast">
            {cast.slice(0, 16).map(({ person, character }) => (
              <div key={`${person.id}-${character.id}`} className="cast-member">
                {person.image ? (
                  <img src={person.image.medium} alt="" loading="lazy" width="80" height="80" />
                ) : (
                  <div className="cast-fallback">{person.name[0]}</div>
                )}
                <strong>{person.name}</strong>
                <span className="muted small">{character.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {seasons.length > 0 && (
        <section className="block">
          <div className="section-head">
            <h2>Episodes</h2>
            <span className="muted">{seasons.length} season{seasons.length > 1 ? "s" : ""}</span>
          </div>
          <div className="chips seasons" role="tablist">
            {seasons.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={seasonId === s.id}
                className={`chip ${seasonId === s.id ? "active" : ""}`}
                onClick={() => setSeasonId(s.id)}
              >
                Season {s.number}
              </button>
            ))}
          </div>
          {seasonId && <Episodes seasonId={seasonId} />}
        </section>
      )}
    </article>
  );
}
