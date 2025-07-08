import React, { useState, useMemo, useEffect } from 'react';
import MapView from './components/MapView';
import KpiTable from './components/KpiTable';
import SiteDetails from './components/SiteDetails';
import AiInsights from './components/AiInsights';
import TrendGraph from './components/TrendGraph';
import TaskModal from './components/TaskModal';
import TaskList from './components/TaskList';
import GuideBanner from './components/GuideBanner';
import TopImpactPanels from './components/TopImpactPanels';
import IssueSummary from './pages/IssueSummary';
import UserInsights from './pages/UserInsights';
import EndToEndView from './pages/EndToEndView';
import sitesData from './data/sites.json';
import statesList from './data/states.json';
import ConversationalDashboard from './ConversationalDashboard.jsx';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';

const TABS = [
  'Live Map & KPI',
  'AI Insights',
  'Task List',
  'Conversational UI',
  'Issue Summary',
  'User Insights',
  'End-to-End View'
];
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

const DEFAULT_TILE_COLOR = '#cbd5e0';
const SELECTED_TILE_COLOR = '#4a5568';

const PRESELECTED_TOP_SITES = {
  'Top n Offenders': ['CHI003', 'OKL004', 'CHI008'],
  'Heavy Hitters': ['CHI013', 'DAL016', 'STL020'],
  'High Runners': ['DAL021', 'CHI023', 'OKL024'],
  'Micro/Macro Outage': ['DAL031', 'OKL039', 'DAL036'],
  'Broken Trends': ['TAM042', 'CHI043', 'OKL044'],
  'Sleepy Cells': ['OKL054', 'STL055', 'CHI053'],
};

const GRAYSCALE_SITES = [
  'CHI003',
  'OKL004',
  'CHI008',
  'CHI013',
  'DAL016',
  'STL020',
  'DAL021',
  'CHI023',
  'OKL024',
  'DAL031',
  'OKL039',
  'DAL036',
  'TAM042',
  'CHI043',
  'OKL044',
  'OKL054',
  'STL055',
  'CHI053',
];

const STATES = statesList;
const DEFAULT_STATE = STATES[0];

export default function App() {
  const [selectedSite, setSelectedSite] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  // Start on the Live Map tab by default
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
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedContext, setSelectedContext] = useState({
    market: null,
    site: null,
    enb: null,
    sector: null,
    carrier: null,
    siteObj: null, // full site object if needed
  });

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

  const handleSiteSelect = (siteObj) => {
    setSelectedContext({
      ...selectedContext,
      market: siteObj.state,
      site: siteObj.geoId,
      enb: siteObj.enodeb,
      siteObj,
    });
  };

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
    return sitesData.filter((s) => s.state === stateFilter).map((s) => s.geoId);
  }, [stateFilter]);

  const filteredByState =
    stateFilter === 'All' ? sites : sites.filter((s) => s.state === stateFilter);

  const filteredByGeo =
    geoFilter === 'All' ? filteredByState : filteredByState.filter((s) => s.geoId === geoFilter);

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


  // Helper to jump to a tab and set context
  const goToTabWithSite = (tabIdx, site) => {
    setSelectedSite(site);
    setActiveTab(tabIdx);
  };

  // Tab indices (adjust as per your TABS array)
  const TAB_AI_INSIGHTS = 1;
  const TAB_END_TO_END = 6;
  const TAB_CONVERSATIONAL = 3;

  useEffect(() => {
    const handleGotoAiInsights = (e) => {
      setSelectedSite(e.detail);
      setActiveTab(TAB_AI_INSIGHTS); // Make sure this is the correct tab index for AI Insights
    };
    const handleGotoEndToEnd = (e) => {
      setSelectedSite(e.detail);
      setActiveTab(TAB_END_TO_END); // Make sure this is the correct tab index for End-to-End View
    };
    window.addEventListener('gotoAiInsights', handleGotoAiInsights);
    window.addEventListener('gotoEndToEnd', handleGotoEndToEnd);
    return () => {
      window.removeEventListener('gotoAiInsights', handleGotoAiInsights);
      window.removeEventListener('gotoEndToEnd', handleGotoEndToEnd);
    };
  }, []);

  return (
    <>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 bw">AWSP AI Dashboard</h1>
      {taskMessage && (
        <div className="mb-4 text-sm text-blue-600 bw">{taskMessage}</div>
      )}
      {/* {showGuide && <GuideBanner onClose={() => setShowGuide(false)} />} */}

      {activeTab === 0 && <TopImpactPanels />}

      {/* Filters and Tabs */}
      <div className="mb-4 flex justify-between items-center bw">
        <div className="flex items-center space-x-2">
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
              <option key={s} value={s} title={`View ${s}`}> {s} </option>
            ))}
          </select>
          {geoOptions.length > 0 && (
            <>
              <label htmlFor="geo" className="ml-4 font-medium"> Site: </label>
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
        <div className="flex space-x-4">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`btn bg-transparent ${
                activeTab === i ? 'font-bold underline' : 'hover:underline'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      {activeTab === 0 && (
        <>
          <div className="flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap mb-4 bw">
            {IMPACT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleFilter(cat)}
                className={`btn rounded-full ${
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
                onSelect={(site) => setSelectedSite(site)} // Only select, don't switch tab
                selected={selectedSite}
                onCreateTask={(site) => {
                  setSelectedSite(site);
                  setShowTaskModal(true);
                }}
              />
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
                <SiteDetails
                  site={selectedSite}
                  onViewPath={() => {
                    setSelectedSite(selectedSite);
                    setActiveTab(TAB_END_TO_END);
                  }}
                  onAskAssistant={() => {
                    setSelectedSite(selectedSite);
                    setActiveTab(TAB_CONVERSATIONAL);
                  }}
                />
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

      {activeTab === TAB_AI_INSIGHTS && (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Predicted Top Sites by Impact Type</h2>
          <div className="space-y-3 mb-4">
            {Object.entries(predictedSitesByImpact).map(([type, sites]) => (
              <div key={type} className="space-y-2">
                <div className="mb-1 font-medium">{type}</div>
                <div className="flex flex-wrap gap-2">
                  {sites.map((s) => (
                    <button
                      key={s.geoId}
                      className={`border rounded px-2 py-1 text-xs ${
                        selectedSite && selectedSite.geoId === s.geoId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                      onClick={() => setSelectedSite(s)}
                    >
                      {s.geoId}
                    </button>
                  ))}
                </div>
                {selectedSite && sites.some((x) => x.geoId === selectedSite.geoId) && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="h-64 border rounded full-color">
                        <MapView
                          sites={[selectedSite]}
                          onSelect={setSelectedSite}
                          selected={selectedSite}
                          stateFilter={selectedSite.state}
                          zoomToSelected
                        />
                      </div>
                      <div className="col-span-2 h-64 border rounded">
                        <TrendGraph site={selectedSite} />
                      </div>
                    </div>
                    {/* Show AI Insights and below it the selected site table */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="h-64 border rounded overflow-auto">
                        <AiInsights
                          context={{ siteObj: selectedSite }}
                          onViewPath={() => setActiveTab(TAB_END_TO_END)}
                          onAskAssistant={() => setActiveTab(TAB_CONVERSATIONAL)}
                          onApprove={handleTaskCreate}
                        />
                      </div>
                      <div className="col-span-2 h-64 border rounded overflow-auto">
                        <SiteDetails
                          site={selectedSite}
                          onViewPath={() => setActiveTab(TAB_END_TO_END)}
                          onAskAssistant={() => setActiveTab(TAB_CONVERSATIONAL)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <TaskList tasks={tasks} onRemove={handleTaskRemove} />
      )}

      {activeTab === 3 && <ConversationalDashboard />}
      {activeTab === 4 && <IssueSummary />}
      {activeTab === 5 && <UserInsights />}
      {activeTab === 6 && <EndToEndView
        context={selectedContext}
        onAskAssistant={() => setActiveTab(TAB_CONVERSATIONAL)}
      />}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[60%] lg:w-[60%] bg-white z-[2000] border-l shadow-xl overflow-auto p-4 transform transition-transform duration-300 ${showDashboard ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
      >
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={() => setShowDashboard(false)}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <ConversationalDashboard />
      </div>

      <button
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg z-[1200] hover:bg-blue-700 transition" 
        onClick={() => setShowDashboard((prev) => !prev)}
        aria-label="Toggle network chat"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>
    </div>
    <button
      onClick={() => setShowAssistant(true)}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 z-40"
      title="Open Assistant"
    >
      <ChatBubbleLeftRightIcon className="w-6 h-6" />
    </button>
    {showAssistant && (
      <div className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-30 z-[1200]">
        <div className="bg-white w-full sm:max-w-md md:max-w-lg h-[80vh] shadow-xl relative m-4 rounded-lg">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
            onClick={() => setShowAssistant(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <ConversationalDashboard
            context={selectedContext}
            onSelectSite={handleSiteSelect}
          />
        </div>
      </div>
    )}
    </>
  );
}

