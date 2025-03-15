export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  quantity: number;
  priceHistory: number[];
}

export interface StockPortfolio {
  name: string;
  tradingDay: number;
  cash: number;
  portfolioValue: number;
  stocks: Stock[];
  stockPool: Stock[];
  pnlHistory: number[];
}

export interface StockTransaction {
  symbol: string;
  quantity: number;
} 