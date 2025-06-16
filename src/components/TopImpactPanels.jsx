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
    <div className="mb-4">
      <p className="font-semibold mb-2">In the last {months} months, the top</p>
      <div className="flex space-x-4 overflow-x-auto">
        {orderedTypes.map((type) => {
          const regions = impactRegions[type] || [];
          return (
            <div key={type} className="p-3 border rounded text-sm bw min-w-[12rem]">
              <p className="font-semibold mb-1">
                {type} regions:
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
    </div>
  );
};

export default TopImpactPanels;
