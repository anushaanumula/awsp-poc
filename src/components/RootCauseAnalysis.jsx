import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import rcaEngine from '../utils/rcaEngine';

const RootCauseAnalysis = ({ site, onCreateTask, onUpdateAnalysis }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCause, setSelectedCause] = useState(null);
  const [actionStatus, setActionStatus] = useState({});

  useEffect(() => {
    if (site) {
      performRCA();
    }
  }, [site]);

  const performRCA = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const rcaResult = rcaEngine.analyzeKPI(site);
      setAnalysis(rcaResult);
      setSelectedCause(rcaResult.rootCauses[0]); // Select most probable cause
      if (onUpdateAnalysis) {
        onUpdateAnalysis(rcaResult);
      }
    } catch (error) {
      console.error('RCA failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-100',
      major: 'text-orange-600 bg-orange-100',
      minor: 'text-yellow-600 bg-yellow-100'
    };
    return colors[severity] || 'text-gray-600 bg-gray-100';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      critical: <XCircleIcon className="w-5 h-5" />,
      major: <ExclamationTriangleIcon className="w-5 h-5" />,
      minor: <InformationCircleIcon className="w-5 h-5" />
    };
    return icons[severity] || <InformationCircleIcon className="w-5 h-5" />;
  };

  const handleActionClick = (action, index) => {
    const key = `${selectedCause.cause}-${index}`;
    setActionStatus(prev => ({
      ...prev,
      [key]: prev[key] === 'completed' ? 'pending' : 'completed'
    }));
  };

  const createTaskFromRCA = () => {
    if (!analysis || !selectedCause) return;

    const task = {
      id: Date.now(),
      title: `RCA: ${selectedCause.cause} at ${site.geoId}`,
      description: `Root cause analysis identified ${selectedCause.cause} as the primary issue. Confidence: ${Math.round(analysis.confidence * 100)}%`,
      siteId: site.id,
      geoId: site.geoId,
      kpi: site.kpi,
      severity: analysis.severity,
      rootCause: selectedCause.cause,
      nextActions: selectedCause.nextActions,
      estimatedUsers: analysis.impactAssessment.estimatedUsers,
      timeline: analysis.timeline,
      createdAt: new Date().toISOString(),
      rcaData: analysis
    };

    if (onCreateTask) {
      onCreateTask(task);
    }
  };

  if (!site) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Select a site to perform Root Cause Analysis</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <div className="flex items-center space-x-3">
          <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600" />
          <span>Analyzing root causes...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <button 
          onClick={performRCA}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start Root Cause Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Root Cause Analysis</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getSeverityColor(analysis.severity)}`}>
            {getSeverityIcon(analysis.severity)}
            <span className="capitalize">{analysis.severity}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{Math.round(analysis.confidence * 100)}%</div>
            <div className="text-sm text-gray-600">Confidence</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-orange-600">{analysis.impactAssessment.estimatedUsers}</div>
            <div className="text-sm text-gray-600">Affected Users</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-green-600">{analysis.timeline.resolution}</div>
            <div className="text-sm text-gray-600">Est. Resolution</div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <strong>Site:</strong> {site.geoId} | <strong>KPI:</strong> {site.kpi} | <strong>Value:</strong> {site.value}
        </div>
      </div>

      {/* Root Causes */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Identified Root Causes</h3>
        <div className="space-y-3">
          {analysis.rootCauses.map((cause, index) => (
            <div 
              key={index}
              className={`p-4 border rounded cursor-pointer transition-all ${
                selectedCause?.cause === cause.cause 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCause(cause)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{cause.cause}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {Math.round(cause.probability * 100)}% probability
                  </span>
                  <div className={`w-3 h-3 rounded-full ${
                    cause.probability > 0.3 ? 'bg-red-500' : 
                    cause.probability > 0.2 ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Indicators:</strong> {cause.indicators.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Best Actions */}
      {selectedCause && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">
            Next Best Actions - {selectedCause.cause}
          </h3>
          <div className="space-y-3">
            {selectedCause.nextActions.map((action, index) => {
              const key = `${selectedCause.cause}-${index}`;
              const isCompleted = actionStatus[key] === 'completed';
              
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 border rounded cursor-pointer transition-all ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleActionClick(action, index)}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`flex-1 ${isCompleted ? 'line-through text-gray-600' : ''}`}>
                    {action}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Impact Assessment */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Impact Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              User Experience
            </h4>
            <p className="text-sm text-gray-600 mb-4">{analysis.impactAssessment.userExperience}</p>
            
            <h4 className="font-medium mb-2 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Business Metrics
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Revenue Risk: {analysis.impactAssessment.businessMetrics.revenueRisk}</div>
              <div>Customer Satisfaction: {analysis.impactAssessment.businessMetrics.customerSatisfaction}</div>
              <div>Churn Risk: {analysis.impactAssessment.businessMetrics.churnRisk}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              Timeline
            </h4>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <div>Resolution: {analysis.timeline.resolution}</div>
              <div>Monitoring: {analysis.timeline.monitoring}</div>
            </div>
            
            <h4 className="font-medium mb-2">Network Performance</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Capacity: {analysis.impactAssessment.networkPerformance.capacity}</div>
              <div>Reliability: {analysis.impactAssessment.networkPerformance.reliability}</div>
              <div>Performance: {analysis.impactAssessment.networkPerformance.performance}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          onClick={createTaskFromRCA}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create Task from RCA
        </button>
        <button 
          onClick={performRCA}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Refresh Analysis
        </button>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;
