import React, { useState, useEffect } from 'react';
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

interface StockMarketProps {
  stocks: Stock[];
  onBuy: (symbol: string, quantity: number) => void;
  onCreateStock: (name: string, symbol: string, sector: string) => void;
  marketState: 'BULL' | 'BEAR' | 'NEUTRAL';
}

const StockMarket: React.FC<StockMarketProps> = ({ 
  stocks, 
  onBuy, 
  onCreateStock,
  marketState 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStock, setNewStock] = useState({
    name: '',
    symbol: '',
    sector: ''
  });
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [chartView, setChartView] = useState<'normalized' | 'price'>('normalized');

  // Initialize with top 5 stocks by market cap when component mounts
  useEffect(() => {
    if (stocks.length > 0) {
      const topStocks = [...stocks]
        .sort((a, b) => b.currentPrice - a.currentPrice)
        .slice(0, 5)
        .map(stock => stock.symbol);
      setSelectedStocks(topStocks);
    }
  }, [stocks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'symbol' | 'price' | 'change');
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleNewStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStock.name && newStock.symbol && newStock.sector) {
      onCreateStock(newStock.name, newStock.symbol, newStock.sector);
      setNewStock({ name: '', symbol: '', sector: '' });
      setShowCreateForm(false);
    }
  };

  const toggleStockSelection = (symbol: string) => {
    setSelectedStocks(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'symbol') {
      comparison = a.symbol.localeCompare(b.symbol);
    } else if (sortBy === 'price') {
      comparison = a.currentPrice - b.currentPrice;
    } else if (sortBy === 'change') {
      comparison = a.priceChange - b.priceChange;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Group stocks by sector
  const stocksBySector = sortedStocks.reduce((acc, stock) => {
    if (!acc[stock.sector]) {
      acc[stock.sector] = [];
    }
    acc[stock.sector].push(stock);
    return acc;
  }, {} as Record<string, Stock[]>);

  // Get unique sectors and sort them
  const sectors = Object.keys(stocksBySector).sort();

  // Prepare chart data
  const prepareChartData = () => {
    if (selectedStocks.length === 0) return null;

    const labels = Array.from({ length: stocks[0]?.priceHistory.length || 0 }, (_, i) => `Day ${i + 1}`);
    
    const datasets = selectedStocks.map(symbol => {
      const stock = stocks.find(s => s.symbol === symbol);
      if (!stock) return null;

      // For normalized view, convert prices to percentage change from first day
      const data = chartView === 'normalized' 
        ? stock.priceHistory.map((price, i) => {
            const firstPrice = stock.priceHistory[0];
            return ((price - firstPrice) / firstPrice) * 100;
          })
        : stock.priceHistory;

      // Generate a deterministic color based on the symbol
      const hash = symbol.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      const hue = hash % 360;
      
      return {
        label: symbol,
        data,
        borderColor: `hsl(${hue}, 70%, 60%)`,
        backgroundColor: `hsla(${hue}, 70%, 60%, 0.1)`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
      };
    }).filter(Boolean);

    return {
      labels,
      datasets: datasets as any[],
    };
  };

  const chartData = prepareChartData();

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
            return chartView === 'normalized' 
              ? `${Number(tickValue).toFixed(0)}%` 
              : `$${Number(tickValue).toFixed(0)}`;
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
        position: 'top',
        labels: {
          color: 'rgba(160, 160, 160, 0.8)',
          font: {
            size: 10,
          },
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(138, 99, 210, 0.8)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return chartView === 'normalized'
              ? `${label}: ${value.toFixed(2)}%`
              : `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stock Market</h2>
        <div className="flex items-center gap-2">
          <span className="text-secondary text-sm">Market:</span>
          <div className={`stock-badge ${
            marketState === 'BULL' ? 'badge-bull' : 
            marketState === 'BEAR' ? 'badge-bear' : ''
          }`}>
            {marketState}
          </div>
        </div>
      </div>
      
      {/* Market Chart */}
      <div className="card mb-6 overflow-hidden">
        <div className="p-4 border-b border-color-border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Market Performance</h3>
            <div className="chart-toggle">
              <div 
                className={`chart-toggle-option ${chartView === 'normalized' ? 'active' : ''}`}
                onClick={() => setChartView('normalized')}
              >
                Normalized
              </div>
              <div 
                className={`chart-toggle-option ${chartView === 'price' ? 'active' : ''}`}
                onClick={() => setChartView('price')}
              >
                Price
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="stock-selector">
            {stocks.slice(0, 10).map(stock => (
              <div 
                key={`selector-${stock.symbol}`}
                className={`stock-selector-item ${selectedStocks.includes(stock.symbol) ? 'selected' : ''}`}
                onClick={() => toggleStockSelection(stock.symbol)}
              >
                {stock.symbol}
              </div>
            ))}
            {stocks.length > 10 && (
              <div className="stock-selector-item">
                +{stocks.length - 10} more
              </div>
            )}
          </div>
          
          <div style={{ height: '250px' }}>
            {chartData && selectedStocks.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-secondary">Select stocks to view performance</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="card mb-4 overflow-hidden">
        <div className="p-4 border-b border-color-border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks by name, symbol, or sector..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input w-full pl-10"
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="var(--color-text-secondary)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label htmlFor="sortBy" className="text-secondary text-sm whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="input flex-1 md:w-auto"
              >
                <option value="symbol">Symbol</option>
                <option value="price">Price</option>
                <option value="change">Change</option>
              </select>
              <button
                className="btn btn-secondary p-2"
                onClick={handleSortOrderChange}
                aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-secondary text-sm">
              {filteredStocks.length} stock{filteredStocks.length !== 1 ? 's' : ''} available
            </p>
            <button 
              className="btn btn-secondary text-sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ Add New Stock'}
            </button>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="card mb-4 p-4 fade-in">
          <h3 className="text-lg font-bold mb-4">Create New Stock</h3>
          <form onSubmit={handleCreateStock}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-secondary text-sm mb-1">Company Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newStock.name}
                  onChange={handleNewStockChange}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="symbol" className="block text-secondary text-sm mb-1">Symbol</label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={newStock.symbol}
                  onChange={handleNewStockChange}
                  className="input w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="sector" className="block text-secondary text-sm mb-1">Sector</label>
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  value={newStock.sector}
                  onChange={handleNewStockChange}
                  className="input w-full"
                  required
                />
              </div>
            </div>
            <div className="mt-4 text-right">
              <button type="submit" className="btn">Create Stock</button>
            </div>
          </form>
        </div>
      )}
      
      {filteredStocks.length === 0 ? (
        <div className="card text-center p-8">
          <div className="mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
              <path d="M10 3H14V14H10V3Z" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 18V21H14V18H10Z" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">No stocks found</h3>
          <p className="text-secondary">No stocks match your search criteria.</p>
          <p className="text-secondary">Try adjusting your search or create a new stock.</p>
        </div>
      ) : (
        <div>
          {sectors.map(sector => (
            <div key={sector} className="mb-8">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-bold">{sector}</h3>
                <span className="text-secondary text-sm ml-2">
                  ({stocksBySector[sector].length} stock{stocksBySector[sector].length !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="grid">
                {stocksBySector[sector].map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onBuy={onBuy}
                    onSell={undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockMarket; 