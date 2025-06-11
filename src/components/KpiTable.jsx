import React from 'react';
import Tooltip from './Tooltip';

const KpiTable = ({ sites, onSelect, selected, onCreateTask }) => (
  <table className="w-full mt-4 border text-sm">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">
          <Tooltip text="Geographical site identifier">Geo ID</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Base station identifier">eNodeB</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Sector number within the site">Sector</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Carrier or frequency band">Carrier</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Name of the KPI being monitored">KPI Name</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Measured KPI value">KPI Value</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Timestamp of last update">Last Updated</Tooltip>
        </th>
        <th className="border p-2">
          <Tooltip text="Create a task for this site">⋯</Tooltip>
        </th>
      </tr>
    </thead>
    <tbody>
      {sites.map((site) => (
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
          className={`cursor-pointer ${selected?.id === site.id ? 'bg-blue-100' : ''}`}
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
      ))}
    </tbody>
  </table>
);

export default KpiTable;
