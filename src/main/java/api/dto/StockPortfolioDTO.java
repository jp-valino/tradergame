package api.dto;

import java.util.List;

public class StockPortfolioDTO {
    private String name;
    private int tradingDay;
    private double cash;
    private double portfolioValue;
    private List<StockDTO> stocks;
    private List<StockDTO> stockPool;
    private List<Double> pnlHistory;
    
    public StockPortfolioDTO() {
    }
    
    public StockPortfolioDTO(String name, int tradingDay, double cash, double portfolioValue, 
                            List<StockDTO> stocks, List<StockDTO> stockPool, List<Double> pnlHistory) {
        this.name = name;
        this.tradingDay = tradingDay;
        this.cash = cash;
        this.portfolioValue = portfolioValue;
        this.stocks = stocks;
        this.stockPool = stockPool;
        this.pnlHistory = pnlHistory;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public int getTradingDay() {
        return tradingDay;
    }
    
    public void setTradingDay(int tradingDay) {
        this.tradingDay = tradingDay;
    }
    
    public double getCash() {
        return cash;
    }
    
    public void setCash(double cash) {
        this.cash = cash;
    }
    
    public double getPortfolioValue() {
        return portfolioValue;
    }
    
    public void setPortfolioValue(double portfolioValue) {
        this.portfolioValue = portfolioValue;
    }
    
    public List<StockDTO> getStocks() {
        return stocks;
    }
    
    public void setStocks(List<StockDTO> stocks) {
        this.stocks = stocks;
    }
    
    public List<StockDTO> getStockPool() {
        return stockPool;
    }
    
    public void setStockPool(List<StockDTO> stockPool) {
        this.stockPool = stockPool;
    }
    
    public List<Double> getPnlHistory() {
        return pnlHistory;
    }
    
    public void setPnlHistory(List<Double> pnlHistory) {
        this.pnlHistory = pnlHistory;
    }
} 