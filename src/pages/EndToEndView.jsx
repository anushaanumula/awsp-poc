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

export default function EndToEndView() {
  const markets = hierarchy.markets.map((m) => m.name);
  const [market, setMarket] = useState(markets[0]);
  const sites = useMemo(
    () => hierarchy.markets.find((m) => m.name === market)?.sites || [],
    [market]
  );
  const [site, setSite] = useState(sites[0]?.id || '');
  useEffect(() => {
    setSite(sites[0]?.id || '');
  }, [sites]);

  const enbs = useMemo(
    () => sites.find((s) => s.id === site)?.enbs || [],
    [site, sites]
  );
  const [enb, setEnb] = useState(enbs[0] || '');
  useEffect(() => {
    setEnb(enbs[0] || '');
  }, [enbs]);

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

  const [selected, setSelected] = useState(null);
  const handleSelect = (key) => setSelected(key === selected ? null : key);

  const selectedData = selected ? data[selected] : null;
  const sectorDetail =
    hierarchy.enbDetails[enb]?.sectors.find((s) => s.id === sector) || null;

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

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-center">End-to-End Network Path Visualization</h2>
      <p className="text-center text-sm mb-2">
        This dashboard illustrates the full path a telecom signal takes from the user device to the internet.
      </p>
      <Legend />
      {/* Drilldown dropdowns */}
      <div className="flex flex-wrap gap-2 text-sm">
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
        <div className="flex items-center justify-between gap-4 min-w-[600px]">
          {NODES.map((n, idx) => (
            <React.Fragment key={n.key}>
              <NodeCard
                title={n.title}
                icon={n.icon}
                kpis={data[n.key]}
                severity={data[n.key].severity}
                selected={selected === n.key}
                onClick={() => handleSelect(n.key)}
              />
              {idx < NODES.length - 1 && (
                <div
                  className={`flex-1 h-1 animate-pulse ${
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
      )}
    </div>
  );
}
