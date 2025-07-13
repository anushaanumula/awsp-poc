// API client for RCA and Next Best Action services

const API_BASE_URL = 'http://localhost:5000';

class RCAApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async performRCA(siteData) {
    try {
      const response = await fetch(`${this.baseUrl}/rca/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site: siteData })
      });

      if (!response.ok) {
        throw new Error(`RCA API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('RCA API unavailable, using local analysis:', error);
      // Fallback to local RCA engine if backend is unavailable
      return this.localRCAFallback(siteData);
    }
  }

  async getNextBestAction(siteData, context = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/recommendations/next-best-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site: siteData, context })
      });

      if (!response.ok) {
        throw new Error(`Next Best Action API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Next Best Action API unavailable, using local analysis:', error);
      return this.localNextBestActionFallback(siteData);
    }
  }

  async getRCASummary(siteIds) {
    try {
      const response = await fetch(`${this.baseUrl}/rca/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ site_ids: siteIds })
      });

      if (!response.ok) {
        throw new Error(`RCA Summary API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('RCA Summary API unavailable, using mock data:', error);
      return this.localSummaryFallback(siteIds);
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  // Fallback methods for when backend is unavailable
  localRCAFallback(siteData) {
    // Import and use the frontend RCA engine
    const rcaEngine = require('../utils/rcaEngine').default;
    return rcaEngine.analyzeKPI(siteData);
  }

  localNextBestActionFallback(siteData) {
    const rcaEngine = require('../utils/rcaEngine').default;
    const analysis = rcaEngine.analyzeKPI(siteData);
    
    const recommendations = analysis.rootCauses.length > 0 ? [{
      id: 'rec_0_0',
      priority: analysis.severity === 'critical' ? 'high' : 'medium',
      action: analysis.rootCauses[0].nextActions[0],
      root_cause: analysis.rootCauses[0].cause,
      estimated_effort: 'Medium (4-8 hours)',
      success_probability: analysis.rootCauses[0].probability * 0.8,
      timeline: analysis.timeline
    }] : [];

    return {
      site_id: siteData.id,
      timestamp: new Date().toISOString(),
      primary_recommendation: recommendations[0] || null,
      alternative_actions: recommendations.slice(1, 3),
      automated_actions: [],
      confidence: analysis.confidence,
      expected_impact: {
        resolution_time: analysis.timeline.resolution,
        success_probability: recommendations[0]?.success_probability || 0.5,
        effort_required: recommendations[0]?.estimated_effort || 'Unknown'
      },
      risk_assessment: {
        severity: analysis.severity,
        affected_users: analysis.impactAssessment.estimatedUsers,
        business_impact: analysis.impactAssessment.businessMetrics
      }
    };
  }

  localSummaryFallback(siteIds) {
    return {
      total_sites: siteIds.length,
      critical_issues: Math.floor(siteIds.length * 0.1),
      major_issues: Math.floor(siteIds.length * 0.2),
      auto_resolvable: Math.floor(siteIds.length * 0.15),
      estimated_resolution_time: '2-8 hours',
      confidence_avg: 0.82
    };
  }
}

// Analytics and monitoring functions
export const trackRCAUsage = (siteId, analysisType, result) => {
  // Track RCA usage for analytics
  console.log('RCA Usage:', { siteId, analysisType, result });
};

export const trackActionExecution = (actionId, actionType, success) => {
  // Track action execution for success metrics
  console.log('Action Execution:', { actionId, actionType, success });
};

// Export singleton instance
export default new RCAApiClient();
