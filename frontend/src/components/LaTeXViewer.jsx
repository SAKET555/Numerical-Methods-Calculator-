import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function LaTeXViewer({ math, displayMode = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: displayMode,
          throwOnError: false
        });
      } catch (err) {
        containerRef.current.innerText = math;
      }
    }
  }, [math, displayMode]);

  return <div ref={containerRef} style={{ color: '#f0f6fc', overflowX: 'auto', padding: '4px 0' }} />;
}
