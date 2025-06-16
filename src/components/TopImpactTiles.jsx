import React from 'react';

const TopImpactTiles = ({ data, months = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
    {Object.entries(data).map(([type, regions]) => (
      <div key={type} className="p-3 border rounded text-sm bw">
        <p>
          In the last {months} months, the top {type.toLowerCase()} regions are:{' '}
          {regions.map((region, i) => (
            <span key={region}>
              <a href="#" className="underline text-blue-600 hover:text-blue-800">
                {region}
              </a>
              {i < regions.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>
    ))}
  </div>
);

export default TopImpactTiles;
