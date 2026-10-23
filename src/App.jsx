import { useEffect, useState } from "react";
import Home from "./components/Home.jsx";
import SearchResults from "./components/SearchResults.jsx";
import ShowDetails from "./components/ShowDetails.jsx";
import ShowGrid from "./components/ShowGrid.jsx";
import { useDebounced, useHashRoute, useLocalStorage } from "./hooks.js";

// Keep only what the cards need, so the watchlist stays small in localStorage
const slim = (s) => ({
  id: s.id, name: s.name, image: s.image, rating: s.rating, genres: s.genres,
  premiered: s.premiered, ended: s.ended, status: s.status,
});

export default function App() {
  const route = useHashRoute();
  const [watchlist, setWatchlist] = useLocalStorage("binge:watchlist", []);
  const [query, setQuery] = useState(route[0] === "search" ? decodeURIComponent(route[1] ?? "") : "");
  const debounced = useDebounced(query.trim());

  // Typing in the search box updates the URL, so results can be shared and the back button works
  useEffect(() => {
    const onSearch = route[0] === "search";
    if (debounced) {
      const target = `#/search/${encodeURIComponent(debounced)}`;
      if (window.location.hash !== target) {
        if (onSearch) window.location.replace(target);
        else window.location.hash = target;
      }
    } else if (onSearch) {
      window.location.hash = "#/";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Clear the box when leaving search through a link
  useEffect(() => {
    if (route[0] !== "search") setQuery("");
  }, [route[0]]);

  const isSaved = (id) => watchlist.some((s) => s.id === id);
  const toggleSave = (show) =>
    setWatchlist((list) => (list.some((s) => s.id === show.id) ? list.filter((s) => s.id !== show.id) : [slim(show), ...list]));

  let page;
  if (route[0] === "show" && route[1]) {
    page = <ShowDetails key={route[1]} id={route[1]} isSaved={isSaved} onToggleSave={toggleSave} />;
  } else if (route[0] === "search" && route[1]) {
    page = <SearchResults query={decodeURIComponent(route[1])} isSaved={isSaved} onToggleSave={toggleSave} />;
  } else if (route[0] === "watchlist") {
    page = (
      <>
        <div className="section-head"><h2>My watchlist <span className="muted">· {watchlist.length}</span></h2></div>
        {watchlist.length ? (
          <ShowGrid shows={watchlist} isSaved={isSaved} onToggleSave={toggleSave} />
        ) : (
          <div className="empty-state">
            <span>♡</span>
            <p>Your watchlist is empty. Tap the heart on any show to save it here.</p>
            <a className="btn primary" href="#/">Discover shows</a>
          </div>
        )}
      </>
    );
  } else {
    page = <Home isSaved={isSaved} onToggleSave={toggleSave} />;
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#/" className="brand"><span>📺</span> Binge</a>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              className="search"
              placeholder="Search TV shows…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search TV shows"
            />
          </div>
          <nav className="nav">
            <a href="#/" className={!route[0] ? "active" : ""}>Discover</a>
            <a href="#/watchlist" className={route[0] === "watchlist" ? "active" : ""}>
              Watchlist {watchlist.length > 0 && <span className="pill">{watchlist.length}</span>}
            </a>
          </nav>
        </div>
      </header>

      <main className="container">{page}</main>

      <footer className="footer">
        Data from <a href="https://www.tvmaze.com/api" target="_blank" rel="noopener noreferrer">TVMaze</a> (CC BY-SA) · Built with React + Vite
      </footer>
    </>
  );
}
