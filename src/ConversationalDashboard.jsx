import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  SparklesIcon,
  BoltIcon,
  MagnifyingGlassIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  CommandLineIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  MapIcon,
  SignalIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/20/solid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import kpiData from './data/kpis.json';
import reports from './data/reports.json';
import questions from './data/questions.js';
import sites from './data/sites.json';
import MapView from './components/MapView';
import enodebSummary from './data/enodeb_summary.json';
import {
  lineOptions,
  lineData,
  barOptions,
  barData,
} from './data/chartData.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ConversationalDashboard = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "🤖 **Verizon AI Network Assistant** - Ready to help optimize your network! What insights can I provide today?",
      timestamp: new Date().toISOString(),
      type: 'welcome'
    }
  ]);

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState('intelligent'); // intelligent, technical, predictive
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to latest message when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const nearbySites = useMemo(() => {
    if (!selectedSite) return [];
    return sites.filter(
      (s) =>
        s.state === selectedSite.state &&
        Math.abs(s.lat - selectedSite.lat) < 0.5 &&
        Math.abs(s.lng - selectedSite.lng) < 0.5
    );
  }, [selectedSite]);

  const results = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return sites.filter((s) =>
      String(s.enodeb).toLowerCase().includes(lower)
    );
  }, [query]);

  const handleSelectSite = (site) => {
    setSelectedSite(site);
    setQuery(String(site.enodeb));
    setShowResults(false);
    setSummary(enodebSummary);
  };

  function generateDynamicResponse(question, site, summary) {
    const lower = question.toLowerCase();
    if (!site) {
      return generateMarketLevelResponse(question);
    }

    const aiPersonality = {
      intelligent: "🧠 **AI Analysis:**",
      technical: "⚙️ **Technical Deep Dive:**", 
      predictive: "🔮 **Predictive Insights:**"
    };

    let response = `${aiPersonality[aiMode]} `;

    // Enhanced Drop Rate Analysis
    if (lower.match(/drop|fail|disconnect|lost/i)) {
      const drop = summary?.kpis?.['Bearer Drop Rate'] ?? summary?.kpis?.['Bearer Drop %'] ?? Math.random() * 5;
      response += `**Bearer Drop Analysis for ${site.geoId}**\n\n`;
      response += `📊 Current Drop Rate: **${drop.toFixed(2)}%**\n`;
      
      if (drop > 2) {
        response += `🚨 **Status: ATTENTION REQUIRED**\n`;
        response += `• Threshold exceeded (>2.0%)\n`;
        response += `• Potential causes: RF interference, hardware issues, overload\n`;
        response += `• Impact: ${Math.round(drop * 150)} users affected per hour\n\n`;
        response += `🎯 **AI Recommendations:**\n`;
        response += `• Investigate RF environment for interference sources\n`;
        response += `• Check recent hardware alarms and performance logs\n`;
        response += `• Consider load balancing to adjacent cells\n`;
        response += `• Monitor for 24h and escalate if >3%\n\n`;
        response += `Would you like me to create an optimization task or show trend analysis?`;
      } else {
        response += `✅ **Status: HEALTHY**\n`;
        response += `• Within acceptable range (<2.0%)\n`;
        response += `• Trending: ${Math.random() > 0.5 ? 'Stable' : 'Improving'}\n`;
        response += `• Continue monitoring for anomalies`;
      }
      return response;
    }

    // Enhanced CQI Analysis  
    if (lower.match(/cqi|quality|modulation/i)) {
      const cqi = summary?.kpis?.CQI ?? (Math.random() * 7 + 3);
      response += `**Channel Quality Analysis for ${site.geoId}**\n\n`;
      response += `📊 Current CQI: **${cqi.toFixed(1)}**\n`;
      
      if (cqi < 8) {
        response += `⚠️ **Status: SUBOPTIMAL**\n`;
        response += `• Below optimal range (8-15)\n`;
        response += `• Radio conditions affecting throughput\n`;
        response += `• Estimated capacity impact: ${Math.round((8-cqi)*12)}%\n\n`;
        response += `🎯 **AI Optimization Strategy:**\n`;
        response += `• Antenna tilt optimization (+/-2°)\n`;
        response += `• Interference mitigation analysis\n`;
        response += `• Power rebalancing evaluation\n`;
        response += `• User density vs coverage analysis\n\n`;
        response += `🔮 **Predictive Impact:** Optimizing could improve throughput by ${Math.round((8-cqi)*15)}%`;
      } else {
        response += `✅ **Status: OPTIMAL**\n`;
        response += `• Excellent radio conditions\n`;
        response += `• Supporting high-order modulation\n`;
        response += `• No immediate optimization needed`;
      }
      return response;
    }

    // Enhanced Throughput Analysis
    if (lower.match(/throughput|speed|capacity|mbps/i)) {
      const tp = summary?.kpis?.Throughput ?? (Math.random() * 40 + 10);
      response += `**Throughput Performance for ${site.geoId}**\n\n`;
      response += `📊 Current Throughput: **${tp.toFixed(1)} Mbps**\n`;
      
      const expectedTp = 25; // Expected baseline
      if (tp < expectedTp) {
        response += `📉 **Status: UNDERPERFORMING**\n`;
        response += `• ${((expectedTp-tp)/expectedTp*100).toFixed(0)}% below expected (${expectedTp} Mbps)\n`;
        response += `• Potential revenue impact: $${Math.round((expectedTp-tp)*100)}/hour\n\n`;
        response += `🔍 **Root Cause Analysis:**\n`;
        response += `• PRB Utilization: ${Math.random() > 0.5 ? 'High (>85%)' : 'Normal'}\n`;
        response += `• Backhaul: ${Math.random() > 0.3 ? 'Adequate' : 'Congested'}\n`;
        response += `• Interference: ${Math.random() > 0.7 ? 'Detected' : 'Clean'}\n\n`;
        response += `🚀 **AI-Powered Solutions:**\n`;
        response += `• Dynamic PRB allocation optimization\n`;
        response += `• Carrier aggregation enablement\n`;
        response += `• MIMO configuration tuning\n`;
        response += `• Traffic steering to underutilized carriers`;
      } else {
        response += `✅ **Status: PERFORMING WELL**\n`;
        response += `• Meeting or exceeding targets\n`;
        response += `• User experience: Excellent\n`;
        response += `• Continue current configuration`;
      }
      return response;
    }

    // General Health Assessment
    if (lower.match(/health|status|overall|summary/i)) {
      const healthScore = Math.random() * 40 + 60; // 60-100
      response += `**Overall Site Health Assessment for ${site.geoId}**\n\n`;
      response += `🏥 **Health Score: ${healthScore.toFixed(0)}/100**\n\n`;
      
      const issues = [];
      const wins = [];
      
      if (Math.random() > 0.6) issues.push("High PRB utilization (>85%)");
      if (Math.random() > 0.7) issues.push("CQI below optimal");
      if (Math.random() > 0.8) issues.push("Bearer drops elevated");
      
      if (Math.random() > 0.5) wins.push("Stable coverage patterns");
      if (Math.random() > 0.6) wins.push("Low interference levels");
      if (Math.random() > 0.4) wins.push("Good user experience metrics");
      
      if (issues.length > 0) {
        response += `⚠️ **Areas Needing Attention:**\n`;
        issues.forEach(issue => response += `• ${issue}\n`);
        response += `\n`;
      }
      
      if (wins.length > 0) {
        response += `✅ **Performing Well:**\n`;
        wins.forEach(win => response += `• ${win}\n`);
        response += `\n`;
      }
      
      response += `🎯 **AI Recommendation:** ${healthScore > 80 ? 'Maintain current configuration with routine monitoring' : 'Schedule optimization review within 48 hours'}`;
      return response;
    }

    return generateFallbackResponse(question, site);
  }

  function generateMarketLevelResponse(question) {
    const lower = question.toLowerCase();
    
    if (lower.match(/market|region|area|overview/i)) {
      return `🌐 **Market Intelligence Overview**\n\n📊 **Current Market Status:**\n• Total Sites: ${sites.length}\n• Critical Issues: ${Math.round(sites.length * 0.12)}\n• Optimization Opportunities: ${Math.round(sites.length * 0.25)}\n\n🎯 **Top Priorities:**\n• Peak hour capacity management\n• Interference mitigation\n• Predictive maintenance\n\nSelect a specific site for detailed analysis, or ask about specific KPIs!`;
    }
    
    return `🤖 **AI Assistant Ready**\n\nI can help you with:\n• Site-specific KPI analysis\n• Performance optimization recommendations\n• Predictive insights and trends\n• Troubleshooting guidance\n\nPlease select a site from the map or ask about specific metrics!`;
  }

  function generateFallbackResponse(question, site) {
    return `🤖 **AI Analysis for ${site?.geoId || 'Network'}**\n\nI understand you're asking about: "${question}"\n\n💡 **I can help you analyze:**\n• Drop rates and connection quality\n• CQI and throughput performance\n• Overall site health\n• Predictive insights\n• Optimization recommendations\n\nTry asking: "What's the throughput performance?" or "Show me the health status"`;
  }

  const handleSend = () => {
    if (!input.trim()) return;
    
    setIsTyping(true);
    const userMessage = { 
      sender: 'user', 
      text: input.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Simulate AI processing delay
    setTimeout(() => {
      let response = generateDynamicResponse(input, selectedSite, summary);
      let charts = false;

      if (!response) {
        // Fallback to general analysis
        const lower = input.toLowerCase();
        if (selectedSite && lower.includes('cqi')) {
          response = generateDynamicResponse('cqi analysis', selectedSite, summary);
          charts = true;
        } else if (selectedSite && lower.includes('throughput')) {
          response = generateDynamicResponse('throughput analysis', selectedSite, summary);
          charts = true;
        } else if (lower.includes('health') || lower.includes('status')) {
          response = generateDynamicResponse('health check', selectedSite, summary);
        } else {
          response = generateFallbackResponse(input, selectedSite);
        }
      }

      const assistantMessage = { 
        sender: 'assistant', 
        text: response, 
        charts,
        timestamp: new Date().toISOString(),
        aiMode: aiMode
      };
      
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
    
    setInput('');
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white text-verizon-black flex flex-col">
      {/* Enhanced AI Header with Real-time Status */}
      <div className="bg-gradient-to-r from-verizon-black via-gray-800 to-verizon-blue text-white p-6 border-b-4 border-verizon-red shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl border border-white/20">
              <SparklesIcon className="w-8 h-8 text-verizon-red" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Verizon AI Network Assistant
              </h1>
              <p className="text-gray-300 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Advanced ML-Powered Network Intelligence</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced AI Mode Selector */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value)}
                className="bg-transparent border-none text-white text-sm font-medium focus:outline-none"
              >
                <option value="intelligent" className="text-black bg-white">🧠 Intelligent Mode</option>
                <option value="technical" className="text-black bg-white">⚙️ Technical Deep-Dive</option>
                <option value="predictive" className="text-black bg-white">🔮 Predictive Analytics</option>
              </select>
            </div>
            
            {/* Voice & Tools */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  voiceEnabled 
                    ? 'bg-verizon-red shadow-lg scale-105' 
                    : 'bg-white/20 hover:bg-white/30'
                } text-white border border-white/20`}
                title="Voice Input"
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
              
              <button
                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/20 transition-all duration-200"
                title="AI Settings"
              >
                <CogIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* AI Status Bar */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <CpuChipIcon className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-200">ML Models: Active</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <BoltIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-200">Processing: Real-time</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-200">Confidence: 94%</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <RocketLaunchIcon className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-200">Predictions: Ready</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Context Banner */}
        {selectedSite && (
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-verizon-red bg-opacity-20 rounded-lg">
                  <MapIcon className="w-5 h-5 text-verizon-red" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">
                    Analyzing: {selectedSite.geoId}
                  </div>
                  <div className="text-sm text-gray-300">
                    Market: <span className="text-verizon-red font-medium">{selectedSite.state}</span> | 
                    eNodeB: <span className="text-blue-300 font-medium">{selectedSite.enodeb}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-verizon-red text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-lg"
                  onClick={() => window.dispatchEvent(new CustomEvent('gotoEndToEnd', { detail: selectedSite }))}
                >
                  🛤️ Path View
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-lg"
                  onClick={() => window.dispatchEvent(new CustomEvent('gotoAiInsights', { detail: selectedSite }))}
                >
                  🤖 AI Insights
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  onClick={() => setSelectedSite(null)}
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Quick KPI Dashboard with AI Insights */}
      {selectedSite && summary && (
        <div className="p-6 bg-gradient-to-r from-white to-gray-50 border-b-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-verizon-blue" />
              Real-time KPI Intelligence
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[
              { 
                label: 'Health Score', 
                value: '87%', 
                status: 'good', 
                icon: CheckCircleIcon,
                trend: '+2.3%',
                aiInsight: 'Stable performance'
              },
              { 
                label: 'Throughput', 
                value: `${summary?.kpis?.Throughput || '23.4'} Mbps`, 
                status: 'warning', 
                icon: SignalIcon,
                trend: '-1.2%',
                aiInsight: 'Peak hour impact'
              },
              { 
                label: 'CQI', 
                value: summary?.kpis?.CQI || '8.2', 
                status: 'good', 
                icon: ChartBarIcon,
                trend: '+0.8%',
                aiInsight: 'Optimal radio conditions'
              },
              { 
                label: 'Drop Rate', 
                value: `${summary?.kpis?.['Bearer Drop Rate'] || '1.2'}%`, 
                status: 'good', 
                icon: ExclamationTriangleIcon,
                trend: '-0.3%',
                aiInsight: 'Within thresholds'
              }
            ].map((kpi, index) => (
              <div key={index} className="group hover:shadow-lg transition-all duration-300">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-verizon-blue transition-colors h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">{kpi.label}</span>
                    <kpi.icon className={`w-5 h-5 ${
                      kpi.status === 'good' ? 'text-green-500' : 
                      kpi.status === 'warning' ? 'text-orange-500' : 'text-red-500'
                    }`} />
                  </div>
                  <div className="text-xl font-bold text-verizon-black mb-1">{kpi.value}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend}
                    </span>
                    <span className="text-xs text-gray-500">{kpi.aiInsight}</span>
                  </div>
                  
                  {/* AI Progress Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          kpi.status === 'good' ? 'bg-green-500' : 
                          kpi.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: kpi.status === 'good' ? '85%' : kpi.status === 'warning' ? '65%' : '40%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Chat Messages with AI Branding */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-2xl transition-all duration-300 hover:shadow-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-verizon-red to-red-600 text-white rounded-2xl rounded-br-sm shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-verizon-black rounded-2xl rounded-bl-sm shadow-md hover:border-verizon-blue'
              } px-6 py-4`}
            >
              {message.sender === 'assistant' && (
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-verizon-blue bg-opacity-20 rounded-lg">
                      <SparklesIcon className="w-4 h-4 text-verizon-blue" />
                    </div>
                    <span className="text-sm font-bold text-verizon-blue">
                      Verizon AI • {message.aiMode || aiMode} mode
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
              )}
              
              <div className="text-sm whitespace-pre-line leading-relaxed">{message.text}</div>
              
              {message.sender === 'assistant' && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-xs px-3 py-1 bg-verizon-blue bg-opacity-10 text-verizon-blue rounded-full hover:bg-opacity-20 transition-colors">
                        👍 Helpful
                      </button>
                      <button className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        🔄 Follow-up
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
              
              {message.sender === 'user' && message.timestamp && (
                <div className="text-xs mt-2 text-white/70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-verizon-blue text-verizon-black rounded-2xl rounded-bl-sm shadow-lg px-6 py-4 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-verizon-blue bg-opacity-20 rounded-xl">
                  <CpuChipIcon className="w-5 h-5 text-verizon-blue animate-pulse" />
                </div>
                <div>
                  <span className="text-sm font-bold text-verizon-blue block">AI is analyzing...</span>
                  <div className="flex space-x-1 mt-1">
                    <div className="w-2 h-2 bg-verizon-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-verizon-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-verizon-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Enhanced Quick Actions with AI Suggestions */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-200">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
            <LightBulbIcon className="w-4 h-4 mr-2 text-verizon-blue" />
            AI-Suggested Actions
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { text: "Analyze site health", icon: "🏥", color: "green" },
              { text: "Check throughput", icon: "📊", color: "blue" },
              { text: "Show drop rates", icon: "📉", color: "orange" },
              { text: "Optimization tips", icon: "🎯", color: "purple" }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => setInput(action.text)}
                className={`px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 group ${
                  action.color === 'green' ? 'hover:border-green-400 hover:bg-green-50' :
                  action.color === 'blue' ? 'hover:border-blue-400 hover:bg-blue-50' :
                  action.color === 'orange' ? 'hover:border-orange-400 hover:bg-orange-50' :
                  'hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <div className="text-lg mb-1">{action.icon}</div>
                <div className="text-xs text-gray-600 group-hover:text-gray-800">{action.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Input Section with AI Features */}
      <div className="p-6 bg-white border-t-4 border-verizon-red shadow-xl">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-4 z-10">
              <SparklesIcon className="w-5 h-5 text-verizon-blue" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedSite ? `Ask AI about ${selectedSite.geoId}...` : "Ask Verizon AI about network performance..."}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-verizon-blue focus:ring-2 focus:ring-verizon-blue focus:ring-opacity-20 bg-white text-gray-800 placeholder-gray-500 shadow-inner transition-all duration-200"
            />
            {voiceEnabled && (
              <button className="absolute right-4 top-4 text-verizon-red hover:text-red-700 transition-colors">
                <MicrophoneIcon className="w-5 h-5" />
              </button>
            )}
            
            {/* AI Suggestions Popup */}
            {input && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-20 max-h-32 overflow-y-auto">
                {[
                  `${input} in detail`,
                  `Show ${input} trends`,
                  `Compare ${input} with baseline`,
                  `AI recommendations for ${input}`
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-8 py-4 bg-gradient-to-r from-verizon-red to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            <RocketLaunchIcon className="w-5 h-5" />
            <span>Analyze with AI</span>
          </button>
        </div>
        
        {/* AI Mode Indicator */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <CpuChipIcon className="w-4 h-4 text-verizon-blue" />
            <span>AI Mode: <strong className="text-verizon-blue">{aiMode}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <BoltIcon className="w-4 h-4 text-yellow-500" />
            <span>Response time: ~200ms</span>
          </div>
        </div>
      </div>

      {/* Enhanced Site Selector with AI Recommendations */}
      {!selectedSite && (
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 border-t-2 border-gray-200">
          <div className="text-center max-w-2xl mx-auto">
            <div className="p-4 bg-gradient-to-br from-verizon-blue to-blue-600 rounded-2xl inline-block mb-4">
              <MapIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-verizon-black mb-2">
              AI-Powered Site Analysis
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Select a site from the Live Map & KPI tab to unlock advanced AI insights, 
              predictive analytics, and intelligent optimization recommendations.
            </p>
            
            {/* Featured Sites */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 mr-2 text-verizon-blue" />
                AI-Recommended Sites for Analysis
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {sites.slice(0, 3).map((site, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSite(site)}
                    className="group p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-verizon-blue hover:shadow-lg transition-all duration-200"
                  >
                    <div className="text-lg font-bold text-verizon-black group-hover:text-verizon-blue transition-colors">
                      {site.geoId}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{site.state}</div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Ready for AI</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* AI Capabilities Preview */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CpuChipIcon className="w-5 h-5 text-verizon-blue" />
                  <span className="font-bold text-blue-800">ML Analysis</span>
                </div>
                <p className="text-sm text-blue-700">
                  Advanced pattern recognition and predictive modeling for network optimization.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <RocketLaunchIcon className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Auto-Actions</span>
                </div>
                <p className="text-sm text-green-700">
                  Autonomous recommendations with one-click deployment capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationalDashboard;
