import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendGraph = ({ site }) => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (!site) {
      setValues([]);
      return;
    }
    const points = Array.from({ length: 7 }, () =>
      parseFloat((site.value + (Math.random() * 4 - 2)).toFixed(2))
    );
    setValues(points);
  }, [site]);

  if (!site) return <div className="p-4">Select a site to view trend</div>;

  const data = {
    labels: values.map((_, i) => `T-${values.length - i}`),
    datasets: [
      {
        label: site.kpi,
        data: values,
        borderColor: '#3182ce',
        backgroundColor: 'rgba(49, 130, 206, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  return <Line data={data} options={options} />;
};

export default TrendGraph;
