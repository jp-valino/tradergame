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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon">
                      <path d="M7.5 14.25V16.5M10.5 12V16.5M13.5 9.75V16.5M16.5 7.5V16.5M6 20.25H18C19.2426 20.25 20.25 19.2426 20.25 18V6C20.25 4.75736 19.2426 3.75 18 3.75H6C4.75736 3.75 3.75 4.75736 3.75 6V18C3.75 19.2426 4.75736 20.25 6 20.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="accent-stroke"/>
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
              <button className={`btn ${isScrolled ? 'btn-icon' : ''}`} onClick={onProgressDay}>
                {isScrolled ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.75 4.75L19.25 12L12.75 19.25M4.75 19.25L11.25 12L4.75 4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  "Next Day"
                )}
              </button>
              <div className="hidden md:flex gap-2">
                <button className={`btn btn-secondary ${isScrolled ? 'btn-icon' : ''}`} onClick={onSave}>
                  {isScrolled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.25 20.25H6.75C5.64543 20.25 4.75 19.3546 4.75 18.25V5.75C4.75 4.64543 5.64543 3.75 6.75 3.75H14.75L19.25 8.25V18.25C19.25 19.3546 18.3546 20.25 17.25 20.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.75 20.25V16.25C8.75 15.1454 9.64543 14.25 10.75 14.25H13.25C14.3546 14.25 15.25 15.1454 15.25 16.25V20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.75 9.75H15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    "Save"
                  )}
                </button>
                <button className={`btn btn-secondary ${isScrolled ? 'btn-icon' : ''}`} onClick={onLoad}>
                  {isScrolled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.75 9.75V5.75C3.75 4.64543 4.64543 3.75 5.75 3.75H18.25C19.3546 3.75 20.25 4.64543 20.25 5.75V18.25C20.25 19.3546 19.3546 20.25 18.25 20.25H5.75C4.64543 20.25 3.75 19.3546 3.75 18.25V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.75 16.5L16.5 12L9.75 7.5V16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    "Load"
                  )}
                </button>
                <button className={`btn btn-secondary ${isScrolled ? 'btn-icon' : ''}`} onClick={onReset}>
                  {isScrolled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C14.8995 4.75 17.4076 6.34591 18.7136 8.75M19.25 4.75V8.75H15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    "Reset"
                  )}
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