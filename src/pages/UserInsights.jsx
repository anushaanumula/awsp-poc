import React from 'react';
import insights from '../data/user_insights.json';
import users from '../data/users.json';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function UserInsights() {
  const loginData = {
    labels: users.map((u) => u.date),
    datasets: [
      {
        label: 'Daily Logins',
        data: users.map((u) => u.logins),
        borderColor: '#6b7280', // gray-500
        backgroundColor: 'rgba(107,114,128,0.2)', // gray-500 with opacity
        tension: 0.3,
      },
    ],
  };

  const featureData = {
    labels: insights.features.map((f) => f.feature),
    datasets: [
      {
        label: 'Feature Usage',
        data: insights.features.map((f) => f.count),
        backgroundColor: '#9ca3af', // gray-400
      },
    ],
  };

  const marketData = {
    labels: insights.markets.map((m) => m.market),
    datasets: [
      {
        label: 'Market Searches',
        data: insights.markets.map((m) => m.searches),
        backgroundColor: '#d1d5db', // gray-300
      },
    ],
  };

  const searchTermData = {
    labels: insights.searches.map((s) => s.term),
    datasets: [
      {
        label: 'Search Count',
        data: insights.searches.map((s) => s.count),
        backgroundColor: '#4b5563', // gray-600
      },
    ],
  };

  const deviceData = {
    labels: insights.devices.map((d) => d.type),
    datasets: [
      {
        label: 'Device Type',
        data: insights.devices.map((d) => d.count),
        backgroundColor: ['#d1d5db', '#9ca3af', '#6b7280'], // gray-300 to gray-500
      },
    ],
  };

  const loginByHourData = {
    labels: insights.loginHours.map((h) => h.hour),
    datasets: [
      {
        label: 'Logins by Hour',
        data: insights.loginHours.map((h) => h.logins),
        borderColor: '#374151', // gray-700
        backgroundColor: 'rgba(55,65,81,0.3)', // gray-700 with opacity
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 text-gray-800 bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        📊 User Insights Dashboard
      </h1>

      {/* Context Panel */}
      <div className="bg-white rounded-xl p-6 mb-10 shadow-md border border-gray-200">
        <p className="mb-2">
          This dashboard helps analyze user behavior across RCA, Airwave, and AI Assistant tools. It offers market-level insights to improve platform adoption and operational efficiency.
        </p>
        <p className="mb-2 text-gray-600">
          Login peaks and feature usage trends help correlate behavioral patterns with KPIs like RRC failures or throughput drops—enabling preemptive troubleshooting.
        </p>
        <p className="text-gray-500">
          These metrics also help drive targeted improvements in UI, backend performance, and training across regions.
        </p>
      </div>

      {/* Chart Grid - 2 rows with 3 charts each */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ChartCard title="📅 Daily Logins" color="text-gray-600">
          <Line data={loginData} />
        </ChartCard>
        <ChartCard title="🧠 Feature Usage" color="text-gray-600">
          <Bar data={featureData} />
        </ChartCard>
        <ChartCard title="📍 Market Searches" color="text-gray-600">
          <Bar data={marketData} />
        </ChartCard>

        <ChartCard title="🔍 Top Search Terms" color="text-gray-600">
          <Bar data={searchTermData} />
        </ChartCard>
        <ChartCard title="📱 Device Type Usage" color="text-gray-600">
          <Pie data={deviceData} />
        </ChartCard>
        <ChartCard title="⏰ Login Pattern by Hour" color="text-gray-600">
          <Line data={loginByHourData} />
        </ChartCard>
      </div>

      {/* Top Users Table */}
      <div className="bg-white rounded-xl p-6 mt-12 shadow-md border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">🏅 Top Active Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Market</th>
                <th className="px-4 py-2">Logins</th>
              </tr>
            </thead>
            <tbody>
              {insights.topUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } border-t border-gray-200 hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.market}</td>
                  <td className="px-4 py-2 text-gray-600">{user.logins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable chart card for consistency
function ChartCard({ title, color, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>
      <div className="w-full h-[300px]">{children}</div>
    </div>
  );
}
