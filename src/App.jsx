import React, { useState, useMemo, useEffect } from 'react';
import MapView from './components/MapView';
import KpiTable from './components/KpiTable';
import SiteDetails from './components/SiteDetails';
import AiInsights from './components/AiInsights';
import KPICorrelation from './components/KPICorrelation';
import AIKPIDashboard from './components/AIKPIDashboard';
import AIInsightsEngineering from './components/AIInsightsEngineering';
import AIStatusHeader from './components/AIStatusHeader';
import TrendGraph from './components/TrendGraph';
import TaskModal from './components/TaskModal';
import TaskList from './components/TaskList';
import AITaskDashboard from './components/AITaskDashboard';
import GuideBanner from './components/GuideBanner';
import TopImpactPanels from './components/TopImpactPanels';
import { ToasterProvider } from './components/Toaster';
import IssueSummary from './pages/IssueSummary';
import UserInsights from './pages/UserInsights';
import EndToEndView from './pages/EndToEndView';
import sitesData from './data/sites.json';
import statesList from './data/states.json';
import ConversationalUI from './components/ConversationalUI';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';

const TABS = [
  'Live Map & KPI',
  'AI Insights',
  'KPI Correlation',
  'AI Task Intelligence',
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
  // New state for TopImpactPanels filtering
  const [selectedMarketFromPanels, setSelectedMarketFromPanels] = useState(null);
  const [selectedKpiCategory, setSelectedKpiCategory] = useState(null);
  const [sites, setSites] = useState(sitesData);
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      // Add some sample AI-generated tasks if no tasks exist
      if (storedTasks.length === 0) {
        return [
          {
            id: Date.now() + 1,
            title: 'Optimize DAL001 antenna tilt for capacity improvement',
            description: 'AI detected suboptimal antenna configuration causing 15% throughput reduction',
            siteId: 'DAL001',
            priority: 'critical',
            status: 'pending',
            assignee: 'RF Engineering Team',
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: Date.now() + 2,
            title: 'Preemptive load balancing for TAM042 predicted congestion',
            description: 'ML model predicts 40% traffic surge in next 2 hours based on event patterns',
            siteId: 'TAM042',
            priority: 'high',
            status: 'in-progress',
            assignee: 'Network Operations',
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: Date.now() + 3,
            title: 'Auto-remediate CHI023 interference pattern',
            description: 'AI identified recurring interference source, implementing automated mitigation',
            siteId: 'CHI023',
            priority: 'medium',
            status: 'completed',
            assignee: 'AI Automation System',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            dueDate: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            id: Date.now() + 4,
            title: 'Capacity expansion analysis for STL020 market growth',
            description: 'Data analytics suggest need for additional carriers based on subscriber growth trends',
            siteId: 'STL020',
            priority: 'low',
            status: 'pending',
            assignee: 'Capacity Planning',
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
          }
        ];
      }
      return storedTasks;
    } catch {
      return [];
    }
  });
  const [taskMessage, setTaskMessage] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
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
    setSelectedSite(siteObj); // Add this line to fix site selection
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

  // Handlers for TopImpactPanels market and KPI category selection
  const handleMarketSelectFromPanels = (market) => {
    setSelectedMarketFromPanels(market);
    if (market) {
      setStateFilter(market); // Also update the main state filter
    }
  };

  const handleKpiCategorySelect = (category) => {
    setSelectedKpiCategory(category);
    // Clear existing filters and set the new category filter
    if (category) {
      const mappedCategory = mapKpiCategoryToFilter(category);
      setActiveFilters([mappedCategory]);
    } else {
      setActiveFilters([]);
    }
  };

  // Map KPI category names from TopImpactPanels to filter names
  const mapKpiCategoryToFilter = (category) => {
    const mapping = {
      'Sleepy Cells': 'Sleepy Cells',
      'Broken Trends': 'Broken Trends', 
      'High Runners': 'High Runners',
      'Heavy Hitters': 'Heavy Hitters',
      'Top n Offenders': 'Top n Offenders',
      'Micro/Macro': 'Micro/Macro Outage'
    };
    return mapping[category] || category;
  };

  // Handle filter changes from AIKPIDashboard
  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
    // If filters are cleared, also clear the selected category
    if (newFilters.length === 0) {
      setSelectedKpiCategory(null);
    }
  };

  // Clear TopImpactPanels selection when state filter is manually changed
  useEffect(() => {
    if (stateFilter !== selectedMarketFromPanels && selectedMarketFromPanels) {
      setSelectedMarketFromPanels(null);
      setSelectedKpiCategory(null);
    }
  }, [stateFilter, selectedMarketFromPanels]);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
    // Clear TopImpactPanels selection if manually toggling filters
    setSelectedKpiCategory(null);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSelectedKpiCategory(null);
  };

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
  const TAB_KPI_CORRELATION = 2;
  const TAB_END_TO_END = 7;
  const TAB_CONVERSATIONAL = 4;

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
    <ToasterProvider>
      <div className="p-4 bg-neutral min-h-screen">
      {/* AI Status Header */}
      <AIStatusHeader 
        sitesCount={sites.length}
        alertsCount={sites.filter(s => s.severity > 3).length}
        activeInsights={12}
      />
      
      {taskMessage && (
        <div className="mb-4 text-sm text-secondary bw">{taskMessage}</div>
      )}
      {/* {showGuide && <GuideBanner onClose={() => setShowGuide(false)} />} */}

      {activeTab === 0 && (
        <TopImpactPanels 
          onMarketSelect={handleMarketSelectFromPanels}
          onKpiCategorySelect={handleKpiCategorySelect}
          selectedMarket={selectedMarketFromPanels}
          selectedCategory={selectedKpiCategory}
          filteredSitesCount={filteredSites.length}
        />
      )}

      {/* Filters and Tabs */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="state" className="font-medium text-base-content">
            Market/Geofence:
          </label>
          <select
            id="state"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="border border-base-content rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
          >
            <option value="All">All Markets</option>
            {STATES.map((s) => (
              <option key={s} value={s} title={`View ${s}`}> {s} </option>
            ))}
          </select>
          {geoOptions.length > 0 && (
            <>
              <label htmlFor="geo" className="ml-4 font-medium text-base-content"> Site: </label>
              <select
                id="geo"
                value={geoFilter}
                onChange={(e) => setGeoFilter(e.target.value)}
                className="border border-base-content rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
              >
                <option value="All">All Sites</option>
                {geoOptions.map((g) => (
                  <option key={g} value={g} title={`View ${g}`}>{g}</option>
                ))}
              </select>
            </>
          )}
        </div>
        
        {/* Enhanced Tab Navigation */}
        <div className="flex space-x-1 bg-base-content p-1 rounded-lg">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === i
                  ? 'bg-primary text-white shadow-md'
                  : 'text-neutral hover:text-white hover:bg-secondary'
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
          {/* AI-Native KPI Dashboard */}
          <AIKPIDashboard
            sites={filteredSites}
            selectedSite={selectedSite}
            onSiteSelect={handleSiteSelect}
            onCreateTask={(site, action) => {
              setSelectedSite(site);
              setTaskMessage(`Task created: ${action}`);
              const newTask = {
                id: Date.now(),
                title: action,
                description: `AI-recommended action for site ${site.geoId}`,
                siteId: site.geoId,
                priority: site.severity > 3 ? 'high' : 'medium',
                status: 'pending',
                assignee: 'RF Engineer',
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
              };
              setTasks(prev => [newTask, ...prev]);
            }}
            stateFilter={stateFilter}
            externalActiveFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            onViewPath={(site) => {
              setSelectedSite(site);
              setActiveTab(TAB_END_TO_END);
            }}
            onAskAssistant={(site) => {
              setSelectedSite(site);
              setActiveTab(TAB_CONVERSATIONAL);
            }}
          />

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
        <AIInsightsEngineering
          sites={filteredSites}
          selectedSite={selectedSite}
          onSiteSelect={handleSiteSelect}
          onCreateTask={(site, action) => {
            if (site.geoId === 'MARKET') {
              setTaskMessage(`Market-level AI task created: ${action}`);
            } else {
              setSelectedSite(site);
              setTaskMessage(`AI optimization task created: ${action}`);
            }
            const newTask = {
              id: Date.now(),
              title: action,
              description: site.geoId === 'MARKET' 
                ? `Market-level AI action for ${stateFilter}: ${action}`
                : `AI-driven optimization for site ${site.geoId}: ${action}`,
              siteId: site.geoId,
              priority: 'high',
              status: 'in-progress', // Start in progress for AI workflows
              assignee: 'RF Engineering Team',
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
              aiWorkflow: true,
              workflowType: action.toLowerCase().includes('execute') ? 'execute' : 
                           action.toLowerCase().includes('auto') ? 'auto' :
                           action.toLowerCase().includes('prevent') ? 'prevent' : 'optimization'
            };
            setTasks(prev => [newTask, ...prev]);
          }}
          stateFilter={stateFilter}
          onViewPath={(site) => {
            setSelectedSite(site);
            setActiveTab(TAB_END_TO_END);
          }}
          onAskAssistant={(site) => {
            setSelectedSite(site);
            setActiveTab(TAB_CONVERSATIONAL);
          }}
          predictedSitesByImpact={predictedSitesByImpact}
        />
      )}

      {activeTab === 2 && (
        <KPICorrelation 
          context={{ siteObj: selectedSite }}
          onCreateTask={handleTaskCreate}
        />
      )}

      {activeTab === 3 && (
        <AITaskDashboard 
          tasks={tasks} 
          onRemove={handleTaskRemove}
          onUpdateTask={(taskId, updates) => {
            setTasks(prev => prev.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            ));
          }}
          onAddTask={(newTask) => {
            setTasks(prev => [newTask, ...prev]);
          }}
          stateFilter={stateFilter}
        />
      )}

      {activeTab === 4 && (
        <ConversationalUI
          context={selectedContext}
          onSelectSite={handleSiteSelect}
        />
      )}
      {activeTab === 5 && <IssueSummary />}
      {activeTab === 6 && <UserInsights />}
      {activeTab === 7 && <EndToEndView
        context={selectedContext}
        onAskAssistant={() => setActiveTab(TAB_CONVERSATIONAL)}
      />}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[60%] lg:w-[60%] bg-white z-[2000] border-l-2 border-primary shadow-2xl overflow-auto transform transition-all duration-300 ease-in-out ${showDashboard ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
      >
        <ConversationalUI
          context={selectedContext}
          onSelectSite={handleSiteSelect}
          onClose={() => setShowDashboard(false)}
        />
      </div>

      {/* Single chat button */}
      {!showDashboard && (
        <button
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-primary to-red-700 text-white rounded-full shadow-xl z-[1200] hover:from-red-700 hover:to-primary transition-all duration-300 hover:scale-110 hover:shadow-2xl group" 
          onClick={() => setShowDashboard(true)}
          aria-label="Open Network AI Assistant"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
        </button>
      )}
    </div>
    </ToasterProvider>
  );
}

