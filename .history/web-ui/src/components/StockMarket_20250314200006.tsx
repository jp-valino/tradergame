import React, { useState } from 'react';
import { Stock } from '../types';
import StockCard from './StockCard';

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