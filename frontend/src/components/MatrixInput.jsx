import React from 'react';

export default function MatrixInput({ A, B, x0, onChangeA, onChangeB, onChangeX0 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Matrix A & Vector B Grid */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Coefficient Matrix [A] (3x3) & RHS Vector [B]
        </label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          
          {/* Matrix A */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            background: '#0d1117',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            {A.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`A-${i}-${j}`}
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => {
                    const newA = A.map((r, rIdx) =>
                      r.map((c, cIdx) => (rIdx === i && cIdx === j ? parseFloat(e.target.value) || 0 : c))
                    );
                    onChangeA(newA);
                  }}
                  className="font-mono input-field"
                  style={{ width: '65px', textAlign: 'center', padding: '6px' }}
                />
              ))
            )}
          </div>

          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--cyan-accent)' }}>x =</span>

          {/* Vector B */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: '#0d1117',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            {B.map((val, i) => (
              <input
                key={`B-${i}`}
                type="number"
                step="any"
                value={val}
                onChange={(e) => {
                  const newB = B.map((bVal, bIdx) => (bIdx === i ? parseFloat(e.target.value) || 0 : bVal));
                  onChangeB(newB);
                }}
                className="font-mono input-field"
                style={{ width: '65px', textAlign: 'center', padding: '6px' }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Initial Seed Vector x0 */}
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Initial Guess Vector [x0]
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {x0.map((val, i) => (
            <div key={`x0-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>x{i + 1}:</span>
              <input
                type="number"
                step="any"
                value={val}
                onChange={(e) => {
                  const newX0 = x0.map((xVal, xIdx) => (xIdx === i ? parseFloat(e.target.value) || 0 : xVal));
                  onChangeX0(newX0);
                }}
                className="font-mono input-field"
                style={{ width: '70px', textAlign: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
