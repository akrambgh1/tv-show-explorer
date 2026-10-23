# 📺 Binge — TV Show Explorer

Binge lets you discover and explore TV shows. Search any series, browse top-rated shows by genre, open a show to see its cast, seasons and episodes, and save favorites to a watchlist.

Built with **React** and **Vite**, using the free **[TVMaze API](https://www.tvmaze.com/api)** (no API key needed).

**🔗 Live demo:** https://akrambgh1.github.io/tv-show-explorer/

## ✨ Features

- 🔍 **Live search** with debouncing; the query goes into the URL, so results can be shared and the back button works
- ⭐ **Discover page** with a featured hero banner and the highest-rated popular shows
- 🎭 **Genre filters** and **sorting** (top rated, newest, A–Z), plus a "Load more" button
- 📄 **Show details page**: poster, rating, genres, network, runtime, schedule and summary
- 👥 **Cast** with photos and character names
- 🎬 **Episodes by season**, with images, air dates, ratings and summaries, loaded when you pick a season
- ♥ **Watchlist** saved in `localStorage`, with a counter in the nav bar
- ⚡ **Request caching**, so going back to a page is instant
- 💀 **Skeleton loaders**, empty states and friendly error messages (including API rate limits)
- 📱 Fully **responsive**, with a cinema-style dark design

## 🛠️ Tech Stack

| Part | Technology |
|------|------------|
| UI | React 18 (hooks, custom hooks) |
| Routing | Hash-based router written from scratch (works on GitHub Pages) |
| Data | TVMaze REST API with `fetch` and an in-memory cache |
| Build tool | Vite |
| Styling | Plain CSS (Grid, custom properties, `aspect-ratio`) |
| CI/CD | GitHub Actions to GitHub Pages |

## 🚀 Run Locally

```bash
git clone https://github.com/akrambgh1/tv-show-explorer.git
cd tv-show-explorer
npm install
npm run dev
```

Then open http://localhost:5173/tv-show-explorer/

## 📂 Project Structure

```
src/
├── App.jsx                 # Top bar, search to URL sync, routes, watchlist
├── api.js                  # TVMaze calls, caching, HTML to text
├── hooks.js                # useHashRoute, useAsync, useDebounced, useLocalStorage
├── styles.css
└── components/
    ├── Home.jsx            # Hero, genres, sorting, load more
    ├── SearchResults.jsx
    ├── ShowDetails.jsx     # Details, cast, seasons and episodes
    ├── ShowGrid.jsx        # Grid + skeleton loader
    └── ShowCard.jsx
```

## 📚 What I Learned

- Working with a real REST API: embedding related data, pagination and rate limits
- Writing reusable custom hooks for async data, debouncing and routing
- Caching requests and avoiding race conditions when a newer request finishes first
- Safely turning HTML from an API into plain text with `DOMParser`
- Building a polished, responsive media UI with CSS Grid

## 🙏 Credits

TV data is provided by [TVMaze](https://www.tvmaze.com/) under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).

## 📄 License

MIT. Free to use and modify.
