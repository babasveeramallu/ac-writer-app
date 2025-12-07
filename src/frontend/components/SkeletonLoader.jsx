import React from 'react';

const SkeletonLoader = () => (
  <div style={{ padding: '16px' }} role="status" aria-label="Loading content">
    <div style={{ height: '24px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '12px', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '80%', animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
  </div>
);

export default SkeletonLoader;
