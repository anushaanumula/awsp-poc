import React from 'react';

const AiInsights = ({ site }) => {
  if (!site) return <div className="p-4 border">Select a site to view AI insights</div>;

  const getPrediction = () => {
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
      case 'Uplink SINR (dB)':
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

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-semibold mb-2">AI Insights</h2>
      <p><strong>Geo ID:</strong> {site.geoId}</p>
      <p><strong>eNodeB:</strong> {site.enodeb}</p>
      <p><strong>KPI:</strong> {site.kpi}</p>
      <p><strong>Value:</strong> {site.value}</p>
      <p className="mt-2 text-blue-700"><strong>Predicted Insight:</strong> {getPrediction()}</p>
    </div>
  );
};

export default AiInsights;
