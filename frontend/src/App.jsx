import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MethodCard from './components/MethodCard';
import { Binary, LineChart, Sigma, Gauge, Grid, ChevronRight } from 'lucide-react';

const MODULES = [
  {
    id: 'm1',
    title: 'Module 1: Solution of Equations & Systems',
    icon: Binary,
    methods: [
      { key: 'fixed-point', name: '1. Fixed-Point Iteration', endpoint: '/api/m1/fixed-point' },
      { key: 'secant', name: '2. Secant Method', endpoint: '/api/m1/secant' },
      { key: 'gauss-seidel', name: '3. Gauss-Seidel Method', endpoint: '/api/m1/gauss-seidel' }
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Interpolation & Curve Fitting',
    icon: LineChart,
    methods: [
      { key: 'lagrange-interp', name: "4. Lagrange's Interpolation", endpoint: '/api/m2/lagrange-interp' },
      { key: 'lagrange-inverse', name: "5. Lagrange's Inverse Interpolation", endpoint: '/api/m2/lagrange-inverse' },
      { key: 'curve-fit', name: '6. Least Squares Curve Fitting', endpoint: '/api/m2/curve-fit' }
    ]
  },
  {
    id: 'm3',
    title: 'Module 3: Numerical Integration & Quadrature',
    icon: Sigma,
    methods: [
      { key: 'simpsons', name: "7. Simpson's 1/3 Rule", endpoint: '/api/m3/simpsons' },
      { key: 'romberg', name: "8. Romberg's Integration", endpoint: '/api/m3/romberg' },
      { key: 'gauss-quadrature', name: '9. Gauss-Legendre Quadrature', endpoint: '/api/m3/gauss-quadrature' }
    ]
  },
  {
    id: 'm4',
    title: 'Module 4: Initial Value Problems for ODEs',
    icon: Gauge,
    methods: [
      { key: 'modified-euler', name: "10. Modified Euler's Method", endpoint: '/api/m4/modified-euler' },
      { key: 'rk4', name: '11. 4th-Order Runge-Kutta (RK4)', endpoint: '/api/m4/rk4' },
      { key: 'taylor', name: "12. Taylor's Series Method", endpoint: '/api/m4/taylor' }
    ]
  },
  {
    id: 'm5',
    title: 'Module 5: Boundary Value Problems & PDEs',
    icon: Grid,
    methods: [
      { key: 'linear-bvp', name: '13. 2-Point Linear BVP', endpoint: '/api/m5/linear-bvp' },
      { key: 'laplace-poisson', name: '14. 2D Laplace / Poisson Solver', endpoint: '/api/m5/laplace-poisson' },
      { key: 'crank-nicolson', name: '15. 1D Heat Equation (Crank-Nicolson)', endpoint: '/api/m5/crank-nicolson' }
    ]
  }
];

export default function App() {
  const [precision, setPrecision] = useState(6);
  const [activeModuleId, setActiveModuleId] = useState('m1');
  const [activeMethodKey, setActiveMethodKey] = useState('fixed-point');
  const [apiStatus, setApiStatus] = useState(false);

  // Check Backend connectivity
  useEffect(() => {
    fetch('/api/')
      .then(res => res.json())
      .then(() => setApiStatus(true))
      .catch(() => setApiStatus(false));
  }, []);

  const activeModule = MODULES.find(m => m.id === activeModuleId);
  const activeMethod = activeModule.methods.find(m => m.key === activeMethodKey) || activeModule.methods[0];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-slate)' }}>
      
      {/* Enterprise App Header */}
      <Header
        precision={precision}
        setPrecision={setPrecision}
        apiStatus={apiStatus}
        activeModuleTitle={activeModule.title}
        activeMethodName={activeMethod.name}
      />

      {/* Main Workspace Layout */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
        
        {/* Left Sidebar Navigation */}
        <aside style={{ width: '320px', flexShrink: 0 }}>
          <div className="enterprise-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', sticky: 'top', top: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', tracking: '1px', color: '#64748b', paddingLeft: '4px' }}>
              Numerical Methods Index (15 Algorithms)
            </div>

            {MODULES.map(module => {
              const Icon = module.icon;
              const isModuleActive = module.id === activeModuleId;

              return (
                <div key={module.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => {
                      setActiveModuleId(module.id);
                      setActiveMethodKey(module.methods[0].key);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: isModuleActive ? '#2563eb' : 'transparent',
                      background: isModuleActive ? '#1e293b' : 'transparent',
                      color: isModuleActive ? '#38bdf8' : '#f8fafc',
                      fontWeight: isModuleActive ? '600' : '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={18} color={isModuleActive ? '#38bdf8' : '#64748b'} />
                    <span style={{ fontSize: '12px', flex: 1 }}>{module.title}</span>
                  </button>

                  {/* Sub-methods under active module */}
                  {isModuleActive && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '28px', marginTop: '2px' }}>
                      {module.methods.map(method => {
                        const isMethodActive = method.key === activeMethodKey;
                        return (
                          <button
                            key={method.key}
                            onClick={() => setActiveMethodKey(method.key)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: '4px',
                              border: 'none',
                              background: isMethodActive ? '#0f172a' : 'transparent',
                              color: isMethodActive ? '#ffffff' : '#94a3b8',
                              fontSize: '12px',
                              fontWeight: isMethodActive ? '600' : '400',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>{method.name}</span>
                            {isMethodActive && <ChevronRight size={14} color="#38bdf8" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Active Calculation Workspace */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <MethodCard
            key={activeMethod.key}
            methodKey={activeMethod.key}
            precision={precision}
          />
        </section>

      </main>

      {/* Enterprise Footer */}
      <footer style={{ borderTop: '1px solid #334155', padding: '16px 24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
        NumCore Studio Enterprise • Professional Numerical Computation Platform
      </footer>

    </div>
  );
}
