import React from 'react';
import { StockPortfolio } from '../types';

interface HeaderProps {
  portfolio: StockPortfolio | null;
  onProgressDay: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ portfolio, onProgressDay, onReset }) => {
  return (
    <header className="bg-secondary p-4 mb-4 rounded">
      <div className="container flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-accent">Trader Game</h1>
          {portfolio && (
            <p className="text-secondary">
              Day: <span className="text-primary">{portfolio.tradingDay}</span>
            </p>
          )}
        </div>
        <div className="flex gap-4">
          {portfolio && (
            <div className="text-right">
              <p className="text-secondary">Cash</p>
              <p className="text-lg font-medium">
                ${portfolio.cash.toFixed(2)}
              </p>
            </div>
          )}
          {portfolio && (
            <div className="text-right">
              <p className="text-secondary">Portfolio Value</p>
              <p className="text-lg font-medium">
                ${portfolio.portfolioValue.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={onProgressDay}>
            Next Day
          </button>
          <button className="btn btn-secondary" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 