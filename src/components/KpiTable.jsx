import React from 'react';

const KpiTable = ({ sites, onSelect, selected }) => {
  // Sort sites by severity (1 to 5)
  const sortedSites = [...sites].sort((a, b) => a.severity - b.severity);

  return (
    <table className="w-full mt-4 border border-verizon-black text-sm bw">
      <thead>
        <tr className="bg-verizon-black text-white">
          <th className="border border-verizon-black p-2">Site</th>
          <th className="border border-verizon-black p-2">eNodeB</th>
          <th className="border border-verizon-black p-2">Market/Geofence</th>
          <th className="border border-verizon-black p-2">Sector</th>
          <th className="border border-verizon-black p-2">Carrier</th>
          <th className="border border-verizon-black p-2">KPI Name</th>
          <th className="border border-verizon-black p-2">KPI Value</th>
          <th className="border border-verizon-black p-2">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {sortedSites.map((site) => {
          const severityClass =
            site.severity >= 4
              ? 'bg-red-50'
              : site.severity >= 2
              ? 'bg-yellow-50'
              : 'bg-green-50';

          return (
            <tr
              key={site.id}
              tabIndex={0}
              role="button"
              onClick={() => onSelect(site)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(site);
                }
              }}
              className={`cursor-pointer border-verizon-black ${selected?.id === site.id ? 'bg-verizon-concrete' : severityClass}`}
              title={`Impact: ${site.kpiType} | Severity: ${site.severity}`}
            >
            <td className="border border-verizon-black p-2">{site.geoId}</td>
            <td className="border border-verizon-black p-2">{site.enodeb}</td>
            <td className="border border-verizon-black p-2">{site.state}</td>
            <td className="border border-verizon-black p-2">{site.sector}</td>
            <td className="border border-verizon-black p-2">{site.carrier}</td>
            <td className="border border-verizon-black p-2">{site.kpi}</td>
            <td className="border border-verizon-black p-2">{site.value}</td>
            <td className="border border-verizon-black p-2">{site.updatedAt}</td>
          </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default KpiTable;
