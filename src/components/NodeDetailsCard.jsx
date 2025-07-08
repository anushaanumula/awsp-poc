import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend as ChartLegend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartLegend);

export default function NodeDetailsCard({ node, data, sectorDetail, enbInfo }) {
  if (!node || !data) return null;
  const healthMap = {
    1: { label: 'Good', color: 'green' },
    2: { label: 'Warning', color: 'yellow' },
    3: { label: 'Critical', color: 'red' },
  };
  const metrics = Object.entries(data).filter(([k]) => k !== 'trend' && k !== 'severity');
  const trend = sectorDetail?.trend || data.trend;
  const health = healthMap[data.severity] || healthMap[1];
  return (
    <div className="mt-4 p-4 border rounded bg-white shadow space-y-4" id="node-details">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold mb-1">{node.title}</h3>
          <p className="text-sm">{node.desc}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded bg-${health.color}-500 text-white`}>Health: {health.label}</span>
        <button className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Create Task</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(([k, v]) => (
          <div key={k} className="text-xs border rounded p-2 flex justify-between">
            <span>{k}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
      </div>
      {enbInfo && (
        <>
          <div className="text-sm">
            <p>eNB ID: {enbInfo.id}</p>
            <p>Cell IDs: {enbInfo.cells.join(', ')}</p>
          </div>
          <table className="w-full text-xs border mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-1">Sector</th>
                <th className="border px-1">Carriers</th>
                <th className="border px-1">Throughput</th>
                <th className="border px-1">CQI</th>
                <th className="border px-1">PRB Util</th>
                <th className="border px-1">Drops</th>
                <th className="border px-1"></th>
              </tr>
            </thead>
            <tbody>
              {enbInfo.sectors.map((s) => (
                <tr key={s.id} className={sectorDetail && s.id === sectorDetail.id ? 'bg-blue-50' : ''}>
                  <td className="border px-1">{s.id}</td>
                  <td className="border px-1">{s.carriers.join(', ')}</td>
                  <td className="border px-1">{s.kpis.throughput}</td>
                  <td className="border px-1">{s.kpis.cqi}</td>
                  <td className="border px-1">{s.kpis.prbUtil}</td>
                  <td className="border px-1">{s.kpis.drops}</td>
                  <td className="border px-1 text-center">
                    <button className="text-blue-600">📋</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {trend && (
        <div className="h-40">
          <Line
            data={{ labels: trend.map((_, i) => i + 1), datasets: [{ data: trend, borderColor: '#2563eb' }] }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
      )}
    </div>
  );
}
