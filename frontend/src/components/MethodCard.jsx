import React, { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle2, AlertCircle, Info, HelpCircle, Table as TableIcon, FileText, Activity, Compass, Layers } from 'lucide-react';
import LaTeXViewer from './LaTeXViewer';
import MatrixInput from './MatrixInput';
import HeatmapGrid from './HeatmapGrid';
import { methodMetadata } from '../data/methodMetadata';
import { syllabusExamples } from '../data/syllabusExamples';

export default function MethodCard({ methodKey, precision }) {
  const meta = methodMetadata[methodKey] || {};
  const example = syllabusExamples[methodKey] || {};

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Initialize input parameters with default values
  useEffect(() => {
    loadDefaults();
  }, [methodKey]);

  const loadDefaults = () => {
    if (syllabusExamples[methodKey]) {
      const { formulaLatex, description, ...inputs } = syllabusExamples[methodKey];
      setFormData(JSON.parse(JSON.stringify(inputs)));
      setResult(null);
      setError(null);
    }
  };

  const handleInputChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const endpoint = `/api/${getModulePrefix(methodKey)}/${methodKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Calculation error on backend solver');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getModulePrefix = (key) => {
    if (['fixed-point', 'secant', 'gauss-seidel'].includes(key)) return 'm1';
    if (['lagrange-interp', 'lagrange-inverse', 'curve-fit'].includes(key)) return 'm2';
    if (['simpsons', 'romberg', 'gauss-quadrature'].includes(key)) return 'm3';
    if (['modified-euler', 'rk4', 'taylor'].includes(key)) return 'm4';
    return 'm5';
  };

  const formatNum = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Number(num).toFixed(precision);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* 1. Algorithm Overview & Mathematical Formula Banner */}
      <div className="enterprise-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '1px' }}>
              {meta.category || 'Numerical Algorithm'}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
              {meta.title || methodKey}
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', maxWidth: '920px', lineHeight: '1.6' }}>
              {meta.description}
            </p>
          </div>
          
          <button onClick={loadDefaults} className="btn-enterprise-secondary">
            <BookOpen size={14} color="#38bdf8" /> Load Syllabus Example
          </button>
        </div>

        {/* Mathematical Formula Card */}
        {meta.formulaLatex && (
          <div style={{
            background: '#070a12',
            padding: '16px 22px',
            borderRadius: '8px',
            border: '1px solid var(--border-bright)',
            marginTop: '14px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Governing Mathematical Expression
            </div>
            <LaTeXViewer math={meta.formulaLatex} />
          </div>
        )}
      </div>

      {/* 2. Input Parameters Panel with Explanatory Parameter Cards */}
      <form onSubmit={handleSubmit} className="enterprise-card" style={{ padding: '22px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#38bdf8" /> Input Parameter Specification
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Each input field below includes its mathematical variable name, plain-English explanation, and input controls.
          </p>
        </div>

        {/* Matrix Solver Input for Gauss-Seidel */}
        {methodKey === 'gauss-seidel' ? (
          <div>
            <div className="info-callout" style={{ marginBottom: '18px' }}>
              <div style={{ fontWeight: '700', color: '#38bdf8', marginBottom: '4px', fontSize: '14px' }}>
                System Matrix A (3x3), Vector B (3x1), & Initial Guess Vector [x₀]
              </div>
              <div style={{ lineHeight: '1.6' }}>
                • <strong>Matrix A & Vector B</strong>: Represents system coefficients (A x = B). Matrix A should ideally be <em>diagonally dominant</em> (|a_ii| ≥ ∑ |a_ij| for j ≠ i).<br />
                • <strong>Initial Vector x0</strong>: The starting solution vector $[x_1^{(0)}, x_2^{(0)}, x_3^{(0)}]$ (commonly $[0,0,0]$).<br />
                • <strong>Tolerance (tol)</strong>: Desired error precision limit for vector components.<br />
                • <strong>Max Iterations</strong>: Maximum iteration steps before terminating.
              </div>
            </div>

            <MatrixInput
              A={formData.A || [[10, -1, 2], [-1, 11, -1], [2, -1, 10]]}
              B={formData.B || [6, 25, -11]}
              x0={formData.x0 || [0, 0, 0]}
              onChangeA={(val) => handleInputChange('A', val)}
              onChangeB={(val) => handleInputChange('B', val)}
              onChangeX0={(val) => handleInputChange('x0', val)}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {Object.keys(formData).map((key) => {
              const val = formData[key];
              const inputMeta = meta.inputs?.[key] || { label: key, description: `Parameter value for ${key}` };

              if (Array.isArray(val) && (key === 'x_points' || key === 'y_points')) {
                return (
                  <div key={key} className="field-card" style={{ gridColumn: 'span 2' }}>
                    <div className="field-header">
                      <span className="field-label-text">{inputMeta.label || key}</span>
                      <span className="field-symbol-badge">[{key}]</span>
                    </div>
                    <div className="field-explanation">{inputMeta.description}</div>
                    <input
                      type="text"
                      className="input-field-ent font-mono"
                      value={val.join(', ')}
                      onChange={(e) => {
                        const parsed = e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                        handleInputChange(key, parsed);
                      }}
                    />
                  </div>
                );
              }

              if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                return (
                  <div key={key} className="field-card" style={{ gridColumn: 'span 2' }}>
                    <div className="field-header">
                      <span className="field-label-text">{inputMeta.label || key}</span>
                      <span className="field-symbol-badge">[y⁽ᵏ⁾(x₀)]</span>
                    </div>
                    <div className="field-explanation">{inputMeta.description}</div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                      {Object.keys(val).map(dKey => (
                        <div key={dKey} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="font-mono" style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>{dKey}:</span>
                          <input
                            type="number"
                            step="any"
                            className="input-field-ent font-mono"
                            style={{ width: '90px' }}
                            value={val[dKey]}
                            onChange={(e) => {
                              const newObj = { ...val, [dKey]: parseFloat(e.target.value) || 0 };
                              handleInputChange(key, newObj);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={key} className="field-card">
                  <div className="field-header">
                    <span className="field-label-text">{inputMeta.label || key}</span>
                    <span className="field-symbol-badge">[{key}]</span>
                  </div>
                  <div className="field-explanation">{inputMeta.description}</div>
                  
                  {key === 'model_type' ? (
                    <select
                      className="input-field-ent font-mono"
                      value={val}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    >
                      <option value="linear">Linear: y = a*x + b</option>
                      <option value="exponential">Exponential: y = a * e^(b*x)</option>
                      <option value="parabolic">Parabolic: y = a*x^2 + b*x + c</option>
                    </select>
                  ) : key === 'n_points' ? (
                    <select
                      className="input-field-ent font-mono"
                      value={val}
                      onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
                    >
                      <option value={2}>2-Point Gauss Quadrature</option>
                      <option value={3}>3-Point Gauss Quadrature</option>
                    </select>
                  ) : (
                    <input
                      type={typeof val === 'number' ? 'number' : 'text'}
                      step="any"
                      placeholder={inputMeta.placeholder || ''}
                      className="input-field-ent font-mono"
                      value={val !== undefined ? val : ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        handleInputChange(key, typeof val === 'number' ? (v === '' ? '' : parseFloat(v)) : v);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Execute Button */}
        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={loading} className="btn-enterprise-primary">
            {loading ? 'Executing Solver...' : <><Play size={16} /> Run Calculation Solver</>}
          </button>
        </div>
      </form>

      {/* Error Callout */}
      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '8px',
          padding: '16px 20px',
          color: '#f43f5e',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={24} />
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px' }}>Calculation Solver Execution Error</div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>{error}</div>
          </div>
        </div>
      )}

      {/* 3. Output Results & Mathematical Interpretation */}
      {result && (
        <div className="enterprise-card" style={{ padding: '22px' }}>
          
          {/* Highlighted Final Answer Badge */}
          <div style={{
            background: '#070a12',
            border: '1px solid #38bdf8',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '22px',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: '700' }}>
                Computed Final Answer
              </div>
              <div className="font-mono" style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '4px' }}>
                {result.root !== undefined && `Root x = ${formatNum(result.root)}`}
                {result.integral !== undefined && `Integral = ${formatNum(result.integral)}`}
                {result.y_eval !== undefined && `y(x_eval) = ${formatNum(result.y_eval)}`}
                {result.x_eval !== undefined && `x(y_eval) = ${formatNum(result.x_eval)}`}
                {result.final_y !== undefined && `y(x) = ${formatNum(result.final_y)}`}
                {result.solution && `Solution Vector X = [${result.solution.map(v => formatNum(v)).join(', ')}]`}
                {result.coefficients && `Fitted Model: ${result.equation_str}`}
                {result.polynomial_str && !result.coefficients && `Polynomial: ${result.polynomial_str}`}
                {result.r_param !== undefined && `Mesh Parameter r = ${formatNum(result.r_param)}`}
                {result.interior_count && result.y_values && `Interior Grid Solutions: ${result.interior_count} nodes`}
              </div>
            </div>

            {/* Convergence Status Badge */}
            {result.converged !== undefined && (
              <div style={{
                background: result.converged ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: result.converged ? '#10b981' : '#f59e0b',
                border: `1px solid ${result.converged ? '#10b981' : '#f59e0b'}`,
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                {result.converged ? 'Converged within Tolerance' : 'Iteration Limit Reached'}
              </div>
            )}
          </div>

          {/* Mathematical Output Interpretation Panel */}
          {meta.outputGuide?.interpretation && (
            <div className="interpretation-card" style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', color: '#818cf8', marginBottom: '6px' }}>
                <Info size={18} /> Plain-English Output Interpretation
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#e0e7ff' }}>
                {meta.outputGuide.interpretation(result, precision)}
              </div>
            </div>
          )}

          {/* Iteration Column Guide Key */}
          {meta.outputGuide?.columns && (
            <div style={{ background: '#090d16', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-bright)', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>
                Table Column Definitions & Legend
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', fontSize: '12px' }}>
                {Object.entries(meta.outputGuide.columns).map(([col, desc]) => (
                  <div key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono" style={{ color: '#38bdf8', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {col}
                    </span>
                    <span style={{ color: '#cbd5e1' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 1 Iteration Log Table with Grid Lines */}
          {result.iterations && result.iterations.length > 0 && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TableIcon size={16} color="#38bdf8" /> Step-by-Step Iteration Table ({result.iterations.length} Steps)
              </h4>
              <div className="enterprise-table-container" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      {Object.keys(result.iterations[0]).map(col => <th key={col}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.iterations.map((row, idx) => (
                      <tr key={idx}>
                        {Object.entries(row).map(([col, val], cIdx) => (
                          <td key={cIdx}>
                            {typeof val === 'number' ? formatNum(val) : Array.isArray(val) ? `[${val.map(v => formatNum(v)).join(', ')}]` : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module 3 Simpson's Grid */}
          {result.grid && !Array.isArray(result.grid[0]) && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                Simpson's Ordinate Grid (Step Size h = {formatNum(result.h)})
              </h4>
              <div className="enterprise-table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>i</th><th>x_i</th><th>f(x_i)</th><th>Weight</th><th>Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.grid.map((row) => (
                      <tr key={row.i}>
                        <td>{row.i}</td>
                        <td>{formatNum(row.x_i)}</td>
                        <td>{formatNum(row.f_xi)}</td>
                        <td>{row.weight}</td>
                        <td>{formatNum(row.term)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module 3 Romberg Tableau */}
          {result.tableau && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                Romberg Extrapolation Tableau R(j, k)
              </h4>
              <div className="enterprise-table-container" style={{ overflowX: 'auto' }}>
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>j \ k</th>
                      {result.tableau[0].map((_, idx) => <th key={idx}>k={idx}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.tableau.map((row, j) => (
                      <tr key={j}>
                        <td>j={j}</td>
                        {row.map((val, k) => (
                          <td key={k} style={{ color: val === 0 ? '#64748b' : '#38bdf8', fontWeight: val !== 0 ? '600' : '400' }}>
                            {val !== 0 ? formatNum(val) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module 4 ODE Steps */}
          {result.steps && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                ODE Trajectory Log
              </h4>
              <div className="enterprise-table-container" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      {Object.keys(result.steps[0]).map(col => <th key={col}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((step, idx) => (
                      <tr key={idx}>
                        {Object.entries(step).map(([col, val], cIdx) => (
                          <td key={cIdx}>{typeof val === 'number' ? formatNum(val) : String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module 5 2D Heatmap Grid (Laplace / Poisson) */}
          {result.grid && Array.isArray(result.grid[0]) && (
            <HeatmapGrid grid={result.grid} precision={precision} title={`2D Mesh Potential/Temperature Grid (${result.total_iters ? result.total_iters + ' iterations' : ''})`} />
          )}

          {/* Module 5 Crank-Nicolson Time Level Heatmap */}
          {result.time_levels && (
            <HeatmapGrid
              grid={result.time_levels.map(t => t.u_values)}
              precision={precision}
              title={`Crank-Nicolson Time Evolution Mesh (${result.time_levels.length} Time Steps)`}
            />
          )}

        </div>
      )}

    </div>
  );
}
