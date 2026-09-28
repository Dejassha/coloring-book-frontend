const COLORS = [
  '#FF6B6B', // coral
  '#FFD166', // sunshine
  '#06D6A0', // mint
  '#118AB2', // sky
  '#8338EC', // grape
  '#FF9F1C', // tangerine
  '#EF476F', // punch pink
  '#3A86FF', // blue
  '#2B2140', // deep plum (outline-ish dark)
  '#FFFFFF', // eraser / white
];

export default function ColorPalette({ selectedColor, onSelect }) {
  return (
    <div className="palette">
      <p className="palette-label">Pick a color</p>
      <div className="palette-swatches">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`swatch ${selectedColor === color ? 'swatch-active' : ''} ${
              color === '#FFFFFF' ? 'swatch-eraser' : ''
            }`}
            style={{ background: color }}
            onClick={() => onSelect(color)}
            aria-label={`Color ${color}`}
            title={color === '#FFFFFF' ? 'Eraser' : color}
          />
        ))}
      </div>
    </div>
  );
}
