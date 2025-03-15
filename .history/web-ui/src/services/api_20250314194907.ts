import axios from 'axios';
import { Stock, StockPortfolio, StockTransaction, NewStockRequest } from '../types';

const API_URL = '/api/portfolio';

export const getPortfolio = async (): Promise<StockPortfolio> => {
  const response = await axios.get<StockPortfolio>(API_URL);
  return response.data;
};

export const getStocks = async (): Promise<Stock[]> => {
  const response = await axios.get<Stock[]>(`${API_URL}/stocks`);
  return response.data;
};

export const getStockPool = async (): Promise<Stock[]> => {
  const response = await axios.get<Stock[]>(`${API_URL}/pool`);
  return response.data;
};

export const buyStock = async (transaction: StockTransaction): Promise<Stock> => {
  const response = await axios.post<Stock>(`${API_URL}/buy`, transaction);
  return response.data;
};

export const sellStock = async (transaction: StockTransaction): Promise<Stock> => {
  const response = await axios.post<Stock>(`${API_URL}/sell`, transaction);
  return response.data;
};

export const progressDay = async (): Promise<StockPortfolio> => {
  const response = await axios.post<StockPortfolio>(`${API_URL}/progress-day`);
  return response.data;
};

export const resetPortfolio = async (): Promise<StockPortfolio> => {
  const response = await axios.post<StockPortfolio>(`${API_URL}/reset`);
  return response.data;
};

export const savePortfolio = async (): Promise<void> => {
  await axios.post(`${API_URL}/save`);
};

export const loadPortfolio = async (): Promise<void> => {
  await axios.post(`${API_URL}/load`);
};

export const createStock = async (newStock: NewStockRequest): Promise<Stock> => {
  const response = await axios.post<Stock>(`${API_URL}/create-stock`, newStock);
  return response.data;
}; 