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
        borderColor: stock.priceChange >= 0 ? 'rgba(0, 200, 5, 0.8)' : 'rgba(255, 82, 82, 0.8)',
        backgroundColor: stock.priceChange >= 0 ? 'rgba(0, 200, 5, 0.1)' : 'rgba(255, 82, 82, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        ticks: {
          color: 'rgba(160, 160, 160, 0.8)',
          font: {
            size: 10,
          },
          callback: function(tickValue: number | string) {
            return `$${Number(tickValue).toFixed(0)}`;
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false,
        }
      },
      x: {
        ticks: {
          color: 'rgba(160, 160, 160, 0.8)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
          font: {
            size: 10,
          }
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: stock.priceChange >= 0 ? 'rgba(0, 200, 5, 0.8)' : 'rgba(255, 82, 82, 0.8)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toFixed(2)}`;
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
      }
    },
  };

  return (
    <div className="card overflow-hidden">
      <div className="stock-card-header">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{stock.symbol}</h3>
            <span className="stock-badge">{stock.sector}</span>
          </div>
          <p className="text-secondary text-sm">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">${stock.currentPrice.toFixed(2)}</p>
          <p className={stock.priceChange >= 0 ? 'stock-price-up' : 'stock-price-down'}>
            {stock.priceChange >= 0 ? '+' : ''}
            {stock.priceChange.toFixed(2)} ({((stock.priceChange / (stock.currentPrice - stock.priceChange)) * 100).toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="chart-container" style={{ height: '120px', padding: '0 8px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {stock.quantity > 0 && (
        <div className="p-4 bg-tertiary">
          <div className="flex justify-between">
            <div>
              <p className="text-secondary text-xs">
                You own
              </p>
              <p className="text-md font-medium">
                {stock.quantity} shares
              </p>
            </div>
            <div>
              <p className="text-secondary text-xs">
                Market value
              </p>
              <p className="text-md font-medium">
                ${(stock.quantity * stock.currentPrice).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-secondary text-xs">
                P&L
              </p>
              <p className={`text-md font-medium ${stock.potentialProfit >= 0 ? 'text-success' : 'text-error'}`}>
                ${stock.potentialProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <button 
          className="text-secondary text-xs underline mb-4"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="mb-4 p-3 bg-tertiary rounded text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-secondary">Original Price</p>
                <p className="text-primary">${stock.originalPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-secondary">Daily Change</p>
                <p className={stock.dailyVariation >= 0 ? 'text-success' : 'text-error'}>
                  {stock.dailyVariation.toFixed(2)}%
                </p>
              </div>
              {stock.quantity > 0 && (
                <>
                  <div>
                    <p className="text-secondary">Avg. Buy Price</p>
                    <p className="text-primary">${stock.buyPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Realized Profit</p>
                    <p className={stock.realizedProfit >= 0 ? 'text-success' : 'text-error'}>
                      ${stock.realizedProfit.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="input"
              style={{ width: '80px' }}
            />
            <div className="flex-1 flex gap-2">
              <button
                className="btn flex-1"
                onClick={() => onBuy && onBuy(stock.symbol, quantity)}
                disabled={!onBuy}
              >
                Buy
              </button>
              <button
                className="btn btn-secondary flex-1"
                onClick={() => onSell && onSell(stock.symbol, quantity)}
                disabled={!onSell || stock.quantity < quantity}
              >
                Sell
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockCard; 