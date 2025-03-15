import React from 'react';
import { Stock } from '../types';
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

interface StockCardProps {
  stock: Stock;
  onBuy?: (symbol: string, quantity: number) => void;
  onSell?: (symbol: string, quantity: number) => void;
  showActions?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  onBuy, 
  onSell, 
  showActions = true 
}) => {
  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const chartData = {
    labels: Array.from({ length: stock.priceHistory.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Price History',
        data: stock.priceHistory,
        borderColor: stock.priceChange >= 0 ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
        backgroundColor: stock.priceChange >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: '#b3b3b3',
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
          maxTicksLimit: 5,
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
      },
    },
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-bold">{stock.symbol}</h3>
          <p className="text-secondary text-sm">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${stock.currentPrice.toFixed(2)}</p>
          <p className={stock.priceChange >= 0 ? 'text-success' : 'text-error'}>
            {stock.priceChange >= 0 ? '+' : ''}
            {stock.priceChange.toFixed(2)} ({((stock.priceChange / (stock.currentPrice - stock.priceChange)) * 100).toFixed(2)}%)
          </p>
        </div>
      </div>

      {stock.quantity > 0 && (
        <div className="mb-2 p-2 bg-tertiary rounded">
          <p className="text-secondary">
            You own: <span className="text-primary font-medium">{stock.quantity} shares</span>
          </p>
          <p className="text-secondary">
            Value: <span className="text-primary font-medium">${(stock.quantity * stock.currentPrice).toFixed(2)}</span>
          </p>
        </div>
      )}

      <div className="mb-4" style={{ height: '150px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {showActions && (
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="input"
            style={{ width: '80px' }}
          />
          <button
            className="btn"
            onClick={() => onBuy && onBuy(stock.symbol, quantity)}
            disabled={!onBuy}
          >
            Buy
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onSell && onSell(stock.symbol, quantity)}
            disabled={!onSell || stock.quantity < quantity}
          >
            Sell
          </button>
        </div>
      )}
    </div>
  );
};

export default StockCard; 