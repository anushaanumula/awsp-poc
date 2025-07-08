import React from 'react';

// Displays static impact summaries in individual panels
const TopImpactPanels = ({ months = 3 }) => {
  const orderedTypes = [
    'Sleepy Cells',
    'Broken Trends',
    'High Runners',
    'Heavy Hitters',
    'Top n Offenders',
    'Micro/Macro',
  ];
  const regions = ['Dallas', 'Tampa', 'Chicago'];

  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">In the last {months} months, the top</p>
      <div className="flex space-x-4 overflow-x-auto">
        {orderedTypes.map((type) => (
          <div key={type} className="p-3 border rounded text-sm bw min-w-[12rem]">
            <p className="font-semibold mb-1">{type} regions:</p>
            <p>
              {regions.map((region, i) => (
                <span key={region}>
                  <a
                    href="#"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    {region}
                  </a>
                  {i < regions.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopImpactPanels;
