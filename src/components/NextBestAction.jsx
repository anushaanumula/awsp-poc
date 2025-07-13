import React, { useState, useEffect } from 'react';
import { 
  LightBulbIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CogIcon,
  UserGroupIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import rcaApiClient, { trackActionExecution } from '../utils/rcaApiClient';

const NextBestAction = ({ site, onActionExecuted, onCreateTask }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState({});
  const [executionHistory, setExecutionHistory] = useState([]);

  useEffect(() => {
    if (site) {
      fetchNextBestAction();
    }
  }, [site]);

  const fetchNextBestAction = async () => {
    setLoading(true);
    try {
      const result = await rcaApiClient.getNextBestAction(site);
      setRecommendation(result);
    } catch (error) {
      console.error('Failed to fetch next best action:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action, actionType = 'manual') => {
    const actionKey = `${action.id || action.action}`;
    setExecuting(prev => ({ ...prev, [actionKey]: true }));

    try {
      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Track the execution
      trackActionExecution(action.id, actionType, true);
      
      // Add to execution history
      const executionRecord = {
        id: Date.now(),
        action: action.action || action.title,
        timestamp: new Date().toISOString(),
        status: 'completed',
        type: actionType,
        effort: action.estimated_effort || 'Unknown',
        success_probability: action.success_probability || 0.8
      };
      
      setExecutionHistory(prev => [executionRecord, ...prev.slice(0, 4)]);
      
      // Create task if callback provided
      if (onCreateTask) {
        const task = {
          id: Date.now(),
          title: `Execute: ${action.action || action.title}`,
          description: `Next Best Action: ${action.action}. Root cause: ${action.root_cause || 'Analysis pending'}`,
          siteId: site.id,
          geoId: site.geoId,
          priority: action.priority || 'medium',
          nextBestAction: true,
          estimatedEffort: action.estimated_effort,
          successProbability: action.success_probability,
          createdAt: new Date().toISOString()
        };
        onCreateTask(task);
      }
      
      if (onActionExecuted) {
        onActionExecuted(action, executionRecord);
      }
      
    } catch (error) {
      console.error('Action execution failed:', error);
      trackActionExecution(action.id, actionType, false);
    } finally {
      setExecuting(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const executeAutomatedAction = (action) => {
    executeAction(action, 'automated');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100 border-red-200',
      medium: 'text-orange-600 bg-orange-100 border-orange-200',
      low: 'text-green-600 bg-green-100 border-green-200'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />,
      major: <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />,
      minor: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
    };
    return icons[severity] || <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
  };

  if (!site) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Select a site to get next best action recommendations</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <div className="flex items-center space-x-3">
          <CogIcon className="w-5 h-5 animate-spin text-blue-600" />
          <span>Analyzing and generating recommendations...</span>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <button 
          onClick={fetchNextBestAction}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Get Next Best Action
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with risk assessment */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <LightBulbIcon className="w-6 h-6 mr-2 text-blue-600" />
            Next Best Action
          </h2>
          <div className="flex items-center space-x-2">
            {getSeverityIcon(recommendation.risk_assessment?.severity)}
            <span className="text-sm font-medium capitalize">
              {recommendation.risk_assessment?.severity} Priority
            </span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {Math.round((recommendation.confidence || 0.8) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Confidence</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">
              {recommendation.risk_assessment?.affected_users || 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Affected Users</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {recommendation.expected_impact?.resolution_time || 'Unknown'}
            </div>
            <div className="text-xs text-gray-600">Est. Resolution</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">
              {Math.round((recommendation.expected_impact?.success_probability || 0.8) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Primary Recommendation */}
      {recommendation.primary_recommendation && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowRightIcon className="w-5 h-5 mr-2 text-green-600" />
            Primary Recommendation
          </h3>
          
          <div className={`p-4 border rounded-lg ${getPriorityColor(recommendation.primary_recommendation.priority)}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{recommendation.primary_recommendation.action}</h4>
              <span className="text-sm font-medium px-2 py-1 rounded">
                {recommendation.primary_recommendation.priority} priority
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              <strong>Root Cause:</strong> {recommendation.primary_recommendation.root_cause}
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <strong>Estimated Effort:</strong> {recommendation.primary_recommendation.estimated_effort}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => executeAction(recommendation.primary_recommendation)}
                disabled={executing[recommendation.primary_recommendation.id]}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {executing[recommendation.primary_recommendation.id] ? (
                  <CogIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                <span>
                  {executing[recommendation.primary_recommendation.id] ? 'Executing...' : 'Execute'}
                </span>
              </button>
              
              <button
                onClick={() => executeAction({
                  ...recommendation.primary_recommendation,
                  title: `Create Task: ${recommendation.primary_recommendation.action}`
                })}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Actions */}
      {recommendation.alternative_actions && recommendation.alternative_actions.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Alternative Actions</h3>
          <div className="space-y-3">
            {recommendation.alternative_actions.map((action, index) => (
              <div key={index} className="p-3 border rounded bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{action.action}</h4>
                    <p className="text-sm text-gray-600">Root Cause: {action.root_cause}</p>
                  </div>
                  <button
                    onClick={() => executeAction(action)}
                    disabled={executing[action.id]}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    {executing[action.id] ? 'Executing...' : 'Execute'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automated Actions */}
      {recommendation.automated_actions && recommendation.automated_actions.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CogIcon className="w-5 h-5 mr-2 text-blue-600" />
            Automated Actions Available
          </h3>
          <div className="space-y-3">
            {recommendation.automated_actions.map((action, index) => (
              <div key={index} className="p-3 border rounded bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{action.action}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                      action.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                      action.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {action.risk_level} risk
                    </span>
                  </div>
                  <button
                    onClick={() => executeAutomatedAction(action)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Auto Execute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-gray-600" />
            Recent Actions
          </h3>
          <div className="space-y-2">
            {executionHistory.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{record.action}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({new Date(record.timestamp).toLocaleTimeString()})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    record.type === 'automated' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {record.type}
                  </span>
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button 
          onClick={fetchNextBestAction}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
};

export default NextBestAction;
