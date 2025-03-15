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
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stock Market</h2>
        <div className="flex items-center gap-2">
          <span className="text-secondary">Market State:</span>
          <span className={`font-bold ${
            marketState === 'BULL' ? 'text-success' : 
            marketState === 'BEAR' ? 'text-error' : 'text-primary'
          }`}>
            {marketState}
          </span>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-secondary">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortChange}
              className="input"
              style={{ width: 'auto' }}
            >
              <option value="symbol">Symbol</option>
              <option value="price">Price</option>
              <option value="change">Change</option>
            </select>
            <button
              className="btn btn-secondary"
              onClick={handleSortOrderChange}
              style={{ padding: '8px 12px' }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-4 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Create New Stock</h3>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Stock'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateStock} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-secondary mb-1">Company Name</label>
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
                <label htmlFor="symbol" className="block text-secondary mb-1">Symbol</label>
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
                <label htmlFor="sector" className="block text-secondary mb-1">Sector</label>
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
        )}
      </div>
      
      {sortedStocks.length === 0 ? (
        <div className="card text-center p-4">
          <p className="text-secondary">No stocks found matching your search.</p>
        </div>
      ) : (
        <div className="grid">
          {sortedStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onBuy={onBuy}
              onSell={undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StockMarket; 