// Root Cause Analysis Engine
// This engine analyzes KPI data to determine potential root causes and provides next best actions

export class RCAEngine {
  constructor() {
    this.rcaRules = {
      'RRC Setup Failure Rate': {
        highThreshold: 15,
        moderateThreshold: 8,
        rootCauses: {
          high: [
            {
              cause: 'Core Network Congestion',
              probability: 0.35,
              indicators: ['High CPU on MME', 'S1 interface congestion', 'Core latency spikes'],
              nextActions: [
                'Check MME performance metrics',
                'Verify S1 interface utilization',
                'Scale core network capacity',
                'Implement load balancing'
              ]
            },
            {
              cause: 'Radio Resource Shortage',
              probability: 0.25,
              indicators: ['High PRB utilization', 'RACH overload', 'Limited PDCCH capacity'],
              nextActions: [
                'Analyze PRB utilization patterns',
                'Optimize RACH configuration',
                'Add carrier capacity',
                'Implement carrier aggregation'
              ]
            },
            {
              cause: 'Neighbor Relation Issues',
              probability: 0.20,
              indicators: ['Missing neighbor relations', 'Handover failures', 'Coverage gaps'],
              nextActions: [
                'Audit neighbor cell list',
                'Perform drive test',
                'Update ANR configuration',
                'Optimize handover parameters'
              ]
            },
            {
              cause: 'Hardware/Software Issues',
              probability: 0.20,
              indicators: ['Baseband alarms', 'Software errors', 'Hardware faults'],
              nextActions: [
                'Check baseband health',
                'Review error logs',
                'Schedule maintenance',
                'Update software version'
              ]
            }
          ],
          moderate: [
            {
              cause: 'Interference Issues',
              probability: 0.40,
              indicators: ['High RSRQ degradation', 'UL interference', 'Adjacent channel interference'],
              nextActions: [
                'Perform interference analysis',
                'Check frequency planning',
                'Optimize power settings',
                'Consider frequency refarming'
              ]
            },
            {
              cause: 'Capacity Constraints',
              probability: 0.35,
              indicators: ['Peak hour congestion', 'Limited resources', 'User density'],
              nextActions: [
                'Monitor traffic patterns',
                'Implement load balancing',
                'Plan capacity expansion',
                'Optimize scheduler algorithms'
              ]
            },
            {
              cause: 'Configuration Drift',
              probability: 0.25,
              indicators: ['Parameter misalignment', 'Recent changes', 'Configuration errors'],
              nextActions: [
                'Audit configuration parameters',
                'Compare with baseline',
                'Rollback recent changes',
                'Implement change management'
              ]
            }
          ]
        }
      },
      'Bearer Drop Rate': {
        highThreshold: 5,
        moderateThreshold: 2,
        rootCauses: {
          high: [
            {
              cause: 'Handover Failures',
              probability: 0.40,
              indicators: ['High handover failure rate', 'Coverage gaps', 'Poor neighbor planning'],
              nextActions: [
                'Analyze handover statistics',
                'Check neighbor cell configuration',
                'Perform drive test validation',
                'Optimize handover thresholds'
              ]
            },
            {
              cause: 'Radio Link Quality Degradation',
              probability: 0.30,
              indicators: ['Poor RSRP/RSRQ', 'High interference', 'Fading conditions'],
              nextActions: [
                'Check RF conditions',
                'Optimize antenna configuration',
                'Review power settings',
                'Implement diversity techniques'
              ]
            },
            {
              cause: 'Transport Network Issues',
              probability: 0.20,
              indicators: ['Backhaul congestion', 'Latency spikes', 'Packet loss'],
              nextActions: [
                'Monitor backhaul utilization',
                'Check transport QoS',
                'Upgrade backhaul capacity',
                'Implement traffic shaping'
              ]
            },
            {
              cause: 'UE Mobility Patterns',
              probability: 0.10,
              indicators: ['High-speed mobility', 'Frequent cell changes', 'Edge coverage'],
              nextActions: [
                'Analyze mobility patterns',
                'Optimize cell overlap',
                'Adjust hysteresis parameters',
                'Implement mobility robustness'
              ]
            }
          ]
        }
      },
      'RSRP (dBm)': {
        highThreshold: -100,
        moderateThreshold: -110,
        rootCauses: {
          high: [
            {
              cause: 'Coverage Gap',
              probability: 0.35,
              indicators: ['Distance from cell', 'Terrain obstacles', 'Building penetration'],
              nextActions: [
                'Perform coverage analysis',
                'Plan new site deployment',
                'Optimize antenna patterns',
                'Consider small cell deployment'
              ]
            },
            {
              cause: 'Antenna/RF Issues',
              probability: 0.25,
              indicators: ['Antenna misalignment', 'Feeder issues', 'Power amplifier problems'],
              nextActions: [
                'Check antenna alignment',
                'Test RF components',
                'Inspect feeder systems',
                'Schedule site maintenance'
              ]
            },
            {
              cause: 'Interference/Obstruction',
              probability: 0.25,
              indicators: ['New obstructions', 'Seasonal foliage', 'Construction'],
              nextActions: [
                'Conduct site survey',
                'Check for new obstructions',
                'Consider antenna relocation',
                'Implement beam optimization'
              ]
            },
            {
              cause: 'Power Budget Issues',
              probability: 0.15,
              indicators: ['Low transmit power', 'High path loss', 'Cable losses'],
              nextActions: [
                'Review power settings',
                'Check cable integrity',
                'Optimize power allocation',
                'Consider power boost'
              ]
            }
          ]
        }
      },
      'RSRQ (dB)': {
        highThreshold: -10,
        moderateThreshold: -14,
        rootCauses: {
          high: [
            {
              cause: 'Co-channel Interference',
              probability: 0.40,
              indicators: ['Same frequency interference', 'Poor frequency reuse', 'Pilot pollution'],
              nextActions: [
                'Analyze interference sources',
                'Optimize frequency plan',
                'Adjust power levels',
                'Implement interference coordination'
              ]
            },
            {
              cause: 'Adjacent Channel Interference',
              probability: 0.25,
              indicators: ['Adjacent frequency interference', 'Spurious emissions', 'Filter issues'],
              nextActions: [
                'Check adjacent frequencies',
                'Verify filter performance',
                'Coordinate with neighboring operators',
                'Implement guard bands'
              ]
            },
            {
              cause: 'Noise/Thermal Issues',
              probability: 0.20,
              indicators: ['High noise floor', 'Thermal noise', 'External interference'],
              nextActions: [
                'Measure noise levels',
                'Identify interference sources',
                'Implement noise mitigation',
                'Check equipment temperature'
              ]
            },
            {
              cause: 'Multi-path Fading',
              probability: 0.15,
              indicators: ['Urban environment', 'Reflections', 'Scattering'],
              nextActions: [
                'Analyze propagation environment',
                'Implement diversity techniques',
                'Optimize antenna configuration',
                'Consider MIMO enhancement'
              ]
            }
          ]
        }
      },
      'UL SINR (dB)': {
        highThreshold: 10,
        moderateThreshold: 5,
        rootCauses: {
          high: [
            {
              cause: 'Uplink Interference',
              probability: 0.45,
              indicators: ['High UL noise', 'Interference from other cells', 'External sources'],
              nextActions: [
                'Identify interference sources',
                'Optimize uplink power control',
                'Implement interference cancellation',
                'Coordinate frequency usage'
              ]
            },
            {
              cause: 'Poor Power Control',
              probability: 0.25,
              indicators: ['Inadequate power control', 'Near-far effect', 'Power imbalance'],
              nextActions: [
                'Review power control settings',
                'Optimize target SINR',
                'Implement fractional power control',
                'Monitor power headroom'
              ]
            },
            {
              cause: 'Scheduler Issues',
              probability: 0.20,
              indicators: ['Poor resource allocation', 'Scheduling conflicts', 'QoS violations'],
              nextActions: [
                'Analyze scheduler performance',
                'Optimize resource allocation',
                'Implement priority scheduling',
                'Review QoS configuration'
              ]
            },
            {
              cause: 'UE Capability Limitations',
              probability: 0.10,
              indicators: ['Legacy UE devices', 'Power limitations', 'Antenna constraints'],
              nextActions: [
                'Analyze UE distribution',
                'Optimize for mixed capabilities',
                'Implement device-specific optimization',
                'Consider coverage enhancement'
              ]
            }
          ]
        }
      },
      'Paging Success Rate': {
        highThreshold: 97,
        moderateThreshold: 90,
        rootCauses: {
          high: [
            {
              cause: 'Core Network Issues',
              probability: 0.35,
              indicators: ['MME overload', 'S1 interface problems', 'Core latency'],
              nextActions: [
                'Check MME performance',
                'Monitor S1 interface',
                'Verify core connectivity',
                'Scale core resources'
              ]
            },
            {
              cause: 'Paging Channel Congestion',
              probability: 0.30,
              indicators: ['PDCCH overload', 'High paging load', 'Resource shortage'],
              nextActions: [
                'Monitor PDCCH utilization',
                'Optimize paging configuration',
                'Implement paging load balancing',
                'Add paging capacity'
              ]
            },
            {
              cause: 'UE Reachability Issues',
              probability: 0.25,
              indicators: ['Poor coverage', 'UE power saving', 'Mobility issues'],
              nextActions: [
                'Check coverage quality',
                'Optimize DRX configuration',
                'Monitor UE behavior',
                'Implement paging optimization'
              ]
            },
            {
              cause: 'Configuration Problems',
              probability: 0.10,
              indicators: ['Wrong paging parameters', 'Timing issues', 'Protocol errors'],
              nextActions: [
                'Audit paging configuration',
                'Check timing alignment',
                'Verify protocol settings',
                'Test paging procedures'
              ]
            }
          ]
        }
      }
    };
  }

  analyzeKPI(site) {
    const kpiType = site.kpi;
    const value = site.value;
    const rules = this.rcaRules[kpiType];
    
    if (!rules) {
      return this.getGenericAnalysis(site);
    }

    const severity = this.determineSeverity(value, kpiType, rules);
    const rootCauses = this.identifyRootCauses(severity, rules);
    const impactAssessment = this.assessImpact(site, severity);
    const timeline = this.estimateTimeline(severity, rootCauses);

    return {
      site: site,
      severity: severity,
      rootCauses: rootCauses,
      impactAssessment: impactAssessment,
      timeline: timeline,
      confidence: this.calculateConfidence(site, rootCauses),
      lastUpdated: new Date().toISOString()
    };
  }

  determineSeverity(value, kpiType, rules) {
    // Different KPIs have different severity logic (higher/lower is worse)
    const isHigherWorse = ['RRC Setup Failure Rate', 'Bearer Drop Rate'].includes(kpiType);
    const isLowerWorse = ['RSRP (dBm)', 'RSRQ (dB)', 'UL SINR (dB)', 'Paging Success Rate'].includes(kpiType);

    if (isHigherWorse) {
      if (value > rules.highThreshold) return 'critical';
      if (value > rules.moderateThreshold) return 'major';
      return 'minor';
    } else if (isLowerWorse) {
      if (value < rules.moderateThreshold) return 'critical';
      if (value < rules.highThreshold) return 'major';
      return 'minor';
    }
    return 'minor';
  }

  identifyRootCauses(severity, rules) {
    const causes = rules.rootCauses[severity === 'critical' ? 'high' : 'moderate'] || 
                   rules.rootCauses.high || [];
    
    // Sort by probability and return top causes
    return causes.sort((a, b) => b.probability - a.probability);
  }

  assessImpact(site, severity) {
    const baseImpact = {
      userExperience: this.getUserExperienceImpact(site.kpi, severity),
      businessMetrics: this.getBusinessImpact(site.kpi, severity),
      networkPerformance: this.getNetworkImpact(site.kpi, severity),
      estimatedUsers: this.estimateAffectedUsers(site, severity)
    };

    return baseImpact;
  }

  getUserExperienceImpact(kpi, severity) {
    const impacts = {
      'RRC Setup Failure Rate': {
        critical: 'Users cannot connect to network, call setup failures',
        major: 'Delayed connection establishment, poor call success rate',
        minor: 'Occasional connection delays'
      },
      'Bearer Drop Rate': {
        critical: 'Frequent call drops, data session failures',
        major: 'Intermittent call drops, reduced session reliability',
        minor: 'Rare connection interruptions'
      },
      'RSRP (dBm)': {
        critical: 'No service, calls cannot be established',
        major: 'Poor voice quality, slow data speeds',
        minor: 'Occasional signal weakness'
      },
      'RSRQ (dB)': {
        critical: 'Severe call quality issues, data timeouts',
        major: 'Reduced throughput, voice quality degradation',
        minor: 'Minor quality fluctuations'
      },
      'UL SINR (dB)': {
        critical: 'Upload failures, voice breakup',
        major: 'Slow upload speeds, reduced voice quality',
        minor: 'Occasional upload delays'
      },
      'Paging Success Rate': {
        critical: 'Missed calls, delayed notifications',
        major: 'Inconsistent incoming call delivery',
        minor: 'Rare notification delays'
      }
    };

    return impacts[kpi]?.[severity] || 'Impact assessment not available';
  }

  getBusinessImpact(kpi, severity) {
    const severityMultipliers = { critical: 3, major: 2, minor: 1 };
    const baseImpact = severityMultipliers[severity];

    return {
      revenueRisk: `${baseImpact * 15}% potential revenue impact`,
      customerSatisfaction: `${baseImpact * 20}% satisfaction score risk`,
      churnRisk: `${baseImpact * 5}% increased churn probability`,
      competitiveRisk: severity === 'critical' ? 'High' : severity === 'major' ? 'Medium' : 'Low'
    };
  }

  getNetworkImpact(kpi, severity) {
    return {
      capacity: severity === 'critical' ? 'Severely reduced' : severity === 'major' ? 'Reduced' : 'Minimally impacted',
      reliability: severity === 'critical' ? 'Poor' : severity === 'major' ? 'Degraded' : 'Stable',
      performance: severity === 'critical' ? 'Severely degraded' : severity === 'major' ? 'Reduced' : 'Normal'
    };
  }

  estimateAffectedUsers(site, severity) {
    // Rough estimation based on sector capacity and severity
    const baseUsers = 1000; // Assume 1000 users per sector
    const severityImpact = { critical: 0.8, major: 0.5, minor: 0.2 };
    
    return Math.round(baseUsers * severityImpact[severity]);
  }

  estimateTimeline(severity, rootCauses) {
    const primaryCause = rootCauses[0];
    if (!primaryCause) return { resolution: '2-4 hours', monitoring: '24 hours' };

    const timelineMap = {
      'Core Network Congestion': { resolution: '1-2 hours', monitoring: '48 hours' },
      'Radio Resource Shortage': { resolution: '4-8 hours', monitoring: '72 hours' },
      'Neighbor Relation Issues': { resolution: '2-6 hours', monitoring: '24 hours' },
      'Hardware/Software Issues': { resolution: '4-24 hours', monitoring: '1 week' },
      'Handover Failures': { resolution: '2-4 hours', monitoring: '48 hours' },
      'Coverage Gap': { resolution: '1-4 weeks', monitoring: '1 month' },
      'Antenna/RF Issues': { resolution: '4-12 hours', monitoring: '1 week' },
      'Interference Issues': { resolution: '2-8 hours', monitoring: '72 hours' }
    };

    return timelineMap[primaryCause.cause] || { resolution: '2-4 hours', monitoring: '24 hours' };
  }

  calculateConfidence(site, rootCauses) {
    // Simple confidence calculation based on available data and rule strength
    let confidence = 0.7; // Base confidence
    
    if (site.sectorInfo && site.sectorInfo.length > 0) confidence += 0.1;
    if (rootCauses.length > 0) confidence += 0.1;
    if (site.severity > 2) confidence += 0.05;
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  getGenericAnalysis(site) {
    return {
      site: site,
      severity: 'minor',
      rootCauses: [{
        cause: 'Generic KPI Degradation',
        probability: 0.5,
        indicators: ['KPI threshold exceeded'],
        nextActions: ['Monitor trend', 'Investigate further', 'Review historical data']
      }],
      impactAssessment: {
        userExperience: 'Potential service degradation',
        businessMetrics: { revenueRisk: 'Low', customerSatisfaction: 'Monitor', churnRisk: 'Low' },
        networkPerformance: { capacity: 'Normal', reliability: 'Monitor', performance: 'Monitor' },
        estimatedUsers: 100
      },
      timeline: { resolution: '2-4 hours', monitoring: '24 hours' },
      confidence: 0.6,
      lastUpdated: new Date().toISOString()
    };
  }
}

export default new RCAEngine();
