import React from 'react';
import { Bar } from 'react-chartjs-2';

const GraphCard = ({ title, data }) => {
  const chartData = {
    labels: data.map(d => d.responsable),
    datasets: [
      {
        label: 'Marge totale',
        data: data.map(d => d.total_marge),
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderRadius: 5
      }
    ]
  };

  const options = {
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, font: { size: 18 } }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { color: '#2c3e50', font: { weight: 'bold' } } }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GraphCard;
