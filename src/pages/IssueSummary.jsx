import React, { useState } from 'react';
import {
  Bar,
  Line,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const troubleshootingSteps = [
  {
    layer: 'RF Layer (L1-L3)',
    steps: [
      'Analyze drive test CQI, SINR heatmaps',
      'Check antenna tilt, azimuth, neighbor list',
      'Scan for interference and PIM',
      'Check HARQ, PRACH failures, BLER',
      'Analyze PRB usage and scheduler behavior',
    ],
  },
  {
    layer: 'Transport/Core (L4-L7)',
    steps: [
      'Verify S1/X2 interface connectivity',
      'Check firewall, GTPv2, DNS logs',
      'Trace UE → eNodeB → SGW/PGW sessions',
      'Reproduce test calls and capture packet traces',
    ],
  },
  {
    layer: 'System/Platform',
    steps: [
      'Review Airwave trends (RRC, HO, throughput)',
      'Check RCA engine logs per site/market',
      'Examine Vizon alarms for hardware/fiber issues',
      'Check WeSOPP for fiber/modem resets',
    ],
  },
];

const proactiveActions = [
  {
    action: 'Regular Drive Tests',
    benefit: 'Identify coverage holes and interference early.',
  },
  {
    action: 'Scheduler Optimization',
    benefit: 'Improve PRB utilization and user throughput.',
  },
  {
    action: 'Alarm Monitoring Automation',
    benefit: 'Proactively catch hardware or transport faults.',
  },
];

// Issues with detailed descriptions for new engineers
const issues = [
  // RAN Issues
  { type: 'High RRC Failures', count: 23, description: 'UE unable to establish initial connection (Radio Connection setup failure)' },
  { type: 'Low CQI', count: 15, description: 'Indicates poor RF conditions such as interference or fading' },
  { type: 'High Handover Failures', count: 12, description: 'Mobility misconfigurations or weak neighbor list causing failed handovers' },
  { type: 'Sleeping Cell', count: 6, description: 'Site is up but not serving users due to software or hardware issues' },
  { type: 'Throughput Degradation', count: 13, description: 'Lower than expected data rates due to RF or backhaul issues' },
  { type: 'High PRB Utilization', count: 10, description: 'Resource Blocks overloaded due to heavy usage or scheduler issues' },
  { type: 'High Retransmissions (BLER)', count: 9, description: 'Indicates RF or interference problems affecting link quality' },

  // Core Network Issues
  { type: 'S1/APN Setup Failures', count: 8, description: 'UE cannot establish sessions at core network level' },
  { type: 'High Drop Call Rate (DCR)', count: 7, description: 'Sessions lost before completion affecting user experience' },
  { type: 'Paging Failures', count: 9, description: 'Users unreachable during incoming calls or sessions' },
  { type: 'Control Plane Congestion', count: 5, description: 'Massive signaling events congest the control plane' },
  { type: 'DNS / GTPv2 Failures', count: 4, description: 'Failures affecting data flow setup and user experience' },
];
const correlations = [
  { behavior: 'High RRC Failures + Low CQI', cause: 'Coverage holes, interference', metrics: 'RSRP, SINR, HO Failures' },
  { behavior: 'Low Throughput + High PRB Usage', cause: 'Congestion or scheduler issues', metrics: '#UEs, CPU Usage, BLER' },
  { behavior: 'Call Drops + Paging Failures', cause: 'Core network issues', metrics: 'S1 Setup, Paging Success, DNS latency' },
  { behavior: 'Sleeping Cell (0 UEs)', cause: 'Software fault or transport issue', metrics: 'Node reachability, alarms' },
];

// KPIs with trend data, status, and descriptions
const kpis = [
  {
    name: 'RRC Setup Success Rate',
    good: '> 98%',
    bad: '< 90%',
    remark: 'Call initiation impact',
    value: '85%',
    trend: [95, 93, 92, 89, 87, 86, 85],
    status: 'bad',
    comment: 'Impacted by low CQI and high PRACH failure',
  },
  {
    name: 'CQI Average',
    good: '> 10',
    bad: '< 6',
    remark: 'RF quality',
    value: '7',
    trend: [5, 5.5, 6.1, 6.4, 6.8, 7.2, 7],
    status: 'warn',
    comment: 'Recovering from recent dip',
  },
  {
    name: 'Handover Success Rate',
    good: '> 97%',
    bad: '< 90%',
    remark: 'Mobility robustness',
    value: '95%',
    trend: [94, 94.5, 94.8, 95, 95.1, 95, 95],
    status: 'ok',
    comment: 'Stable',
  },
  {
    name: 'PRB Utilization',
    good: '50-80%',
    bad: '> 90%',
    remark: 'High = congestion',
    value: '85%',
    trend: [70, 72, 75, 80, 83, 85, 85],
    status: 'warn',
    comment: 'Trending higher, risk of congestion',
  },
  {
    name: 'BLER',
    good: '< 5%',
    bad: '> 10%',
    remark: 'RF link quality',
    value: '12%',
    trend: [6, 7, 8, 9, 10, 11, 12],
    status: 'bad',
    comment: 'High retransmissions indicate interference',
  },
];

// Calculate health score based on KPI statuses
const getHealthScore = () => {
  const total = kpis.length;
  const weights = { ok: 1, warn: 0.5, bad: 0 };
  const score = kpis.reduce((acc, k) => acc + (weights[k.status] || 0), 0);
  return Math.round((score / total) * 100);
};

// Health card component
const HealthScoreCard = ({ score }) => {
  let color = 'text-green-700 bg-green-100';
  let status = 'Good';
  if (score < 60) {
    color = 'text-red-700 bg-red-100';
    status = 'Poor';
  } else if (score < 80) {
    color = 'text-yellow-700 bg-yellow-100';
    status = 'Warning';
  }

  return (
    <div className={`p-4 rounded shadow-md w-64 mx-auto mb-6 text-center ${color}`}>
      <h2 className="text-xl font-bold mb-2">Overall Health Score</h2>
      <p className="text-4xl font-extrabold">{score}%</p>
      <p className="italic">{status} status based on KPI evaluation</p>
    </div>
  );
};

const markets = ['Market A', 'Market B', 'Market C'];
const sites = ['Site 101', 'Site 102', 'Site 103'];
const enodebs = ['eNodeB-1', 'eNodeB-2', 'gNodeB-3'];
const sectors = ['Sector 1', 'Sector 2', 'Sector 3'];
const carriers = ['Carrier A', 'Carrier B'];
const dus = ['DU 1', 'DU 2'];

export default function RANDashboard() {
  // Controlled dropdowns for drilldown
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [selectedENodeB, setSelectedENodeB] = useState(enodebs[0]);
  const [selectedSector, setSelectedSector] = useState(sectors[0]);
  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0]);
  const [selectedDU, setSelectedDU] = useState(dus[0]);

  // Bar chart data for issues
  const issueData = {
    labels: issues.map((i) => i.type),
    datasets: [
      {
        label: 'Issue Count',
        data: issues.map((i) => i.count),
        backgroundColor: '#3b82f6',
      },
    ],
  };
  const issueOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const healthScore = getHealthScore();

  // Render sparkline as a small line chart for KPI trend
  const renderSparkline = (trend) => {
    const data = {
      labels: trend.map((_, i) => i + 1),
      datasets: [
        {
          data: trend,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    };
    const options = {
      responsive: false,
      maintainAspectRatio: false,
      scales: { x: { display: false }, y: { display: false } },
      elements: { line: { borderWidth: 2 } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    };
    return <Line data={data} options={options} width={100} height={30} />;
  };

  return (
    <div className="p-6 w-full space-y-10 font-sans text-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-center">RAN Performance Dashboard</h1>

      {/* Health Score Card */}
      <HealthScoreCard score={healthScore} />

      {/* Drilldown selectors */}
      <section className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded shadow">
        {[
          { label: 'Market', options: markets, value: selectedMarket, setter: setSelectedMarket },
          { label: 'Site', options: sites, value: selectedSite, setter: setSelectedSite },
          { label: 'eNodeB/gNodeB', options: enodebs, value: selectedENodeB, setter: setSelectedENodeB },
          { label: 'Sector', options: sectors, value: selectedSector, setter: setSelectedSector },
          { label: 'Carrier', options: carriers, value: selectedCarrier, setter: setSelectedCarrier },
          { label: 'DU', options: dus, value: selectedDU, setter: setSelectedDU },
        ].map(({ label, options, value, setter }) => (
          <div key={label} className="flex flex-col">
            <label className="mb-1 font-semibold">{label}</label>
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </section>

      {/* Issues summary */}
      <section className="bg-white p-6 rounded shadow overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">Issue Summary</h2>
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 max-w-lg mx-auto">
            <Bar data={issueData} options={issueOptions} />
          </div>
          <table className="w-full mt-6 md:mt-0 border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300 text-left">Issue Type</th>
                <th className="p-2 border border-gray-300 text-left">Description</th>
                <th className="p-2 border border-gray-300 text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(({ type, description, count }) => (
                <tr key={type} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border border-gray-300">{type}</td>
                  <td className="p-2 border border-gray-300">{description}</td>
                  <td className="p-2 border border-gray-300 text-right">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* KPI Thresholds with Sparklines */}
      <section className="bg-white p-6 rounded shadow overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">Key KPI Thresholds & Trends</h2>
        <table className="min-w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-left">KPI</th>
              <th className="p-2 border border-gray-300 text-center">Good (✔️)</th>
              <th className="p-2 border border-gray-300 text-center">Bad (❌)</th>
              <th className="p-2 border border-gray-300 text-left">Remarks</th>
              <th className="p-2 border border-gray-300 text-left">Current Value</th>
              <th className="p-2 border border-gray-300 text-left">Trend</th>
              <th className="p-2 border border-gray-300 text-left">Comment</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map(({ name, good, bad, remark, value, trend, status, comment }) => (
              <tr
                key={name}
                className={`odd:bg-white even:bg-gray-50 ${
                  status === 'bad' ? 'bg-red-100 font-semibold' : status === 'warn' ? 'bg-yellow-100 font-semibold' : ''
                }`}
              >
                <td className="p-2 border border-gray-300">{name}</td>
                <td className="p-2 border border-gray-300 text-center text-green-600 font-semibold">{good}</td>
                <td className="p-2 border border-gray-300 text-center text-red-600 font-semibold">{bad}</td>
                <td className="p-2 border border-gray-300">{remark}</td>
                <td className={`p-2 border border-gray-300 font-semibold ${
                  status === 'bad' ? 'text-red-600' : status === 'warn' ? 'text-yellow-600' : 'text-green-600'
                }`}>{value}</td>
                <td className="p-2 border border-gray-300 w-24">{renderSparkline(trend)}</td>
                <td className="p-2 border border-gray-300 italic">{comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Correlations */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Common KPI Correlations & Root Causes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {correlations.map(({ behavior, cause, metrics }) => (
            <div key={behavior} className="border border-gray-300 rounded p-4 bg-gray-50 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">{behavior}</h3>
              <p><strong>Likely Cause:</strong> {cause}</p>
              <p><strong>Correlated Metrics:</strong> {metrics}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Troubleshooting Steps */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting Steps by Layer</h2>
        <div className="space-y-6">
          {troubleshootingSteps.map(({ layer, steps }) => (
            <details key={layer} className="border border-gray-300 rounded p-4 bg-gray-50">
              <summary className="font-semibold cursor-pointer">{layer}</summary>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* Proactive Actions */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Proactive Monitoring & Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proactiveActions.map(({ action, benefit }) => (
            <div key={action} className="border border-blue-400 rounded p-4 bg-blue-50 text-blue-800 shadow-sm">
              <h3 className="font-semibold mb-1">{action}</h3>
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
