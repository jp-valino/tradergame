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
        borderColor: 'rgba(0, 200, 5, 0.8)',
        backgroundColor: 'rgba(0, 200, 5, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
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
        borderColor: 'rgba(0, 200, 5, 0.8)',
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
  };

  // Calculate total portfolio value
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);

  // Calculate allocation percentages
  const stocksWithAllocation = stocks.map(stock => ({
    ...stock,
    allocation: (stock.currentPrice * stock.quantity) / totalValue * 100
  }));

  // Sort by allocation (highest first)
  const sortedStocks = [...stocksWithAllocation].sort((a, b) => 
    (b.currentPrice * b.quantity) - (a.currentPrice * a.quantity)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Portfolio</h2>
        {stocks.length > 0 && (
          <div className="text-secondary text-sm">
            {stocks.length} stock{stocks.length !== 1 ? 's' : ''} in your portfolio
          </div>
        )}
      </div>
      
      {pnlHistory.length > 0 && (
        <div className="card mb-6 overflow-hidden">
          <div className="p-4 border-b border-color-border">
            <h3 className="text-lg font-bold mb-1">Portfolio Performance</h3>
            <p className="text-secondary text-xs">
              {pnlHistory[pnlHistory.length - 1] >= 0 ? 'Up' : 'Down'} ${Math.abs(pnlHistory[pnlHistory.length - 1]).toFixed(2)} all time
            </p>
          </div>
          <div style={{ height: '200px', padding: '16px 8px 8px 8px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {stocks.length > 0 && (
        <div className="card mb-6 overflow-hidden">
          <div className="p-4 border-b border-color-border">
            <h3 className="text-lg font-bold">Allocation</h3>
          </div>
          <div className="p-4">
            {sortedStocks.map(stock => (
              <div key={`allocation-${stock.symbol}`} className="mb-3 last:mb-0">
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center">
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="text-secondary ml-2">{stock.allocation.toFixed(1)}%</span>
                  </div>
                  <span>${(stock.currentPrice * stock.quantity).toFixed(2)}</span>
                </div>
                <div className="bg-tertiary rounded-full h-2 w-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full" 
                    style={{ width: `${stock.allocation}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {stocks.length === 0 ? (
        <div className="card text-center p-8">
          <div className="mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">Your portfolio is empty</h3>
          <p className="text-secondary mb-4">You don't own any stocks yet.</p>
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