import React, { useState } from 'react';

const TABS = [
  'Live Map & KPI',
  'AI Insights', 
  'KPI Correlation',
  'Task List'
];

function SimpleApp() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' }}>
        AWSP AI Dashboard
      </h1>
      
      {/* Tab Navigation */}
      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              style={{
                padding: '10px 16px',
                border: 'none',
                backgroundColor: activeTab === index ? '#3b82f6' : 'transparent',
                color: activeTab === index ? 'white' : '#6b7280',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === index ? 'bold' : 'normal'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minHeight: '300px' }}>
        {activeTab === 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Live Map & KPI View</h2>
            <p>This would show the map and KPI table.</p>
          </div>
        )}
        
        {activeTab === 1 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>AI Insights</h2>
            <p>This would show AI-generated insights.</p>
          </div>
        )}
        
        {activeTab === 2 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>KPI Correlation</h2>
            <p>This would show the KPI correlation visualizations and analysis.</p>
          </div>
        )}
        
        {activeTab === 3 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Task List</h2>
            <p>This would show the task management interface.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleApp;
