import axios from 'axios';
import { Stock, StockPortfolio, StockTransaction, NewStockRequest } from '../types';
import { 
  getMockPortfolio, 
  mockBuyStock, 
  mockSellStock, 
  mockProgressDay, 
  mockResetPortfolio,
  mockCreateStock
} from './mockData';

// Flag to determine whether to use mock data or real API
const USE_MOCK_DATA = true;

const API_URL = '/api/portfolio';

export const getPortfolio = async (): Promise<StockPortfolio> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockPortfolio();
  }
  
  const response = await axios.get<StockPortfolio>(API_URL);
  return response.data;
};

export const getStocks = async (): Promise<Stock[]> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockPortfolio().stocks;
  }
  
  const response = await axios.get<Stock[]>(`${API_URL}/stocks`);
  return response.data;
};

export const getStockPool = async (): Promise<Stock[]> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockPortfolio().stockPool;
  }
  
  const response = await axios.get<Stock[]>(`${API_URL}/pool`);
  return response.data;
};

export const buyStock = async (transaction: StockTransaction): Promise<Stock> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockBuyStock(transaction.symbol, transaction.quantity);
    const portfolio = getMockPortfolio();
    return portfolio.stocks.find(s => s.symbol === transaction.symbol) as Stock;
  }
  
  const response = await axios.post<Stock>(`${API_URL}/buy`, transaction);
  return response.data;
};

export const sellStock = async (transaction: StockTransaction): Promise<Stock> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockSellStock(transaction.symbol, transaction.quantity);
    const portfolio = getMockPortfolio();
    const stock = portfolio.stocks.find(s => s.symbol === transaction.symbol);
    return stock || { 
      symbol: transaction.symbol, 
      quantity: 0,
      name: '',
      sector: '',
      currentPrice: 0,
      originalPrice: 0,
      priceChange: 0,
      buyPrice: 0,
      sellPrice: 0,
      realizedProfit: 0,
      potentialProfit: 0,
      dailyVariation: 0,
      priceHistory: []
    };
  }
  
  const response = await axios.post<Stock>(`${API_URL}/sell`, transaction);
  return response.data;
};

export const progressDay = async (): Promise<StockPortfolio> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockProgressDay();
    return getMockPortfolio();
  }
  
  const response = await axios.post<StockPortfolio>(`${API_URL}/progress-day`);
  return response.data;
};

export const resetPortfolio = async (): Promise<StockPortfolio> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockResetPortfolio();
    return getMockPortfolio();
  }
  
  const response = await axios.post<StockPortfolio>(`${API_URL}/reset`);
  return response.data;
};

export const savePortfolio = async (): Promise<void> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In mock mode, we don't need to do anything for save
    return;
  }
  
  await axios.post(`${API_URL}/save`);
};

export const loadPortfolio = async (): Promise<void> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In mock mode, we don't need to do anything for load
    return;
  }
  
  await axios.post(`${API_URL}/load`);
};

export const createStock = async (newStock: NewStockRequest): Promise<Stock> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockCreateStock(newStock.name, newStock.symbol, newStock.sector);
    const portfolio = getMockPortfolio();
    return portfolio.stockPool.find(s => s.symbol === newStock.symbol) as Stock;
  }
  
  const response = await axios.post<Stock>(`${API_URL}/create-stock`, newStock);
  return response.data;
}; 