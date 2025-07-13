import React, { useState, useMemo } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import issues from '../data/issues.json';
import sites from '../data/sites.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function IssueSummary() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedIssueType, setSelectedIssueType] = useState('all');

  // Process sites data to extract issue-related information
  const processedData = useMemo(() => {
    const severityDistribution = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const trendData = [];

    // Generate synthetic issue data based on sites data
    sites.forEach((site) => {
      const severity = site.severity === 1 ? 'Critical' : 
                     site.severity === 2 ? 'High' : 
                     site.severity === 3 ? 'Medium' : 'Low';
      
      severityDistribution[severity]++;
    });

    // Generate trend data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trendData.push({
        date: date.toISOString().split('T')[0],
        critical: Math.floor(Math.random() * 15) + 5,
        high: Math.floor(Math.random() * 25) + 10,
        medium: Math.floor(Math.random() * 40) + 20,
        low: Math.floor(Math.random() * 30) + 15
      });
    }

    return { severityDistribution, trendData };
  }, []);

  // Chart data configurations
  const issueTypeData = {
    labels: issues.map(issue => issue.type),
    datasets: [
      {
        label: 'Issue Count',
        data: issues.map(issue => issue.count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 2
      }
    ]
  };

  const severityData = {
    labels: Object.keys(processedData.severityDistribution),
    datasets: [
      {
        label: 'Issues by Severity',
        data: Object.values(processedData.severityDistribution),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ]
      }
    ]
  };

  const trendData = {
    labels: processedData.trendData.map(d => d.date.split('-').slice(1).join('/')),
    datasets: [
      {
        label: 'Critical',
        data: processedData.trendData.map(d => d.critical),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3
      },
      {
        label: 'High',
        data: processedData.trendData.map(d => d.high),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3
      },
      {
        label: 'Medium',
        data: processedData.trendData.map(d => d.medium),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      }
    ]
  };

  const totalIssues = issues.reduce((sum, issue) => sum + issue.count, 0);

  return (
    <div className="min-h-screen p-6 text-gray-800 bg-gradient-to-br from-white via-gray-100 to-gray-200">
      {/* Issue Summary Header */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          🚨 Issue Summary Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Comprehensive view of network issues, trends, and resolution status across all markets and equipment types.
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard 
            title="Total Issues"
            value={totalIssues}
            color="text-blue-600"
            bgColor="bg-blue-50"
            icon="📊"
          />
          <SummaryCard 
            title="Critical Issues"
            value={processedData.severityDistribution.Critical}
            color="text-red-600"
            bgColor="bg-red-50"
            icon="🚨"
          />
          <SummaryCard 
            title="Resolved Today"
            value={Math.floor(Math.random() * 15) + 5}
            color="text-green-600"
            bgColor="bg-green-50"
            icon="✅"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">🔍 Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
            <select 
              value={selectedIssueType}
              onChange={(e) => setSelectedIssueType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              {issues.map(issue => (
                <option key={issue.type} value={issue.type}>{issue.type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="📊 Issues by Type" color="text-gray-600">
          <Bar data={issueTypeData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
        
        <ChartCard title="🎯 Issues by Severity" color="text-gray-600">
          <Pie data={severityData} options={{ responsive: true, maintainAspectRatio: false }} />
        </ChartCard>
      </div>

      {/* Trend Chart */}
      <ChartCard title="📈 Issue Trends (Last 30 Days)" color="text-gray-600">
        <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartCard>
    </div>
  );
}

// Reusable components
function ChartCard({ title, color, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h3>
      <div className="w-full h-[300px]">{children}</div>
    </div>
  );
}

function SummaryCard({ title, value, color, bgColor, icon }) {
  return (
    <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
