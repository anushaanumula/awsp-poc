import React from 'react';

export default function KpiTooltip({ kpis }) {
  return (
    <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white border rounded shadow text-xs p-2 z-10 whitespace-nowrap">
      {Object.entries(kpis).map(([k, v]) => (
        <div key={k} className="flex justify-between space-x-2">
          <span>{k}</span>
          <span className="font-semibold">{v}</span>
        </div>
      ))}
    </div>
  );
}
