import React, { useState } from 'react';
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
  ChartOptions
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
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

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
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-bold">{stock.symbol}</h3>
          <p className="text-secondary text-sm">{stock.name}</p>
          <p className="text-secondary text-xs">Sector: {stock.sector}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${stock.currentPrice.toFixed(2)}</p>
          <p className={stock.priceChange >= 0 ? 'text-success' : 'text-error'}>
            {stock.priceChange >= 0 ? '+' : ''}
            {stock.priceChange.toFixed(2)} ({((stock.priceChange / (stock.currentPrice - stock.priceChange)) * 100).toFixed(2)}%)
          </p>
          <p className="text-secondary text-xs">
            Daily Variation: {stock.dailyVariation ? `${stock.dailyVariation.toFixed(2)}%` : 'N/A'}
          </p>
        </div>
      </div>

      {stock.quantity > 0 && (
        <div className="mb-2 p-2 bg-tertiary rounded">
          <div className="flex justify-between">
            <div>
              <p className="text-secondary">
                You own: <span className="text-primary font-medium">{stock.quantity} shares</span>
              </p>
              <p className="text-secondary">
                Value: <span className="text-primary font-medium">${(stock.quantity * stock.currentPrice).toFixed(2)}</span>
              </p>
            </div>
            <div>
              <p className="text-secondary">
                Buy Price: <span className="text-primary font-medium">${stock.buyPrice ? stock.buyPrice.toFixed(2) : 'N/A'}</span>
              </p>
              <p className={`${stock.potentialProfit >= 0 ? 'text-success' : 'text-error'}`}>
                P&L: ${stock.potentialProfit ? stock.potentialProfit.toFixed(2) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2">
        <button 
          className="text-secondary text-sm underline"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="mb-4 p-2 bg-tertiary rounded text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="text-secondary">Original Price: <span className="text-primary">${stock.originalPrice.toFixed(2)}</span></p>
            <p className="text-secondary">Current Price: <span className="text-primary">${stock.currentPrice.toFixed(2)}</span></p>
            {stock.quantity > 0 && (
              <>
                <p className="text-secondary">Buy Price: <span className="text-primary">${stock.buyPrice.toFixed(2)}</span></p>
                <p className="text-secondary">Sell Price: <span className="text-primary">${stock.sellPrice > 0 ? stock.sellPrice.toFixed(2) : 'N/A'}</span></p>
                <p className="text-secondary">Realized Profit: <span className={`${stock.realizedProfit >= 0 ? 'text-success' : 'text-error'}`}>${stock.realizedProfit.toFixed(2)}</span></p>
                <p className="text-secondary">Potential Profit: <span className={`${stock.potentialProfit >= 0 ? 'text-success' : 'text-error'}`}>${stock.potentialProfit.toFixed(2)}</span></p>
              </>
            )}
          </div>
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