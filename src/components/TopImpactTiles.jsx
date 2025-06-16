import React from 'react';

// Displays a single summary tile listing the top outage regions
const TopImpactTiles = ({ regions, months = 3 }) => (
  <div className="mb-4">
    <div className="p-3 border rounded text-sm bw">
      <p>
        In the last {months} months, the top micro/macro outage regions are:{' '}
        {regions.slice(0, 3).map((region, i) => (
          <span key={region}>
            <a href="#" className="underline text-blue-600 hover:text-blue-800">
              {region}
            </a>
            {i < Math.min(regions.length, 3) - 1 ? ', ' : ''}
          </span>
        ))}
        {regions.length > 3 && ' and remaining'}
      </p>
    </div>
  </div>
);

export default TopImpactTiles;
