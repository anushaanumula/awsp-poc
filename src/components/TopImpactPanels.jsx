import React from 'react';

// Displays impact summaries in individual panels
const TopImpactPanels = ({ impactRegions, months = 3 }) => {
  const orderedTypes = [
    'Sleepy Cells',
    'Broken Trends',
    'High Runners',
    'Heavy Hitters',
    'Top n Offenders',
    'Micro/Macro Outage',
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      {orderedTypes.map((type) => {
        const regions = impactRegions[type] || [];
        return (
          <div key={type} className="p-3 border rounded text-sm bw">
            <p className="font-semibold mb-1">
              In the last {months} months, the top {type.toLowerCase()} regions:
            </p>
            <p>
              {regions.slice(0, 3).map((region, i) => (
                <span key={region}>
                  <a
                    href="#"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    {region}
                  </a>
                  {i < Math.min(regions.length, 3) - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TopImpactPanels;
