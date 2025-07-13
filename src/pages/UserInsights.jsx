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
        borderColor: '#ff0000', // primary (brand-red)
        backgroundColor: 'rgba(255, 0, 0, 0.1)', // primary with opacity
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
        backgroundColor: '#3285dc', // secondary (brand-blue)
      },
    ],
  };

  const marketData = {
    labels: insights.markets.map((m) => m.market),
    datasets: [
      {
        label: 'Market Searches',
        data: insights.markets.map((m) => m.searches),
        backgroundColor: '#ff0000', // primary (brand-red)
      },
    ],
  };

  const searchTermData = {
    labels: insights.searches.map((s) => s.term),
    datasets: [
      {
        label: 'Search Count',
        data: insights.searches.map((s) => s.count),
        backgroundColor: '#3285dc', // secondary (brand-blue)
      },
    ],
  };

  const deviceData = {
    labels: insights.devices.map((d) => d.type),
    datasets: [
      {
        label: 'Device Type',
        data: insights.devices.map((d) => d.count),
        backgroundColor: ['#ff0000', '#3285dc', '#000000'], // primary, secondary, brand-black
      },
    ],
  };

  const loginByHourData = {
    labels: insights.loginHours.map((h) => h.hour),
    datasets: [
      {
        label: 'Logins by Hour',
        data: insights.loginHours.map((h) => h.logins),
        borderColor: '#000000', // brand-black
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // brand-black with opacity
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 text-base-content bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Context Panel */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border-l-4 border-primary">
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-base-content mb-3">Dashboard Overview</h3>
            <p className="mb-3 text-base-content">
              This dashboard helps analyze user behavior across RCA, Airwave, and AI Assistant tools. It offers market-level insights to improve platform adoption and operational efficiency.
            </p>
            <p className="mb-3 text-base-content/80">
              Login peaks and feature usage trends help correlate behavioral patterns with KPIs like RRC failures or throughput drops—enabling preemptive troubleshooting.
            </p>
            <p className="text-base-content/60">
              These metrics also help drive targeted improvements in UI, backend performance, and training across regions.
            </p>
          </div>
        </div>
      </div>

      {/* Chart Grid - 2 rows with 3 charts each */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <ChartCard title="📅 Daily Logins" color="text-primary" accentColor="border-primary">
          <Line data={loginData} />
        </ChartCard>
        <ChartCard title="🧠 Feature Usage" color="text-secondary" accentColor="border-secondary">
          <Bar data={featureData} />
        </ChartCard>
        <ChartCard title="📍 Market Searches" color="text-primary" accentColor="border-primary">
          <Bar data={marketData} />
        </ChartCard>

        <ChartCard title="🔍 Top Search Terms" color="text-secondary" accentColor="border-secondary">
          <Bar data={searchTermData} />
        </ChartCard>
        <ChartCard title="📱 Device Type Usage" color="text-primary" accentColor="border-primary">
          <Pie data={deviceData} />
        </ChartCard>
        <ChartCard title="⏰ Login Pattern by Hour" color="text-secondary" accentColor="border-secondary">
          <Line data={loginByHourData} />
        </ChartCard>
      </div>

      {/* Top Users Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-base-300">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary/10 p-2 rounded-lg">
            <span className="text-xl">🏅</span>
          </div>
          <h3 className="text-2xl font-bold text-base-content">Top Active Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-base-content">
            <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 text-base-content">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Market</th>
                <th className="px-6 py-4 font-semibold">Logins</th>
              </tr>
            </thead>
            <tbody>
              {insights.topUsers.map((user, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? 'bg-base-100' : 'bg-base-200'
                  } border-t border-base-300 hover:bg-primary/5 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-medium">
                      {user.market}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">
                      {user.logins}
                    </span>
                  </td>
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
function ChartCard({ title, color, accentColor, children }) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${accentColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <h3 className={`text-lg font-bold mb-4 ${color} font-primary`}>{title}</h3>
      <div className="w-full h-[300px]">{children}</div>
    </div>
  );
}
