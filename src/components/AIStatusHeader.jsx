import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon, 
  SparklesIcon, 
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AIStatusHeader = ({ sitesCount, alertsCount, activeInsights }) => {
  const [aiStatus, setAiStatus] = useState('active');
  const [processingCount, setProcessingCount] = useState(0);

  useEffect(() => {
    // Simulate AI processing activity
    const interval = setInterval(() => {
      setProcessingCount(prev => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-base-content via-gray-800 to-gray-900 text-white p-6 rounded-lg mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/20 rounded-lg backdrop-blur-sm border border-white/10">
            <CpuChipIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              AWSP AI Network Intelligence
            </h1>
            <p className="text-gray-300 font-medium">Real-time AI analysis • Predictive insights • Automated optimization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* AI Status */}
          <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div className="text-xs text-gray-300 font-semibold">AI Active</div>
          </div>
          
          {/* Processing Count */}
          <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-lg font-bold">{processingCount}</div>
            <div className="text-xs text-gray-300 font-semibold">Data Points/sec</div>
          </div>
          
          {/* Sites Monitored */}
          <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-lg font-bold">{sitesCount}</div>
            <div className="text-xs text-gray-300 font-semibold">Sites Monitored</div>
          </div>
          
          {/* Active Alerts */}
          <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-lg font-bold text-primary">{alertsCount}</div>
            <div className="text-xs text-gray-300 font-semibold">Active Alerts</div>
          </div>
        </div>
      </div>
      
      {/* AI Capabilities Banner */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
              <BoltIcon className="w-4 h-4 text-primary" />
              <span className="text-gray-200 font-medium">Real-time Anomaly Detection</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
              <ChartBarIcon className="w-4 h-4 text-secondary" />
              <span className="text-gray-200 font-medium">Predictive Analytics</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-primary" />
              <span className="text-gray-200 font-medium">Automated Root Cause Analysis</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
              <CheckCircleIcon className="w-4 h-4 text-secondary" />
              <span className="text-gray-200 font-medium">Smart Recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStatusHeader;
