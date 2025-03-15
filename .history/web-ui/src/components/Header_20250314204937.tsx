import React from 'react';
import { StockPortfolio } from '../types';

interface HeaderProps {
  portfolio: StockPortfolio | null;
  onProgressDay: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  portfolio, 
  onProgressDay, 
  onReset,
  onSave,
  onLoad,
  isScrolled
}) => {
  return (
    <div className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className={`app-header mb-4 ${isScrolled ? 'scrolled' : ''}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center header-content">
              <div className="site-branding">
                <div className="site-logo">
                  {isScrolled && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon">
                      <path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 9L15 3L9 9L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="accent-stroke"/>
                      <path d="M9 3V9H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <h1 className="site-title">
                    <span className="title-main">Trader Game</span>
                    <span className="title-edition">2025 Edition</span>
                  </h1>
                </div>
              </div>
              
              <div className="mr-8 trading-day">
                <p className="text-secondary text-sm">
                  Day <span className="text-primary font-medium">{portfolio?.tradingDay || 1}</span>
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default Header; 