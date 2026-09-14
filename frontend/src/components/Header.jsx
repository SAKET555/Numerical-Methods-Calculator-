import React from 'react';
import { Server, Settings, Activity, HelpCircle, Terminal } from 'lucide-react';

export default function Header({ precision, setPrecision, apiStatus, activeModuleTitle, activeMethodName }) {
  return (
    <header className="enterprise-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Brand & Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#2563eb',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Terminal size={18} />
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.3px' }}>
                NumCore Studio
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#1e293b',
                color: '#94a3b8',
                border: '1px solid #334155'
              }}>
                Enterprise Platform
              </span>
            </div>

            {/* Breadcrumb path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              <span>Workspace</span>
              <span>/</span>
              <span>{activeModuleTitle ? activeModuleTitle.split(':')[1]?.trim() || activeModuleTitle : 'Module'}</span>
              <span>/</span>
              <span style={{ color: '#38bdf8', fontWeight: '500' }}>{activeMethodName}</span>
            </div>
          </div>
        </div>

        {/* Global Controls & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Decimal Precision Control */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1e293b',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #334155'
          }}>
            <Settings size={14} color="#38bdf8" />
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Global Floating-Point Accuracy:</span>
            <select
              value={precision}
              onChange={(e) => setPrecision(Number(e.target.value))}
              className="font-mono"
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                border: '1px solid #334155',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '12px',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={4}>4 Decimals (1e-4)</option>
              <option value={6}>6 Decimals (1e-6)</option>
              <option value={8}>8 Decimals (1e-8)</option>
              <option value={10}>10 Decimals (1e-10)</option>
              <option value={12}>12 Decimals (1e-12)</option>
            </select>
          </div>

          {/* Backend Connection Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            padding: '5px 10px',
            borderRadius: '6px',
            background: apiStatus ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${apiStatus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: apiStatus ? '#10b981' : '#f43f5e'
          }}>
            <Server size={14} />
            <span style={{ fontWeight: '500' }}>{apiStatus ? 'FastAPI Solver Service: Operational' : 'Backend Disconnected'}</span>
          </div>

        </div>

      </div>
    </header>
  );
}
