import React, { useState } from 'react';
import KpiTooltip from './KpiTooltip';

export default function NodeCard({
  title,
  icon,
  kpis,
  selected,
  onClick,
  severity = 1,
}) {
  const [hover, setHover] = useState(false);
  const colorMap = {
    1: 'bg-green-500',
    2: 'bg-yellow-500',
    3: 'bg-red-500',
  };
  return (
    <div
      className={`relative p-2 flex flex-col items-center rounded-lg shadow cursor-pointer bg-white transition border ${selected ? 'border-blue-600' : 'border-gray-200'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <img src={icon} alt={title} className="w-10 h-10" />
      <div className="text-xs mt-1 font-medium">{title}</div>
      {hover && <KpiTooltip kpis={kpis} />}
      <span
        className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${colorMap[severity]}`}
      />
    </div>
  );
}
