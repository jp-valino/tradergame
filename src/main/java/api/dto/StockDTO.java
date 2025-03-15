package api.dto;

import java.util.List;

public class StockDTO {
    private String symbol;
    private String name;
    private double currentPrice;
    private double priceChange;
    private int quantity;
    private List<Double> priceHistory;
    
    public StockDTO() {
    }
    
    public StockDTO(String symbol, String name, double currentPrice, double priceChange, int quantity, List<Double> priceHistory) {
        this.symbol = symbol;
        this.name = name;
        this.currentPrice = currentPrice;
        this.priceChange = priceChange;
        this.quantity = quantity;
        this.priceHistory = priceHistory;
    }
    
    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public double getCurrentPrice() {
        return currentPrice;
    }
    
    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
    }
    
    public double getPriceChange() {
        return priceChange;
    }
    
    public void setPriceChange(double priceChange) {
        this.priceChange = priceChange;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
    public List<Double> getPriceHistory() {
        return priceHistory;
    }
    
    public void setPriceHistory(List<Double> priceHistory) {
        this.priceHistory = priceHistory;
    }
} 