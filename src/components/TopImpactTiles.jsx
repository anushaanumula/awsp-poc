import React from 'react';

// Renders a single tile summarizing top regions for selected impact types
const TopImpactTiles = ({ impactRegions, months = 3 }) => {
  const orderedTypes = [
    'Sleepy Cells',
    'Broken Trends',
    'High Runners',
    'Top n Offenders',
  ];

  return (
    <div className="p-3 border rounded text-sm mb-4 bw">
      <p className="mb-1">In the last {months} months, the top</p>
      {orderedTypes.map((type) => {
        const regions = impactRegions[type] || [];
        return (
          <p key={type} className="mb-1 ml-2">
            {type.toLowerCase()} regions:{' '}
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
        );
      })}
    </div>
  );
};

export default TopImpactTiles;
