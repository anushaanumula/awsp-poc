import React from 'react';

const ITEMS = [
  { icon: '/icons/cloud.svg', label: 'Interference' },
  { icon: '/icons/traffic.svg', label: 'Congestion' },
  { icon: '/icons/antenna.svg', label: 'Radio Node' },
  { icon: '/icons/device.svg', label: 'User Equipment' },
  { icon: '/icons/server.svg', label: 'Core Network' },
  { icon: '/icons/globe.svg', label: 'Internet Gateway' },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 text-xs mb-4">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center space-x-1">
          <img src={item.icon} alt="" className="w-4 h-4" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
