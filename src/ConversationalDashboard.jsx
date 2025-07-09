import { useRef, useEffect, useState, useMemo } from 'react';
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
import sites from './data/sites.json';
import MapView from './components/MapView';
import enodebSummary from './data/enodeb_summary.json';
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
    {
      sender: 'assistant',
      text: "Hi! I'm your RF Assistant. What would you like to analyze today?",
    },
    { sender: 'user', text: 'Any insights on CQI in Dallas?' },
    {
      sender: 'assistant',
      text: 'CQI for Dallas averages 3.2. Here are the details:',
      charts: true,
    },
  ]);

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [summary, setSummary] = useState(null);

  const chatEndRef = useRef(null);

  // Auto-scroll to latest message when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // User journey banner
  const journey = selectedSite
    ? `Journey: Market: ${selectedSite.state} → Site: ${selectedSite.geoId} → eNodeB: ${selectedSite.enodeb}`
    : 'Journey: No site selected';

  const nearbySites = useMemo(() => {
    if (!selectedSite) return [];
    return sites.filter(
      (s) =>
        s.state === selectedSite.state &&
        Math.abs(s.lat - selectedSite.lat) < 0.5 &&
        Math.abs(s.lng - selectedSite.lng) < 0.5
    );
  }, [selectedSite]);

  const results = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return sites.filter((s) =>
      String(s.enodeb).toLowerCase().includes(lower)
    );
  }, [query]);

  const handleSelectSite = (site) => {
    setSelectedSite(site);
    setQuery(String(site.enodeb));
    setShowResults(false);
    setSummary(enodebSummary);
  };

  function generateDynamicResponse(question, site, summary) {
    const lower = question.toLowerCase();
    if (!site) return null;

    // Example: Drop Rate
    if (lower.match(/drop|fail|disconnect|lost/i)) {
      const drop = summary?.kpis?.['Bearer Drop Rate'] ?? summary?.kpis?.['Bearer Drop %'];
      let msg = `Bearer drop rate for ${site.geoId} is ${drop ?? 'N/A'}%. `;
      if (drop > 2) {
        msg += "This is above the normal threshold and may indicate radio link instability or interference. ";
        msg += "You may want to check for recent hardware alarms, interference sources, or congestion in the area. ";
        msg += "Would you like to see a trend graph or get recommended actions?";
      } else {
        msg += "This is within the normal range. ";
        msg += "No immediate action is required, but you can monitor this KPI for any sudden changes.";
      }
      return msg;
    }

    // Example: Paging
    if (lower.includes('paging')) {
      const paging = summary?.kpis?.['Paging Success Rate'];
      let msg = `Paging success rate for ${site.geoId} is ${paging ?? 'N/A'}%. `;
      if (paging < 97) {
        msg += "A low paging rate may affect mobile-terminated call performance. ";
        msg += "Consider checking S1AP and RRC signaling for anomalies. ";
        msg += "Would you like to see related KPIs or troubleshooting steps?";
      } else {
        msg += "Paging KPIs look healthy. ";
        msg += "No action needed at this time.";
      }
      return msg;
    }

    // Example: CQI
    if (lower.match(/cqi|quality|modulation/i)) {
      const cqi = summary?.kpis?.CQI;
      let msg = `CQI for ${site.geoId} is ${cqi ?? 'N/A'}. `;
      if (cqi < 8) {
        msg += "Low CQI suggests poor radio conditions or interference. ";
        msg += "You might want to check for external interference, suboptimal antenna tilt, or high user density. ";
        msg += "Would you like to see a coverage map or get optimization tips?";
      } else {
        msg += "CQI is healthy. ";
        msg += "No immediate optimization needed.";
      }
      return msg;
    }

    // Example: Throughput
    if (lower.match(/throughput|speed|capacity/i)) {
      const tp = summary?.kpis?.Throughput;
      let msg = `Throughput for ${site.geoId} is ${tp ?? 'N/A'} Mbps. `;
      if (tp < 10) {
        msg += "This is below the expected value for this site. ";
        msg += "Potential causes include high PRB utilization, interference, or backhaul congestion. ";
        msg += "Would you like to see PRB utilization or backhaul stats?";
      } else {
        msg += "Throughput is within expected range.";
      }
      return msg;
    }

    // Example: Combine KPIs for health
    if (lower.match(/health|status|overall/i)) {
      const drop = summary?.kpis?.['Bearer Drop Rate'] ?? summary?.kpis?.['Bearer Drop %'];
      const cqi = summary?.kpis?.CQI;
      const prb = summary?.kpis?.['PRB Utilization'];
      let health = 'good';
      let msg = `Overall health for ${site.geoId}: `;
      if (drop > 2 || cqi < 8 || prb > 85) {
        health = 'needs attention';
        msg += "Some KPIs are outside normal thresholds. ";
        if (drop > 2) msg += "High drop rate. ";
        if (cqi < 8) msg += "Low CQI. ";
        if (prb > 85) msg += "High PRB utilization. ";
        msg += "Would you like recommended actions or a detailed breakdown?";
      } else {
        msg += "All major KPIs are within normal range. ";
        msg += "No immediate action required.";
      }
      return msg;
    }

    // Example: Actions/Recommendations
    if (lower.match(/recommend|action|suggest|mitigate|fix/i)) {
      let actions = [];
      if (summary?.kpis?.['Bearer Drop Rate'] > 2) {
        actions.push("Investigate high bearer drop rate: check hardware alarms and interference.");
      }
      if (summary?.kpis?.CQI < 8) {
        actions.push("Low CQI: check for external interference or optimize antenna tilt.");
      }
      if (summary?.kpis?.['PRB Utilization'] > 85) {
        actions.push("High PRB Utilization: consider offloading traffic or optimizing scheduling parameters.");
      }
      if (actions.length === 0) {
        return `No critical actions recommended for ${site.geoId} at this time.`;
      }
      return `Recommended actions for ${site.geoId}: ${actions.join(' ')} Would you like to create a task or see more details?`;
    }

    // Default fallback
    return "I'm analyzing your question. Could you specify which KPI or issue you'd like to discuss?";
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input.trim() };
    let response = generateDynamicResponse(input, selectedSite, summary);
    let charts = false;

    if (!response) {
      // fallback to canned Q&A
      const lower = input.toLowerCase();
      // Dynamic: If a site is selected and the question mentions "cqi"
      if (selectedSite && lower.includes('cqi')) {
        response = `CQI for ${selectedSite.geoId} is ${summary?.kpis?.CQI ?? 'N/A'}.`;
        charts = true;
      } else if (selectedSite && lower.includes('throughput')) {
        response = `Throughput for ${selectedSite.geoId} is ${summary?.kpis?.Throughput ?? 'N/A'} Mbps.`;
        charts = true;
      } else {
        // Fallback to canned Q&A
        const match = questions.find((q) =>
          q.keywords.some((kw) => lower.includes(kw.toLowerCase()))
        );
        if (match) {
          response = match.answer;
          charts = !!match.charts;
        }
      }
    }

    const assistantMessage = { sender: 'assistant', text: response, charts };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  return (
    <div className="h-full bg-white text-black p-4 flex flex-col gap-4">
      {/* User Journey Banner */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs font-medium mb-2">
        <span className="text-blue-700">{journey}</span>
        {selectedSite && (
          <>
            <button
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              onClick={() => window.dispatchEvent(new CustomEvent('gotoEndToEnd', { detail: selectedSite }))}
              title="View End-to-End Path"
            >
              End-to-End View
            </button>
            <button
              className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              onClick={() => window.dispatchEvent(new CustomEvent('gotoAiInsights', { detail: selectedSite }))}
              title="View AI Insights"
            >
              AI Insights
            </button>
            <button
              className="ml-auto text-xs text-blue-600 underline hover:text-blue-800"
              onClick={() => setSelectedSite(null)}
              title="Clear selection"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* KPI Row */}
      <div className="flex flex-wrap gap-2 justify-between">
        {kpiData.map((kpi) => (
          <div
            key={kpi.title}
            className="bg-gray-100 rounded border p-3 flex flex-col items-center w-32 hover:shadow-md transition"
          >
            <div className="text-xs text-gray-600">{kpi.title}</div>
            <div className="text-lg font-semibold">{kpi.value}</div>
            <div
              className={`text-xs flex items-center ${
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

      {/* Search and Map */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
              placeholder="Search eNodeB, Site, or Market"
              className="border rounded w-full p-2 text-sm"
            />
            {showResults && results.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-auto mt-1">
                {results.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => handleSelectSite(s)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {s.enodeb} - {s.geoId}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {questions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q.preset)}
                className="bg-gray-200 rounded px-2 py-1 hover:bg-gray-300"
              >
                {q.preset}
              </button>
            ))}
          </div>
          {selectedSite && (
            <div className="h-64 border rounded mt-2">
              <MapView
                sites={nearbySites.length ? nearbySites : [selectedSite]}
                onSelect={handleSelectSite}
                selected={selectedSite}
                stateFilter={selectedSite.state}
                zoomToSelected
              />
            </div>
          )}
        </div>
        {/* Site summary and trends */}
        {selectedSite && summary && (
          <div className="flex-1 space-y-2 overflow-auto">
            <div className="border rounded p-2 bg-gray-50 text-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p>
                    <span className="font-semibold">eNodeB:</span> {selectedSite.enodeb}
                  </p>
                  <p>
                    <span className="font-semibold">Site ID:</span> {selectedSite.geoId}
                  </p>
                  <p>
                    <span className="font-semibold">Market:</span> {selectedSite.state}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {Object.entries(summary.kpis).map(([k, v]) => (
                  <div key={k} className="border rounded p-2 bg-gray-50">
                    <div className="text-xs text-gray-600">{k}</div>
                    <div className="text-lg font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {Object.entries(summary.trends)
                  .slice(0, 4)
                  .map(([metric, data]) => (
                    <div key={metric} className="border rounded p-2 h-32">
                      <Line
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { title: { display: true, text: 'Time' } },
                            y: { title: { display: true, text: metric } },
                          },
                        }}
                        data={{
                          labels: data.labels,
                          datasets: [{ data: data.data, borderColor: '#2563eb' }],
                        }}
                      />
                    </div>
                  ))}
              </div>
              {summary.analysis && (
                <p className="text-xs text-gray-700 mt-2">{summary.analysis}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat and Reports */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col border rounded p-4 h-[420px] bg-white">
          <div className="flex-1 overflow-auto space-y-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2 rounded max-w-[80%] text-xs leading-tight ${
                  m.sender === 'user'
                    ? 'bg-blue-100 self-end text-right'
                    : 'bg-gray-100 self-start text-left'
                }`}
                style={{
                  fontSize: '0.85rem',
                  minHeight: m.charts ? '7.5rem' : undefined, // Ensure enough height for charts
                  marginBottom: m.charts ? '1.5rem' : undefined, // Extra space below chart
                }}
              >
                {m.text}
                {m.charts && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="min-h-[96px] h-28">
                      <Line options={lineOptions} data={lineData} />
                    </div>
                    <div className="min-h-[96px] h-28">
                      <Bar options={barOptions} data={barData} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-2">
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
                className="border border-l-0 rounded-r px-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Send
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
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
        {/* Reports Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="border rounded p-4 h-[420px] flex flex-col bg-gray-50">
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
