import React from 'react';
import { Stock } from '../types';
import StockCard from './StockCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Scale,
  Tick
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PortfolioProps {
  stocks: Stock[];
  pnlHistory: number[];
  onSell: (symbol: string, quantity: number) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ stocks, pnlHistory, onSell }) => {
  const chartData = {
    labels: Array.from({ length: pnlHistory.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Portfolio P&L',
        data: pnlHistory,
        borderColor: 'rgba(138, 43, 226, 0.8)',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        ticks: {
          color: '#b3b3b3',
          callback: function(tickValue: number | string) {
            return `$${Number(tickValue).toFixed(2)}`;
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#b3b3b3',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2d2d2d',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#8a2be2',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
      
      {pnlHistory.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-lg font-bold mb-2">Portfolio Performance</h3>
          <div style={{ height: '200px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
      
      {stocks.length === 0 ? (
        <div className="card text-center p-4">
          <p className="text-secondary">You don't own any stocks yet.</p>
          <p className="text-secondary">Start trading to build your portfolio!</p>
        </div>
      ) : (
        <div className="grid">
          {stocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onSell={onSell}
              onBuy={undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio; 