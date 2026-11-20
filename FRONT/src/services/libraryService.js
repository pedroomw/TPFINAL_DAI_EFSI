const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchLibrary(token) {
  const res = await fetch(`${API_URL}/api/library`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al cargar biblioteca');
  return data; // array de entradas
}

export async function addToLibraryAPI(token, entry) {
  const res = await fetch(`${API_URL}/api/library`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(entry),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al agregar');
  return data;
}

export async function updateLibraryEntryAPI(token, tmdbId, updates) {
  const res = await fetch(`${API_URL}/api/library/${tmdbId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar');
  return data;
}

export async function removeFromLibraryAPI(token, tmdbId) {
  const res = await fetch(`${API_URL}/api/library/${tmdbId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error al eliminar');
  }
}
