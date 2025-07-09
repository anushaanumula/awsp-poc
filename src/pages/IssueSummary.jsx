import React, { useState } from 'react';
import issues from '../data/issues.json';
import {
  Bar,
  // We'll add other charts here later if needed
} from 'react-chartjs-2';
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

// Mock data for KPIs, correlations, troubleshooting, proactive actions
const kpis = [
  { name: 'RRC Setup Success Rate', good: '> 98%', bad: '< 90%', remark: 'Call initiation impact' },
  { name: 'CQI Average', good: '> 10', bad: '< 6', remark: 'RF quality' },
  { name: 'Handover Success Rate', good: '> 97%', bad: '< 90%', remark: 'Mobility robustness' },
  { name: 'PRB Utilization', good: '50-80%', bad: '> 90%', remark: 'High = congestion' },
  { name: 'BLER', good: '< 5%', bad: '> 10%', remark: 'RF link quality' },
  { name: 'Throughput DL', good: '> 3 Mbps', bad: '< 1 Mbps', remark: 'User experience' },
  { name: 'Bearer Drop Rate', good: '< 0.5%', bad: '> 2%', remark: 'QoE impact' },
  { name: 'Paging Success Rate', good: '> 98%', bad: '< 95%', remark: 'MT call reliability' },
  { name: 'SINR', good: '> 15 dB', bad: '< 5 dB', remark: 'Interference/noise' },
];

const correlations = [
  { behavior: 'High RRC Failures + Low CQI', cause: 'Coverage holes, interference', metrics: 'RSRP, SINR, HO Failures' },
  { behavior: 'Low Throughput + High PRB Usage', cause: 'Congestion or scheduler issues', metrics: '#UEs, CPU Usage, BLER' },
  { behavior: 'Call Drops + Paging Failures', cause: 'Core network issues', metrics: 'S1 Setup, Paging Success, DNS latency' },
  { behavior: 'Sleeping Cell (0 UEs)', cause: 'Software fault or transport issue', metrics: 'Node reachability, alarms' },
];

const troubleshootingSteps = [
  { layer: 'RF Layer (L1-L3)', steps: [
    'Analyze drive test CQI, SINR heatmaps',
    'Check antenna tilt, azimuth, neighbor list',
    'Scan for interference and PIM',
    'Check HARQ, PRACH failures, BLER',
    'Analyze PRB usage and scheduler behavior',
  ] },
  { layer: 'Transport/Core (L4-L7)', steps: [
    'Verify S1/X2 interface connectivity',
    'Check firewall, GTPv2, DNS logs',
    'Trace UE → eNodeB → SGW/PGW sessions',
    'Reproduce test calls and capture packet traces',
  ] },
  { layer: 'System/Platform', steps: [
    'Review Airwave trends (RRC, HO, throughput)',
    'Check RCA engine logs per site/market',
    'Examine Vizon alarms for hardware/fiber issues',
    'Check WeSOPP for fiber/modem resets',
  ] },
];

const proactiveActions = [
  { action: 'Alert on KPI deviations', benefit: 'Early anomaly detection' },
  { action: 'AI-driven correlation of KPIs & alarms', benefit: 'Faster root cause prioritization' },
  { action: 'Maintain clean sector mapping', benefit: 'Easier grouping and RCA' },
  { action: 'Heatmaps for RRC drops & sleeping cells', benefit: 'Visual identification of problem areas' },
  { action: 'Auto-ticket generation from top offenders', benefit: 'Faster operational resolution' },
];

const markets = ['Market A', 'Market B', 'Market C'];
const sites = ['Site 101', 'Site 102', 'Site 103'];
const enodebs = ['eNodeB-1', 'eNodeB-2', 'gNodeB-3'];
const sectors = ['Sector 1', 'Sector 2', 'Sector 3'];
const carriers = ['Carrier A', 'Carrier B'];
const dus = ['DU 1', 'DU 2'];

export default function RANDashboard() {
  // Controlled dropdowns to simulate drill-down selection
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [selectedENodeB, setSelectedENodeB] = useState(enodebs[0]);
  const [selectedSector, setSelectedSector] = useState(sectors[0]);
  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0]);
  const [selectedDU, setSelectedDU] = useState(dus[0]);

  // Prepare bar chart data
  const issueData = {
    labels: issues.map((i) => i.type),
    datasets: [
      {
        label: 'Issue Count',
        data: issues.map((i) => i.count),
        backgroundColor: '#3b82f6', // Tailwind blue-500
      },
    ],
  };
  const issueOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="p-6 w-full space-y-10 font-sans text-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-center">RAN Performance Dashboard</h1>

      {/* Drilldown selectors */}
      <section className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded shadow">
        {[ 
          {label: 'Market', options: markets, value: selectedMarket, setter: setSelectedMarket},
          {label: 'Site', options: sites, value: selectedSite, setter: setSelectedSite},
          {label: 'eNodeB/gNodeB', options: enodebs, value: selectedENodeB, setter: setSelectedENodeB},
          {label: 'Sector', options: sectors, value: selectedSector, setter: setSelectedSector},
          {label: 'Carrier', options: carriers, value: selectedCarrier, setter: setSelectedCarrier},
          {label: 'DU', options: dus, value: selectedDU, setter: setSelectedDU},
        ].map(({label, options, value, setter}) => (
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
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Issue Summary</h2>
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/2 max-w-lg mx-auto">
            <Bar data={issueData} options={issueOptions} />
          </div>
          <table className="w-full mt-6 md:mt-0 border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300 text-left">Issue Type</th>
                <th className="p-2 border border-gray-300 text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(({ type, count }) => (
                <tr key={type} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border border-gray-300">{type}</td>
                  <td className="p-2 border border-gray-300 text-right">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* KPI Thresholds */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Key KPI Thresholds</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300 text-left">KPI</th>
                <th className="p-2 border border-gray-300 text-center">Good (✔️)</th>
                <th className="p-2 border border-gray-300 text-center">Bad (❌)</th>
                <th className="p-2 border border-gray-300 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map(({ name, good, bad, remark }) => (
                <tr key={name} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border border-gray-300">{name}</td>
                  <td className="p-2 border border-gray-300 text-center text-green-600 font-semibold">{good}</td>
                  <td className="p-2 border border-gray-300 text-center text-red-600 font-semibold">{bad}</td>
                  <td className="p-2 border border-gray-300">{remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {/* Troubleshooting */}
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
