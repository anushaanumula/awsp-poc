import React from 'react';

const SiteDetails = ({ site }) => {
  if (!site) return <div className="p-4 border">Select a site to view details</div>;

  return (
    <div className="p-4 border rounded bw">
      <h2 className="text-lg font-semibold mb-2">Selected Site</h2>
      <p><strong>Geo ID:</strong> {site.geoId}</p>
      <p><strong>eNodeB:</strong> {site.enodeb}</p>
      <p><strong>State:</strong> {site.state}</p>
      <p><strong>KPI:</strong> {site.kpi}</p>
      <p><strong>Value:</strong> {site.value}</p>

      {/* Sector Carrier Table */}
      {site.sectorInfo && site.sectorInfo.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Sector/Carrier Overview</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="border px-2 py-1">Cell ID</th>
                  <th className="border px-2 py-1">Band</th>
                  <th className="border px-2 py-1">Azimuth</th>
                  <th className="border px-2 py-1">CL (ft)</th>
                  <th className="border px-2 py-1">EDT</th>
                  <th className="border px-2 py-1">Tilt</th>
                </tr>
              </thead>
              <tbody>
                {site.sectorInfo.map((sec, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{sec.cellId}</td>
                    <td className="border px-2 py-1">{sec.band}</td>
                    <td className="border px-2 py-1">{sec.azimuth}</td>
                    <td className="border px-2 py-1">{sec.cl}</td>
                    <td className="border px-2 py-1">{sec.edt}</td>
                    <td className="border px-2 py-1">{sec.tilt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteDetails;
