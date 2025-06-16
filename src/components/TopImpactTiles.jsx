import React from 'react';

// Renders a single tile summarizing the top regions for each impact type
const TopImpactTiles = ({ impactRegions, months = 3 }) => (
  <div className="p-3 border rounded text-sm mb-4 bw">
    {Object.entries(impactRegions).map(([type, regions]) => (
      <p key={type} className="mb-1">
        In the last {months} months, the top {type.toLowerCase()} regions are:{' '}
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
    ))}
  </div>
);

export default TopImpactTiles;
