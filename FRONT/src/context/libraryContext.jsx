import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './authContext.jsx';
import {
  fetchLibrary,
  addToLibraryAPI,
  updateLibraryEntryAPI,
  removeFromLibraryAPI,
} from '../services/libraryService.js';

/**
 * Cada entrada de la biblioteca tiene la forma que devuelve la API:
 * {
 *   id, user_id, tmdb_id, title, poster_path,
 *   state: 'quiero_ver' | 'viendo' | 'vista' | 'abandonada',
 *   is_favorite: boolean,
 *   score, review, watched_at, created_at, updated_at
 * }
 */

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const { token, user } = useAuth();
  const [library, setLibrary] = useState([]);
  const [libLoading, setLibLoading] = useState(false);

  // ── Carga inicial cuando el usuario se loguea ──────────────────────────────
  const loadLibrary = useCallback(async () => {
    if (!token) return;
    setLibLoading(true);
    try {
      const data = await fetchLibrary(token);
      setLibrary(data);
    } catch (err) {
      console.error('Error cargando biblioteca:', err.message);
    } finally {
      setLibLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token) {
      loadLibrary();
    } else {
      // Usuario deslogueado: limpiar estado local
      setLibrary([]);
    }
  }, [user, token, loadLibrary]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getEntry(tmdbId) {
    return library.find((e) => String(e.tmdb_id) === String(tmdbId)) || null;
  }

  function isInLibrary(tmdbId) {
    return !!getEntry(tmdbId);
  }

  function isInFavorites(tmdbId) {
    const entry = getEntry(tmdbId);
    return entry ? entry.is_favorite : false;
  }

  // ── Library ────────────────────────────────────────────────────────────────

  async function addToLibrary(movie) {
    if (!token) return;
    if (isInLibrary(movie.id)) return;

    const entry = {
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path || null,
      state: 'quiero_ver',
    };

    try {
      const saved = await addToLibraryAPI(token, entry);
      setLibrary((prev) => [saved, ...prev]);
    } catch (err) {
      console.error('Error al agregar a la biblioteca:', err.message);
      throw err;
    }
  }

  async function removeFromLibrary(tmdbId) {
    if (!token) return;
    try {
      await removeFromLibraryAPI(token, tmdbId);
      setLibrary((prev) => prev.filter((e) => String(e.tmdb_id) !== String(tmdbId)));
    } catch (err) {
      console.error('Error al eliminar de la biblioteca:', err.message);
      throw err;
    }
  }

  async function updateEntry(tmdbId, updates) {
    if (!token) return;
    try {
      const updated = await updateLibraryEntryAPI(token, tmdbId, updates);
      setLibrary((prev) =>
        prev.map((e) => (String(e.tmdb_id) === String(tmdbId) ? updated : e))
      );
      return updated;
    } catch (err) {
      console.error('Error al actualizar entrada:', err.message);
      throw err;
    }
  }

  // Marcar como "vista"
  async function markWatched(tmdbId) {
    return updateEntry(tmdbId, { state: 'vista' });
  }

  // Volver a "quiero ver"
  async function markPending(tmdbId) {
    return updateEntry(tmdbId, { state: 'quiero_ver' });
  }

  // ── Favoritos ──────────────────────────────────────────────────────────────

  /**
   * Agregar a favoritos:
   * - Si la película ya está en biblioteca → actualiza is_favorite = true
   * - Si no está → la agrega primero y luego marca como favorito
   */
  async function addToFavorites(movie) {
    if (!token) return;
    if (isInFavorites(movie.id ?? movie.tmdb_id)) return;

    const tmdbId = movie.id ?? movie.tmdb_id;

    try {
      if (!isInLibrary(tmdbId)) {
        // Agregar a biblioteca y luego marcar como favorito
        const entry = {
          tmdb_id: tmdbId,
          title: movie.title,
          poster_path: movie.poster_path || null,
          state: 'quiero_ver',
        };
        const saved = await addToLibraryAPI(token, entry);
        // Ahora marcar como favorito
        const updated = await updateLibraryEntryAPI(token, tmdbId, { is_favorite: true });
        setLibrary((prev) => {
          const withoutOld = prev.filter((e) => String(e.tmdb_id) !== String(tmdbId));
          return [updated, ...withoutOld];
        });
      } else {
        await updateEntry(tmdbId, { is_favorite: true });
      }
    } catch (err) {
      console.error('Error al agregar a favoritos:', err.message);
      throw err;
    }
  }

  async function removeFromFavorites(tmdbId) {
    if (!token) return;
    try {
      await updateEntry(tmdbId, { is_favorite: false });
    } catch (err) {
      console.error('Error al quitar de favoritos:', err.message);
      throw err;
    }
  }

  // ── Accesos derivados ──────────────────────────────────────────────────────

  // Lista de favoritos (para la página Favoritos)
  const favorites = library.filter((e) => e.is_favorite);

  return (
    <LibraryContext.Provider
      value={{
        library,
        favorites,
        libLoading,
        getEntry,
        isInLibrary,
        isInFavorites,
        addToLibrary,
        removeFromLibrary,
        updateEntry,
        markWatched,
        markPending,
        addToFavorites,
        removeFromFavorites,
        reloadLibrary: loadLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
