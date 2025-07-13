import React from 'react';
import { ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const SiteDetails = ({ site, onViewPath, onAskAssistant }) => {
  if (!site) return <div className="p-4 border border-verizon-black">Select a site to view details</div>;

  return (
    <div className="p-4 border-0 rounded bw">
      <h2 className="text-lg font-semibold mb-2 text-verizon-black">Selected Site</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
        <p>
          <strong className="text-verizon-black">Site:</strong> {site.geoId}
        </p>
        <p>
          <strong className="text-verizon-black">eNodeB:</strong> {site.enodeb}
        </p>
        <p>
          <strong className="text-verizon-black">Market/Geofence:</strong> {site.state}
        </p>
        <p>
          <strong className="text-verizon-black">KPI:</strong> {site.kpi}
        </p>
        <p>
          <strong className="text-verizon-black">Value:</strong> {site.value}
        </p>
      </div>

      {/* Sector Carrier Table */}
      {site.sectorInfo && site.sectorInfo.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-verizon-black">Sector/Carrier Overview</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border border-verizon-black">
              <thead className="bg-verizon-black text-white">
                <tr>
                  <th className="border border-verizon-black px-2 py-1">Cell ID</th>
                  <th className="border border-verizon-black px-2 py-1">Band</th>
                  <th className="border border-verizon-black px-2 py-1">Azimuth</th>
                  <th className="border border-verizon-black px-2 py-1">CL (ft)</th>
                  <th className="border border-verizon-black px-2 py-1">EDT</th>
                  <th className="border border-verizon-black px-2 py-1">Tilt</th>
                </tr>
              </thead>
              <tbody>
                {site.sectorInfo.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-verizon-concrete">
                    <td className="border border-verizon-black px-2 py-1">{sec.cellId}</td>
                    <td className="border border-verizon-black px-2 py-1">{sec.band}</td>
                    <td className="border border-verizon-black px-2 py-1">{sec.azimuth}</td>
                    <td className="border border-verizon-black px-2 py-1">{sec.cl}</td>
                    <td className="border border-verizon-black px-2 py-1">{sec.edt}</td>
                    <td className="border border-verizon-black px-2 py-1">{sec.tilt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-verizon-red text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => onViewPath && onViewPath(site)}
        >
          <ChartBarIcon className="h-5 w-5" />
          <span>View End-to-End Path</span>
        </button>
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-verizon-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => onAskAssistant && onAskAssistant(site)}
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          <span>Ask Assistant</span>
        </button>
      </div>
    </div>
  );
};

export default SiteDetails;
