export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  originalPrice: number;
  priceChange: number;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  realizedProfit: number;
  potentialProfit: number;
  dailyVariation: number;
  priceHistory: number[];
}

export interface StockPortfolio {
  name: string;
  tradingDay: number;
  cash: number;
  balance: number;
  portfolioValue: number;
  totalPnl: number;
  marketState: 'BULL' | 'BEAR' | 'NEUTRAL';
  stocks: Stock[];
  stockPool: Stock[];
  pnlHistory: number[];
}

export interface StockTransaction {
  symbol: string;
  quantity: number;
}

export interface NewStockRequest {
  name: string;
  symbol: string;
  sector: string;
} 