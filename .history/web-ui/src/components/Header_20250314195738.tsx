import React from 'react';
import { StockPortfolio } from '../types';

interface HeaderProps {
  portfolio: StockPortfolio | null;
  onProgressDay: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  portfolio, 
  onProgressDay, 
  onReset,
  onSave,
  onLoad
}) => {
  return (
    <header className="bg-secondary p-4 mb-4 rounded">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-8">
            <h1 className="text-xl font-bold text-accent">Trader Game</h1>
            {portfolio && (
              <p className="text-secondary text-sm">
                Day <span className="text-primary font-medium">{portfolio.tradingDay}</span>
              </p>
            )}
          </div>
          
          {portfolio && (
            <div className="hidden md:flex items-center">
              <div className="stock-badge mr-2 badge-bull">
                <span className={`${portfolio.marketState === 'BULL' ? 'text-success' : 'text-secondary'}`}>
                  BULL
                </span>
              </div>
              <div className="stock-badge mr-2 badge-bear">
                <span className={`${portfolio.marketState === 'BEAR' ? 'text-error' : 'text-secondary'}`}>
                  BEAR
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="hidden md:flex gap-6">
          {portfolio && (
            <div className="text-right">
              <p className="text-secondary text-xs">Cash</p>
              <p className="text-lg font-medium">
                ${portfolio.cash.toFixed(2)}
              </p>
            </div>
          )}
          {portfolio && (
            <div className="text-right">
              <p className="text-secondary text-xs">Portfolio Value</p>
              <p className="text-lg font-medium">
                ${portfolio.portfolioValue.toFixed(2)}
              </p>
            </div>
          )}
          {portfolio && (
            <div className="text-right">
              <p className="text-secondary text-xs">Total P&L</p>
              <p className={`text-lg font-medium ${portfolio.totalPnl >= 0 ? 'text-success' : 'text-error'}`}>
                ${portfolio.totalPnl.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button className="btn" onClick={onProgressDay}>
            Next Day
          </button>
          <div className="hidden md:flex gap-2">
            <button className="btn btn-secondary" onClick={onSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={onLoad}>
              Load
            </button>
            <button className="btn btn-secondary" onClick={onReset}>
              Reset
            </button>
          </div>
          <div className="md:hidden">
            <button className="btn btn-secondary p-2" onClick={() => {
              const menu = document.getElementById('mobile-menu');
              if (menu) {
                menu.classList.toggle('hidden');
              }
            }}>
              ☰
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden mt-4 p-4 bg-secondary rounded fade-in">
        <div className="flex justify-between mb-4">
          {portfolio && (
            <div>
              <p className="text-secondary text-xs">Cash</p>
              <p className="text-md font-medium">
                ${portfolio.cash.toFixed(2)}
              </p>
            </div>
          )}
          {portfolio && (
            <div>
              <p className="text-secondary text-xs">Portfolio Value</p>
              <p className="text-md font-medium">
                ${portfolio.portfolioValue.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-between">
          <button className="btn btn-secondary flex-1" onClick={onSave}>
            Save
          </button>
          <button className="btn btn-secondary flex-1" onClick={onLoad}>
            Load
          </button>
          <button className="btn btn-secondary flex-1" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 