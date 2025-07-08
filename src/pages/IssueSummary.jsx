import React from 'react';
import issues from '../data/issues.json';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function IssueSummary() {
  const data = {
    labels: issues.map((i) => i.type),
    datasets: [
      {
        label: 'Issues',
        data: issues.map((i) => i.count),
        backgroundColor: '#60a5fa',
      },
    ],
  };
  const options = { responsive: true, plugins: { legend: { display: false } } };
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Issue Summary</h2>
      <div className="max-w-md mx-auto">
        <Bar data={data} options={options} />
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Count</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((i) => (
            <tr key={i.type}>
              <td className="p-2 border">{i.type}</td>
              <td className="p-2 border">{i.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
