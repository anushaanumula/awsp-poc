import React from 'react';

const IMPACT_INFO = {
  'Top n Offenders': 'Worst KPI performance sites',
  'Heavy Hitters': 'Large traffic or customer impact',
  'High Runners': 'Consistently high usage cells',
  'Micro/Macro Outage': 'Sites currently unreachable',
  'Broken Trends': 'KPIs trending negatively',
  'Sleepy Cells': 'Low traffic or inactive sectors',
};

const COLORS = {
  'Top n Offenders': '#e53e3e',
  'Heavy Hitters': '#dd6b20',
  'High Runners': '#38a169',
  'Micro/Macro Outage': '#805ad5',
  'Broken Trends': '#718096',
  'Sleepy Cells': '#3182ce',
};

const IMPACT_CATEGORIES = Object.keys(IMPACT_INFO);

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
      {IMPACT_CATEGORIES.map((type) => (
        <div
          key={type}
          className="p-3 rounded text-white text-center text-sm"
          style={{ backgroundColor: COLORS[type] }}
          title={IMPACT_INFO[type]}
        >
          <div className="font-semibold">{type}</div>
          <div className="text-2xl font-bold">{counts[type] || 0}</div>
        </div>
      ))}
    </div>
  );
};

export default ImpactTiles;
