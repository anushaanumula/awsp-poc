import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

export default function KpiSummaryCard({ title, value, delta, trend }) {
  return (
    <div className="border rounded p-3 flex flex-col items-center bg-gray-50">
      <div className="text-xs text-gray-600">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
      {delta && (
        <div className={`text-sm flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}> 
          {delta}
          {trend === 'up' ? (
            <ArrowTrendingUpIcon className="w-4 h-4 ml-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 ml-1" />
          )}
        </div>
      )}
    </div>
  );
}
