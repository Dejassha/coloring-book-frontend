const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
export const IMAGES_BASE_URL = import.meta.env.VITE_IMAGES_BASE_URL || 'http://localhost:5050';

export async function fetchPictures() {
  const res = await fetch(`${API_URL}/pictures`);
  if (!res.ok) throw new Error('Could not load pictures');
  return res.json();
}

export async function fetchSavedArtwork() {
  const res = await fetch(`${API_URL}/artwork`);
  if (!res.ok) throw new Error('Could not load saved art');
  return res.json();
}

export async function saveArtwork({ pictureId, title, svgMarkup }) {
  const res = await fetch(`${API_URL}/artwork`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pictureId, title, svgMarkup }),
  });
  if (!res.ok) throw new Error('Could not save artwork');
  return res.json();
}

export async function deleteArtwork(id) {
  const res = await fetch(`${API_URL}/artwork/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Could not delete artwork');
}
