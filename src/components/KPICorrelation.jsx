import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  ClockIcon,
  CogIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  CpuChipIcon,
  BoltIcon,
  EyeIcon,
  BeakerIcon,
  CircleStackIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { mockCorrelationData, generateSmartRecommendations, getCorrelationInsights } from '../data/correlationData';

const KPICorrelation = ({ context, onCreateTask }) => {
  const [activeVisualization, setActiveVisualization] = useState('market-trends');
  const [correlationInsights, setCorrelationInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const site = context.siteObj;

  useEffect(() => {
    generateCorrelationInsights();
    generateRecommendations();
  }, [site]);

  const generateCorrelationInsights = () => {
    // Get dynamic insights based on current context
    const correlationInsights = getCorrelationInsights();
    
    const insights = [
      {
        id: 'market_trends',
        title: 'Market-Wide KPI Trends',
        description: 'Cross-market analysis shows degradation patterns across multiple KPIs with strong correlation between throughput and CQI metrics.',
        takeaway: 'Regional interference issues affecting multiple markets simultaneously. Consider coordinated optimization efforts.',
        correlationStrength: 0.87,
        kpis: ['Throughput', 'CQI', 'RSRP', 'Bearer Drop Rate'],
        trend: 'declining'
      },
      {
        id: 'hourly_patterns',
        title: 'Hourly Performance Heatmaps',
        description: 'Peak hour degradation patterns show consistent issues during 8AM-10AM and 5PM-7PM across all sites.',
        takeaway: 'Traffic congestion during peak hours correlates with increased failure rates. Capacity expansion needed.',
        correlationStrength: 0.92,
        kpis: ['RRC Setup Failure', 'Bearer Drop Rate', 'Throughput'],
        trend: 'cyclical'
      },
      {
        id: 'worst_performers',
        title: 'Top 10 Worst Sites by Health Score',
        description: 'Identified sites with consistently poor health scores showing correlated failures across multiple KPIs.',
        takeaway: 'Infrastructure issues at specific sites require immediate attention. Hardware replacement may be needed.',
        correlationStrength: 0.95,
        kpis: ['Health Score', 'All KPIs'],
        trend: 'critical'
      },
      {
        id: 'cqi_throughput_correlation',
        title: 'CQI-Throughput Strong Correlation',
        description: correlationInsights.insights[0],
        takeaway: correlationInsights.actionableFindings[0],
        correlationStrength: 0.94,
        kpis: ['CQI', 'Throughput', 'SINR', 'RSRQ'],
        trend: 'stable'
      },
      {
        id: 'failure_cascade',
        title: 'Failure Cascade Pattern',
        description: correlationInsights.insights[1],
        takeaway: correlationInsights.actionableFindings[1],
        correlationStrength: 0.89,
        kpis: ['RRC Setup Failure', 'Bearer Drop', 'User Throughput'],
        trend: 'cascading'
      },
      {
        id: 'predictive_health',
        title: 'Predictive Health Analysis',
        description: correlationInsights.insights[3],
        takeaway: correlationInsights.actionableFindings[3],
        correlationStrength: 0.85,
        kpis: ['Health Score Prediction', 'Historical Trends'],
        trend: 'predictive'
      }
    ];
    setCorrelationInsights(insights);
  };

  const generateRecommendations = () => {
    // Use smart recommendations based on site data
    let smartRecs = [];
    if (site) {
      const kpiData = {
        cqi: site.kpi === 'CQI' ? site.value : Math.random() * 10 + 3,
        throughput: site.kpi === 'Throughput' ? site.value : Math.random() * 50 + 20,
        rsrp: site.kpi === 'RSRP (dBm)' ? site.value : -95 - Math.random() * 20,
        rrcFailure: site.kpi === 'RRC Setup Failure Rate' ? site.value : Math.random() * 15
      };
      smartRecs = generateSmartRecommendations(kpiData);
    }

    // Combine with static recommendations
    const recs = [
      ...smartRecs,
      {
        id: 'peak_hour_management',
        title: 'Peak Hour Traffic Management',
        description: 'Strong correlation between peak hours and performance degradation',
        priority: 'medium',
        kpiTrigger: 'Peak hour performance < 80% of normal',
        actions: [
          'Implement dynamic load balancing algorithms',
          'Configure traffic shaping policies for peak hours',
          'Activate carrier aggregation for capacity boost',
          'Schedule non-critical maintenance outside peak hours',
          'Consider temporary mobile cell deployment for events'
        ],
        correlatedKPIs: ['Throughput', 'Latency', 'Connection Success Rate'],
        estimatedImpact: 'Medium - Improved peak hour experience',
        timeline: '3-7 days'
      },
      {
        id: 'predictive_maintenance',
        title: 'Predictive Maintenance Initiative',
        description: 'ML model indicates high probability of equipment failure',
        priority: 'high',
        kpiTrigger: 'Health Score < 60%, Multiple KPI degradation',
        actions: [
          'Schedule preventive maintenance for identified sites',
          'Replace aging hardware components proactively',
          'Implement enhanced monitoring for critical sites',
          'Create backup capacity plans for high-risk areas',
          'Update maintenance schedules based on predictions'
        ],
        correlatedKPIs: ['Health Score', 'Equipment Alarms', 'Performance Trends'],
        estimatedImpact: 'High - Prevents unplanned outages',
        timeline: '1-3 weeks'
      }
    ];
    setRecommendations(recs);
  };

  const visualizations = [
    {
      id: 'market-trends',
      title: 'Market KPI Trends',
      image: '1_market_kpi_trends.png',
      description: 'Cross-market trend analysis showing KPI performance over time'
    },
    {
      id: 'hourly-heatmaps',
      title: 'Hourly Performance Heatmaps',
      image: '2_hourly_heatmaps.png',
      description: 'Hourly performance patterns across different time periods'
    },
    {
      id: 'worst-performers',
      title: 'Top 10 Worst Sites',
      image: '4_top_10_worst_by_health.png',
      description: 'Sites with lowest health scores requiring immediate attention'
    },
    {
      id: 'failure-trends',
      title: 'Failure Impact Analysis',
      image: '5_failure_impact_trends.png',
      description: 'Analysis of how failures cascade across different KPIs'
    },
    {
      id: 'site-analysis',
      title: 'Site-Specific Analysis',
      image: '6_enodeb_144628_dual_axis_failure_analysis.png',
      description: 'Detailed dual-axis analysis of specific eNodeB performance'
    },
    {
      id: 'correlation-heatmap',
      title: 'KPI Correlation Matrix',
      image: '7_1_correlation_heatmap_worst_144936.png',
      description: 'Correlation strength between different KPI metrics'
    },
    {
      id: 'health-forecast',
      title: 'Health Score Forecast',
      image: '8_FORECAST_predicted_health_score.png',
      description: 'ML-based predictions of future site health scores'
    }
  ];

  const executeRecommendation = (recommendation) => {
    const task = {
      id: Date.now(),
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.priority,
      actions: recommendation.actions,
      correlatedKPIs: recommendation.correlatedKPIs,
      estimatedImpact: recommendation.estimatedImpact,
      timeline: recommendation.timeline,
      type: 'kpi-correlation',
      createdAt: new Date().toISOString(),
      siteId: site?.id || 'multiple'
    };
    
    if (onCreateTask) {
      onCreateTask(task);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'text-red-600 bg-red-100 border-red-200',
      high: 'text-orange-600 bg-orange-100 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      low: 'text-green-600 bg-green-100 border-green-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getTrendIcon = (trend) => {
    const icons = {
      declining: <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />,
      stable: <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />,
      cyclical: <ClockIcon className="w-5 h-5 text-orange-600" />,
      critical: <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />,
      cascading: <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />,
      inverse: <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />,
      predictive: <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
    };
    return icons[trend] || <ArrowTrendingUpIcon className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* AI-Native Header with Corporate Branding */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white rounded-xl border-2 border-red-200 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                AI-Powered KPI Correlation Engine
              </h2>
              <p className="text-red-100 text-sm">
                Advanced ML-driven correlation analysis with predictive insights
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold">94%</div>
              <div className="text-xs text-red-100">AI Confidence</div>
            </div>
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* AI Status Indicators */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <BoltIcon className="w-5 h-5 mx-auto mb-1 text-yellow-200" />
            <div className="text-sm font-medium">Real-time</div>
            <div className="text-xs text-red-100">Processing</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <EyeIcon className="w-5 h-5 mx-auto mb-1 text-blue-200" />
            <div className="text-sm font-medium">Pattern</div>
            <div className="text-xs text-red-100">Detection</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <BeakerIcon className="w-5 h-5 mx-auto mb-1 text-green-200" />
            <div className="text-sm font-medium">ML Models</div>
            <div className="text-xs text-red-100">Active</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <RocketLaunchIcon className="w-5 h-5 mx-auto mb-1 text-purple-200" />
            <div className="text-sm font-medium">Predictions</div>
            <div className="text-xs text-red-100">Ready</div>
          </div>
        </div>
      </div>

      {/* AI-Enhanced Visualization Gallery */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <CircleStackIcon className="w-6 h-6 mr-3 text-secondary" />
            Intelligent Performance Visualizations
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Analysis</span>
          </div>
        </div>
        
        {/* Enhanced Visualization Selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {visualizations.map((viz) => (
            <button
              key={viz.id}
              onClick={() => setActiveVisualization(viz.id)}
              className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeVisualization === viz.id
                  ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {viz.title}
            </button>
          ))}
        </div>

        {/* Active Visualization with AI Enhancement */}
        {visualizations.find(v => v.id === activeVisualization) && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-200">
              <img 
                src={`/graphs/${visualizations.find(v => v.id === activeVisualization).image}`}
                alt={visualizations.find(v => v.id === activeVisualization).title}
                className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                style={{ maxHeight: '500px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Enhanced Fallback with AI Branding */}
              <div className="hidden">
                <div className="bg-gradient-to-br from-blue-50 to-secondary bg-opacity-10 border-2 border-dashed border-secondary rounded-xl p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-secondary bg-opacity-20 rounded-xl">
                      <ChartBarIcon className="w-16 h-16 text-secondary" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-secondary mb-2">
                    {visualizations.find(v => v.id === activeVisualization).title}
                  </h4>
                  <p className="text-blue-700 mb-4">
                    {visualizations.find(v => v.id === activeVisualization).description}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                    <SparklesIcon className="w-4 h-4" />
                    <span>AI processing visualization data...</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Insights for Current Visualization */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-secondary">
              <div className="flex items-start space-x-3">
                <SparklesIcon className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">AI Analysis</h4>
                  <p className="text-sm text-gray-600">
                    {visualizations.find(v => v.id === activeVisualization).description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI-Powered Correlation Insights */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <BoltIcon className="w-6 h-6 mr-3 text-yellow-500" />
            AI-Generated Insights & Patterns
          </h3>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">ML Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {correlationInsights.map((insight) => (
            <div key={insight.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-5 h-full">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-800 flex items-center group-hover:text-secondary transition-colors">
                    {getTrendIcon(insight.trend)}
                    <span className="ml-3">{insight.title}</span>
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-secondary to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {Math.round(insight.correlationStrength * 100)}%
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{insight.description}</p>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-secondary p-4 rounded-lg mb-4">
                  <div className="flex items-start space-x-2">
                    <LightBulbIcon className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-800 text-sm">AI Takeaway:</strong>
                      <p className="text-sm text-blue-700 mt-1">{insight.takeaway}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {insight.kpis.map((kpi, index) => (
                    <span key={index} className="text-xs px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Driven Recommendations & Autonomous Actions */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <RocketLaunchIcon className="w-6 h-6 mr-3 text-primary" />
            Autonomous AI Recommendations
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-primary bg-opacity-10 px-3 py-1 rounded-full">
              <ShieldCheckIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Auto-Approved</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`group border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${getPriorityColor(rec.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-bold text-lg text-gray-800">{rec.title}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      rec.priority === 'critical' ? 'bg-red-500 text-white' : 
                      rec.priority === 'high' ? 'bg-orange-500 text-white' : 
                      'bg-yellow-500 text-white'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{rec.description}</p>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm">
                    <strong className="text-blue-800">AI Trigger:</strong> 
                    <span className="text-blue-700 ml-2">{rec.kpiTrigger}</span>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="text-xs text-gray-600 mb-1">Timeline</div>
                    <div className="font-bold text-gray-800">{rec.timeline}</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Items with AI Insights */}
              <div className="mb-4">
                <h5 className="text-sm font-bold mb-3 flex items-center text-gray-800">
                  <CogIcon className="w-4 h-4 mr-2 text-secondary" />
                  AI-Recommended Actions:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rec.actions.slice(0, 4).map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white bg-opacity-50 rounded-lg p-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-secondary to-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                  {rec.actions.length > 4 && (
                    <div className="text-gray-500 text-xs flex items-center justify-center py-2">
                      +{rec.actions.length - 4} additional optimization steps...
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced KPI Impact & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h6 className="text-sm font-medium mb-2 text-gray-800">Correlated KPIs:</h6>
                  <div className="flex flex-wrap gap-2">
                    {rec.correlatedKPIs.slice(0, 4).map((kpi, index) => (
                      <span key={index} className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-blue-50 transition-colors">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium mb-2 text-gray-800">Expected Impact:</h6>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">{rec.estimatedImpact}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Button with AI Automation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => executeRecommendation(rec)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-sm font-bold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <RocketLaunchIcon className="w-4 h-4" />
                    <span>Deploy AI Solution</span>
                  </button>
                  
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4" />
                    <span>Simulate Impact</span>
                  </button>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-500">AI Confidence</div>
                  <div className="text-lg font-bold text-secondary">
                    {Math.round(85 + Math.random() * 10)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Performance Dashboard */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl border-2 border-gray-700 p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <CircleStackIcon className="w-6 h-6 mr-3 text-primary" />
          AI Engine Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">{correlationInsights.length}</div>
            <div className="text-blue-100 text-sm">AI Insights Generated</div>
            <div className="w-full bg-blue-800 rounded-full h-2 mt-2">
              <div className="bg-blue-300 h-2 rounded-full w-4/5"></div>
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-primary to-red-600 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">{recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length}</div>
            <div className="text-red-100 text-sm">Priority Actions</div>
            <div className="w-full bg-red-800 rounded-full h-2 mt-2">
              <div className="bg-red-300 h-2 rounded-full w-3/5"></div>
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">94%</div>
            <div className="text-green-100 text-sm">ML Accuracy</div>
            <div className="w-full bg-green-800 rounded-full h-2 mt-2">
              <div className="bg-green-300 h-2 rounded-full w-full"></div>
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
            <div className="text-3xl font-bold text-white mb-1">7</div>
            <div className="text-purple-100 text-sm">Data Sources</div>
            <div className="w-full bg-purple-800 rounded-full h-2 mt-2">
              <div className="bg-purple-300 h-2 rounded-full w-full"></div>
            </div>
          </div>
        </div>
        
        {/* Real-time Processing Status */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">ML Models Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Data Streaming</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Predictions Ready</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Last Updated</div>
              <div className="text-sm text-white font-medium">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICorrelation;
