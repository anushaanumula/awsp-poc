import React, { useState, useRef, useEffect } from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon,
  SignalIcon,
  ChartBarIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Brand theme colors
const BRAND_COLORS = {
  primary: '#ff0000',
  secondary: '#3285dc', 
  neutral: '#f2f2f2',
  black: '#000000',
  white: '#ffffff',
  concrete: '#f2f2f2'
};

// Chart generators
const generateSiteComparisonChart = (sites) => {
  return {
    type: 'bar',
    data: {
      labels: sites,
      datasets: [
        {
          label: 'Throughput (Mbps)',
          data: sites.map(() => Math.floor(Math.random() * 300) + 100),
          backgroundColor: BRAND_COLORS.primary,
          borderColor: BRAND_COLORS.primary,
          borderWidth: 1
        },
        {
          label: 'Availability (%)',
          data: sites.map(() => Math.floor(Math.random() * 5) + 95),
          backgroundColor: BRAND_COLORS.secondary,
          borderColor: BRAND_COLORS.secondary,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Site Performance Comparison'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };
};

const generateKpiTrendChart = (timeRange = '24h') => {
  const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 48;
  const labels = Array.from({length: hours/4}, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - (hours - i*4));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });

  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Throughput (Mbps)',
          data: labels.map(() => Math.floor(Math.random() * 100) + 200),
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primary + '20',
          tension: 0.1
        },
        {
          label: 'Latency (ms)',
          data: labels.map(() => Math.floor(Math.random() * 20) + 10),
          borderColor: BRAND_COLORS.secondary,
          backgroundColor: BRAND_COLORS.secondary + '20',
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `KPI Trends - Last ${timeRange}`
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }
  };
};

const generateIssueDistributionChart = () => {
  return {
    type: 'doughnut',
    data: {
      labels: ['Capacity Issues', 'Signal Problems', 'Hardware Alerts', 'Configuration Issues', 'Other'],
      datasets: [
        {
          data: [12, 8, 5, 3, 2],
          backgroundColor: [
            BRAND_COLORS.primary,
            BRAND_COLORS.secondary,
            '#ff6b6b',
            '#4ecdc4',
            '#45b7d1'
          ],
          borderWidth: 2,
          borderColor: BRAND_COLORS.white
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Issue Distribution Today'
        }
      }
    }
  };
};

const generateMarketComparisonChart = (markets) => {
  return {
    type: 'bar',
    data: {
      labels: markets,
      datasets: [
        {
          label: 'Active Sites',
          data: markets.map(() => Math.floor(Math.random() * 50) + 20),
          backgroundColor: BRAND_COLORS.primary,
        },
        {
          label: 'Issues Count',
          data: markets.map(() => Math.floor(Math.random() * 10) + 1),
          backgroundColor: BRAND_COLORS.secondary,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Market Performance Comparison'
        }
      }
    }
  };
};

// New chart generators
const generateCapacityAnalysisChart = () => {
  const sites = ['CHI003', 'DAL016', 'OKL044', 'TAM042', 'STL020'];
  return {
    type: 'bar',
    data: {
      labels: sites,
      datasets: [
        {
          label: 'Current Usage (%)',
          data: sites.map(() => Math.floor(Math.random() * 40) + 60),
          backgroundColor: BRAND_COLORS.primary,
          borderColor: BRAND_COLORS.primary,
          borderWidth: 1
        },
        {
          label: 'Peak Capacity (%)',
          data: sites.map(() => Math.floor(Math.random() * 20) + 80),
          backgroundColor: '#ff6b6b',
          borderColor: '#ff6b6b',
          borderWidth: 1
        },
        {
          label: 'Available Capacity (%)',
          data: sites.map(() => Math.floor(Math.random() * 30) + 10),
          backgroundColor: '#4ecdc4',
          borderColor: '#4ecdc4',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Network Capacity Analysis by Site' }
      },
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  };
};

const generateTrafficVolumeChart = (timeRange = '7d') => {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
  const labels = Array.from({length: days}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Data Traffic (GB)',
          data: labels.map(() => Math.floor(Math.random() * 500) + 1000),
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primary + '20',
          tension: 0.1,
          fill: true
        },
        {
          label: 'Voice Traffic (min)',
          data: labels.map(() => Math.floor(Math.random() * 200) + 300),
          borderColor: BRAND_COLORS.secondary,
          backgroundColor: BRAND_COLORS.secondary + '20',
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: `Network Traffic Volume - Last ${timeRange}` }
      },
      scales: {
        y: { type: 'linear', display: true, position: 'left' },
        y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
      }
    }
  };
};

const generateSignalStrengthChart = () => {
  const areas = ['Downtown', 'Suburbs', 'Industrial', 'Rural', 'Highway'];
  return {
    type: 'radar',
    data: {
      labels: areas,
      datasets: [
        {
          label: 'Current Signal Strength',
          data: areas.map(() => Math.floor(Math.random() * 30) + 70),
          borderColor: BRAND_COLORS.primary,
          backgroundColor: BRAND_COLORS.primary + '20',
          pointBackgroundColor: BRAND_COLORS.primary,
          pointBorderColor: BRAND_COLORS.white,
          pointHoverBackgroundColor: BRAND_COLORS.white,
          pointHoverBorderColor: BRAND_COLORS.primary
        },
        {
          label: 'Target Signal Strength',
          data: [85, 80, 75, 70, 78],
          borderColor: BRAND_COLORS.secondary,
          backgroundColor: BRAND_COLORS.secondary + '10',
          pointBackgroundColor: BRAND_COLORS.secondary,
          pointBorderColor: BRAND_COLORS.white,
          pointHoverBackgroundColor: BRAND_COLORS.white,
          pointHoverBorderColor: BRAND_COLORS.secondary
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Signal Strength Coverage Map' }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          pointLabels: { font: { size: 12 } }
        }
      }
    }
  };
};

const generateOutageFrequencyChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Planned Outages',
          data: months.map(() => Math.floor(Math.random() * 3) + 1),
          backgroundColor: '#4ecdc4',
          borderColor: '#4ecdc4',
          borderWidth: 1
        },
        {
          label: 'Unplanned Outages',
          data: months.map(() => Math.floor(Math.random() * 5) + 1),
          backgroundColor: BRAND_COLORS.primary,
          borderColor: BRAND_COLORS.primary,
          borderWidth: 1
        },
        {
          label: 'Emergency Maintenance',
          data: months.map(() => Math.floor(Math.random() * 2)),
          backgroundColor: '#ff6b6b',
          borderColor: '#ff6b6b',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Outage Frequency Analysis - Last 6 Months' }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  };
};

const generateUserExperienceChart = () => {
  return {
    type: 'doughnut',
    data: {
      labels: ['Excellent (>90%)', 'Good (70-90%)', 'Fair (50-70%)', 'Poor (<50%)'],
      datasets: [
        {
          data: [65, 25, 8, 2],
          backgroundColor: ['#4ecdc4', '#45b7d1', '#ffa726', BRAND_COLORS.primary],
          borderWidth: 2,
          borderColor: BRAND_COLORS.white
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        title: { display: true, text: 'User Experience Quality Distribution' }
      }
    }
  };
};

const generatePerformanceDegradationChart = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [
        {
          label: 'Network Health Score',
          data: [92, 89, 85, 88],
          borderColor: BRAND_COLORS.secondary,
          backgroundColor: BRAND_COLORS.secondary + '20',
          tension: 0.1,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Performance Benchmark',
          data: [90, 90, 90, 90],
          borderColor: '#4ecdc4',
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Network Performance Degradation Tracking' }
      },
      scales: {
        y: { beginAtZero: false, min: 80, max: 100 }
      }
    }
  };
};

// Mock responses for network operations
const MOCK_RESPONSES = {
  'show me sites with issues': {
    type: 'site_list',
    data: [
      { id: 'CHI003', name: 'Chicago Downtown', issue: 'High packet loss', severity: 'critical' },
      { id: 'DAL016', name: 'Dallas North', issue: 'Capacity congestion', severity: 'high' },
      { id: 'OKL044', name: 'Oklahoma West', issue: 'Signal degradation', severity: 'medium' }
    ]
  },
  'network performance': {
    type: 'metrics',
    data: {
      availability: '99.2%',
      throughput: '847 Mbps',
      latency: '12ms',
      active_users: '234,567'
    }
  },
  'top issues today': {
    type: 'issues_with_chart',
    data: [
      { type: 'Capacity Issues', count: 12, trend: 'up' },
      { type: 'Signal Problems', count: 8, trend: 'down' },
      { type: 'Hardware Alerts', count: 5, trend: 'stable' }
    ],
    chart: generateIssueDistributionChart()
  },
  'help': {
    type: 'help',
    data: [
      'Ask about network performance',
      'Check site status: "status of CHI003"',
      'View KPI trends: "show KPI trends"',
      'Compare sites: "compare CHI003 vs DAL016"',
      'Market analysis: "compare markets"',
      'Get issue summary: "top issues today"',
      'Network capacity: "network capacity analysis"',
      'Traffic analysis: "traffic volume last 7d"',
      'Signal coverage: "signal strength coverage"',
      'Outage tracking: "outage frequency analysis"',
      'User experience: "user experience quality"',
      'Performance health: "performance degradation"',
      'Site recommendations: "optimize DAL016"'
    ]
  }
};

const SUGGESTED_QUERIES = [
  "Show me sites with issues",
  "Compare CHI003 vs DAL016",
  "KPI trends last 24h",
  "Top issues today",
  "Compare markets",
  "Network capacity analysis",
  "Traffic volume last 7d",
  "Signal strength coverage",
  "Outage frequency analysis",
  "User experience quality",
  "Performance degradation",
  "Network performance overview",
  "Help"
];

const ConversationalUI = ({ context, onSelectSite, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your Network AI Assistant. I can help you monitor sites, analyze KPIs, generate comparison charts, and troubleshoot issues. Try asking me to compare sites or show KPI trends with interactive graphs!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Pattern matching for different types of queries
    if (input.includes('site') && (input.includes('issue') || input.includes('problem'))) {
      return MOCK_RESPONSES['show me sites with issues'];
    }
    
    if (input.includes('performance') || input.includes('network')) {
      return MOCK_RESPONSES['network performance'];
    }
    
    if (input.includes('issue') || input.includes('problem') || input.includes('alert')) {
      return MOCK_RESPONSES['top issues today'];
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return MOCK_RESPONSES['help'];
    }
    
    // Chart-generating queries
    if (input.includes('compare') && (input.includes('site') || input.match(/[a-z]{3}\d{3}/i))) {
      const siteMatches = input.match(/[a-z]{3}\d{3}/gi);
      const sites = siteMatches || ['CHI003', 'DAL016', 'OKL044'];
      return {
        type: 'site_comparison_chart',
        data: {
          sites: sites.slice(0, 5), // Limit to 5 sites for readability
          message: `Comparing performance metrics for ${sites.slice(0, 5).join(', ')}`
        },
        chart: generateSiteComparisonChart(sites.slice(0, 5))
      };
    }
    
    if (input.includes('compare') && input.includes('market')) {
      const markets = ['Chicago', 'Dallas', 'Oklahoma', 'Tampa', 'St. Louis'];
      return {
        type: 'market_comparison_chart',
        data: {
          markets,
          message: 'Market performance comparison across regions'
        },
        chart: generateMarketComparisonChart(markets)
      };
    }
    
    if (input.includes('kpi') && input.includes('trend')) {
      const timeMatch = input.match(/(\d+)(h|d)/);
      const timeRange = timeMatch ? `${timeMatch[1]}${timeMatch[2]}` : '24h';
      return {
        type: 'kpi_trends_chart',
        data: {
          period: `Last ${timeRange}`,
          message: `KPI performance trends over the last ${timeRange}`
        },
        chart: generateKpiTrendChart(timeRange)
      };
    }
    
    if (input.includes('trend') && !input.includes('kpi')) {
      return {
        type: 'kpi_trends_chart',
        data: {
          period: 'Last 24h',
          message: 'Network performance trends over the last 24 hours'
        },
        chart: generateKpiTrendChart('24h')
      };
    }
    
    // New chart-generating queries
    if (input.includes('capacity') || input.includes('usage')) {
      return {
        type: 'capacity_analysis_chart',
        data: {
          message: 'Network capacity analysis across key sites'
        },
        chart: generateCapacityAnalysisChart()
      };
    }
    
    if (input.includes('traffic') && input.includes('volume')) {
      const timeMatch = input.match(/(\d+)(d)/);
      const timeRange = timeMatch ? `${timeMatch[1]}${timeMatch[2]}` : '7d';
      return {
        type: 'traffic_volume_chart',
        data: {
          period: `Last ${timeRange}`,
          message: `Network traffic volume analysis over the last ${timeRange}`
        },
        chart: generateTrafficVolumeChart(timeRange)
      };
    }
    
    if (input.includes('signal') && (input.includes('strength') || input.includes('coverage'))) {
      return {
        type: 'signal_strength_chart',
        data: {
          message: 'Signal strength coverage analysis across different areas'
        },
        chart: generateSignalStrengthChart()
      };
    }
    
    if (input.includes('outage') || input.includes('downtime') || input.includes('maintenance')) {
      return {
        type: 'outage_frequency_chart',
        data: {
          message: 'Outage frequency and maintenance analysis'
        },
        chart: generateOutageFrequencyChart()
      };
    }
    
    if (input.includes('user experience') || input.includes('customer satisfaction') || input.includes('quality')) {
      return {
        type: 'user_experience_chart',
        data: {
          message: 'User experience quality distribution analysis'
        },
        chart: generateUserExperienceChart()
      };
    }
    
    if (input.includes('degradation') || input.includes('health score') || input.includes('performance score')) {
      return {
        type: 'performance_degradation_chart',
        data: {
          message: 'Network performance degradation tracking over time'
        },
        chart: generatePerformanceDegradationChart()
      };
    }
    
    // Default response
    return {
      type: 'default',
      data: "I understand you're asking about network operations. I can help with site status, KPIs, issues, comparisons with charts, and optimization. Try asking 'help' to see what I can do!"
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestedQuery = (query) => {
    setInput(query);
  };

  const renderBotResponse = (content) => {
    if (typeof content === 'string') {
      return <p className="text-gray-700">{content}</p>;
    }

    switch (content.type) {
      case 'site_list':
        return (
          <div className="space-y-2">
            <p className="text-gray-700 mb-3">Found {content.data.length} sites with issues:</p>
            {content.data.map(site => (
              <div 
                key={site.id} 
                className="p-3 bg-base-200 rounded-lg border-l-4 border-primary cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectSite && onSelectSite(site)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-base-content">{site.id}</span>
                    <span className="text-gray-600 ml-2">{site.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    site.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    site.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {site.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{site.issue}</p>
              </div>
            ))}
          </div>
        );

      case 'metrics':
        return (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(content.data).map(([key, value]) => (
              <div key={key} className="p-3 bg-secondary bg-opacity-10 rounded-lg border border-secondary border-opacity-20">
                <div className="text-xs text-secondary uppercase tracking-wide font-semibold">
                  {key.replace('_', ' ')}
                </div>
                <div className="text-lg font-bold text-base-content">{value}</div>
              </div>
            ))}
          </div>
        );

      case 'issues':
      case 'issues_with_chart':
        return (
          <div className="space-y-4">
            <p className="text-gray-700 mb-3">Current issue breakdown:</p>
            <div className="space-y-2">
              {content.data.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-base-200 rounded border-l-2 border-primary">
                  <span className="text-base-content font-medium">{issue.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-primary">{issue.count}</span>
                    {issue.trend === 'up' && <span className="text-red-500">↑</span>}
                    {issue.trend === 'down' && <span className="text-green-500">↓</span>}
                    {issue.trend === 'stable' && <span className="text-gray-400">→</span>}
                  </div>
                </div>
              ))}
            </div>
            {content.chart && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-base-200">
                <div className="h-64">
                  <Doughnut data={content.chart.data} options={content.chart.options} />
                </div>
              </div>
            )}
          </div>
        );

      case 'site_comparison_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Bar data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'market_comparison_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Bar data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'kpi_trends_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Line data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'capacity_analysis_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Bar data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'traffic_volume_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Line data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'signal_strength_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Radar data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'outage_frequency_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Bar data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'user_experience_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-64">
                <Doughnut data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'performance_degradation_chart':
        return (
          <div className="space-y-4">
            <p className="text-base-content font-semibold">{content.data.message}</p>
            <div className="bg-white p-4 rounded-lg border border-base-200 shadow-sm">
              <div className="h-80">
                <Line data={content.chart.data} options={content.chart.options} />
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-2">
            <p className="text-gray-700 mb-3">Here's what I can help you with:</p>
            {content.data.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <LightBulbIcon className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        );

      case 'site_status':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-base-content">{content.data.site}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                content.data.status === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {content.data.status}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="text-sm">
                <span className="text-gray-500">Uptime: </span>
                <span className="font-medium text-base-content">{content.data.uptime}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Last Updated: </span>
                <span className="font-medium text-base-content">{content.data.last_updated}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content">Key Metrics:</p>
              {Object.entries(content.data.kpis).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm p-2 bg-base-200 rounded">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium text-base-content">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CpuChipIcon className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-base-content">Optimization for {content.data.site}</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Recommended actions:</p>
              {content.data.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-secondary bg-opacity-10 rounded border-l-2 border-secondary">
                  <span className="text-primary font-bold text-sm min-w-[20px]">{index + 1}.</span>
                  <span className="text-sm text-base-content">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'kpi_trends':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-base-content">KPI Trends - {content.data.period}</span>
            </div>
            <div className="space-y-2">
              {content.data.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded border border-gray-200">
                  <span className="text-base-content font-medium">{trend.metric}</span>
                  <div className="text-right">
                    <div className="font-bold text-base-content">{trend.value}</div>
                    <div className={`text-xs font-semibold ${
                      trend.change.startsWith('+') && !trend.metric.includes('Latency') && !trend.metric.includes('Error') ? 'text-green-600' :
                      trend.change.startsWith('-') && (trend.metric.includes('Latency') || trend.metric.includes('Error')) ? 'text-green-600' :
                      'text-primary'
                    }`}>
                      {trend.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p className="text-gray-700">{content.data}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-primary">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary via-red-700 to-gray-900 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Network AI Assistant</h2>
            <p className="text-xs text-white text-opacity-80">Intelligent network analysis & insights</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 hover:scale-105"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                message.type === 'user'
                  ? 'bg-primary text-white border-primary shadow-primary/20' 
                  : 'bg-white text-gray-800 border-gray-200 shadow-gray-100'
              }`}
            >
              {message.type === 'bot' ? renderBotResponse(message.content) : message.content}
              <div className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-red-100' : 'text-gray-500'
              }`}>
                <ClockIcon className="w-3 h-3 inline mr-1" />
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-white">
          <p className="text-sm text-base-content font-semibold mb-3">Try these queries to see interactive charts:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(query)}
                className="px-3 py-2 text-xs bg-neutral border border-primary border-opacity-30 rounded-lg hover:bg-primary hover:text-white transition-all duration-200 text-base-content font-medium shadow-sm hover:shadow-md hover:scale-105"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about comparisons, trends, network status, KPIs..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-primary shadow-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md hover:scale-105"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationalUI;
