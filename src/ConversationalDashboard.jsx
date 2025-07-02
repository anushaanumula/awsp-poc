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
import kpiData from './data/kpis.json';
import reports from './data/reports.json';
import questions from './data/questions.js';
import {
  lineOptions,
  lineData,
  barOptions,
  barData,
} from './data/chartData.js';

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


export default function ConversationalDashboard() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Hi! I'm your RF Assistant. What would you like to analyze today?" },
    { sender: 'user', text: 'Can you tell me more about latency issues in Oklahoma?' },
    { sender: 'assistant', text: "Latency for Oklahoma averages 75ms. Here are the details:", charts: true },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input.trim() };
    let response = "Sorry, I don't have data on that yet.";
    let charts = false;
    const lower = input.toLowerCase();
    const match = questions.find((q) =>
      q.keywords.some((kw) => lower.includes(kw.toLowerCase()))
    );
    if (match) {
      response = match.answer;
      charts = !!match.charts;
    }
    const assistantMessage = { sender: 'assistant', text: response, charts };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="h-full bg-white text-black p-4 space-y-4 flex flex-col">
      {/* KPI Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
        <div className="flex flex-1 justify-around">
          {kpiData.map((kpi) => (
            <div
              key={kpi.title}
              className="bg-gray-100 rounded border p-4 flex flex-col items-center w-1/3 mx-1 hover:shadow-md transition"
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
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded w-fit ${
                    m.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                  }`}
                >
                  {m.text}
                  {m.charts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="h-40">
                        <Line options={lineOptions} data={lineData} />
                      </div>
                      <div className="h-40">
                        <Bar options={barOptions} data={barData} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 border rounded-l p-2 text-sm"
                  placeholder="Type your question..."
                />
                <button
                  onClick={handleSend}
                  className="border border-l-0 rounded-r px-4"
                >
                  Send
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q.preset)}
                    className="text-xs bg-gray-200 rounded px-2 py-1 hover:bg-gray-300"
                  >
                    {q.preset}
                  </button>
                ))}
              </div>
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
