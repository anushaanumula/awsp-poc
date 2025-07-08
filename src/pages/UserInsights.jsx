import React from 'react';
import insights from '../data/user_insights.json';
import users from '../data/users.json';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserInsights() {
  const loginData = {
    labels: users.map((u) => u.date),
    datasets: [
      {
        label: 'Logins',
        data: users.map((u) => u.logins),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.3)',
      },
    ],
  };

  const featureData = {
    labels: insights.features.map((f) => f.feature),
    datasets: [
      {
        label: 'Uses',
        data: insights.features.map((f) => f.count),
        backgroundColor: '#4ade80',
      },
    ],
  };

  const marketData = {
    labels: insights.markets.map((m) => m.market),
    datasets: [
      {
        label: 'Searches',
        data: insights.markets.map((m) => m.searches),
        backgroundColor: '#fbbf24',
      },
    ],
  };

  const options = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">User Insights</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Line data={loginData} options={options} />
        </div>
        <div>
          <Bar data={featureData} options={options} />
        </div>
        <div>
          <Bar data={marketData} options={options} />
        </div>
      </div>
    </div>
  );
}
