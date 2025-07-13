import React, { useState, useMemo, useEffect } from 'react';
import MapView from './MapView';
import SiteDetails from './SiteDetails';
import TrendGraph from './TrendGraph';
import ActionModal from './ActionModal';
import { useToaster } from './Toaster';
import { 
  CpuChipIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  BeakerIcon,
  ClockIcon,
  EyeIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  AdjustmentsHorizontalIcon,
  SignalIcon,
  RadioIcon,
  CogIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const RF_INSIGHTS_ENGINE = {
  analyzeMarket: (sites, market) => {
    const marketSites = sites.filter(s => s.state === market);
    const totalSites = marketSites.length;
    const degradedSites = marketSites.filter(s => s.severity >= 3).length;
    const criticalSites = marketSites.filter(s => s.severity >= 4).length;
    
    // Calculate market-level KPIs
    const avgRSRP = marketSites.reduce((sum, s) => sum + (s.kpi.includes('RSRP') ? s.value : -95), 0) / totalSites;
    const avgThroughput = Math.random() * 50 + 100; // Simulated throughput
    const handoverSuccessRate = 97.5 - (degradedSites / totalSites) * 5;
    const capacityUtilization = 65 + (degradedSites / totalSites) * 20;
    
    return {
      marketHealth: {
        score: Math.max(0, 100 - (degradedSites / totalSites) * 100),
        trend: degradedSites > totalSites * 0.1 ? 'declining' : 'stable',
        totalSites,
        degradedSites,
        criticalSites
      },
      rfMetrics: {
        avgRSRP: avgRSRP.toFixed(1),
        avgRSRQ: (-8.5 - Math.random() * 3).toFixed(1),
        handoverSuccessRate: handoverSuccessRate.toFixed(1),
        capacityUtilization: capacityUtilization.toFixed(1),
        interferenceLevel: (Math.random() * 15 + 5).toFixed(1)
      },
      predictions: {
        nextHour: {
          degradationRisk: degradedSites > 5 ? 'High' : 'Low',
          expectedOutages: Math.floor(degradedSites * 0.1),
          trafficGrowth: (Math.random() * 10 + 5).toFixed(1)
        },
        next24Hours: {
          capacityAlert: capacityUtilization > 80,
          maintenanceRequired: criticalSites,
          performanceImpact: degradedSites > 10 ? 'Significant' : 'Minimal'
        }
      },
      aiRecommendations: [
        {
          priority: 'Critical',
          action: 'Immediate antenna optimization for 3 sites',
          impact: '15-20% performance improvement',
          timeframe: '2-4 hours',
          confidence: 94,
          type: 'RF Optimization'
        },
        {
          priority: 'High',
          action: 'Load balancing adjustment across sector',
          impact: '8-12% capacity increase',
          timeframe: '30 minutes',
          confidence: 87,
          type: 'Capacity Management'
        },
        {
          priority: 'Medium',
          action: 'Neighbor list optimization for handovers',
          impact: '5-8% improvement in success rate',
          timeframe: '1-2 hours',
          confidence: 82,
          type: 'Mobility Optimization'
        }
      ]
    };
  },

  analyzeSite: (site) => {
    if (!site) return null;
    
    return {
      rfPerformance: {
        rsrp: { value: site.value, threshold: -95, status: site.value > -95 ? 'Good' : 'Poor' },
        rsrq: { value: -8.5, threshold: -10, status: 'Good' },
        sinr: { value: 15.2, threshold: 10, status: 'Good' },
        pci: { value: 184, conflicts: 0, status: 'Clean' }
      },
      trafficAnalysis: {
        currentLoad: Math.floor(Math.random() * 40) + 60,
        peakLoad: Math.floor(Math.random() * 20) + 85,
        userCount: Math.floor(Math.random() * 200) + 150,
        dataVolume: (Math.random() * 50 + 100).toFixed(1)
      },
      interferenceMap: {
        interSiteIC: (Math.random() * 10).toFixed(1),
        intraSiteIC: (Math.random() * 5).toFixed(1),
        externalNoise: (Math.random() * 15 + 5).toFixed(1),
        mitigationActions: Math.floor(Math.random() * 3)
      },
      predictiveInsights: [
        {
          type: 'Performance Degradation',
          probability: 73,
          timeframe: '4-6 hours',
          rootCause: 'Increasing interference from neighboring cell',
          impact: 'Medium'
        },
        {
          type: 'Capacity Overload',
          probability: 45,
          timeframe: '24 hours',
          rootCause: 'Traffic growth exceeding current capacity',
          impact: 'High'
        }
      ],
      automationOpportunities: [
        { action: 'Auto-tilt adjustment', confidence: 89, impact: 'Immediate' },
        { action: 'Power optimization', confidence: 76, impact: 'Short-term' },
        { action: 'Frequency refarming', confidence: 82, impact: 'Long-term' }
      ]
    };
  }
};

const AIInsightsEngineering = ({ 
  sites, 
  selectedSite, 
  onSiteSelect, 
  onCreateTask, 
  stateFilter,
  onViewPath,
  onAskAssistant,
  predictedSitesByImpact 
}) => {
  const [analysisMode, setAnalysisMode] = useState('market'); // 'market' or 'site'
  const [selectedCategory, setSelectedCategory] = useState('Top n Offenders');
  const [aiProcessing, setAiProcessing] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  
  // Modal and Toast state
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: '',
    actionType: 'optimization',
    site: null
  });
  
  const { showToast } = useToaster();

  // Open action modal
  const openActionModal = (action, actionType = 'optimization', site = null) => {
    setActionModal({
      isOpen: true,
      action,
      actionType,
      site
    });
  };

  // Close action modal
  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      action: '',
      actionType: 'optimization',
      site: null
    });
  };

  // Execute action with toaster notification
  const executeAction = (actionDetails) => {
    // Show processing toast
    showToast.processing(
      '🔄 Executing AI Action',
      'Sending command to downstream systems via Agentic workflow...',
      { action: actionDetails.action, status: 'processing' }
    );

    // Simulate downstream execution delay
    setTimeout(() => {
      showToast.success(
        '✅ Action Executed Successfully',
        'Command has been executed in downstream system using Agentic workflow',
        actionDetails
      );

      // Also create a task if the original handler exists
      if (onCreateTask) {
        onCreateTask(actionDetails.site || { geoId: 'MARKET' }, actionDetails.action);
      }
    }, 2000);
  };

  // Get market analysis
  const marketAnalysis = useMemo(() => {
    if (stateFilter === 'All') return null;
    return RF_INSIGHTS_ENGINE.analyzeMarket(sites, stateFilter);
  }, [sites, stateFilter]);

  // Get site analysis
  const siteAnalysis = useMemo(() => {
    return RF_INSIGHTS_ENGINE.analyzeSite(selectedSite);
  }, [selectedSite]);

  // Filter sites by category
  const categorySites = useMemo(() => {
    return predictedSitesByImpact[selectedCategory] || [];
  }, [predictedSitesByImpact, selectedCategory]);

  // Market-level KPI summary
  const marketKPIs = useMemo(() => {
    if (!marketAnalysis) return null;
    
    return [
      { label: 'Market Health Score', value: `${marketAnalysis.marketHealth.score.toFixed(0)}%`, status: marketAnalysis.marketHealth.score > 80 ? 'good' : 'warning' },
      { label: 'Avg RSRP', value: `${marketAnalysis.rfMetrics.avgRSRP} dBm`, status: marketAnalysis.rfMetrics.avgRSRP > -95 ? 'good' : 'poor' },
      { label: 'HO Success Rate', value: `${marketAnalysis.rfMetrics.handoverSuccessRate}%`, status: marketAnalysis.rfMetrics.handoverSuccessRate > 95 ? 'good' : 'warning' },
      { label: 'Capacity Utilization', value: `${marketAnalysis.rfMetrics.capacityUtilization}%`, status: marketAnalysis.rfMetrics.capacityUtilization < 80 ? 'good' : 'warning' }
    ];
  }, [marketAnalysis]);

  useEffect(() => {
    if (selectedSite) {
      setAnalysisMode('site');
    } else if (stateFilter !== 'All') {
      setAnalysisMode('market');
    }
  }, [selectedSite, stateFilter]);

  return (
    <div className="space-y-6">
      {/* Analysis Mode Selector */}
      <div className="flex space-x-1 bg-verizon-black p-1 rounded-lg">
        <button
          onClick={() => setAnalysisMode('market')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            analysisMode === 'market'
              ? 'bg-verizon-red text-white'
              : 'text-verizon-concrete hover:bg-verizon-blue'
          }`}
        >
          Market-Level Analysis
        </button>
        <button
          onClick={() => setAnalysisMode('site')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            analysisMode === 'site'
              ? 'bg-verizon-red text-white'
              : 'text-verizon-concrete hover:bg-verizon-blue'
          }`}
          disabled={!selectedSite}
        >
          Site-Level Deep Dive
        </button>
      </div>

      {/* Market Analysis View */}
      {analysisMode === 'market' && marketAnalysis && (
        <>
          {/* Market KPI Dashboard */}
          <div className="grid grid-cols-4 gap-4">
            {marketKPIs.map((kpi, index) => (
              <div key={index} className="bg-white border border-verizon-black rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">{kpi.label}</div>
                    <div className="text-2xl font-bold text-verizon-black">{kpi.value}</div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    kpi.status === 'good' ? 'bg-green-500' :
                    kpi.status === 'warning' ? 'bg-orange-500' : 'bg-verizon-red'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Intelligence Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Market Health & Predictions */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black">
                <h3 className="text-lg font-semibold text-verizon-black flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-verizon-blue" />
                  Market Health Intelligence
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-verizon-blue">{marketAnalysis.marketHealth.totalSites}</div>
                    <div className="text-xs text-gray-600">Total Sites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-verizon-red">{marketAnalysis.marketHealth.degradedSites}</div>
                    <div className="text-xs text-gray-600">Degraded Sites</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-verizon-black">Next Hour Predictions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Degradation Risk</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        marketAnalysis.predictions.nextHour.degradationRisk === 'High' 
                          ? 'bg-verizon-red text-white' : 'bg-green-100 text-green-800'
                      }`}>
                        {marketAnalysis.predictions.nextHour.degradationRisk}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expected Outages</span>
                      <span className="text-sm font-medium">{marketAnalysis.predictions.nextHour.expectedOutages}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Traffic Growth</span>
                      <span className="text-sm font-medium">+{marketAnalysis.predictions.nextHour.trafficGrowth}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Proactive Actions */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-semibold text-verizon-black mb-2">Proactive Measures</h4>
                  <div className="space-y-2">
                    {marketAnalysis.predictions.nextHour.degradationRisk === 'High' && (
                      <button 
                        onClick={() => openActionModal('Enable Load Balancing across degraded sites', 'automation', null)}
                        className="w-full px-3 py-2 bg-verizon-blue text-white text-xs rounded hover:bg-blue-700 text-left"
                      >
                        🔄 Enable Auto Load Balancing
                      </button>
                    )}
                    {marketAnalysis.predictions.nextHour.expectedOutages > 0 && (
                      <button 
                        onClick={() => openActionModal('Pre-position maintenance teams for predicted outages', 'emergency', null)}
                        className="w-full px-3 py-2 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 text-left"
                      >
                        🚨 Pre-position Teams
                      </button>
                    )}
                    {marketAnalysis.predictions.nextHour.trafficGrowth > 5 && (
                      <button 
                        onClick={() => openActionModal('Scale capacity for predicted traffic surge', 'optimization', null)}
                        className="w-full px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 text-left"
                      >
                        📈 Scale Capacity
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Sites Map */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black">
                <h3 className="text-lg font-semibold text-verizon-black flex items-center">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-verizon-red" />
                  Problem Sites Analysis
                </h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(predictedSitesByImpact).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-2 py-1 rounded text-xs ${
                          selectedCategory === category
                            ? 'bg-verizon-red text-white'
                            : 'bg-gray-100 text-verizon-black hover:bg-verizon-concrete'
                        }`}
                      >
                        {category.replace(' ', '').substring(0, 8)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {categorySites.map((site) => (
                    <button
                      key={site.geoId}
                      onClick={() => onSiteSelect(site)}
                      className={`w-full p-2 text-left rounded border transition-all ${
                        selectedSite?.geoId === site.geoId
                          ? 'bg-verizon-red text-white border-verizon-red'
                          : 'bg-white border-gray-300 hover:bg-verizon-concrete'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{site.geoId}</span>
                        <span className="text-xs">Sev: {site.severity}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedSite && (
                  <div className="h-32 border border-verizon-black rounded">
                    <MapView
                      sites={[selectedSite]}
                      onSelect={onSiteSelect}
                      selected={selectedSite}
                      stateFilter={selectedSite.state}
                      zoomToSelected
                    />
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black">
                <h3 className="text-lg font-semibold text-verizon-black flex items-center">
                  <CogIcon className="w-5 h-5 mr-2 text-verizon-blue" />
                  AI Optimization Actions
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {marketAnalysis.aiRecommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'Critical' ? 'bg-verizon-red text-white' :
                          rec.priority === 'High' ? 'bg-orange-500 text-white' :
                          'bg-verizon-blue text-white'
                        }`}>
                          {rec.priority}
                        </span>
                        <span className="text-xs text-gray-500">{rec.type}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-sm text-verizon-black mb-1">{rec.action}</h4>
                    <p className="text-xs text-gray-600 mb-2">{rec.impact}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">⏱️ {rec.timeframe}</span>
                      <button 
                        onClick={() => openActionModal(rec.action, 'optimization', null)}
                        className="px-3 py-1 bg-verizon-red text-white text-xs rounded hover:bg-red-700"
                      >
                        Execute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Site Analysis View */}
      {analysisMode === 'site' && selectedSite && siteAnalysis && (
        <>
          {/* Site Performance Dashboard */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-verizon-black rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">RSRP Signal</div>
                  <div className="text-2xl font-bold text-verizon-black">{siteAnalysis.rfPerformance.rsrp.value} dBm</div>
                </div>
                <SignalIcon className={`w-6 h-6 ${siteAnalysis.rfPerformance.rsrp.status === 'Good' ? 'text-green-500' : 'text-verizon-red'}`} />
              </div>
            </div>
            
            <div className="bg-white border border-verizon-black rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Current Load</div>
                  <div className="text-2xl font-bold text-verizon-black">{siteAnalysis.trafficAnalysis.currentLoad}%</div>
                </div>
                <ChartBarIcon className={`w-6 h-6 ${siteAnalysis.trafficAnalysis.currentLoad < 80 ? 'text-green-500' : 'text-verizon-red'}`} />
              </div>
            </div>
            
            <div className="bg-white border border-verizon-black rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">User Count</div>
                  <div className="text-2xl font-bold text-verizon-black">{siteAnalysis.trafficAnalysis.userCount}</div>
                </div>
                <EyeIcon className="w-6 h-6 text-verizon-blue" />
              </div>
            </div>
            
            <div className="bg-white border border-verizon-black rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Interference</div>
                  <div className="text-2xl font-bold text-verizon-black">{siteAnalysis.interferenceMap.interSiteIC}%</div>
                </div>
                <ExclamationTriangleIcon className={`w-6 h-6 ${parseFloat(siteAnalysis.interferenceMap.interSiteIC) < 5 ? 'text-green-500' : 'text-verizon-red'}`} />
              </div>
            </div>
          </div>

          {/* Site Deep Dive Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* RF Performance Details */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black">
                <h3 className="text-lg font-semibold text-verizon-black flex items-center">
                  <RadioIcon className="w-5 h-5 mr-2 text-verizon-blue" />
                  RF Performance Analysis
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {Object.entries(siteAnalysis.rfPerformance).map(([metric, data]) => (
                  <div key={metric} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{metric.toUpperCase()}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{data.value}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        data.status === 'Good' ? 'bg-green-500' : 
                        data.status === 'Clean' ? 'bg-verizon-blue' : 'bg-verizon-red'
                      }`}></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-3 bg-verizon-concrete rounded">
                  <h4 className="font-semibold text-verizon-black mb-2">Interference Analysis</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Inter-site IC:</span>
                      <span>{siteAnalysis.interferenceMap.interSiteIC}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intra-site IC:</span>
                      <span>{siteAnalysis.interferenceMap.intraSiteIC}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>External Noise:</span>
                      <span>{siteAnalysis.interferenceMap.externalNoise} dBm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Insights & Actions */}
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black">
                <h3 className="text-lg font-semibold text-verizon-black flex items-center">
                  <BeakerIcon className="w-5 h-5 mr-2 text-verizon-red" />
                  Predictive AI Insights
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-verizon-black mb-2">Predicted Issues</h4>
                  {siteAnalysis.predictiveInsights.map((insight, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded mb-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{insight.type}</span>
                        <span className="text-xs bg-verizon-blue text-white px-2 py-1 rounded">
                          {insight.probability}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{insight.rootCause}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">⏱️ {insight.timeframe}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            insight.impact === 'High' ? 'bg-verizon-red text-white' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {insight.impact} Impact
                          </span>
                        </div>
                        <button 
                          onClick={() => openActionModal(`Prevent ${insight.type}`, 'emergency', selectedSite)}
                          className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                        >
                          Prevent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-semibold text-verizon-black mb-2">Auto-Optimization</h4>
                  {siteAnalysis.automationOpportunities.map((auto, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1">
                      <span className="text-sm">{auto.action}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">{auto.confidence}%</span>
                        <button 
                          onClick={() => openActionModal(auto.action, 'automation', selectedSite)}
                          className="px-2 py-1 bg-verizon-red text-white text-xs rounded hover:bg-red-700"
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Site Trends & Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <div className="p-4 border-b border-verizon-black">
                <h3 className="text-lg font-semibold text-verizon-black">Performance Trends</h3>
              </div>
              <div className="p-4">
                <div className="h-64">
                  <TrendGraph site={selectedSite} />
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-verizon-black rounded-lg shadow-sm">
              <SiteDetails
                site={selectedSite}
                onViewPath={onViewPath}
                onAskAssistant={onAskAssistant}
              />
            </div>
          </div>
        </>
      )}

      {/* No Analysis State */}
      {analysisMode === 'market' && !marketAnalysis && (
        <div className="text-center py-12 bg-white border border-verizon-black rounded-lg">
          <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-verizon-black mb-2">Select a Market for Analysis</h3>
          <p className="text-gray-600">Choose a specific market/geofence to view AI-driven insights and recommendations</p>
        </div>
      )}

      {analysisMode === 'site' && !selectedSite && (
        <div className="text-center py-12 bg-white border border-verizon-black rounded-lg">
          <RadioIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-verizon-black mb-2">Select a Site for Deep Dive</h3>
          <p className="text-gray-600">Choose a specific site to view detailed RF performance analysis and optimization opportunities</p>
        </div>
      )}

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        action={actionModal.action}
        actionType={actionModal.actionType}
        site={actionModal.site}
        onExecute={executeAction}
      />
    </div>
  );
};

export default AIInsightsEngineering;
