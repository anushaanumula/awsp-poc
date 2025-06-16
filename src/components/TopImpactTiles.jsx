import React, { useState } from 'react';

// Renders a collapsible tile summarizing top regions for selected impact types
const TopImpactTiles = ({ impactRegions, months = 3 }) => {
  const [open, setOpen] = useState(false);

  const orderedTypes = [
    'Sleepy Cells',
    'Broken Trends',
    'High Runners',
    'Heavy Hitters',
    'Top n Offenders',
    'Micro/Macro Outage',
  ];

  return (
    <div className="p-3 border rounded text-sm mb-4 bw">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left font-semibold px-2 py-1 bg-yellow-100 rounded"
      >
        In the last {months} months, the top
        <span className="float-right ml-2 bg-yellow-200 px-1">choose UI</span>
        <span className="float-right mr-2">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2">
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
                {regions.length > 3 && ' and remaining'}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopImpactTiles;
