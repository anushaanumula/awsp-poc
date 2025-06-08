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
        <th className="border p-2">⋯</th> {/* Action column */}
      </tr>
    </thead>
    <tbody>
      {sites.map((site) => (
        <tr
          key={site.id}
          className={`cursor-pointer ${selected?.id === site.id ? 'bg-blue-100' : ''}`}
        >
          <td className="border p-2" onClick={() => onSelect(site)}>{site.geoId}</td>
          <td className="border p-2" onClick={() => onSelect(site)}>{site.enodeb}</td>
          <td className="border p-2" onClick={() => onSelect(site)}>{site.sector}</td>
          <td className="border p-2" onClick={() => onSelect(site)}>{site.carrier}</td>
          <td className="border p-2" onClick={() => onSelect(site)}>{site.kpi}</td>
          <td className="border p-2" onClick={() => onSelect(site)}>{site.value}</td>
          <td className="border p-2" onClick={() => onSelect(site)}>{site.updatedAt}</td>
          <td className="border p-2 text-center">
            <span
              onClick={() => onCreateTask(site)}
              className="text-blue-600 hover:underline cursor-pointer text-xs"
              title="Create Task"
            >
              +Task
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default KpiTable;
