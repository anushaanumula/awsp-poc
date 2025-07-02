export const lineOptions = {
  responsive: true,
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { display: false } },
};

export const barOptions = {
  responsive: true,
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { display: false } },
};

export const lineData = {
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
      data: [80, 75, 70, 85, 90, 95, 70, 60, 50, 55, 65, 70],
      backgroundColor: '#34d399',
    },
  ],
};
