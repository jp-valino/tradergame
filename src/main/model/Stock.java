package model;

import org.json.JSONArray;
import org.json.JSONObject;
import persistence.Writable;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

/*
Represents a Stock. A stock has some key fields like:
 - description (name, code and sector)
 - prices (original, current, buy and sell)
 - number of shares owned (0 shares is a non-bought stock)
 - a history of prices
 - daily change in price (%)
 - profit (predicted and realized)
 */
public class Stock implements Writable {

    /*
    CLASS-LEVEL COMMENT: Stock Class
    Describes a stock. The stock has a name, code and sector, as well as fields pertaining to its original, current
    and historical prices. The stock is the element contained in the portfolio, and each stock can be bought and
    sold by the user in order to produce profit.
    */

    private String stockName;
    private String stockCode;
    private String stockSector;

    private ArrayList<Double> priceHistory;

    private double originalPrice;
    private double currentPrice;
    private int sharesOwned;
    private double buyPrice;
    private double sellPrice;
    private double stockRealizedProfit;
    private double stockPotentialProfit;
    private double stockDailyVariation;

    // Constructor

    // EFFECTS: Constructs a new Stock
    public Stock(String name,String code, String sector) {
        this.stockName = name;
        this.stockCode = code;
        this.stockSector = sector;

        double random;
        int min = 5;
        int max = 100;
        random = ThreadLocalRandom.current().nextDouble(min, max);

        this.originalPrice = random;
        this.currentPrice = this.originalPrice;
        priceHistory = new ArrayList<>();
        priceHistory.add(this.originalPrice); // adds first price at index 0
        this.sharesOwned = 0;
        this.buyPrice = 0;
        this.sellPrice = 0;
        this.stockRealizedProfit = 0;
        this.stockPotentialProfit = 0;
        this.stockDailyVariation = 0;
    }

    // Getters

    // EFFECTS: returns the stock name
    public String getStockName() {
        return this.stockName;
    }

    // EFFECTS: returns the stock code
    public String getStockCode() {
        return this.stockCode;
    }

    // EFFECTS: returns the stock sector
    public String getStockSector() {
        return this.stockSector;
    }

    // EFFECTS: returns the original price
    public double getOriginalPrice() {
        return this.originalPrice;
    }

    // EFFECTS: returns the current price
    public double getCurrentPrice() {
        return this.currentPrice;
    }

    // EFFECTS: returns the price history
    public ArrayList<Double> getPriceHistory() {
        return this.priceHistory;
    }

    // EFFECTS: returns the number of shares owned
    public int getSharesOwned() {
        return this.sharesOwned;
    }

    // EFFECTS: returns the buy price
    public double getBuyPrice() {
        return this.buyPrice;
    }

    // EFFECTS: returns the sell price
    public double getSellPrice() {
        return this.sellPrice;
    }

    // EFFECTS: returns the realized profit
    public double getStockRealizedProfit() {
        return this.stockRealizedProfit;
    }

    // EFFECTS: returns the potential profit
    public double getStockPotentialProfit() {
        return this.stockPotentialProfit;
    }

    // EFFECTS: returns the daily variation
    public double getStockDailyVariation() {
        return this.stockDailyVariation;
    }


    // Setters

    // MODIFIES: this
    // EFFECTS: sets the stock's name to given value
    public void setStockName(String name) {
        this.stockName = name;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's sector to given value
    public void setStockSector(String sector) {
        this.stockSector = sector;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's code to given value
    public void setStockCode(String code) {
        this.stockCode = code;
    }

    // MODIFIES: this
    // EFFECTS: sets the original price
    public void setOriginalPrice(Double price) {
        this.originalPrice = price;
    }

    // MODIFIES: this
    // EFFECTS: sets the current price
    public void setCurrentPrice(Double price) {
        this.currentPrice = price;
    }

    // MODIFIES: this
    // EFFECTS: sets the current price
    public void setSharesOwned(int shares) {
        this.sharesOwned = shares;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's buy price to given value
    public void setBuyPrice(Double buyPrice) {
        this.buyPrice = buyPrice;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's sell price to given value
    public void setSellPrice(Double sellPrice) {
        this.sellPrice = sellPrice;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's realized profit to given value
    public void setStockRealizedProfit(Double realizedProfit) {
        this.stockRealizedProfit = realizedProfit;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's potential profit to given value
    public void setStockPotentialProfit(Double potentialProfit) {
        this.stockPotentialProfit = potentialProfit;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's daily change to given value
    public void setStockDailyVariation(Double dailyVariation) {
        this.stockDailyVariation = dailyVariation;
    }

    // MODIFIES: this
    // EFFECTS: sets the stock's daily change to given value
    public void setPriceHistory(ArrayList<Double> prices) {
        this.priceHistory = prices;
    }

    // Other methods:

    // REQUIRES: currentPrice is non-null
    // MODIFIES: this
    // EFFECTS: adds current price to historical prices list for this stock
    public void addPriceToHistory() {
        double priceToAdd = this.getCurrentPrice(); // Remember first price is added in constructor
        this.priceHistory.add(priceToAdd);
    }

    // MODIFIES: this
    // EFFECTS: updates the current price based on a given percentage
    public void updatePrice(double percentage) {
        double newPrice = this.getCurrentPrice();
        newPrice = newPrice + (newPrice * percentage);
        this.currentPrice = newPrice;
    }

    // MODIFIES: this
    // EFFECTS: updates the stock's profit / loss
    public void updateProfitSoFar() {
        this.stockPotentialProfit = (this.currentPrice - this.buyPrice) * this.sharesOwned;
    }

    // MODIFIES: this
    // EFFECTS: compares yesterday's price with the current
    public void updateDailyVariation() {
        this.stockDailyVariation = (this.currentPrice - this.priceHistory.get(priceHistory.size() - 1))
                / this.priceHistory.get(priceHistory.size() - 1);
    }

    // REQUIRES: i > 0
    // MODIFIES: this
    // EFFECTS: buys i shares, registers BuyPrice
    public void buyShares(int i) {
        this.sharesOwned = i;
        this.buyPrice = this.currentPrice;
    }

    // MODIFIES: this
    // EFFECTS: registers sellPrice, sets profit/loss for this stock, sets shares of this Stock to 0
    public void sellShares() {
        this.sellPrice = this.currentPrice;
        this.stockRealizedProfit = (this.sellPrice - this.buyPrice) * this.sharesOwned;
        this.sharesOwned = 0;
    }

    // TODO: create toJson() method in Stock class
    // EFFECTS"
    @Override
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("name", stockName);
        json.put("code", stockCode);
        json.put("sector", stockSector);
        json.put("original_price", originalPrice);
        json.put("current_price", currentPrice);
        json.put("shares_owned", sharesOwned);
        json.put("buy_price", buyPrice);
        json.put("sell_price", sellPrice);
        json.put("realized_profit", stockRealizedProfit);
        json.put("potential_profit", stockPotentialProfit);
        json.put("daily_variation", stockDailyVariation);
        json.put("price_history", priceHistory); //don't know it this will work, check back later.
        return json;
    }

}
