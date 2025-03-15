import React, { useState, useEffect } from 'react';
import { StockPortfolio, StockTransaction } from './types';
import * as api from './services/api';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import StockMarket from './components/StockMarket';
import './styles/index.css';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<StockPortfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      setSuccess(`Successfully purchased ${quantity} shares of ${symbol}`);
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
      setSuccess(`Successfully sold ${quantity} shares of ${symbol}`);
    } catch (err) {
      setError('Failed to sell stock. Please try again.');
      console.error(err);
    }
  };

  const handleProgressDay = async () => {
    try {
      await api.progressDay();
      fetchPortfolio();
      setSuccess(`Progressed to next trading day: ${portfolio?.tradingDay ? portfolio.tradingDay + 1 : 1}`);
    } catch (err) {
      setError('Failed to progress to the next day. Please try again.');
      console.error(err);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetPortfolio();
      fetchPortfolio();
      setSuccess('Portfolio has been reset successfully');
    } catch (err) {
      setError('Failed to reset portfolio. Please try again.');
      console.error(err);
    }
  };

  const handleSavePortfolio = async () => {
    try {
      await api.savePortfolio();
      setSuccess('Portfolio saved successfully');
    } catch (err) {
      setError('Failed to save portfolio. Please try again.');
      console.error(err);
    }
  };

  const handleLoadPortfolio = async () => {
    try {
      await api.loadPortfolio();
      fetchPortfolio();
      setSuccess('Portfolio loaded successfully');
    } catch (err) {
      setError('Failed to load portfolio. Please try again.');
      console.error(err);
    }
  };

  const handleCreateStock = async (name: string, symbol: string, sector: string) => {
    try {
      await api.createStock({ name, symbol, sector });
      fetchPortfolio();
      setSuccess(`New stock ${name} (${symbol}) created successfully`);
    } catch (err) {
      setError('Failed to create new stock. Please try again.');
      console.error(err);
    }
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
        onSave={handleSavePortfolio}
        onLoad={handleLoadPortfolio}
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

      {success && (
        <div className="bg-success p-4 rounded mb-4">
          <p className="text-white">{success}</p>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => setSuccess(null)}
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
          <div className="card mb-4 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Market State: <span className={portfolio.marketState === 'BULL' ? 'text-success' : 'text-error'}>{portfolio.marketState}</span></h3>
                <p className="text-secondary">Trading Day: {portfolio.tradingDay}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">Balance: ${portfolio.balance.toFixed(2)}</h3>
                <p className={`${portfolio.totalPnl >= 0 ? 'text-success' : 'text-error'}`}>
                  Total P&L: ${portfolio.totalPnl.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

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
              onCreateStock={handleCreateStock}
              marketState={portfolio.marketState}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App; 