import React, { useState, useEffect } from 'react';
import { StockPortfolio, StockTransaction } from './types';
import Header from './components/Header';
import StockMarket from './components/StockMarket';
import Portfolio from './components/Portfolio';
import { 
  getPortfolio, 
  getStocks, 
  getStockPool, 
  buyStock, 
  sellStock, 
  progressDay, 
  resetPortfolio,
  savePortfolio,
  loadPortfolio,
  createStock
} from './services/api';
import './styles/index.css';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<StockPortfolio | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market'>('portfolio');

  useEffect(() => {
    fetchPortfolio();
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setErrorMessage('Failed to load portfolio data. Please try again.');
    }
  };

  const handleBuyStock = async (symbol: string, quantity: number) => {
    try {
      const transaction = await buyStock(symbol, quantity);
      setPortfolio(prevPortfolio => {
        if (!prevPortfolio) return null;
        
        // Find the stock in the portfolio
        const stockIndex = prevPortfolio.ownedStocks.findIndex(s => s.symbol === symbol);
        
        if (stockIndex >= 0) {
          // Update existing stock
          const updatedStocks = [...prevPortfolio.ownedStocks];
          updatedStocks[stockIndex] = {
            ...updatedStocks[stockIndex],
            quantity: updatedStocks[stockIndex].quantity + quantity,
            buyPrice: transaction.price
          };
          
          return {
            ...prevPortfolio,
            cash: prevPortfolio.cash - (transaction.price * quantity),
            ownedStocks: updatedStocks,
            portfolioValue: calculatePortfolioValue(updatedStocks),
            transactions: [...prevPortfolio.transactions, transaction]
          };
        } else {
          // Add new stock to portfolio
          const stockPool = prevPortfolio.stockPool;
          const stockToBuy = stockPool.find(s => s.symbol === symbol);
          
          if (!stockToBuy) return prevPortfolio;
          
          const newStock = {
            ...stockToBuy,
            quantity,
            buyPrice: transaction.price,
            potentialProfit: 0,
            realizedProfit: 0
          };
          
          return {
            ...prevPortfolio,
            cash: prevPortfolio.cash - (transaction.price * quantity),
            ownedStocks: [...prevPortfolio.ownedStocks, newStock],
            portfolioValue: calculatePortfolioValue([...prevPortfolio.ownedStocks, newStock]),
            transactions: [...prevPortfolio.transactions, transaction]
          };
        }
      });
      
      setSuccessMessage(`Successfully bought ${quantity} shares of ${symbol}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Switch to portfolio tab after buying
      setActiveTab('portfolio');
    } catch (error) {
      console.error('Error buying stock:', error);
      setErrorMessage(`Failed to buy ${symbol}. Please try again.`);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleSellStock = async (symbol: string, quantity: number) => {
    try {
      const transaction = await sellStock(symbol, quantity);
      setPortfolio(prevPortfolio => {
        if (!prevPortfolio) return null;
        
        // Find the stock in the portfolio
        const stockIndex = prevPortfolio.ownedStocks.findIndex(s => s.symbol === symbol);
        
        if (stockIndex >= 0) {
          const stock = prevPortfolio.ownedStocks[stockIndex];
          const updatedStocks = [...prevPortfolio.ownedStocks];
          
          if (stock.quantity <= quantity) {
            // Remove stock if selling all shares
            updatedStocks.splice(stockIndex, 1);
          } else {
            // Update quantity if selling some shares
            updatedStocks[stockIndex] = {
              ...stock,
              quantity: stock.quantity - quantity,
              realizedProfit: stock.realizedProfit + (transaction.price - stock.buyPrice) * quantity
            };
          }
          
          return {
            ...prevPortfolio,
            cash: prevPortfolio.cash + (transaction.price * quantity),
            ownedStocks: updatedStocks,
            portfolioValue: calculatePortfolioValue(updatedStocks),
            transactions: [...prevPortfolio.transactions, transaction]
          };
        }
        
        return prevPortfolio;
      });
      
      setSuccessMessage(`Successfully sold ${quantity} shares of ${symbol}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error selling stock:', error);
      setErrorMessage(`Failed to sell ${symbol}. Please try again.`);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleProgressDay = async () => {
    try {
      const updatedPortfolio = await progressDay();
      setPortfolio(updatedPortfolio);
      setSuccessMessage('Successfully progressed to the next day');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error progressing day:', error);
      setErrorMessage('Failed to progress to the next day. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleResetPortfolio = async () => {
    try {
      const newPortfolio = await resetPortfolio();
      setPortfolio(newPortfolio);
      setSuccessMessage('Portfolio has been reset');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error resetting portfolio:', error);
      setErrorMessage('Failed to reset portfolio. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleSavePortfolio = async () => {
    try {
      await savePortfolio();
      setSuccessMessage('Portfolio saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setErrorMessage('Failed to save portfolio. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleLoadPortfolio = async () => {
    try {
      const loadedPortfolio = await loadPortfolio();
      setPortfolio(loadedPortfolio);
      setSuccessMessage('Portfolio loaded successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setErrorMessage('Failed to load portfolio. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleCreateStock = async (name: string, symbol: string, sector: string) => {
    try {
      const newStock = await createStock(name, symbol, sector);
      setPortfolio(prevPortfolio => {
        if (!prevPortfolio) return null;
        
        return {
          ...prevPortfolio,
          stockPool: [...prevPortfolio.stockPool, newStock]
        };
      });
      
      setSuccessMessage(`Successfully created new stock: ${symbol}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error creating stock:', error);
      setErrorMessage(`Failed to create stock ${symbol}. Please try again.`);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const calculatePortfolioValue = (stocks: any[]) => {
    return stocks.reduce((total, stock) => total + (stock.currentPrice * stock.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        portfolio={portfolio}
        onProgressDay={handleProgressDay}
        onReset={handleResetPortfolio}
        onSave={handleSavePortfolio}
        onLoad={handleLoadPortfolio}
        isScrolled={isScrolled}
      />
      
      <main className="container py-4">
        {successMessage && (
          <div className="bg-success p-3 rounded mb-4 fade-in">
            <p>{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-error p-3 rounded mb-4 fade-in">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <div className={`tab-indicator ${activeTab === 'market' ? 'market' : ''}`}></div>
          <button
            className={`tab-button ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            My Portfolio
          </button>
          <button
            className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            Stock Market
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {portfolio && activeTab === 'portfolio' && (
            <Portfolio 
              stocks={portfolio.ownedStocks}
              pnlHistory={portfolio.pnlHistory}
              onSell={handleSellStock}
            />
          )}
          
          {portfolio && activeTab === 'market' && (
            <StockMarket 
              stocks={portfolio.stockPool}
              onBuy={handleBuyStock}
              onCreateStock={handleCreateStock}
              marketState={portfolio.marketState}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App; 