import { Stock, StockPortfolio } from '../types';

// Generate random price history
const generatePriceHistory = (days: number, startPrice: number): number[] => {
  const history = [startPrice];
  let currentPrice = startPrice;
  
  for (let i = 1; i < days; i++) {
    const change = currentPrice * (Math.random() * 0.1 - 0.05); // -5% to +5%
    currentPrice += change;
    history.push(Math.max(1, currentPrice)); // Ensure price doesn't go below 1
  }
  
  return history;
};

// Generate a mock stock
const createMockStock = (
  symbol: string, 
  name: string, 
  sector: string, 
  price: number, 
  quantity: number = 0
): Stock => {
  const priceHistory = generatePriceHistory(10, price);
  const currentPrice = priceHistory[priceHistory.length - 1];
  const previousPrice = priceHistory[priceHistory.length - 2] || price;
  const priceChange = currentPrice - previousPrice;
  
  return {
    symbol,
    name,
    sector,
    currentPrice,
    originalPrice: price,
    priceChange,
    quantity,
    buyPrice: quantity > 0 ? price * 0.9 : 0, // Simulate buying at a slightly lower price
    sellPrice: 0,
    realizedProfit: 0,
    potentialProfit: quantity > 0 ? quantity * (currentPrice - (price * 0.9)) : 0,
    dailyVariation: (priceChange / previousPrice) * 100,
    priceHistory
  };
};

// Create mock stock pool
const createMockStockPool = (): Stock[] => {
  return [
    createMockStock('AAPL', 'Apple Inc.', 'Technology', 150),
    createMockStock('MSFT', 'Microsoft Corporation', 'Technology', 250),
    createMockStock('GOOGL', 'Alphabet Inc.', 'Technology', 2000),
    createMockStock('AMZN', 'Amazon.com Inc.', 'Consumer Cyclical', 3000),
    createMockStock('TSLA', 'Tesla Inc.', 'Automotive', 800),
    createMockStock('META', 'Meta Platforms Inc.', 'Technology', 300),
    createMockStock('NFLX', 'Netflix Inc.', 'Entertainment', 400),
    createMockStock('JPM', 'JPMorgan Chase & Co.', 'Financial Services', 120),
    createMockStock('V', 'Visa Inc.', 'Financial Services', 200),
    createMockStock('JNJ', 'Johnson & Johnson', 'Healthcare', 160)
  ];
};

// Create mock portfolio with some owned stocks
const createMockPortfolio = (): StockPortfolio => {
  const stockPool = createMockStockPool();
  
  // Create some owned stocks (copies of pool stocks with quantities)
  const ownedStocks = [
    createMockStock('AAPL', 'Apple Inc.', 'Technology', 150, 10),
    createMockStock('MSFT', 'Microsoft Corporation', 'Technology', 250, 5),
    createMockStock('GOOGL', 'Alphabet Inc.', 'Technology', 2000, 2)
  ];
  
  // Calculate portfolio value
  const portfolioValue = ownedStocks.reduce(
    (total, stock) => total + stock.currentPrice * stock.quantity, 
    0
  );
  
  // Generate PnL history
  const pnlHistory = generatePriceHistory(10, 10000).map(val => val - 10000);
  
  return {
    name: 'My Stock Portfolio',
    tradingDay: 10,
    cash: 50000,
    balance: 50000,
    portfolioValue,
    totalPnl: pnlHistory[pnlHistory.length - 1],
    marketState: Math.random() > 0.5 ? 'BULL' : 'BEAR',
    stocks: ownedStocks,
    stockPool,
    pnlHistory
  };
};

// Mock portfolio data
let mockPortfolio = createMockPortfolio();

// Mock API functions
export const getMockPortfolio = (): StockPortfolio => {
  return mockPortfolio;
};

export const mockBuyStock = (symbol: string, quantity: number): void => {
  const stockToBuy = mockPortfolio.stockPool.find(s => s.symbol === symbol);
  if (!stockToBuy) return;
  
  const cost = stockToBuy.currentPrice * quantity;
  
  // Check if we have enough cash
  if (mockPortfolio.cash < cost) return;
  
  // Update cash
  mockPortfolio.cash -= cost;
  mockPortfolio.balance = mockPortfolio.cash;
  
  // Check if we already own this stock
  const existingStock = mockPortfolio.stocks.find(s => s.symbol === symbol);
  
  if (existingStock) {
    // Update existing stock
    const avgBuyPrice = (existingStock.buyPrice * existingStock.quantity + cost) / (existingStock.quantity + quantity);
    existingStock.quantity += quantity;
    existingStock.buyPrice = avgBuyPrice;
    existingStock.potentialProfit = existingStock.quantity * (existingStock.currentPrice - existingStock.buyPrice);
  } else {
    // Add new stock to portfolio
    const newStock = { ...stockToBuy };
    newStock.quantity = quantity;
    newStock.buyPrice = newStock.currentPrice;
    newStock.potentialProfit = quantity * (newStock.currentPrice - newStock.buyPrice);
    mockPortfolio.stocks.push(newStock);
  }
  
  // Update portfolio value
  mockPortfolio.portfolioValue = mockPortfolio.stocks.reduce(
    (total, stock) => total + stock.currentPrice * stock.quantity, 
    0
  );
};

export const mockSellStock = (symbol: string, quantity: number): void => {
  const stockToSell = mockPortfolio.stocks.find(s => s.symbol === symbol);
  if (!stockToSell || stockToSell.quantity < quantity) return;
  
  const revenue = stockToSell.currentPrice * quantity;
  
  // Update cash
  mockPortfolio.cash += revenue;
  mockPortfolio.balance = mockPortfolio.cash;
  
  // Update realized profit
  const profitPerShare = stockToSell.currentPrice - stockToSell.buyPrice;
  stockToSell.realizedProfit += profitPerShare * quantity;
  
  // Update stock quantity
  stockToSell.quantity -= quantity;
  
  // Remove stock if quantity is 0
  if (stockToSell.quantity === 0) {
    mockPortfolio.stocks = mockPortfolio.stocks.filter(s => s.symbol !== symbol);
  } else {
    // Update potential profit
    stockToSell.potentialProfit = stockToSell.quantity * (stockToSell.currentPrice - stockToSell.buyPrice);
  }
  
  // Update portfolio value
  mockPortfolio.portfolioValue = mockPortfolio.stocks.reduce(
    (total, stock) => total + stock.currentPrice * stock.quantity, 
    0
  );
  
  // Update total PnL
  mockPortfolio.totalPnl = mockPortfolio.stocks.reduce(
    (total, stock) => total + stock.potentialProfit + stock.realizedProfit,
    0
  );
};

export const mockProgressDay = (): void => {
  // Increment trading day
  mockPortfolio.tradingDay += 1;
  
  // Randomly change market state
  if (Math.random() < 0.2) {
    mockPortfolio.marketState = Math.random() > 0.5 ? 'BULL' : 'BEAR';
  }
  
  // Update stock prices
  const updateStockPrice = (stock: Stock) => {
    const marketFactor = mockPortfolio.marketState === 'BULL' ? 0.03 : -0.02;
    const randomFactor = Math.random() * 0.1 - 0.05; // -5% to +5%
    const changePercent = marketFactor + randomFactor;
    
    const previousPrice = stock.currentPrice;
    const newPrice = Math.max(1, previousPrice * (1 + changePercent));
    
    stock.priceHistory.push(newPrice);
    if (stock.priceHistory.length > 30) {
      stock.priceHistory.shift(); // Keep only last 30 days
    }
    
    stock.currentPrice = newPrice;
    stock.priceChange = newPrice - previousPrice;
    stock.dailyVariation = (stock.priceChange / previousPrice) * 100;
    
    if (stock.quantity > 0) {
      stock.potentialProfit = stock.quantity * (stock.currentPrice - stock.buyPrice);
    }
    
    return stock;
  };
  
  // Update all stocks
  mockPortfolio.stocks = mockPortfolio.stocks.map(updateStockPrice);
  mockPortfolio.stockPool = mockPortfolio.stockPool.map(updateStockPrice);
  
  // Update portfolio value
  mockPortfolio.portfolioValue = mockPortfolio.stocks.reduce(
    (total, stock) => total + stock.currentPrice * stock.quantity, 
    0
  );
  
  // Update PnL history
  const currentPnl = mockPortfolio.stocks.reduce(
    (total, stock) => total + stock.potentialProfit + stock.realizedProfit,
    0
  );
  mockPortfolio.pnlHistory.push(currentPnl);
  if (mockPortfolio.pnlHistory.length > 30) {
    mockPortfolio.pnlHistory.shift(); // Keep only last 30 days
  }
  
  mockPortfolio.totalPnl = currentPnl;
};

export const mockResetPortfolio = (): void => {
  mockPortfolio = createMockPortfolio();
};

export const mockCreateStock = (name: string, symbol: string, sector: string): void => {
  const price = Math.floor(Math.random() * 500) + 50; // Random price between 50 and 550
  const newStock = createMockStock(symbol, name, sector, price);
  mockPortfolio.stockPool.push(newStock);
}; 