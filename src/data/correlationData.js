// Mock data generator for KPI correlation analysis
// This provides fallback data when real ML analytics are not available

export const mockCorrelationData = {
  // Market-wide KPI trends
  marketTrends: {
    timeRange: '2025-06-01 to 2025-07-09',
    markets: ['Dallas', 'Chicago', 'Oklahoma', 'Tampa'],
    kpis: {
      'CQI': { values: [8.2, 7.9, 7.1, 6.8, 6.5, 6.2, 5.9], trend: 'declining', correlation: 0.92 },
      'Throughput': { values: [45.2, 42.1, 38.9, 35.4, 32.1, 28.9, 25.3], trend: 'declining', correlation: 0.94 },
      'RSRP': { values: [-98, -99, -101, -103, -105, -107, -109], trend: 'declining', correlation: 0.89 },
      'RRC_Failure': { values: [2.1, 3.2, 4.8, 6.5, 8.9, 11.2, 14.5], trend: 'increasing', correlation: -0.87 }
    }
  },

  // Hourly patterns
  hourlyPatterns: {
    peakHours: ['08:00-10:00', '12:00-14:00', '17:00-19:00'],
    degradationPattern: {
      '08:00': { throughput: 85, cqi: 6.2, failures: 12.5 },
      '12:00': { throughput: 78, cqi: 5.9, failures: 15.2 },
      '17:00': { throughput: 72, cqi: 5.4, failures: 18.9 },
      '22:00': { throughput: 95, cqi: 8.1, failures: 3.2 }
    }
  },

  // Site health correlation
  siteHealth: {
    worstSites: [
      { siteId: 'CHI003', healthScore: 23, issues: ['Low CQI', 'High Interference', 'Hardware Aging'] },
      { siteId: 'DAL016', healthScore: 31, issues: ['Coverage Gap', 'Overload', 'RF Issues'] },
      { siteId: 'OKL024', healthScore: 28, issues: ['Interference', 'Handover Failures', 'Capacity'] },
      { siteId: 'TAM042', healthScore: 34, issues: ['Signal Quality', 'Equipment Fault', 'Congestion'] }
    ]
  },

  // KPI correlations matrix
  correlationMatrix: {
    'CQI': { 'Throughput': 0.94, 'RSRQ': 0.87, 'SINR': 0.91, 'Bearer_Drop': -0.82 },
    'Throughput': { 'CQI': 0.94, 'RSRP': 0.76, 'Latency': -0.89, 'User_Count': 0.65 },
    'RSRP': { 'RSRQ': 0.73, 'Coverage': 0.88, 'Handover_Success': 0.81, 'Call_Drop': -0.79 },
    'RRC_Failure': { 'Bearer_Drop': 0.89, 'Core_Congestion': 0.85, 'Signaling_Load': 0.92, 'User_Experience': -0.91 }
  },

  // Predictive insights
  predictions: {
    healthScoreForecast: {
      next7Days: [62, 58, 54, 51, 47, 44, 40],
      confidence: 0.85,
      riskLevel: 'high',
      recommendedActions: ['Immediate RF optimization', 'Hardware replacement', 'Capacity expansion']
    }
  },

  // Issue patterns
  issuePatterns: [
    {
      pattern: 'CQI-Throughput Degradation',
      frequency: 'Daily during peak hours',
      correlation: 0.94,
      rootCause: 'Interference and capacity constraints',
      recommendation: 'Implement interference coordination and add carriers'
    },
    {
      pattern: 'RRC-Bearer Cascade Failure',
      frequency: 'Weekly during maintenance windows',
      correlation: 0.89,
      rootCause: 'Core network overload during failover',
      recommendation: 'Optimize core redundancy and load balancing'
    },
    {
      pattern: 'Coverage-Quality Inverse Relationship',
      frequency: 'Continuous in rural areas',
      correlation: -0.76,
      rootCause: 'Distance from cell and terrain obstacles',
      recommendation: 'Deploy small cells and optimize antenna patterns'
    }
  ]
};

// Generate recommendation based on KPI patterns
export const generateSmartRecommendations = (kpiData) => {
  const recommendations = [];

  // CQI-based recommendations
  if (kpiData.cqi && kpiData.cqi < 7) {
    if (kpiData.throughput && kpiData.throughput < 30) {
      recommendations.push({
        type: 'interference_mitigation',
        priority: 'high',
        title: 'CQI-Throughput Correlation Issue',
        description: 'Strong negative correlation detected between CQI degradation and throughput reduction',
        actions: [
          'Perform interference hunting analysis',
          'Check for PIM (Passive Intermodulation) issues',
          'Review frequency planning and neighboring cell interference',
          'Inspect antenna systems and feeders for physical issues',
          'Consider frequency refarming or additional spectrum'
        ],
        expectedImprovement: '30-50% throughput increase',
        correlationScore: 0.94
      });
    }
  }

  // RSRP-based recommendations
  if (kpiData.rsrp && kpiData.rsrp < -105) {
    recommendations.push({
      type: 'coverage_optimization',
      priority: 'medium',
      title: 'Coverage Gap Mitigation',
      description: 'Poor RSRP values indicating coverage issues with correlated service quality impact',
      actions: [
        'Conduct detailed coverage analysis and drive testing',
        'Optimize antenna tilt and azimuth for better coverage',
        'Consider power boost for edge areas',
        'Plan small cell deployment for coverage holes',
        'Review and optimize handover parameters'
      ],
      expectedImprovement: '20-30% coverage improvement',
      correlationScore: 0.88
    });
  }

  // Failure rate recommendations
  if (kpiData.rrcFailure && kpiData.rrcFailure > 10) {
    recommendations.push({
      type: 'capacity_optimization',
      priority: 'critical',
      title: 'Connection Failure Prevention',
      description: 'High RRC failure rates correlating with overall service degradation',
      actions: [
        'Check MME and core network capacity utilization',
        'Review RACH configuration and optimize for high traffic',
        'Analyze signaling load and implement admission control',
        'Monitor S1 interface performance and latency',
        'Consider core network scaling if needed'
      ],
      expectedImprovement: 'Prevent service outages',
      correlationScore: 0.91
    });
  }

  return recommendations;
};

// Export correlation insights for visualization
export const getCorrelationInsights = () => {
  return {
    strongestCorrelations: [
      { kpi1: 'CQI', kpi2: 'Throughput', strength: 0.94, relationship: 'positive' },
      { kpi1: 'RRC Failure', kpi2: 'Bearer Drop', strength: 0.89, relationship: 'positive' },
      { kpi1: 'RSRP', kpi2: 'Coverage Quality', strength: 0.88, relationship: 'positive' },
      { kpi1: 'Peak Hours', kpi2: 'Failure Rate', strength: 0.85, relationship: 'positive' }
    ],
    insights: [
      'CQI and Throughput show the strongest positive correlation, indicating that improving Channel Quality will directly improve user experience',
      'RRC failures tend to cascade into Bearer drops, suggesting early intervention can prevent larger service issues',
      'Peak hour traffic patterns strongly correlate with failure rates, indicating capacity constraints',
      'Site health scores accurately predict future performance with 85% confidence'
    ],
    actionableFindings: [
      'Focus RF optimization efforts on improving CQI for maximum throughput impact',
      'Implement predictive alerting for RRC failures to prevent cascade effects',
      'Schedule proactive capacity expansion during identified peak hours',
      'Prioritize maintenance for sites with health scores below 40'
    ]
  };
};
