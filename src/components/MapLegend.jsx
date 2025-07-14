import React from 'react';

const KPI_TYPES = [
  { type: 'Top n Offenders', color: '#e53e3e', description: 'Worst performing sites' },
  { type: 'Heavy Hitters', color: '#dd6b20', description: 'High traffic impact' },
  { type: 'High Runners', color: '#38a169', description: 'Consistently high usage' },
  { type: 'Micro/Macro Outage', color: '#805ad5', description: 'Currently unreachable' },
  { type: 'Broken Trends', color: '#718096', description: 'KPIs trending down' },
  { type: 'Sleepy Cells', color: '#3182ce', description: 'Low activity sites' },
];

const SEVERITY_LEVELS = [
  { level: 1, color: '#FF1744', label: 'Critical', description: 'Immediate attention required' },
  { level: 2, color: '#FF9800', label: 'Major', description: 'High priority issue' },
  { level: 3, color: '#FFC107', label: 'Minor', description: 'Moderate impact' },
  { level: 4, color: '#4CAF50', label: 'Warning', description: 'Potential issue' },
  { level: 5, color: '#2196F3', label: 'Normal', description: 'Operating normally' },
];

export default function MapLegend({ hasSelectedSite = false }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3 space-y-3 max-w-full">
      <div className="text-sm font-semibold text-gray-800 border-b pb-2">
        Map Legend
      </div>
      
      {/* Default KPI Type Colors */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
          Default Site Colors (KPI Types)
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {KPI_TYPES.map((item) => (
            <div key={item.type} className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full border border-black flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium truncate text-xs">{item.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Site Colors */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
          Selected Site Colors (Severity Level)
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {SEVERITY_LEVELS.map((item) => (
            <div key={item.level} className="flex items-center space-x-1">
              <div 
                className={`w-3 h-3 rounded-full border-2 border-white flex-shrink-0 ${hasSelectedSite ? 'shadow-md' : ''}`}
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: hasSelectedSite ? `0 0 0 2px ${item.color}40` : 'none'
                }}
              />
              <span className="font-medium text-xs">Sev {item.level} ({item.label})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
        <div className="font-medium text-blue-800 mb-1">How to read the map:</div>
        <div className="flex flex-wrap gap-4 text-blue-700">
          <span>• Unselected sites show <strong>KPI type</strong> colors</span>
          <span>• Selected sites show <strong>severity level</strong> colors</span>
          <span>• Selected sites are larger with pulsing animation</span>
        </div>
      </div>
    </div>
  );
}
