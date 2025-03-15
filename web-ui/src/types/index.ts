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
  ownedStocks: Stock[];
  stockPool: Stock[];
  pnlHistory: number[];
  transactions: StockTransaction[];
}

export interface StockTransaction {
  symbol: string;
  quantity: number;
  price: number;
  date?: string;
  type?: 'BUY' | 'SELL';
}

export interface NewStockRequest {
  name: string;
  symbol: string;
  sector: string;
} 