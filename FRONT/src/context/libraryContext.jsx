import { createContext, useContext, useState, useEffect } from 'react';

// ─── Shapes ─────────────────────────────────────────────────────────────────
// libraryEntry: { imdbID, title, year, poster, type, status: 'pending'|'watched', addedAt }
// favoriteEntry: { imdbID, title, year, poster, type, addedAt }

const LibraryContext = createContext(null);

// Posters via TMDB image CDN (libre de hotlinking, no requiere API key)
const MOCK_LIBRARY = [
  {
    imdbID: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: '1994',
    poster: 'https://image.tmdb.org/t/p/w300/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg',
    type: 'movie',
    status: 'watched',
    addedAt: '2024-01-10',
  },
  {
    imdbID: 'tt0068646',
    title: 'The Godfather',
    year: '1972',
    poster: 'https://image.tmdb.org/t/p/w300/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    type: 'movie',
    status: 'pending',
    addedAt: '2024-02-05',
  },
];

const MOCK_FAVORITES = [
  {
    imdbID: 'tt0816692',
    title: 'Interstellar',
    year: '2014',
    poster: 'https://image.tmdb.org/t/p/w300/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
    type: 'movie',
    addedAt: '2024-01-15',
  },
];

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(MOCK_LIBRARY);
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  // ── Library ────────────────────────────────────────────────────────────────

  function isInLibrary(imdbID) {
    return library.some((e) => e.imdbID === imdbID);
  }

  function addToLibrary(movie) {
    if (isInLibrary(movie.imdbID)) return;
    const entry = {
      imdbID: movie.imdbID,
      title: movie.Title || movie.title,
      year: movie.Year || movie.year,
      poster: movie.Poster || movie.poster,
      type: movie.Type || movie.type || 'movie',
      status: 'pending',
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setLibrary((prev) => [entry, ...prev]);
    // TODO: await libraryService.add(entry)
  }

  function removeFromLibrary(imdbID) {
    setLibrary((prev) => prev.filter((e) => e.imdbID !== imdbID));
    // TODO: await libraryService.remove(imdbID)
  }

  function markWatched(imdbID) {
    setLibrary((prev) =>
      prev.map((e) => (e.imdbID === imdbID ? { ...e, status: 'watched' } : e))
    );
    // TODO: await libraryService.update(imdbID, { status: 'watched' })
  }

  function markPending(imdbID) {
    setLibrary((prev) =>
      prev.map((e) => (e.imdbID === imdbID ? { ...e, status: 'pending' } : e))
    );
    // TODO: await libraryService.update(imdbID, { status: 'pending' })
  }

  // ── Favorites ──────────────────────────────────────────────────────────────

  function isInFavorites(imdbID) {
    return favorites.some((e) => e.imdbID === imdbID);
  }

  function addToFavorites(movie) {
    if (isInFavorites(movie.imdbID)) return;
    const entry = {
      imdbID: movie.imdbID,
      title: movie.Title || movie.title,
      year: movie.Year || movie.year,
      poster: movie.Poster || movie.poster,
      type: movie.Type || movie.type || 'movie',
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setFavorites((prev) => [entry, ...prev]);
    // TODO: await favoritesService.add(entry)
  }

  function removeFromFavorites(imdbID) {
    setFavorites((prev) => prev.filter((e) => e.imdbID !== imdbID));
    // TODO: await favoritesService.remove(imdbID)
  }

  return (
    <LibraryContext.Provider
      value={{
        library,
        favorites,
        isInLibrary,
        addToLibrary,
        removeFromLibrary,
        markWatched,
        markPending,
        isInFavorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
