import React from 'react';

// Renders a grid of summary tiles listing the top regions per impact type
const TopImpactTiles = ({ impactRegions, months = 3 }) => (
  <div className="grid md:grid-cols-3 gap-4 mb-4">
    {Object.entries(impactRegions).map(([type, regions]) => (
      <div key={type} className="p-3 border rounded text-sm bw">
        <p>
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
      </div>
    ))}
  </div>
);

export default TopImpactTiles;
