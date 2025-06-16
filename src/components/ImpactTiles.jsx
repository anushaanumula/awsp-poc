import React from 'react';

const INFO = {
  'Top n Offenders': 'Worst KPI performance sites',
  'Heavy Hitters': 'High traffic impact',
  'High Runners': 'Consistently high usage',
  'Micro/Macro Outage': 'Currently unreachable',
  'Broken Trends': 'KPIs trending down',
  'Sleepy Cells': 'Low traffic or inactive',
};

const COLORS = {
  'Top n Offenders': '#e53e3e',
  'Heavy Hitters': '#dd6b20',
  'High Runners': '#38a169',
  'Micro/Macro Outage': '#805ad5',
  'Broken Trends': '#718096',
  'Sleepy Cells': '#3182ce',
};

const ImpactTiles = ({ sites }) => {
  const counts = React.useMemo(() => {
    const tally = {};
    sites.forEach((s) => {
      tally[s.kpiType] = (tally[s.kpiType] || 0) + 1;
    });
    return tally;
  }, [sites]);

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {Object.keys(INFO).map((type) => (
        <div
          key={type}
          className="p-3 rounded text-white text-center text-sm"
          style={{ backgroundColor: COLORS[type] }}
          title={INFO[type]}
        >
          <div className="font-semibold">{type}</div>
          <div className="text-2xl font-bold">{counts[type] || 0}</div>
        </div>
      ))}
    </div>
  );
};

export default ImpactTiles;
