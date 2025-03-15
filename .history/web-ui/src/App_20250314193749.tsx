import React, { useState, useEffect } from 'react';
import { StockPortfolio, Stock, StockTransaction } from './types';
import * as api from './services/api';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import StockMarket from './components/StockMarket';
import './styles/index.css';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<StockPortfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market'>('portfolio');

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const data = await api.getPortfolio();
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError('Failed to load portfolio data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleBuyStock = async (symbol: string, quantity: number) => {
    try {
      const transaction: StockTransaction = { symbol, quantity };
      await api.buyStock(transaction);
      fetchPortfolio();
    } catch (err) {
      setError('Failed to buy stock. Please try again.');
      console.error(err);
    }
  };

  const handleSellStock = async (symbol: string, quantity: number) => {
    try {
      const transaction: StockTransaction = { symbol, quantity };
      await api.sellStock(transaction);
      fetchPortfolio();
    } catch (err) {
      setError('Failed to sell stock. Please try again.');
      console.error(err);
    }
  };

  const handleProgressDay = async () => {
    try {
      await api.progressDay();
      fetchPortfolio();
    } catch (err) {
      setError('Failed to progress to the next day. Please try again.');
      console.error(err);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetPortfolio();
      fetchPortfolio();
    } catch (err) {
      setError('Failed to reset portfolio. Please try again.');
      console.error(err);
    }
  };

  if (loading && !portfolio) {
    return (
      <div className="container mt-4 text-center">
        <div className="card p-4">
          <h2 className="text-xl font-bold text-accent">Loading Trader Game...</h2>
          <p className="text-secondary mt-2">Please wait while we fetch your portfolio data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-4">
      <Header
        portfolio={portfolio}
        onProgressDay={handleProgressDay}
        onReset={handleReset}
      />

      {error && (
        <div className="bg-error p-4 rounded mb-4">
          <p className="text-white">{error}</p>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="card mb-4">
        <div className="flex">
          <button
            className={`btn ${activeTab === 'portfolio' ? '' : 'btn-secondary'} flex-1`}
            onClick={() => setActiveTab('portfolio')}
          >
            My Portfolio
          </button>
          <button
            className={`btn ${activeTab === 'market' ? '' : 'btn-secondary'} flex-1`}
            onClick={() => setActiveTab('market')}
          >
            Stock Market
          </button>
        </div>
      </div>

      {portfolio && (
        <div>
          {activeTab === 'portfolio' && (
            <Portfolio
              stocks={portfolio.stocks}
              pnlHistory={portfolio.pnlHistory}
              onSell={handleSellStock}
            />
          )}
          {activeTab === 'market' && (
            <StockMarket
              stocks={portfolio.stockPool}
              onBuy={handleBuyStock}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App; 