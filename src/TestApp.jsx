import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '10px' }}>
        Test App - React is working!
      </h1>
      <p style={{ fontSize: '16px', color: '#374151' }}>
        This is a test component to verify React is rendering.
      </p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
        <p>If you see this blue box, then React and styling are both working.</p>
      </div>
    </div>
  );
}

export default TestApp;
