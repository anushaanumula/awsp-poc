import React from 'react';
import { Line } from 'react-chartjs-2';

export default function KpiTrends({ trends }) {
  if (!trends) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {Object.entries(trends).slice(0, 6).map(([metric, data]) => {
        const options = {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: metric } }
          }
        };
        return (
          <div key={metric} className="border rounded p-2 h-32">
            <Line
              options={options}
              data={{
                labels: data.labels,
                datasets: [
                  {
                    data: data.data,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37,99,235,0.2)'
                  }
                ]
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
