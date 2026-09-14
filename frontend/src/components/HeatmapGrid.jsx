import React from 'react';

export default function HeatmapGrid({ grid, precision = 4, title = "2D Heatmap Matrix" }) {
  if (!grid || !grid.length) return null;

  // Compute min & max for color mapping (Blue = cold, Red/Orange/Yellow = hot)
  let flatValues = grid.flat();
  let minVal = Math.min(...flatValues);
  let maxVal = Math.max(...flatValues);
  if (minVal === maxVal) {
    minVal -= 1;
    maxVal += 1;
  }

  const getColor = (val) => {
    // Normalize to [0, 1]
    const norm = (val - minVal) / (maxVal - minVal);
    // HSL hue: 240 (blue) to 0 (red)
    const hue = (1 - norm) * 240;
    return `hsl(${hue}, 85%, 45%)`;
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>{title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-subtle)' }}>
          <span>Cold ({minVal.toFixed(2)})</span>
          <div style={{ width: '80px', height: '10px', borderRadius: '4px', background: 'linear-gradient(to right, hsl(240, 85%, 45%), hsl(120, 85%, 45%), hsl(0, 85%, 45%))' }} />
          <span>Hot ({maxVal.toFixed(2)})</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: '#0d1117', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(50px, 1fr))`,
          gap: '4px',
          fontFamily: 'Fira Code, monospace',
          fontSize: '11px'
        }}>
          {grid.map((row, rIdx) =>
            row.map((val, cIdx) => (
              <div
                key={`cell-${rIdx}-${cIdx}`}
                style={{
                  background: getColor(val),
                  color: '#ffffff',
                  padding: '8px 4px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: '600',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                }}
                title={`Grid[${rIdx}][${cIdx}] = ${val}`}
              >
                {Number(val).toFixed(precision)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
