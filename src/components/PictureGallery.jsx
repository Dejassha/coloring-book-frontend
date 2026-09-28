import { IMAGES_BASE_URL } from '../api.js';

export default function PictureGallery({ pictures, activePictureId, onSelect }) {
  return (
    <div className="gallery">
      <p className="gallery-label">Choose a picture</p>
      <div className="gallery-grid">
        {pictures.map((pic) => (
          <button
            key={pic.id}
            className={`gallery-item ${activePictureId === pic.id ? 'gallery-item-active' : ''}`}
            onClick={() => onSelect(pic)}
          >
            <img src={`${IMAGES_BASE_URL}${pic.url}`} alt={pic.name} />
            <span>{pic.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
