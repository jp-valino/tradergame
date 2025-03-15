package api.dto;

public class StockTransactionDTO {
    private String symbol;
    private int quantity;
    
    public StockTransactionDTO() {
    }
    
    public StockTransactionDTO(String symbol, int quantity) {
        this.symbol = symbol;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
} 