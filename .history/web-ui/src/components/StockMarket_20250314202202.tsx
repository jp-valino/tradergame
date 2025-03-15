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
  const [selectedSector, setSelectedSector] = useState<string>('All');

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

  // Calculate market statistics
  const marketStats = {
    totalStocks: stocks.length,
    gainers: stocks.filter(stock => stock.priceChange > 0).length,
    losers: stocks.filter(stock => stock.priceChange < 0).length,
    unchanged: stocks.filter(stock => stock.priceChange === 0).length,
    averageChange: stocks.reduce((sum, stock) => sum + stock.dailyVariation, 0) / stocks.length,
    topGainer: [...stocks].sort((a, b) => b.dailyVariation - a.dailyVariation)[0],
    topLoser: [...stocks].sort((a, b) => a.dailyVariation - b.dailyVariation)[0]
  };

  // Get all unique sectors
  const allSectors = ['All', ...Array.from(new Set(stocks.map(stock => stock.sector)))].sort();

  const filteredStocks = stocks.filter(
    (stock) => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      
      return matchesSearch && matchesSector;
    }
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
      <div className="card mb-6 p-4">
        <h2 className="text-xl font-bold mb-4">Stock Market</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`bg-secondary p-4 rounded ${marketState === 'BULL' ? 'border-l-4 border-success' : marketState === 'BEAR' ? 'border-l-4 border-error' : ''}`}>
            <div className="text-secondary text-sm mb-1">Market State</div>
            <div className={`text-xl font-bold ${marketState === 'BULL' ? 'text-success' : marketState === 'BEAR' ? 'text-error' : ''}`}>
              {marketState === 'BULL' ? '🐂 BULL' : marketState === 'BEAR' ? '🐻 BEAR' : 'NEUTRAL'}
            </div>
          </div>
          
          <div className="bg-secondary p-4 rounded">
            <div className="text-secondary text-sm mb-1">Average Change</div>
            <div className={`text-xl font-bold ${marketStats.averageChange >= 0 ? 'text-success' : 'text-error'}`}>
              {marketStats.averageChange >= 0 ? '+' : ''}{marketStats.averageChange.toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-secondary p-4 rounded">
            <div className="text-secondary text-sm mb-1">Gainers / Losers</div>
            <div className="text-xl font-bold">
              <span className="text-success">{marketStats.gainers}</span> / <span className="text-error">{marketStats.losers}</span>
              {marketStats.unchanged > 0 && <span className="text-secondary"> ({marketStats.unchanged} unchanged)</span>}
            </div>
          </div>
        </div>
        
        {marketStats.topGainer && marketStats.topLoser && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary p-4 rounded">
              <div className="text-secondary text-sm mb-1">Top Gainer</div>
              <div className="flex justify-between">
                <div className="font-bold">{marketStats.topGainer.symbol} - {marketStats.topGainer.name}</div>
                <div className="text-success">+{marketStats.topGainer.dailyVariation.toFixed(2)}%</div>
              </div>
            </div>
            
            <div className="bg-secondary p-4 rounded">
              <div className="text-secondary text-sm mb-1">Top Loser</div>
              <div className="flex justify-between">
                <div className="font-bold">{marketStats.topLoser.symbol} - {marketStats.topLoser.name}</div>
                <div className="text-error">{marketStats.topLoser.dailyVariation.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Market Comparison Chart */}
      <div className="card mb-6 overflow-hidden">
        <div className="p-4 border-b border-color-border">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Market Comparison</h3>
            <div className="flex items-center space-x-2">
              <button 
                className={`px-3 py-1 text-xs rounded ${chartView === 'normalized' ? 'bg-accent text-white' : 'bg-secondary'}`}
                onClick={() => setChartView('normalized')}
              >
                Normalized
              </button>
              <button 
                className={`px-3 py-1 text-xs rounded ${chartView === 'price' ? 'bg-accent text-white' : 'bg-secondary'}`}
                onClick={() => setChartView('price')}
              >
                Price
              </button>
            </div>
          </div>
        </div>
        <div style={{ height: '300px', padding: '16px 8px 8px 8px' }}>
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-secondary">
              Select stocks to compare
            </div>
          )}
        </div>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="card mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">Search Stocks</label>
            <input
              type="text"
              id="search"
              className="w-full p-2 bg-tertiary rounded border border-color-border"
              placeholder="Search by symbol, name, or sector..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div>
            <label htmlFor="sector" className="block text-sm font-medium mb-1">Filter by Sector</label>
            <select
              id="sector"
              className="w-full p-2 bg-tertiary rounded border border-color-border"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              {allSectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1">Sort By</label>
            <div className="flex">
              <select
                id="sort"
                className="flex-1 p-2 bg-tertiary rounded-l border border-color-border"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="symbol">Symbol</option>
                <option value="price">Price</option>
                <option value="change">Change</option>
              </select>
              <button
                className="px-3 bg-tertiary border border-l-0 border-color-border rounded-r"
                onClick={handleSortOrderChange}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-secondary">
            {filteredStocks.length} stock{filteredStocks.length !== 1 ? 's' : ''} found
          </div>
          
          <button
            className="px-4 py-2 bg-accent text-white rounded"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Stock'}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="mt-4 p-4 bg-secondary rounded">
            <h3 className="text-lg font-bold mb-3">Create New Stock</h3>
            <form onSubmit={handleCreateStock}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-2 bg-tertiary rounded border border-color-border"
                    value={newStock.name}
                    onChange={handleNewStockChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="symbol" className="block text-sm font-medium mb-1">Symbol</label>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    className="w-full p-2 bg-tertiary rounded border border-color-border"
                    value={newStock.symbol}
                    onChange={handleNewStockChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sector" className="block text-sm font-medium mb-1">Sector</label>
                  <input
                    type="text"
                    id="sector"
                    name="sector"
                    className="w-full p-2 bg-tertiary rounded border border-color-border"
                    value={newStock.sector}
                    onChange={handleNewStockChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white rounded"
                >
                  Create Stock
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Stock List */}
      <h3 className="text-lg font-bold mb-4">Available Stocks</h3>
      
      {sectors.length === 0 ? (
        <div className="card text-center p-8">
          <div className="mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="rgba(160, 160, 160, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2">No stocks found</h3>
          <p className="text-secondary mb-4">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sectors.map(sector => (
            <div key={sector} className="mb-6">
              <h4 className="text-md font-medium mb-3 text-secondary">{sector}</h4>
              <div className="grid grid-cols-1 gap-4">
                {stocksBySector[sector].map(stock => (
                  <div key={stock.symbol} className="flex items-center">
                    <div className="flex-1">
                      <StockCard
                        stock={stock}
                        onBuy={onBuy}
                        onSell={undefined}
                      />
                    </div>
                    <div className="ml-4">
                      <button
                        className={`p-2 rounded ${selectedStocks.includes(stock.symbol) ? 'bg-accent text-white' : 'bg-secondary'}`}
                        onClick={() => toggleStockSelection(stock.symbol)}
                        title={selectedStocks.includes(stock.symbol) ? 'Remove from chart' : 'Add to chart'}
                      >
                        {selectedStocks.includes(stock.symbol) ? '📊' : '➕'}
                      </button>
                    </div>
                  </div>
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