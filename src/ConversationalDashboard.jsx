import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/20/solid';
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

const kpiData = [
  { title: 'Throughput', value: '450 Mbps', delta: '+5%', trend: 'up' },
  { title: 'Latency', value: '12 ms', delta: '-2%', trend: 'down' },
  { title: 'Coverage Quality', value: '95.2%', delta: '+1%', trend: 'up' },
];

const markets = ['All Markets', 'Midwest', 'Northeast', 'South'];

const lineOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const barOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const lineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [400, 420, 440, 430, 450, 460, 455],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.3)',
      fill: true,
    },
  ],
};

const barData = {
  labels: ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p'],
  datasets: [
    {
      data: [80, 75, 70, 85, 90, 95, 70, 60, 50, 55, 65, 70],
      backgroundColor: '#34d399',
    },
  ],
};

const reports = [
  { title: 'Daily 5G Throughput', freq: 'Daily', status: 'paused', time: '8:00 AM' },
  { title: 'Weekly Coverage Availability', freq: 'Weekly', status: 'active', time: 'Sun 1:00 AM' },
  { title: 'Monthly Capacity Planning', freq: 'Monthly', status: 'paused', time: '1st 12:00 AM' },
  { title: 'Hourly Latency Monitor', freq: 'Hourly', status: 'paused', time: 'Top of hour' },
];

export default function ConversationalDashboard() {
  const [market, setMarket] = useState(markets[0]);
  const [input, setInput] = useState('');

  return (
    <div className="h-full bg-white text-black p-4 space-y-4 flex flex-col">
      {/* KPI Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Market:</label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            {markets.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 justify-around">
          {kpiData.map((kpi) => (
            <div
              key={kpi.title}
              className="bg-gray-100 rounded border p-4 flex flex-col items-center w-1/3 mx-1"
            >
              <div className="text-sm text-gray-600">{kpi.title}</div>
              <div className="text-xl font-semibold">{kpi.value}</div>
              <div
                className={`text-sm flex items-center ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {kpi.delta}
                {kpi.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 ml-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:flex lg:space-x-4">
        {/* Chat Section */}
        <div className="lg:flex-1 space-y-4">
          <div className="border rounded p-4 space-y-2 h-[520px] flex flex-col">
            <div className="flex-1 overflow-auto space-y-4">
              <div className="bg-gray-100 p-3 rounded self-start">
                Hello! I'm your RF Analytics Assistant. How can I help you today?
              </div>
              <div className="bg-blue-100 p-3 rounded self-end">
                Can you tell me more about latency issues in Oklahoma?
              </div>
              <div className="bg-gray-100 p-3 rounded self-start">
                Based on recent data, Oklahoma's latency is averaging 75ms across most sites.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40">
                  <Line options={lineOptions} data={lineData} />
                </div>
                <div className="h-40">
                  <Bar options={barOptions} data={barData} />
                </div>
              </div>
            </div>
            <div className="mt-2 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-l p-2 text-sm"
                placeholder="Type your question..."
              />
              <button className="border border-l-0 rounded-r px-4">Send</button>
            </div>
          </div>
        </div>

        {/* Reports Sidebar */}
        <div className="mt-4 lg:mt-0 lg:w-64">
          <div className="border rounded p-4 h-[520px] flex flex-col">
            <h2 className="font-semibold mb-2">Scheduled Reports</h2>
            <div className="overflow-auto space-y-2">
              {reports.map((r) => (
                <div key={r.title} className="border rounded p-2 flex items-center space-x-2">
                  {r.status === 'active' ? (
                    <PlayCircleIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <PauseCircleIcon className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="text-xs text-gray-600">
                      {r.freq} - {r.status} - last run {r.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
