import React, { useState } from 'react';
import { Stock } from '../types';
import StockCard from './StockCard';

interface StockMarketProps {
  stocks: Stock[];
  onBuy: (symbol: string, quantity: number) => void;
}

const StockMarket: React.FC<StockMarketProps> = ({ stocks, onBuy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'symbol' | 'price' | 'change');
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
      <h2 className="text-xl font-bold mb-4">Stock Market</h2>
      
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