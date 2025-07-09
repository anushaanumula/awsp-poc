import React, { useState, useMemo, useEffect } from 'react';
import NodeCard from '../components/NodeCard';
import Legend from '../components/Legend';
import NodeDetailsCard from '../components/NodeDetailsCard';
import data from '../data/path_kpis.json';
import hierarchy from '../data/enb_details.json';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend as ChartLegend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, ChartLegend);

const NODES = [
  { key: 'UE', title: 'User Equipment', icon: '/icons/device.svg', desc: 'User device connecting to the network.' },
  { key: 'RAN', title: 'RAN/Base Station', icon: '/icons/antenna.svg', desc: 'The radio node providing wireless access.' },
  { key: 'Sec Car', title: 'Sec Car', icon: '/icons/antenna.svg', desc: 'Secondary carrier for additional capacity.' },
  { key: 'Core', title: 'Core Network', icon: '/icons/server.svg', desc: 'Handles session management and routing.' },
  { key: 'Internet', title: 'Internet', icon: '/icons/globe.svg', desc: 'External network and services.' },
];

const statusColor = {
  ok: 'bg-green-100 border-green-400',
  warn: 'bg-yellow-100 border-yellow-400',
  error: 'bg-red-100 border-red-400',
};

export default function EndToEndView({ selectedSite, onAskAssistant }) {
  // --- Data & State ---
  const markets = hierarchy.markets.map((m) => m.name);
  const [market, setMarket] = useState(selectedSite?.state || markets[0]);
  const sites = useMemo(
    () => hierarchy.markets.find((m) => m.name === market)?.sites || [],
    [market]
  );
  const [site, setSite] = useState(selectedSite?.geoId || sites[0]?.id || '');
  useEffect(() => {
    setSite(selectedSite?.geoId || sites[0]?.id || '');
  }, [sites, selectedSite]);

  const enbs = useMemo(
    () => sites.find((s) => s.id === site)?.enbs || [],
    [site, sites]
  );
  const [enb, setEnb] = useState(selectedSite?.enodeb || enbs[0] || '');
  useEffect(() => {
    setEnb(selectedSite?.enodeb || enbs[0] || '');
  }, [enbs, selectedSite]);

  const sectors = useMemo(
    () => hierarchy.enbDetails[enb]?.sectors.map((s) => s.id) || [],
    [enb]
  );
  const [sector, setSector] = useState(sectors[0] || '');
  useEffect(() => {
    setSector(sectors[0] || '');
  }, [sectors]);

  const carriers = useMemo(() => {
    const secObj = hierarchy.enbDetails[enb]?.sectors.find((s) => s.id === sector);
    return secObj ? secObj.carriers : [];
  }, [enb, sector]);
  const [carrierSel, setCarrierSel] = useState([]);
  useEffect(() => {
    setCarrierSel([]);
  }, [sector]);

  // --- Node selection ---
  const [selected, setSelected] = useState(null);
  const handleSelect = (key) => setSelected(key === selected ? null : key);

  const selectedData = selected ? data[selected] : null;
  const sectorDetail =
    hierarchy.enbDetails[enb]?.sectors.find((s) => s.id === sector) || null;

  // --- Indicators ---
  const indicators = [];
  const curr = sectorDetail?.kpis || {};
  if (curr.cqi !== undefined && curr.cqi < 8) indicators.push('Interference');
  if (curr.prbUtil !== undefined && curr.prbUtil > 85) indicators.push('Congestion');

  useEffect(() => {
    if (selectedData) {
      const el = document.getElementById('node-details');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedData]);

  useEffect(() => {
    if (selectedSite) {
      setMarket(selectedSite.state);
      setSite(selectedSite.geoId);
      setEnb(selectedSite.enodeb);
    }
  }, [selectedSite]);

  // --- UI ---
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
          End-to-End Network Path Visualization
        </h2>
        <div className="flex flex-wrap gap-2 text-sm bg-gray-50 border rounded px-3 py-2 shadow-sm">
          <div>
            <label className="font-medium mr-1">Market:</label>
            <select
              className="border rounded p-1"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
            >
              {markets.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium mr-1">Site:</label>
            <select
              className="border rounded p-1"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium mr-1">eNodeB:</label>
            <select
              className="border rounded p-1"
              value={enb}
              onChange={(e) => setEnb(e.target.value)}
            >
              {enbs.map((eId) => (
                <option key={eId} value={eId}>
                  {eId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium mr-1">Sector:</label>
            <select
              className="border rounded p-1"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              {sectors.map((sId) => (
                <option key={sId} value={sId}>
                  Sector {sId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium mr-1">Carrier(s):</label>
            <select
              multiple
              className="border rounded p-1"
              value={carrierSel}
              onChange={(e) =>
                setCarrierSel(Array.from(e.target.selectedOptions, (o) => o.value))
              }
            >
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mb-2">
        Visualize the full path a telecom signal takes from the user device to the internet. Use the controls above to drill down or change context.
      </p>
      <Legend />

      {indicators.length > 0 && (
        <div className="flex gap-2 text-xs justify-center items-center mt-2">
          {indicators.map((ind) => (
            <span
              key={ind}
              className="px-2 py-0.5 bg-yellow-200 rounded-full flex items-center gap-1"
            >
              {ind === 'Interference' ? '⚠️' : '🚦'} {ind}
            </span>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="flex items-center justify-between gap-4 min-w-[600px] py-4">
          {NODES.map((n, idx) => (
            <React.Fragment key={n.key}>
              <NodeCard
                title={n.title}
                icon={n.icon}
                kpis={data[n.key]}
                severity={data[n.key].severity}
                selected={selected === n.key}
                onClick={() => handleSelect(n.key)}
                className="transition-transform duration-150 hover:scale-105"
              />
              {idx < NODES.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full mx-2 ${
                    data[n.key].severity === 3
                      ? 'bg-red-500'
                      : data[n.key].severity === 2
                      ? 'bg-yellow-400'
                      : 'bg-green-400'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {selectedData && (
        <div id="node-details" className="mt-4">
          <NodeDetailsCard
            node={NODES.find((n) => n.key === selected)}
            data={selectedData}
            sectorDetail={selected === 'RAN' ? sectorDetail : null}
            enbInfo={
              selected === 'RAN'
                ? {
                    id: enb,
                    cells: hierarchy.enbDetails[enb]?.cellIds || [],
                    sectors: hierarchy.enbDetails[enb]?.sectors || [],
                  }
                : null
            }
          />
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Recent Events</h3>
        <ul className="text-sm list-disc pl-6 text-gray-700">
          <li>07/08 13:22 - CQI dip detected in Dallas RAN</li>
          <li>07/08 12:10 - Backhaul latency spike resolved</li>
          <li>07/07 18:45 - Core attach success restored to 99.8%</li>
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          className="btn bg-green-600 text-white mt-4 px-6 py-2 rounded shadow hover:bg-green-700 transition"
          onClick={() =>
            onAskAssistant &&
            onAskAssistant({
              ...selectedSite,
              market,
              site,
              enb,
              sector,
              carriers: carrierSel,
            })
          }
        >
          Ask Assistant about this path
        </button>
      </div>
    </div>
  );
}
