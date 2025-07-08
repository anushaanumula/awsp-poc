export const lineOptions = {
  responsive: true,
  scales: {
    x: { title: { display: true, text: 'Time' } },
    y: { beginAtZero: true, title: { display: true, text: 'Value' } },
  },
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { display: false } },
};

export const barOptions = {
  responsive: true,
  scales: {
    x: { title: { display: true, text: 'Hour' } },
    y: { beginAtZero: true, title: { display: true, text: 'Value' } },
  },
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { display: false } },
};

export const lineData = {
  labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
  datasets: [
    {
      data: [3.5, 3.4, 3.6, 3.2, 3.1, 3.3, 3.4, 3.5, 3.6, 3.7],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [400, 420, 440, 430, 450, 460, 455],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.3)',
      fill: true,
    },
  ],
};

export const barData = {
  labels: ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p'],
  datasets: [
    {
      data: [1.2, 1.0, 0.9, 1.3, 1.1, 1.4, 1.0, 0.8, 0.7, 0.9, 1.1, 1.2],
      data: [80, 75, 70, 85, 90, 95, 70, 60, 50, 55, 65, 70],
      backgroundColor: '#34d399',
    },
  ],
};
