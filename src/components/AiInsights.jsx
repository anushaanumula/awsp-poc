import React, { useState, useEffect } from 'react';
import { 
  BoltIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline';
import rcaEngine from '../utils/rcaEngine';
import RootCauseAnalysis from './RootCauseAnalysis';
import NextBestAction from './NextBestAction';

// Enhanced AI Insights component with integrated RCA capabilities
const AiInsights = ({ context, onApprove = () => {}, onViewPath, onAskAssistant }) => {
  const site = context.siteObj;
  const [activeTab, setActiveTab] = useState('quick-insights');
  const [rcaAnalysis, setRcaAnalysis] = useState(null);
  const [autoActions, setAutoActions] = useState([]);
  
  if (!site) return <div className="p-4 border">Select a site to view AI insights</div>;

  useEffect(() => {
    if (site) {
      generateAutoActions();
    }
  }, [site]);

  const generateAutoActions = () => {
    // Generate automated recommendations based on KPI analysis
    const quickAnalysis = rcaEngine.analyzeKPI(site);
    const actions = [];
    
    if (quickAnalysis.severity === 'critical') {
      actions.push({
        id: 1,
        type: 'immediate',
        title: 'Emergency Response Required',
        description: 'Critical KPI degradation detected - immediate attention needed',
        automated: false,
        priority: 'high'
      });
    }
    
    if (quickAnalysis.rootCauses.length > 0) {
      const primaryCause = quickAnalysis.rootCauses[0];
      actions.push({
        id: 2,
        type: 'diagnostic',
        title: `Investigate ${primaryCause.cause}`,
        description: primaryCause.nextActions[0],
        automated: true,
        priority: quickAnalysis.severity === 'critical' ? 'high' : 'medium'
      });
    }
    
    actions.push({
      id: 3,
      type: 'monitoring',
      title: 'Enable Enhanced Monitoring',
      description: 'Activate detailed KPI tracking for this site',
      automated: true,
      priority: 'low'
    });
    
    setAutoActions(actions);
  };

  const handleUpdateAnalysis = (analysis) => {
    setRcaAnalysis(analysis);
  };

  const getPrediction = () => {
    // Simple heuristic thresholds approximate an ML classifier.
    // Each KPI range maps to a short insight string.
    switch (site.kpi) {
      case 'RRC Setup Failure Rate':
        return site.value > 15
          ? 'Severe access issue detected. Immediate RCA recommended.'
          : site.value > 8
          ? 'Moderate setup failures. Monitor call setup trends.'
          : 'Normal access behavior';
      case 'Bearer Drop Rate':
        return site.value > 5
          ? 'High session drop. Possible handover or coverage gap.'
          : site.value > 2
          ? 'Moderate drops. Monitor mobility events.'
          : 'Stable bearer retention';
      case 'RSRP (dBm)':
        return site.value < -110
          ? 'Very weak signal. May impact user experience.'
          : site.value < -100
          ? 'Weak signal. Consider physical optimization.'
          : 'Good signal strength';
      case 'RSRQ (dB)':
        return site.value < -14
          ? 'Poor signal quality. High interference expected.'
          : site.value < -10
          ? 'Degraded quality. Monitor for UL scheduling issues.'
          : 'Healthy signal quality';
      case 'UL SINR (dB)':
        return site.value < 5
          ? 'High uplink interference. User throughput affected.'
          : site.value < 10
          ? 'Marginal SINR. Monitor scheduler and power headroom.'
          : 'Clean uplink spectrum';
      case 'Paging Success Rate':
        return site.value < 90
          ? 'Low paging rate. Might affect MT call performance.'
          : site.value < 97
          ? 'Slight degradation in paging delivery.'
          : 'Paging KPIs look healthy';
      default:
        return 'No prediction model applied to this KPI.';
    }
  };

  const getAction = () => {
    // Suggested actions mirror the rules above and are not data-driven yet.
    switch (site.kpi) {
      case 'RRC Setup Failure Rate':
        return 'Check signaling traces and verify neighbor relations.';
      case 'Bearer Drop Rate':
        return 'Analyze handover stats and optimize parameters.';
      case 'RSRP (dBm)':
        return 'Inspect antenna alignment or plan a drive test.';
      case 'RSRQ (dB)':
        return 'Investigate interference and verify power settings.';
      case 'UL SINR (dB)':
        return 'Look for uplink blockers and schedule a site visit.';
      case 'Paging Success Rate':
        return 'Check paging channel configuration and core connectivity.';
      default:
        return 'Review KPI trend and determine next best action.';
    }
  };

  const handleApprove = () => {
    // Approving creates a simple task object using the rule-based suggestion.
    const task = {
      id: Date.now(),
      title: `Resolve ${site.kpi} at site ${site.geoId}`,
      description: getAction(),
      siteId: site.id,
      impactType: site.kpiType,
      createdAt: new Date().toISOString(),
    };
    onApprove(task);
  };

  const executeAutoAction = (action) => {
    console.log(`Executing auto action: ${action.title}`);
    // Here you would implement the actual automation logic
    // For now, we'll just create a task
    const task = {
      id: Date.now(),
      title: action.title,
      description: action.description,
      siteId: site.id,
      geoId: site.geoId,
      automated: action.automated,
      priority: action.priority,
      createdAt: new Date().toISOString(),
    };
    onApprove(task);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-orange-600 bg-orange-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('quick-insights')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quick-insights'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quick Insights
          </button>
          <button
            onClick={() => setActiveTab('next-best-action')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'next-best-action'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Next Best Action
          </button>
          <button
            onClick={() => setActiveTab('auto-actions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'auto-actions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Auto Actions
          </button>
          <button
            onClick={() => setActiveTab('rca')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rca'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Root Cause Analysis
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'quick-insights' && (
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <BoltIcon className="w-5 h-5 mr-2 text-blue-600" />
            Quick AI Insights
          </h2>
          <p className="text-black mb-2">
            <strong>Predicted Insight:</strong> {getPrediction()}
          </p>
          <p className="mb-4">
            <strong>Suggested Action:</strong> {getAction()}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleApprove} 
              className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
            >
              <CheckCircleIcon className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button 
              onClick={() => {}} 
              className="btn bg-gray-600 text-white hover:bg-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {activeTab === 'next-best-action' && (
        <NextBestAction 
          site={site}
          onActionExecuted={(action, result) => {
            console.log('Action executed:', action, result);
          }}
          onCreateTask={onApprove}
        />
      )}

      {activeTab === 'auto-actions' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <ArrowPathIcon className="w-5 h-5 mr-2 text-blue-600" />
            Automated Actions
          </h2>
          {autoActions.map((action) => (
            <div key={action.id} className="p-4 border rounded bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{action.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </span>
                  {action.automated && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      Auto
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{action.description}</p>
              <button
                onClick={() => executeAutoAction(action)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                {action.automated ? 'Execute' : 'Create Task'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rca' && (
        <RootCauseAnalysis 
          site={site}
          onCreateTask={onApprove}
          onUpdateAnalysis={handleUpdateAnalysis}
        />
      )}
    </div>
  );
};

export default AiInsights;
