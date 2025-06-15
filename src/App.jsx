import React, { useState, useMemo, useEffect } from 'react';
import MapView from './components/MapView';
import KpiTable from './components/KpiTable';
import SiteDetails from './components/SiteDetails';
import AiInsights from './components/AiInsights';
import TaskModal from './components/TaskModal';
import TaskList from './components/TaskList';
import GuideBanner from './components/GuideBanner';
import sitesData from './data/sites.json';

const TABS = ['Live Map & KPI', 'AI Insights', 'Task List'];
const IMPACT_CATEGORIES = [
  'Top n Offenders',
  'Heavy Hitters',
  'High Runners',
  'Micro/Macro Outage',
  'Broken Trends',
  'Sleepy Cells'
];

const MARKETS = ['Northeast', 'Southeast', 'Midwest', 'West'];

export default function App() {
  const [selectedSite, setSelectedSite] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [market, setMarket] = useState(MARKETS[0]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sites, setSites] = useState(sitesData);
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    } catch {
      return [];
    }
  });
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Simulate live KPI updates by tweaking the top 30 sites every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSites((prev) => {
        const next = [...prev];
        const top = [...next]
          .sort((a, b) => b.severity - a.severity)
          .slice(0, 30);
        top.forEach((site) => {
          site.value = parseFloat((site.value + (Math.random() * 2 - 1)).toFixed(2));
          site.updatedAt = new Date().toISOString();
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSiteSelect = (site) => setSelectedSite(site);

  const handleTaskCreate = (task) => setTasks((prev) => [...prev, task]);
  const handleTaskRemove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  const filteredSites = activeFilters.length
    ? sites.filter((site) => activeFilters.includes(site.kpiType))
    : sites;

  const sortedSites = useMemo(
    () => [...filteredSites].sort((a, b) => b.severity - a.severity),
    [filteredSites]
  );
  const topSites = useMemo(() => sortedSites.slice(0, 10), [sortedSites]);

  const topSitesByImpact = useMemo(() => {
    const groups = {};
    sitesData.forEach((site) => {
      if (!groups[site.kpiType]) groups[site.kpiType] = [];
      groups[site.kpiType].push(site);
    });
    const result = {};
    Object.keys(groups).forEach((type) => {
      result[type] = groups[type]
        .sort((a, b) => b.severity - a.severity)
        .slice(0, 3);
    });
    return result;
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 bw">AWSP AI Dashboard</h1>
      {showGuide && <GuideBanner onClose={() => setShowGuide(false)} />}

      {/* Market Selector */}
      <div className="mb-4 flex items-center space-x-2 bw">
        <label htmlFor="market" className="font-medium">
          Market:
        </label>
        <select
          id="market"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {MARKETS.map((m) => (
            <option key={m} value={m} title={`View ${m} market`}> 
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4 bw">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-md border ${activeTab === i ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      {(activeTab === 0 || activeTab === 3) && (
        <>
          <div className="flex flex-wrap gap-2 mb-4 bw">
            {IMPACT_CATEGORIES.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-3 py-1 rounded border text-sm ${activeFilters.includes(filter) ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
              >
                {filter}
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 bw">
              <KpiTable
                sites={topSites}
                onSelect={handleSiteSelect}
                selected={selectedSite}
                onCreateTask={(site) => {
                  setSelectedSite(site);
                  setShowTaskModal(true);
                }}
              />
              <p className="text-xs text-gray-600 mt-1">Showing top 10 sites by severity</p>

            </div>
            <div className="flex flex-col space-y-4">
              <div className="h-64 border rounded">
                <MapView sites={filteredSites} onSelect={handleSiteSelect} selected={selectedSite} />
              </div>
              <div className="h-64 border rounded overflow-auto bw">
                <SiteDetails site={selectedSite} />
              </div>
            </div>
          </div>

          <div className="mt-4 bw">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!selectedSite}
              onClick={() => setShowTaskModal(true)}
            >
              Create Task
            </button>
          </div>

          {showTaskModal && (
            <TaskModal
              site={selectedSite}
              onClose={() => setShowTaskModal(false)}
              onCreate={handleTaskCreate}
            />
          )}
        </>
      )}

      {activeTab === 1 && (
        <div className="p-4 border rounded bw">
          <h2 className="text-xl font-semibold mb-2">Predicted Issues (Site-wise KPI degradation, Outages, etc.)</h2>
          <AiInsights site={selectedSite} onApprove={handleTaskCreate} />
          <h2 className="text-xl font-semibold mt-6 mb-2">Predicted Top Sites by Impact Type</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {Object.entries(topSitesByImpact).map(([type, sites]) => (
              <li key={type}>
                <strong>{type}:</strong> {sites.map((s) => s.geoId).join(', ')}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">Recommended Actions and Generated Flow</h2>
          <p>If risk is high, suggest proactive mitigation steps. If low, suggest monitoring only.</p>
        </div>
      )}

      {activeTab === 2 && (
        <TaskList tasks={tasks} onRemove={handleTaskRemove} />
      )}
    </div>
  );
}
