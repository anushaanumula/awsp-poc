import React, { useState, useMemo, useEffect } from 'react';
import MapView from './components/MapView';
import KpiTable from './components/KpiTable';
import SiteDetails from './components/SiteDetails';
import AiInsights from './components/AiInsights';
import TrendGraph from './components/TrendGraph';
import TaskModal from './components/TaskModal';
import TaskList from './components/TaskList';
import GuideBanner from './components/GuideBanner';
import TopImpactTiles from './components/TopImpactTiles';
import sitesData from './data/sites.json';
import statesList from './data/states.json';

const TABS = ['Live Map & KPI', 'AI Insights', 'Task List'];
const IMPACT_CATEGORIES = [
  'Top n Offenders',
  'Heavy Hitters',
  'High Runners',
  'Micro/Macro Outage',
  'Broken Trends',
  'Sleepy Cells'
];

const IMPACT_INFO = {
  'Top n Offenders': 'Worst KPI performance sites',
  'Heavy Hitters': 'High traffic impact',
  'High Runners': 'Consistently high usage',
  'Micro/Macro Outage': 'Currently unreachable',
  'Broken Trends': 'KPIs trending down',
  'Sleepy Cells': 'Low traffic or inactive',
};

const IMPACT_COLORS = {
  'Top n Offenders': '#e53e3e',
  'Heavy Hitters': '#dd6b20',
  'High Runners': '#38a169',
  'Micro/Macro Outage': '#805ad5',
  'Broken Trends': '#718096',
  'Sleepy Cells': '#3182ce',
};

const PRESELECTED_TOP_SITES = {
  'Top n Offenders': ['CHI003', 'OKL004', 'CHI008'],
  'Heavy Hitters': ['CHI013', 'DAL016', 'STL020'],
  'High Runners': ['DAL021', 'CHI023', 'OKL024'],
  'Micro/Macro Outage': ['DAL031', 'OKL039', 'DAL036'],
  'Broken Trends': ['TAM042', 'CHI043', 'OKL044'],
  'Sleepy Cells': ['OKL054', 'STL055', 'CHI053'],
};

const STATES = statesList;
const DEFAULT_STATE = STATES[0];

export default function App() {
  const [selectedSite, setSelectedSite] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [stateFilter, setStateFilter] = useState(DEFAULT_STATE);
  const [geoFilter, setGeoFilter] = useState('All');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sites, setSites] = useState(sitesData);
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    } catch {
      return [];
    }
  });
  const [taskMessage, setTaskMessage] = useState('');
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (!taskMessage) return;
    const timer = setTimeout(() => setTaskMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [taskMessage]);

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

  const handleTaskCreate = (task) => {
    if (tasks.some((t) => t.siteId === task.siteId)) {
      setTaskMessage('Task already exists for this site.');
      return;
    }
    setTasks((prev) => [...prev, task]);
    setSites((prev) => prev.filter((s) => s.id !== task.siteId));
    if (selectedSite?.id === task.siteId) {
      setSelectedSite(null);
    }
    setTaskMessage('Task created.');
  };
  const handleTaskRemove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => setActiveFilters([]);


  useEffect(() => {
    setGeoFilter('All');
  }, [stateFilter]);

  const geoOptions = useMemo(() => {
    if (stateFilter === 'All') return [];
    return sitesData
      .filter((s) => s.state === stateFilter)
      .map((s) => s.geoId);
  }, [stateFilter]);

  const filteredByState =
    stateFilter === 'All' ? sites : sites.filter((s) => s.state === stateFilter);

  const filteredByGeo =
    geoFilter === 'All'
      ? filteredByState
      : filteredByState.filter((s) => s.geoId === geoFilter);

  const filteredSites =
    activeFilters.length > 0
      ? filteredByGeo.filter((site) => activeFilters.includes(site.kpiType))
      : filteredByGeo;

  const sortedSites = useMemo(
    () => [...filteredSites].sort((a, b) => b.severity - a.severity),
    [filteredSites]
  );
  const topSites = useMemo(() => sortedSites.slice(0, 10), [sortedSites]);

  const predictedSitesByImpact = useMemo(() => {
    const byId = Object.fromEntries(sitesData.map((s) => [s.geoId, s]));
    const result = {};
    Object.entries(PRESELECTED_TOP_SITES).forEach(([type, ids]) => {
      result[type] = ids.map((id) => byId[id]).filter(Boolean);
    });
    return result;
  }, []);

  // Determine the most common regions for each impact category
  const topRegionsByImpact = useMemo(() => {
    const countsByImpact = {};
    sitesData.forEach((s) => {
      const impact = s.kpiType;
      countsByImpact[impact] = countsByImpact[impact] || {};
      countsByImpact[impact][s.state] =
        (countsByImpact[impact][s.state] || 0) + 1;
    });
    const result = {};
    Object.entries(countsByImpact).forEach(([impact, counts]) => {
      result[impact] = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([state]) => state);
    });
    return result;
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 bw">AWSP AI Dashboard</h1>
      {taskMessage && (
        <div className="mb-4 text-sm text-blue-600 bw">{taskMessage}</div>
      )}
      {showGuide && <GuideBanner onClose={() => setShowGuide(false)} />}

      <TopImpactTiles impactRegions={topRegionsByImpact} />

      {/* State/Geo Filters */}
      <div className="mb-4 flex items-center space-x-2 bw">
        <label htmlFor="state" className="font-medium">
          Market/Geofence:
        </label>
        <select
          id="state"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border rounded px-2 py-1 text-sm bg-gray-200"
        >
          <option value="All">All</option>
          {STATES.map((s) => (
            <option key={s} value={s} title={`View ${s}`}>
              {s}
            </option>
          ))}
        </select>
        {geoOptions.length > 0 && (
          <>
            <label htmlFor="geo" className="ml-4 font-medium">
              Site:
            </label>
            <select
              id="geo"
              value={geoFilter}
              onChange={(e) => setGeoFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm bg-gray-200"
            >
              <option value="All">All</option>
              {geoOptions.map((g) => (
                <option key={g} value={g} title={`View ${g}`}>{g}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4 bw">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`btn px-4 py-2 ${
              activeTab === i
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      {(activeTab === 0 || activeTab === 3) && (
        <>
          <div className="flex flex-wrap gap-2 mb-4 bw">
            {IMPACT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleFilter(cat)}
                className={`btn ${
                  activeFilters.includes(cat)
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
                title={IMPACT_INFO[cat]}
              >
                {cat}
              </button>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="btn bg-black text-white hover:bg-gray-800"
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
              <MapView
                sites={filteredSites}
                onSelect={handleSiteSelect}
                selected={selectedSite}
                stateFilter={stateFilter}
              />
              </div>
              <div className="h-64 border rounded overflow-auto bw">
                <SiteDetails site={selectedSite} />
              </div>
            </div>
          </div>

          <div className="mt-4 bw">
            <button
              className="btn px-4 py-2 bg-black text-white disabled:opacity-50 hover:bg-gray-800"
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
          <SiteDetails site={selectedSite} />
          <AiInsights site={selectedSite} onApprove={handleTaskCreate} />
          {/* Map and trend graph for the selected site are shown within the
              "Predicted Top Sites" section to avoid duplication */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Predicted Top Sites by Impact Type</h2>
          <div className="space-y-3 mb-4">
            {Object.entries(predictedSitesByImpact).map(([type, sites]) => (
              <div key={type} className="space-y-2">
                <div className="mb-1 font-medium">{type}</div>
                <div className="flex flex-wrap gap-2">
                  {sites.map((s) => (
                    <button
                      key={s.geoId}
                      onClick={() => handleSiteSelect(s)}
                      className="btn text-white"
                      style={{ backgroundColor: IMPACT_COLORS[type] }}
                      title={`View ${s.geoId}`}
                    >
                      {s.geoId}
                    </button>
                  ))}
                </div>
                {selectedSite && sites.some((x) => x.geoId === selectedSite.geoId) && (
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="h-64 border rounded">
                      <MapView
                        sites={[selectedSite]}
                        onSelect={handleSiteSelect}
                        selected={selectedSite}
                        stateFilter={stateFilter}
                        zoomToSelected
                      />
                    </div>
                    <div className="col-span-2 h-64 border rounded">
                      <TrendGraph site={selectedSite} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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
