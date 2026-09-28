import { useEffect, useRef, useState } from 'react';
import { IMAGES_BASE_URL, saveArtwork } from '../api.js';

export default function ColoringCanvas({ picture, selectedColor, onSaved }) {
  const containerRef = useRef(null);
  const colorRef = useRef(selectedColor);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Keep the ref in sync so the click handler always uses the latest color
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  // Raster picture-book images (jpg/png) can't be tap-to-fill like SVGs
  const isRaster =
    picture != null &&
    (picture.type === 'image' || !picture.url.toLowerCase().endsWith('.svg'));

  // Load a fresh copy of the picture's SVG whenever the picture changes
  // (SVG line-art only — raster images render directly as <img>)
  useEffect(() => {
    if (!picture || isRaster) return;
    let cancelled = false;

    async function loadSvg() {
      setLoading(true);
      setMessage('');
      try {
        const res = await fetch(`${IMAGES_BASE_URL}${picture.url}`);
        const svgText = await res.text();
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svgText;
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setMessage('Could not load this picture.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSvg();
    return () => {
      cancelled = true;
    };
  }, [picture, isRaster]);

  // Click-to-fill using event delegation, so we don't need per-shape React state
  function handleCanvasClick(e) {
    const target = e.target.closest('.colorable');
    if (!target) return;
    target.setAttribute('fill', colorRef.current);
  }

  function handleReset() {
    if (!picture || !containerRef.current) return;
    fetch(`${IMAGES_BASE_URL}${picture.url}`)
      .then((res) => res.text())
      .then((svgText) => {
        containerRef.current.innerHTML = svgText;
      });
  }

  async function handleSave() {
    if (!picture || !containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    setSaving(true);
    setMessage('');
    try {
      await saveArtwork({
        pictureId: picture.id,
        title: `${picture.name} — my art`,
        svgMarkup: svgEl.outerHTML,
      });
      setMessage('Saved to My Art! 🎉');
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      setMessage('Could not save right now.');
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (!containerRef.current) return;
    // Raster picture-book image: download the original file
    if (isRaster) {
      const a = document.createElement('a');
      a.href = `${IMAGES_BASE_URL}${picture.url}`;
      const ext = picture.url.split('.').pop() || 'jpg';
      a.download = `${picture?.id || 'picture'}.${ext}`;
      a.click();
      return;
    }
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const blob = new Blob([svgEl.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${picture?.id || 'my-drawing'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!picture) {
    return (
      <div className="canvas-empty">
        <p>Pick a picture from the left to start coloring! 🖍️</p>
      </div>
    );
  }

  // Raster picture-book page: show image only (tap-to-fill works on SVG line-art)
  if (isRaster) {
    return (
      <div className="canvas-wrap">
        <div className="canvas-toolbar">
          <h2>{picture.name}</h2>
          <div className="canvas-actions">
            <button className="btn btn-secondary" onClick={handleDownload} type="button">
              Download
            </button>
          </div>
        </div>

        <p className="canvas-message">Picture-book page — coloring works on SVG line-art. 🎨</p>

        <div className="canvas-frame">
          <img
            src={`${IMAGES_BASE_URL}${picture.url}`}
            alt={picture.name}
            className="canvas-photo"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-wrap">
      <div className="canvas-toolbar">
        <h2>{picture.name}</h2>
        <div className="canvas-actions">
          <button className="btn btn-ghost" onClick={handleReset} type="button">
            Clear
          </button>
          <button className="btn btn-secondary" onClick={handleDownload} type="button">
            Download
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} type="button">
            {saving ? 'Saving…' : 'Save my art'}
          </button>
        </div>
      </div>

      {message && <p className="canvas-message">{message}</p>}

      <div
        className={`canvas-frame ${loading ? 'canvas-loading' : ''}`}
        ref={containerRef}
        onClick={handleCanvasClick}
      />
    </div>
  );
}
