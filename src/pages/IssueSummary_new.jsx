import React, { useState, useMemo } from 'react';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AIStatusHeader from '../components/AIStatusHeader';
import TopImpactPanels from '../components/TopImpactPanels';
import RootCauseAnalysis from '../components/RootCauseAnalysis';
import {
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  SignalIcon,
  CpuChipIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Enhanced Issue data with real network scenarios
const CRITICAL_ISSUES = [
  {
    id: 'CHI003_RRC_FAIL',
    site: 'CHI003',
    type: 'RRC Setup Failure',
    severity: 'critical',
    impact: 'High',
    affectedUsers: 1247,
    duration: '2h 15m',
    status: 'active',
    rootCause: 'PRACH resource congestion',
    recommendation: 'Increase PRACH preambles',
    kpiAffected: ['RRC Success Rate', 'Call Setup Time'],
    trend: 'worsening'
  },
  {
    id: 'DAL016_CAPACITY',
    site: 'DAL016', 
    type: 'Capacity Congestion',
    severity: 'high',
    impact: 'Medium',
    affectedUsers: 892,
    duration: '45m',
    status: 'investigating',
    rootCause: 'PRB utilization >95%',
    recommendation: 'Load balancing to neighboring cells',
    kpiAffected: ['Throughput', 'PRB Utilization'],
    trend: 'stable'
  },
  {
    id: 'OKL044_INTERFERENCE',
    site: 'OKL044',
    type: 'RF Interference',
    severity: 'medium',
    impact: 'Medium', 
    affectedUsers: 423,
    duration: '1h 30m',
    status: 'resolved',
    rootCause: 'External interference detected',
    recommendation: 'Frequency refarming completed',
    kpiAffected: ['CQI', 'SINR', 'BLER'],
    trend: 'improving'
  }
];

const NETWORK_KPI_SUMMARY = [
  {
    name: 'RRC Setup Success Rate',
    value: '94.2%',
    target: '98%',
    status: 'warning',
    trend: 'down',
    change: '-2.1%',
    sites_affected: 12
  },
  {
    name: 'Handover Success Rate', 
    value: '96.8%',
    target: '97%',
    status: 'good',
    trend: 'up',
    change: '+0.3%',
    sites_affected: 2
  },
  {
    name: 'Average Throughput',
    value: '87.3 Mbps',
    target: '90 Mbps',
    status: 'warning',
    trend: 'down',
    change: '-1.2%',
    sites_affected: 8
  },
  {
    name: 'Network Availability',
    value: '99.7%',
    target: '99.9%',
    status: 'warning', 
    trend: 'stable',
    change: '0%',
    sites_affected: 3
  }
];

const MARKET_HEALTH_DATA = {
  'Chicago': { score: 87, issues: 5, trending: 'down' },
  'Dallas': { score: 92, issues: 3, trending: 'up' },
  'Oklahoma': { score: 78, issues: 8, trending: 'down' },
  'Tampa': { score: 95, issues: 1, trending: 'stable' },
  'St. Louis': { score: 84, issues: 4, trending: 'up' }
};

// Chart generation functions
const generateIssueDistributionChart = () => {
  const issueTypes = CRITICAL_ISSUES.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(issueTypes),
    datasets: [{
      data: Object.values(issueTypes),
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
      borderWidth: 2
    }]
  };
};

const generateMarketHealthChart = () => {
  const markets = Object.keys(MARKET_HEALTH_DATA);
  return {
    labels: markets,
    datasets: [{
      label: 'Health Score',
      data: markets.map(m => MARKET_HEALTH_DATA[m].score),
      backgroundColor: markets.map(m => 
        MARKET_HEALTH_DATA[m].score >= 90 ? '#22c55e' :
        MARKET_HEALTH_DATA[m].score >= 80 ? '#eab308' : '#ef4444'
      ),
      borderWidth: 1
    }]
  };
};

const generateKpiTrendChart = () => {
  const days = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6-i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return {
    labels: days,
    datasets: [
      {
        label: 'RRC Success Rate (%)',
        data: [96.2, 95.8, 95.1, 94.8, 94.5, 94.2, 94.2],
        borderColor: '#ef4444',
        backgroundColor: '#ef444420',
        tension: 0.1
      },
      {
        label: 'Handover Success Rate (%)',
        data: [96.5, 96.6, 96.7, 96.8, 96.8, 96.8, 96.8],
        borderColor: '#22c55e',
        backgroundColor: '#22c55e20',
        tension: 0.1
      }
    ]
  };
};

// Issue severity colors
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-300';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-red-100 text-red-800';
    case 'investigating': return 'bg-yellow-100 text-yellow-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up': 
    case 'improving': 
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    case 'down':
    case 'worsening':
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    default:
      return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  }
};

export default function IssueSummary({ selectedSite, onCreateTask }) {
  const [selectedMarket, setSelectedMarket] = useState('All Markets');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter issues based on selections
  const filteredIssues = useMemo(() => {
    return CRITICAL_ISSUES.filter(issue => {
      if (selectedSeverity !== 'All' && issue.severity !== selectedSeverity.toLowerCase()) return false;
      if (selectedStatus !== 'All' && issue.status !== selectedStatus.toLowerCase()) return false;
      return true;
    });
  }, [selectedSeverity, selectedStatus]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const total = filteredIssues.length;
    const critical = filteredIssues.filter(i => i.severity === 'critical').length;
    const active = filteredIssues.filter(i => i.status === 'active').length;
    const totalUsers = filteredIssues.reduce((sum, i) => sum + i.affectedUsers, 0);
    
    return { total, critical, active, totalUsers };
  }, [filteredIssues]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* AI Status Header */}
      <AIStatusHeader 
        sitesCount={67}
        alertsCount={summaryMetrics.active}
        activeInsights={summaryMetrics.total}
      />

      {/* Top Impact Panels */}
      <TopImpactPanels 
        months={3}
        selectedMarket={selectedMarket}
        selectedCategory="Top n Offenders"
        filteredSitesCount={filteredIssues.length}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900">{summaryMetrics.total}</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-3xl font-bold text-red-600">{summaryMetrics.critical}</p>
            </div>
            <XCircleIcon className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Issues</p>
              <p className="text-3xl font-bold text-orange-600">{summaryMetrics.active}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Affected Users</p>
              <p className="text-3xl font-bold text-purple-600">{summaryMetrics.totalUsers.toLocaleString()}</p>
            </div>
            <SignalIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-secondary" />
            Issue Type Distribution
          </h3>
          <div className="h-64">
            <Doughnut 
              data={generateIssueDistributionChart()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>

        {/* Market Health Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-secondary" />
            Market Health Scores
          </h3>
          <div className="h-64">
            <Bar 
              data={generateMarketHealthChart()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true, max: 100 }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-secondary" />
          KPI Performance Trends (Last 7 Days)
        </h3>
        <div className="h-80">
          <Line 
            data={generateKpiTrendChart()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                y: { beginAtZero: false, min: 90, max: 100 }
              }
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Filter Issues</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
            <select 
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All Markets">All Markets</option>
              <option value="Chicago">Chicago</option>
              <option value="Dallas">Dallas</option>
              <option value="Oklahoma">Oklahoma</option>
              <option value="Tampa">Tampa</option>
              <option value="St. Louis">St. Louis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Critical Network Issues</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredIssues.length} issues requiring immediate attention
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{issue.type}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(issue.severity)}`}>
                      {issue.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status.toUpperCase()}
                    </span>
                    {getTrendIcon(issue.trend)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Site:</span> {issue.site}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {issue.duration}
                    </div>
                    <div>
                      <span className="font-medium">Affected Users:</span> {issue.affectedUsers.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Impact:</span> {issue.impact}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Root Cause:</span> {issue.rootCause}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Recommendation:</span> {issue.recommendation}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {issue.kpiAffected.map((kpi, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-4 flex space-x-2">
                  <button 
                    onClick={() => onCreateTask && onCreateTask({
                      title: `Resolve ${issue.type} - ${issue.site}`,
                      description: issue.recommendation,
                      priority: issue.severity,
                      site: issue.site
                    })}
                    className="px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Create Task
                  </button>
                  <button className="px-3 py-2 text-sm bg-secondary text-white rounded-md hover:bg-blue-700 transition-colors">
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network KPI Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CpuChipIcon className="w-5 h-5 mr-2 text-secondary" />
          Network KPI Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {NETWORK_KPI_SUMMARY.map((kpi, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{kpi.name}</h4>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500">Target: {kpi.target}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    kpi.status === 'good' ? 'text-green-600' : 
                    kpi.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-gray-500">
                    {kpi.sites_affected} sites affected
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Root Cause Analysis */}
      <RootCauseAnalysis 
        context={{ 
          siteObj: selectedSite || { id: 'CHI003', name: 'Chicago Downtown' },
          issues: filteredIssues
        }}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}
