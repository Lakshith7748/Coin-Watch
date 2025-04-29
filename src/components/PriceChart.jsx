import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency, formatDate, formatTime } from '../utils/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const PriceChart = ({ history, change, timePeriod }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const getTimeFormatter = (period) => {
    switch (period) {
      case '3h':
      case '24h':
        return formatTime;
      default:
        return formatDate;
    }
  };

  const getTicksCount = (period) => {
    switch (period) {
      case '3h':
      case '24h':
        return 6;
      case '7d':
        return 7;
      case '30d':
        return 5;
      case '3m':
        return 6;
      case '1y':
        return 6;
      case '5y':
        return 5;
      default:
        return 5;
    }
  };

  useEffect(() => {
    if (!history || !history.length) return;

    const timeFormatter = getTimeFormatter(timePeriod);

    // Filter data points to avoid overcrowding
    const dataReduction = history.length > 100 ? Math.floor(history.length / 100) : 1;
    const filteredHistory = history.filter((_, index) => index % dataReduction === 0);
    
    const labels = filteredHistory.map(item => timeFormatter(item.timestamp));
    const prices = filteredHistory.map(item => parseFloat(item.price));
    
    // Determine gradient colors based on price change
    const gradientColor = change >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
    const gradientColorTransparent = change >= 0 ? 'rgba(16, 185, 129, 0)' : 'rgba(239, 68, 68, 0)';
    const lineColor = change >= 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)';
    
    setChartData({
      labels,
      datasets: [
        {
          fill: true,
          label: 'Price',
          data: prices,
          borderColor: lineColor,
          backgroundColor: function(context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            
            if (!chartArea) {
              return null;
            }
            
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, gradientColor);
            gradient.addColorStop(1, gradientColorTransparent);
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.4,
        },
      ],
    });
  }, [history, change, timePeriod]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#e5e7eb',
        bodyColor: '#f9fafb',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Price: ${formatCurrency(context.parsed.y)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          maxTicksLimit: getTicksCount(timePeriod),
          color: 'rgb(156, 163, 175)',
          font: {
            size: 10,
          },
        },
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value) {
            return formatCurrency(value);
          },
          font: {
            size: 10,
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="w-full h-full">
      {chartData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No chart data available</p>
        </div>
      )}
    </div>
  );
};

export default PriceChart;