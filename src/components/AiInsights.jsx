import React from 'react';

// This component currently relies on hand-tuned rules to emulate what a machine
// learning model might produce. Each KPI is checked against basic threshold
// values to generate a short prediction and recommended action. The values were
// chosen purely for demonstration and do not reflect a real model.

const AiInsights = ({ site, onApprove = () => {} }) => {
  if (!site) return <div className="p-4 border">Select a site to view AI insights</div>;

  const getPrediction = () => {
    // Simple heuristic thresholds approximate an ML classifier.
    // Each KPI range maps to a short insight string.
    switch (site.kpi) {
      case 'RRC Setup Failure Rate':
        return site.value > 15
          ? 'Severe access issue detected. Immediate RCA recommended.'
          : site.value > 8
          ? 'Moderate setup failures. Monitor call setup trends.'
          : 'Normal access behavior';
      case 'Bearer Drop Rate':
        return site.value > 5
          ? 'High session drop. Possible handover or coverage gap.'
          : site.value > 2
          ? 'Moderate drops. Monitor mobility events.'
          : 'Stable bearer retention';
      case 'RSRP (dBm)':
        return site.value < -110
          ? 'Very weak signal. May impact user experience.'
          : site.value < -100
          ? 'Weak signal. Consider physical optimization.'
          : 'Good signal strength';
      case 'RSRQ (dB)':
        return site.value < -14
          ? 'Poor signal quality. High interference expected.'
          : site.value < -10
          ? 'Degraded quality. Monitor for UL scheduling issues.'
          : 'Healthy signal quality';
      case 'UL SINR (dB)':
        return site.value < 5
          ? 'High uplink interference. User throughput affected.'
          : site.value < 10
          ? 'Marginal SINR. Monitor scheduler and power headroom.'
          : 'Clean uplink spectrum';
      case 'Paging Success Rate':
        return site.value < 90
          ? 'Low paging rate. Might affect MT call performance.'
          : site.value < 97
          ? 'Slight degradation in paging delivery.'
          : 'Paging KPIs look healthy';
      default:
        return 'No prediction model applied to this KPI.';
    }
  };

  const getAction = () => {
    // Suggested actions mirror the rules above and are not data-driven yet.
    switch (site.kpi) {
      case 'RRC Setup Failure Rate':
        return 'Check signaling traces and verify neighbor relations.';
      case 'Bearer Drop Rate':
        return 'Analyze handover stats and optimize parameters.';
      case 'RSRP (dBm)':
        return 'Inspect antenna alignment or plan a drive test.';
      case 'RSRQ (dB)':
        return 'Investigate interference and verify power settings.';
      case 'UL SINR (dB)':
        return 'Look for uplink blockers and schedule a site visit.';
      case 'Paging Success Rate':
        return 'Check paging channel configuration and core connectivity.';
      default:
        return 'Review KPI trend and determine next best action.';
    }
  };

  const handleApprove = () => {
    // Approving creates a simple task object using the rule-based suggestion.
    const task = {
      id: Date.now(),
      title: `Resolve ${site.kpi} at site ${site.geoId}`,
      description: getAction(),
      siteId: site.id,
      impactType: site.kpiType,
      createdAt: new Date().toISOString(),
    };
    onApprove(task);
  };

  return (
    <div className="p-4 border rounded bw">
      <h2 className="text-lg font-semibold mb-2">AI Insights</h2>
      <p><strong>Site:</strong> {site.geoId}</p>
      <p><strong>eNodeB:</strong> {site.enodeb}</p>
      <p><strong>KPI:</strong> {site.kpi}</p>
      <p><strong>Value:</strong> {site.value}</p>
      <p className="mt-2 text-black"><strong>Predicted Insight:</strong> {getPrediction()}</p>
      <p className="mt-2"><strong>Suggested Action:</strong> {getAction()}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={handleApprove} className="btn bg-black text-white hover:bg-gray-800">
          Approve
        </button>
        <button onClick={() => {}} className="btn bg-black text-white hover:bg-gray-800">
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AiInsights;
