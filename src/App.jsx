import { useEffect, useState } from 'react';
import PictureGallery from './components/PictureGallery.jsx';
import ColorPalette from './components/ColorPalette.jsx';
import ColoringCanvas from './components/ColoringCanvas.jsx';
import SavedGallery from './components/SavedGallery.jsx';
import { fetchPictures, fetchSavedArtwork } from './api.js';

export default function App() {
  const [pictures, setPictures] = useState([]);
  const [activePicture, setActivePicture] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [savedArt, setSavedArt] = useState([]);
  const [tab, setTab] = useState('color'); // 'color' | 'myart'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPictures()
      .then((pics) => {
        setPictures(pics);
        if (pics.length) setActivePicture(pics[0]);
      })
      .catch(() => setError('Could not reach the backend. Is it running?'));

    refreshSavedArt();
  }, []);

  function refreshSavedArt() {
    fetchSavedArtwork()
      .then(setSavedArt)
      .catch(() => {});
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-inner">
          <span className="hero-badge">🎨 Doodle Patch Studio</span>
          <h1>Pick a picture, splash some color! ✨</h1>
          <p>Tap any shape to fill it in, then save your masterpiece.</p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${tab === 'color' ? 'tab-active' : ''}`}
          onClick={() => setTab('color')}
        >
          🎨 Color
        </button>
        <button
          className={`tab ${tab === 'myart' ? 'tab-active' : ''}`}
          onClick={() => setTab('myart')}
        >
          🖼️ My Art ({savedArt.length})
        </button>
      </nav>

      {error && <p className="app-error">{error}</p>}

      {tab === 'color' ? (
        <main className="workspace">
          <aside className="sidebar">
            <PictureGallery
              pictures={pictures}
              activePictureId={activePicture?.id}
              onSelect={setActivePicture}
            />
          </aside>

          <section className="stage">
            <ColoringCanvas
              picture={activePicture}
              selectedColor={selectedColor}
              onSaved={refreshSavedArt}
            />
          </section>

          <aside className="sidebar sidebar-right">
            <ColorPalette selectedColor={selectedColor} onSelect={setSelectedColor} />
          </aside>
        </main>
      ) : (
        <main className="my-art">
          <SavedGallery
            items={savedArt}
            onDeleted={(id) => setSavedArt((prev) => prev.filter((a) => a.id !== id))}
          />
        </main>
      )}
    </div>
  );
}
