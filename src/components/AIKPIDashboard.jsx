import React, { useState, useMemo, useEffect } from 'react';
import MapView from './MapView';
import MapLegend from './MapLegend';
import KpiTable from './KpiTable';
import AiInsights from './AiInsights';
import TaskModal from './TaskModal';
import SiteDetails from './SiteDetails';
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const IMPACT_CATEGORIES = [
  'Top n Offenders',
  'Heavy Hitters',
  'High Runners',
  'Micro/Macro Outage',
  'Broken Trends',
  'Sleepy Cells'
];

const AIKPIDashboard = ({ 
  sites, 
  selectedSite, 
  onSiteSelect, 
  onCreateTask, 
  stateFilter,
  onViewPath,
  onAskAssistant,
  externalActiveFilters = [], // New prop for filters from TopImpactPanels
  onFiltersChange // Callback to sync filters back to parent
}) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskAction, setTaskAction] = useState('');
  const [activeFilters, setActiveFilters] = useState(externalActiveFilters);

  // Sync with external filters
  useEffect(() => {
    setActiveFilters(externalActiveFilters);
  }, [externalActiveFilters]);

  // Toggle filter function
  const toggleFilter = (filter) => {
    const newFilters = activeFilters.includes(filter) 
      ? activeFilters.filter((f) => f !== filter) 
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    if (onFiltersChange) {
      onFiltersChange([]);
    }
  };

  // Filter sites based on active filters
  const filteredSites = useMemo(() => {
    if (activeFilters.length === 0) {
      return sites;
    }
    return sites.filter((site) => activeFilters.includes(site.kpiType));
  }, [sites, activeFilters]);

  // Get top 10 sites by severity for the table
  const topSites = useMemo(() => {
    return [...filteredSites].sort((a, b) => b.severity - a.severity).slice(0, 10);
  }, [filteredSites]);

  // Handle site selection from table or map
  const handleSiteSelection = (site) => {
    onSiteSelect(site);
  };

  // Handle task creation from recommendations
  const handleCreateTaskFromRecommendation = (recommendation) => {
    setTaskAction(recommendation);
    setShowTaskModal(true);
  };

  // Handle custom task creation
  const handleCreateCustomTask = () => {
    setTaskAction('');
    setShowTaskModal(true);
  };

  // Handle task modal submission
  const handleTaskCreate = (task) => {
    onCreateTask(selectedSite, taskAction || task.title);
    setShowTaskModal(false);
    setTaskAction('');
  };

  // Mock AI data for the selected site
  const generateAIInsights = (site) => {
    if (!site) return null;

    return {
      insights: [
        `Site ${site.geoId} showing ${site.kpiType} degradation with severity ${site.severity}/5`,
        `Traffic pattern indicates ${Math.random() > 0.5 ? 'congestion' : 'interference'} issues`,
        `Performance trending ${site.value > 75 ? 'downward' : 'stable'} over last 24h`,
        `Predicted impact: ${Math.random() > 0.5 ? 'High' : 'Medium'} subscriber experience degradation`
      ],
      recommendations: [
        'Adjust antenna tilt by 2-3 degrees',
        'Increase power by 1-2 dB on affected sectors',
        'Schedule preventive maintenance within 48h',
        'Monitor neighboring sites for handover optimization'
      ],
      impactMetrics: {
        usersAffected: Math.floor(Math.random() * 5000) + 1000,
        avgCQI: (Math.random() * 5 + 10).toFixed(1), // CQI typically ranges 0-15, showing 10-15 range
        handoverSuccessRate: (Math.random() * 5 + 95).toFixed(1), // 95-100% range
        bearerDropRate: (Math.random() * 2.5).toFixed(2), // 0-2.5% range
        sipRate: (Math.random() * 0.5 + 0.1).toFixed(2) // 0.1-0.6% range
      },
      earlyWarnings: [
        {
          type: 'Performance Decline',
          risk: site.severity > 3 ? 'High' : 'Medium',
          timeframe: '24-48h',
          description: 'KPI degradation trend detected'
        },
        {
          type: 'Capacity Issue',
          risk: 'Medium',
          timeframe: '72h',
          description: 'Traffic growth exceeding threshold'
        }
      ]
    };
  };

  const aiData = generateAIInsights(selectedSite);

  return (
    <div className="space-y-6">
      {/* Always visible: Map and KPI Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KPI Table */}
        <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
          <div className="p-4 border-b border-verizon-black">
            <h3 className="text-lg font-semibold text-verizon-black">Top KPI Issues</h3>
            <p className="text-sm text-gray-600 mb-3">
              {activeFilters.length > 0 
                ? `Filtered results (${topSites.length} of ${filteredSites.length} sites)` 
                : 'Sites with highest severity scores'
              }
            </p>
            
            {/* KPI Category Filters */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-4 w-4 text-verizon-black" />
                  <span className="text-sm font-medium text-verizon-black">Filter by Category:</span>
                </div>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-verizon-blue hover:text-verizon-red underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {IMPACT_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleFilter(category)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 border ${
                      activeFilters.includes(category)
                        ? 'bg-verizon-red text-white border-verizon-red'
                        : 'bg-white text-verizon-black border-verizon-black hover:bg-verizon-concrete'
                    }`}
                  >
                    {category.replace('Micro/Macro Outage', 'Outage')}
                    {activeFilters.includes(category) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <KpiTable
            sites={topSites}
            onSelect={handleSiteSelection}
            selected={selectedSite}
          />
        </div>

        {/* Map View */}
        <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
          <div className="p-4 border-b border-verizon-black">
            <h3 className="text-lg font-semibold text-verizon-black">Live Network Map</h3>
            <p className="text-sm text-gray-600">Select sites for AI analysis</p>
          </div>
          <div className="p-4">
            <div style={{ height: '380px', width: '100%' }} className="mb-4">
              <MapView
                sites={filteredSites}
                onSelect={handleSiteSelection}
                selected={selectedSite}
                stateFilter={stateFilter}
                zoomToSelected={true}
              />
            </div>
            {/* Map Legend */}
            <div className="mt-4">
              <MapLegend hasSelectedSite={!!selectedSite} />
            </div>
          </div>
        </div>
      </div>

      {/* Site Details (when a site is selected) */}
      {selectedSite && (
        <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
          <SiteDetails 
            site={selectedSite}
            onViewPath={onViewPath}
            onAskAssistant={onAskAssistant}
          />
        </div>
      )}

      {/* Conditional: AI Panels (only after site selection) */}
      {selectedSite && (
        <>
          {/* AI Panels Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* AI Insights Panel */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black bg-gradient-to-r from-verizon-concrete to-gray-100">
                <div className="flex items-center space-x-2">
                  <LightBulbIcon className="h-6 w-6 text-verizon-blue" />
                  <h3 className="text-lg font-semibold text-verizon-black">AI Insights</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Site: {selectedSite.geoId}</p>
              </div>
              <div className="p-4 space-y-3">
                {aiData?.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-verizon-blue rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations Panel */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black bg-gradient-to-r from-verizon-concrete to-gray-100">
                <div className="flex items-center space-x-2">
                  <ArrowPathIcon className="h-6 w-6 text-verizon-blue" />
                  <h3 className="text-lg font-semibold text-verizon-black">AI Recommendations</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Automated resolution steps</p>
              </div>
              <div className="p-4 space-y-3">
                {aiData?.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-verizon-blue text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{rec}</p>
                      <button 
                        onClick={() => handleCreateTaskFromRecommendation(rec)}
                        className="text-xs text-verizon-blue hover:text-verizon-red mt-1 hover:underline"
                      >
                        Create Task
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Custom Task Button */}
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={handleCreateCustomTask}
                    className="flex items-center space-x-2 w-full px-3 py-2 bg-verizon-concrete text-verizon-black rounded-md hover:bg-gray-300 transition-colors text-sm border border-verizon-black"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Custom Task</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Impact Tracking Panel */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black bg-gradient-to-r from-verizon-concrete to-gray-100">
                <div className="flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-verizon-red" />
                  <h3 className="text-lg font-semibold text-verizon-black">Impact Tracking</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">RF performance metrics</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-verizon-blue">
                      {aiData?.impactMetrics.usersAffected?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Users Affected in Market</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-verizon-blue">
                      {aiData?.impactMetrics.avgCQI}
                    </div>
                    <div className="text-xs text-gray-600">Avg CQI</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-verizon-blue">
                      {aiData?.impactMetrics.handoverSuccessRate}%
                    </div>
                    <div className="text-xs text-gray-600">Handover Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-verizon-red">
                      {aiData?.impactMetrics.bearerDropRate}%
                    </div>
                    <div className="text-xs text-gray-600">Bearer Drop Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-verizon-red">
                      {aiData?.impactMetrics.sipRate}%
                    </div>
                    <div className="text-xs text-gray-600">SIP Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Early Warning Alerts Panel */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black bg-gradient-to-r from-verizon-concrete to-gray-100">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-6 w-6 text-verizon-red" />
                  <h3 className="text-lg font-semibold text-verizon-black">Early Warning Alerts</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Predictive issue detection</p>
              </div>
              <div className="p-4 space-y-3">
                {aiData?.earlyWarnings.map((warning, index) => (
                  <div key={index} className="border-l-4 border-verizon-red pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-verizon-black">{warning.type}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        warning.risk === 'High' 
                          ? 'bg-verizon-red text-white' 
                          : 'bg-verizon-blue text-white'
                      }`}>
                        {warning.risk} Risk
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{warning.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Timeframe: {warning.timeframe}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Help text when no site selected */}
      {!selectedSite && (
        <div className="text-center py-8 bg-verizon-concrete border border-verizon-black rounded-lg">
          <div className="mx-auto w-12 h-12 bg-verizon-blue rounded-full flex items-center justify-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-verizon-black mb-2">Select a Site for AI Analysis</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Click on any site in the table or map above to view AI-powered insights, recommendations, 
            impact tracking, and early warning alerts.
          </p>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedSite && (
        <TaskModal
          site={selectedSite}
          onClose={() => {
            setShowTaskModal(false);
            setTaskAction('');
          }}
          onCreate={handleTaskCreate}
          initialTitle={taskAction}
        />
      )}
    </div>
  );
};

export default AIKPIDashboard;
