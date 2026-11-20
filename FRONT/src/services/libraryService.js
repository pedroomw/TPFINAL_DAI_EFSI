// TODO: conectar con la API real cuando esté lista
// Todos los métodos están preparados para ser descomentados en libraryContext.jsx

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
  if (!res.ok) throw new Error(data.message || 'Error al cargar biblioteca');
  return data;
}

export async function addToLibraryAPI(token, entry) {
  const res = await fetch(`${API_URL}/api/library`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(entry),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al agregar');
  return data;
}

export async function updateLibraryEntryAPI(token, imdbID, updates) {
  const res = await fetch(`${API_URL}/api/library/${imdbID}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar');
  return data;
}

export async function removeFromLibraryAPI(token, imdbID) {
  const res = await fetch(`${API_URL}/api/library/${imdbID}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Error al eliminar');
}
