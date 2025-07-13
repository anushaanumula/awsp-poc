import React, { useState, useMemo, useEffect } from 'react';
import NodeCard from '../components/NodeCard';
import Legend from '../components/Legend';
import NodeDetailsCard from '../components/NodeDetailsCard';
import data from '../data/path_kpis.json';
import hierarchy from '../data/enb_details.json';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { 
  SparklesIcon, 
  CpuChipIcon, 
  BoltIcon,
  ChartBarIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, ChartLegend);

const NODES = [
  { key: 'UE', title: 'User Equipment', icon: '/icons/device.svg', desc: 'User device connecting to the network.' },
  { key: 'RAN', title: 'RAN/Base Station', icon: '/icons/antenna.svg', desc: 'The radio node providing wireless access.' },
  { key: 'Sec Car', title: 'Sec Car', icon: '/icons/antenna.svg', desc: 'Secondary carrier for additional capacity.' },
  { key: 'Core', title: 'Core Network', icon: '/icons/server.svg', desc: 'Handles session management and routing.' },
  { key: 'Internet', title: 'Internet', icon: '/icons/globe.svg', desc: 'External network and services.' },
];

const statusColor = {
  ok: 'bg-green-100 border-green-400',
  warn: 'bg-yellow-100 border-yellow-400',
  error: 'bg-red-100 border-red-400',
};

export default function EndToEndView({ selectedSite, onAskAssistant }) {
  // --- Data & State ---
  const markets = hierarchy.markets.map((m) => m.name);
  const [market, setMarket] = useState(selectedSite?.state || markets[0]);
  const sites = useMemo(
    () => hierarchy.markets.find((m) => m.name === market)?.sites || [],
    [market]
  );
  const [site, setSite] = useState(selectedSite?.geoId || sites[0]?.id || '');
  const enbs = useMemo(
    () => sites.find((s) => s.id === site)?.enbs || [],
    [site, sites]
  );
  const [enb, setEnb] = useState(selectedSite?.enodeb || enbs[0] || '');
  const sectors = useMemo(
    () => hierarchy.enbDetails[enb]?.sectors.map((s) => s.id) || [],
    [enb]
  );
  const [sector, setSector] = useState(sectors[0] || '');
  const carriers = useMemo(() => {
    const secObj = hierarchy.enbDetails[enb]?.sectors.find((s) => s.id === sector);
    return secObj ? secObj.carriers : [];
  }, [enb, sector]);
  const [carrierSel, setCarrierSel] = useState([]);

  // --- AI Native Features ---
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [agenticWorkflowActive, setAgenticWorkflowActive] = useState(false);
  const [workflowResults, setWorkflowResults] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState('optimize');
  const [aiInsights, setAiInsights] = useState([]);

  // --- Node selection ---
  const [selected, setSelected] = useState(null);
  const handleSelect = (key) => setSelected(key === selected ? null : key);

  const selectedData = selected ? data[selected] : null;
  const sectorDetail =
    hierarchy.enbDetails[enb]?.sectors.find((s) => s.id === sector) || null;

  // --- AI-powered analysis ---
  const performAIAnalysis = async () => {
    setAiAnalysisRunning(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [
      { type: 'critical', message: 'RAN congestion detected - PRB utilization at 87%', confidence: 0.94 },
      { type: 'optimization', message: 'Load balancing to Sec Car could improve throughput by 15%', confidence: 0.89 },
      { type: 'prediction', message: 'Core latency likely to increase in next 2 hours based on traffic patterns', confidence: 0.82 },
      { type: 'action', message: 'Auto-optimization available for selected parameters', confidence: 0.91 }
    ];
    
    setAiInsights(insights);
    setAiAnalysisRunning(false);
  };

  const executeAgenticWorkflow = async () => {
    setAgenticWorkflowActive(true);
    // Simulate agentic workflow execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = {
      workflow: selectedWorkflow,
      level: getWorkflowLevel(),
      actions: getWorkflowActions(),
      impact: getExpectedImpact(),
      timestamp: new Date().toISOString()
    };
    
    setWorkflowResults(results);
    setAgenticWorkflowActive(false);
  };

  const getWorkflowLevel = () => {
    if (carrierSel.length > 0) return `Carrier Level (${carrierSel.join(', ')})`;
    if (sector) return `Sector Level (${sector})`;
    if (enb) return `eNodeB Level (${enb})`;
    if (site) return `Site Level (${site})`;
    return `Market Level (${market})`;
  };

  const getWorkflowActions = () => {
    const actions = {
      optimize: ['Parameter tuning', 'Load balancing', 'Interference mitigation'],
      diagnose: ['RCA analysis', 'Performance correlation', 'Anomaly detection'],
      predict: ['Traffic forecasting', 'Failure prediction', 'Capacity planning'],
      remediate: ['Auto-healing', 'Configuration reset', 'Emergency protocols']
    };
    return actions[selectedWorkflow] || [];
  };

  const getExpectedImpact = () => {
    const impacts = {
      optimize: { throughput: '+12-18%', latency: '-15-25%', efficiency: '+20%' },
      diagnose: { accuracy: '94%', resolution: '80% faster', coverage: '100%' },
      predict: { accuracy: '89%', horizon: '4-8 hours', confidence: '85%+' },
      remediate: { recovery: '<2 min', success: '92%', automation: '100%' }
    };
    return impacts[selectedWorkflow] || {};
  };

  // Update effects
  useEffect(() => {
    setSite(selectedSite?.geoId || sites[0]?.id || '');
  }, [sites, selectedSite]);

  useEffect(() => {
    setEnb(selectedSite?.enodeb || enbs[0] || '');
  }, [enbs, selectedSite]);

  useEffect(() => {
    setSector(sectors[0] || '');
  }, [sectors]);

  useEffect(() => {
    setCarrierSel([]);
  }, [sector]);

  useEffect(() => {
    if (selectedData) {
      const el = document.getElementById('node-details');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedData]);

  useEffect(() => {
    if (selectedSite) {
      setMarket(selectedSite.state);
      setSite(selectedSite.geoId);
      setEnb(selectedSite.enodeb);
    }
  }, [selectedSite]);

  // Auto-trigger AI analysis when selections change
  useEffect(() => {
    if (market && site && enb) {
      performAIAnalysis();
    }
  }, [market, site, enb, sector]);

  // --- Indicators ---
  const indicators = [];
  const curr = sectorDetail?.kpis || {};
  if (curr.cqi !== undefined && curr.cqi < 8) indicators.push('Interference');
  if (curr.prbUtil !== undefined && curr.prbUtil > 85) indicators.push('Congestion');

  // --- UI ---
  return (
    <div className="min-h-screen p-6 text-base-content bg-gradient-to-br from-base-100 via-base-200 to-base-300">



      {/* Network Selection & AI Controls */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-base-300">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-bold text-base-content">Network Context Selection</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="optimize">Optimize Performance</option>
              <option value="diagnose">Diagnose Issues</option>
              <option value="predict">Predict Trends</option>
              <option value="remediate">Auto-Remediate</option>
            </select>
            <button
              onClick={executeAgenticWorkflow}
              disabled={agenticWorkflowActive}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <PlayIcon className="w-5 h-5" />
              <span>Execute AI Workflow</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <NetworkSelector label="Market" value={market} onChange={setMarket} options={markets} />
          <NetworkSelector label="Site" value={site} onChange={setSite} options={sites.map(s => s.id)} />
          <NetworkSelector label="eNodeB" value={enb} onChange={setEnb} options={enbs} />
          <NetworkSelector label="Sector" value={sector} onChange={setSector} options={sectors.map(s => `Sector ${s}`)} />
          <MultiSelector 
            label="Carrier(s)" 
            value={carrierSel} 
            onChange={setCarrierSel} 
            options={carriers} 
          />
        </div>
        
        <div className="mt-4 text-sm text-base-content/60">
          <strong>Current Focus:</strong> {getWorkflowLevel()}
        </div>
      </div>

      {/* Workflow Results */}
      {workflowResults && (
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-base-content">Workflow Results</h3>
            </div>
            <span className="text-sm text-base-content/60">
              Executed: {new Date(workflowResults.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <WorkflowResultsPanel results={workflowResults} />
        </div>
      )}

      {/* Enhanced Network Path Visualization */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-base-content">End-to-End Network Path</h3>
          <Legend />
        </div>

        {indicators.length > 0 && (
          <div className="flex gap-2 text-xs justify-center items-center mb-6">
            {indicators.map((ind) => (
              <span
                key={ind}
                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-2 border border-yellow-300"
              >
                {ind === 'Interference' ? <ExclamationTriangleIcon className="w-4 h-4" /> : '🚦'} 
                {ind}
              </span>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="flex items-center justify-between gap-4 min-w-[800px] py-6">
            {NODES.map((n, idx) => (
              <React.Fragment key={n.key}>
                <div className="relative">
                  <NodeCard
                    title={n.title}
                    icon={n.icon}
                    kpis={data[n.key]}
                    severity={data[n.key].severity}
                    selected={selected === n.key}
                    onClick={() => handleSelect(n.key)}
                    className="transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  />
                  {/* AI Overlay for critical nodes */}
                  {data[n.key].severity >= 2 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                      <SparklesIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {idx < NODES.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-3 rounded-full relative overflow-hidden ${
                        data[n.key].severity === 3
                          ? 'bg-red-500'
                          : data[n.key].severity === 2
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                      }`}
                    >
                      {/* Animated data flow */}
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-center text-xs text-base-content/60 mt-1">
                      {Math.floor(Math.random() * 100) + 50} Mbps
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {selectedData && (
        <div id="node-details" className="mb-8">
          <NodeDetailsCard
            node={NODES.find((n) => n.key === selected)}
            data={selectedData}
            sectorDetail={selected === 'RAN' ? sectorDetail : null}
            enbInfo={
              selected === 'RAN'
                ? {
                    id: enb,
                    cells: hierarchy.enbDetails[enb]?.cellIds || [],
                    sectors: hierarchy.enbDetails[enb]?.sectors || [],
                  }
                : null
            }
          />
        </div>
      )}

      {/* AI Events Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-base-content">AI-Detected Events & Actions</h3>
          <div className="flex items-center space-x-2 text-sm text-base-content/60">
            <ClockIcon className="w-4 h-4" />
            <span>Last 24 hours</span>
          </div>
        </div>
        <div className="space-y-3">
          <AIEvent 
            time="07/08 13:22" 
            type="detection" 
            message="CQI dip detected in Dallas RAN - AI initiated optimization" 
            confidence={94}
          />
          <AIEvent 
            time="07/08 12:10" 
            type="resolution" 
            message="Backhaul latency spike auto-resolved via load balancing" 
            confidence={91}
          />
          <AIEvent 
            time="07/07 18:45" 
            type="prevention" 
            message="Core attach success restored to 99.8% - prevented outage" 
            confidence={87}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components

function WorkflowResultsPanel({ results }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-100 p-4 rounded-lg">
          <h4 className="font-bold text-base-content mb-2">Workflow</h4>
          <p className="text-sm text-secondary">{results.workflow}</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg">
          <h4 className="font-bold text-base-content mb-2">Target</h4>
          <p className="text-sm text-primary">{results.level}</p>
        </div>
        <div className="bg-base-100 p-4 rounded-lg">
          <h4 className="font-bold text-base-content mb-2">Status</h4>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Completed
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold text-base-content mb-2">Actions Taken</h4>
          <ul className="text-sm space-y-1">
            {results.actions.map((action, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base-content mb-2">Expected Impact</h4>
          <div className="text-sm space-y-1">
            {Object.entries(results.impact).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span className="font-medium text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkSelector({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-base-content mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelector({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-base-content mb-2">{label}</label>
      <select
        multiple
        value={value}
        onChange={(e) => onChange(Array.from(e.target.selectedOptions, (o) => o.value))}
        className="w-full border border-base-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function AIEvent({ time, type, message, confidence }) {
  const typeIcons = {
    detection: '🔍',
    resolution: '✅',
    prevention: '🛡️'
  };

  const typeColors = {
    detection: 'text-blue-600',
    resolution: 'text-green-600', 
    prevention: 'text-purple-600'
  };

  return (
    <div className="flex items-start space-x-4 p-3 bg-base-100 rounded-lg">
      <span className="text-lg">{typeIcons[type]}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-base-content/60 font-medium">{time}</span>
          <span className="text-xs font-bold text-primary">{confidence}% confidence</span>
        </div>
        <p className={`text-sm font-medium ${typeColors[type]} mt-1`}>{message}</p>
      </div>
    </div>
  );
}
