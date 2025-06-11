import React from 'react';

const KpiTable = ({ sites, onSelect, selected, onCreateTask }) => (
  <table className="w-full mt-4 border text-sm">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">Geo ID</th>
        <th className="border p-2">eNodeB</th>
        <th className="border p-2">Sector</th>
        <th className="border p-2">Carrier</th>
        <th className="border p-2">KPI Name</th>
        <th className="border p-2">KPI Value</th>
        <th className="border p-2">Last Updated</th>
        <th className="border p-2">⋯</th>
      </tr>
    </thead>
    <tbody>
      {sites.map((site) => {
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
            className={`cursor-pointer ${selected?.id === site.id ? 'bg-blue-100' : severityClass}`}
          >
          <td className="border p-2">{site.geoId}</td>
          <td className="border p-2">{site.enodeb}</td>
          <td className="border p-2">{site.sector}</td>
          <td className="border p-2">{site.carrier}</td>
          <td className="border p-2">{site.kpi}</td>
          <td className="border p-2">{site.value}</td>
          <td className="border p-2">{site.updatedAt}</td>
          <td className="border p-2 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateTask(site);
              }}
              className="text-blue-600 hover:underline text-xs"
              title="Create Task"
            >
              +Task
            </button>
          </td>
        </tr>
        );
      })}
    </tbody>
  </table>
);

export default KpiTable;
