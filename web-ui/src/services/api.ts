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

export const buyStock = async (symbol: string, quantity: number): Promise<StockTransaction> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = mockBuyStock(symbol, quantity);
    return {
      symbol,
      quantity,
      price: result.price,
      type: 'BUY',
      date: new Date().toISOString()
    };
  }
  
  const response = await axios.post<StockTransaction>(`${API_URL}/buy`, { symbol, quantity });
  return response.data;
};

export const sellStock = async (symbol: string, quantity: number): Promise<StockTransaction> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = mockSellStock(symbol, quantity);
    return {
      symbol,
      quantity,
      price: result.price,
      type: 'SELL',
      date: new Date().toISOString()
    };
  }
  
  const response = await axios.post<StockTransaction>(`${API_URL}/sell`, { symbol, quantity });
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

export const loadPortfolio = async (): Promise<StockPortfolio> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In mock mode, just return the current portfolio
    return getMockPortfolio();
  }
  
  const response = await axios.post<StockPortfolio>(`${API_URL}/load`);
  return response.data;
};

export const createStock = async (name: string, symbol: string, sector: string): Promise<Stock> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockCreateStock(name, symbol, sector);
    const portfolio = getMockPortfolio();
    return portfolio.stockPool.find(s => s.symbol === symbol) as Stock;
  }
  
  const response = await axios.post<Stock>(`${API_URL}/create-stock`, { name, symbol, sector });
  return response.data;
}; 