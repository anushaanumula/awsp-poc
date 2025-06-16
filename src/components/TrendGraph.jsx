import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const TrendGraph = ({ value }) => {
  const data = useMemo(() => {
    const points = Array.from({ length: 7 }, () => {
      const variance = (Math.random() * 2 - 1) * 0.5;
      return parseFloat((value + variance).toFixed(2));
    });
    return {
      labels: ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Now'],
      datasets: [
        {
          data: points,
          borderColor: '#1f2937',
          backgroundColor: 'rgba(31,41,55,0.1)',
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [value]);

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return <Line data={data} options={options} height={80} />;
};

export default TrendGraph;
