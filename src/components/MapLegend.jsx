import React from 'react';

// Define main colors for Map Markers
const MAP_SEVERITY_COLORS = {
  1: '#DC2626', // Critical
  2: '#EA580C', // Major
  3: '#FACC15', // Minor
  4: '#06B6D4', // Warning
  5: '#10B981', // Normal
};

// Define Impact Type Colors
const MAP_IMPACT_TYPE_COLORS = {
  'Top n Offenders': '#CC3333',
  'Heavy Hitters': '#E67E22',
  'High Runners': '#2ECC71',
  'Micro/Macro Outage': '#9B59B6',
  'Broken Trends': '#7F8C8D',
  'Sleepy Cells': '#3498DB',
  'Default': '#555555',
};

/**
 * Renders a map legend that shows the selected site's KPI type and severity
 * @param {boolean} hasSelectedSite - Whether a site is currently selected
 * @param {Object} selectedSite - The currently selected site
 */
export default function MapLegend({ hasSelectedSite, selectedSite, visibleSites = [] }) {
  // Helper function to get severity label based on level
  const getSeverityLabel = (level) => {
    const labels = {
      1: 'Critical',
      2: 'Major',
      3: 'Minor',
      4: 'Warning',
      5: 'Normal'
    };
    return labels[level] || `Severity ${level}`;
  };

  // Check if selectedSite has the necessary properties to be considered valid
  const isValidSite = selectedSite && 
                     selectedSite.severity !== undefined &&
                     selectedSite.kpiType !== undefined;

  // If no valid site is selected, don't show anything
  if (!isValidSite) {
    return null;
  }

  // If we reach here, we have a valid selected site
  return (
    <div className="p-2 bg-white overflow-hidden h-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-sm text-gray-800">Selected: {selectedSite.geoId || selectedSite.id}</span>
        <span className="text-xs text-blue-600">{selectedSite.enodeb}</span>
      </div>

      <div className="flex gap-2 items-center">
        {/* Selected site's severity */}
        <div className="bg-gray-50 p-1 rounded border border-gray-200 flex-1">
          <div className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" 
              style={{ backgroundColor: selectedSite.severity <= 5 ? 
                (MAP_SEVERITY_COLORS[selectedSite.severity] || MAP_SEVERITY_COLORS[5]) : 
                MAP_SEVERITY_COLORS[5] }}
            />
            <span className="text-xs">
              Severity: <span className="font-medium">{selectedSite.severity} - {getSeverityLabel(selectedSite.severity)}</span>
            </span>
          </div>
        </div>

        {/* Selected site's KPI type */}
        {selectedSite.kpiType && (
          <div className="bg-gray-50 p-1 rounded border border-gray-200 flex-1">
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" 
                style={{ backgroundColor: MAP_IMPACT_TYPE_COLORS[selectedSite.kpiType] || MAP_IMPACT_TYPE_COLORS['Default'] }}
              />
              <span className="text-xs">
                KPI: <span className="font-medium">{selectedSite.kpiType === 'Micro/Macro Outage' ? 'Outage' : selectedSite.kpiType}</span>
              </span>
            </div>
          </div>
        )}
        
        {/* Market info */}
        <div className="bg-gray-50 p-1 rounded border border-gray-200">
          <span className="text-xs">
            Market: <span className="font-medium">{selectedSite.state}</span>
          </span>
        </div>
      </div>
    </div>
  );
}