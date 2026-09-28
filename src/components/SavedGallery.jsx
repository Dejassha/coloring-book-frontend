import { deleteArtwork } from '../api.js';

export default function SavedGallery({ items, onDeleted }) {
  async function handleDelete(id) {
    try {
      await deleteArtwork(id);
      onDeleted && onDeleted(id);
    } catch (err) {
      console.error(err);
    }
  }

  if (!items.length) {
    return <p className="saved-empty">No saved art yet — color a picture and hit "Save my art"!</p>;
  }

  return (
    <div className="saved-grid">
      {items.map((item) => (
        <div key={item.id} className="saved-card">
          <div
            className="saved-thumb"
            dangerouslySetInnerHTML={{ __html: item.svg_markup }}
          />
          <div className="saved-meta">
            <span>{item.title || item.picture_id}</span>
            <button className="btn btn-ghost btn-small" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
