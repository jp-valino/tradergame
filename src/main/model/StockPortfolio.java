package model;

import org.json.JSONArray;
import org.json.JSONObject;
import persistence.Writable;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

/*
Represents a StockPortfolio. A stock portfolio has some key fields:
 - a name
 - a list of stocks (the portfolio itself)
 - a pool of stocks (available stocks that can be bought)
 - a balance (altered by buying and selling stocks)
 - a trading day (changes according to time progression)
 - a market state (determines variation of stock prices)
 - total Profit and Loss (determined by difference in buy and sell prices of all shares)
 */
public class StockPortfolio implements Writable {

    private String stockPortfolioName;
    private List<Stock> stockPortfolio;
    private List<Stock> stockPool;
    private double stockPortfolioBalance;
    private int tradingDay;
    private String marketState;
    private double totalPNL;
    private ArrayList<Double> pnlHistory; // TODO: remove if breaks

    // Getters:
    // EFFECTS: returns the portfolio's name
    public String getStockPortfolioName() {
        return this.stockPortfolioName;
    }

    // EFFECTS: returns the profit and loss
    public double getTotalPNL() {
        return totalPNL;
    }

    // EFFECTS: returns the list of stocks in the portfolio
    public List<Stock> getStockPortfolio() {
        return this.stockPortfolio;
    }

    // EFFECTS: returns the list of stocks in the stock pool
    public List<Stock> getStockPool() {
        return this.stockPool;
    }

    // EFFECTS: returns portfolio balance
    public double getStockPortfolioBalance() {
        return this.stockPortfolioBalance;
    }

    // EFFECTS: returns trading day
    public int getTradingDay() {
        return this.tradingDay;
    }

    // EFFECTS: returns market state
    public String getMarketState() {
        return this.marketState;
    }

    // EFFECTS: returns size of stock portfolio
    public int getNumStocksInPortfolio() {
        return this.stockPortfolio.size();
    }

    // EFFECTS: gets PNL history
    public ArrayList<Double> getPnLHistory() {
        return this.pnlHistory;
    }

    // Setters:
    // MODIFIES: this
    // EFFECTS: sets this stock portfolio's name
    public void setStockPortfolioName(String name) {
        this.stockPortfolioName = name;
    }

    // MODIFIES: this
    // EFFECTS: sets this stock portfolio's balance
    public void setStockPortfolioBalance(double balance) {
        this.stockPortfolioBalance = balance;
    }

    // MODIFIES: this
    // EFFECTS: sets this stock portfolio's trading day
    public void setTradingDay(int day) {
        this.tradingDay = day;
    }

    // MODIFIES: this
    // EFFECTS: sets this stock portfolio's market state
    public void setMarketState(String state) {
        this.marketState = state;
    }

    // MODIFIES: this
    // EFFECTS: sets this stock portfolio's total PNL
    public void setTotalPNL(double pnl) {
        this.totalPNL = pnl;
    }

    // MODIFIES: this
    // EFFECTS: sets the pnl history to informed array
    public void setPnlHistory(ArrayList<Double> pnlHist) {
        this.pnlHistory = pnlHist;
    }

    // EFFECTS: constructs new Portfolio
    public StockPortfolio(String name) {
        this.tradingDay = 0;
        this.stockPortfolioName = name;
        this.stockPortfolio = new ArrayList<>();
        this.stockPool = new ArrayList<>();
        constructInitialStockPool();
        this.stockPortfolioBalance = 5000; // each user starts with 5000 dollars
        this.marketState = "Neutral";
        this.pnlHistory = new ArrayList<>(); // TODO: remove if breaks something
    }

    // EFFECTS: Creates initial stocks for the stock pool
    public void constructInitialStockPool() {
        Stock apple = new Stock("Apple", "AAPL", "Technology");
        Stock google = new Stock("Google", "GOOGL", "Technology");
        Stock meta = new Stock("Facebook", "META", "Technology");
        Stock pfizer = new Stock("Pfizer", "PFE", "Healthcare");
        Stock astraZeneca = new Stock("Astra Zeneca", "AZN", "Healthcare");
        Stock hsbc = new Stock("HSBC Holdings", "HSBC", "Financial");
        Stock jpMorgan = new Stock("JP Morgan Chase", "JPM", "Financial");
        Stock shell = new Stock("Shell PLC", "SHEL", "Energy");
        Stock exxon = new Stock("Exxon Mobil", "XOM", "Energy");
        Stock cocaCola = new Stock("Coca-Cola Company", "KO", "Consumer Goods");
        Stock pepsiCola = new Stock("Pepsi Cola", "PEP", "Consumer Goods");
        stockPool.add(apple);
        stockPool.add(google);
        stockPool.add(meta);
        stockPool.add(pfizer);
        stockPool.add(astraZeneca);
        stockPool.add(hsbc);
        stockPool.add(jpMorgan);
        stockPool.add(shell);
        stockPool.add(exxon);
        stockPool.add(cocaCola);
        stockPool.add(pepsiCola);
    }

    // MODIFIES: this
    // EFFECTS: adds Stock to the portfolio
    public void addStock(Stock stock) {
        this.stockPortfolio.add(stock);
    }

    // MODIFIES: this
    // EFFECTS: add Stock to pool, if it's already there, removes previous stock and re-adds
    public void addStockToPool(Stock stock) {
        List<String> poolStockNames = new ArrayList<String>();
        for (Stock s : stockPool) {
            poolStockNames.add(s.getStockName());
        }
        if (poolStockNames.contains(stock.getStockName())) {
            removeStockFromPoolWithName(stock.getStockName());
            this.stockPool.add(stock);
        } else {
            stockPool.add(stock);
        }
    }

    // MODIFIES: this
    // EFFECTS: given a stock, removes it from portfolio
    public void removeStock(Stock stock) {
        this.stockPortfolio.remove(stock);
    }

    // MODIFIES: this
    // EFFECTS: given a stock's name, removes it from portfolio
    public void removeStockFromPoolWithName(String name) {
        stockPool.removeIf(s -> Objects.equals(name, s.getStockName()));
    }


    // MODIFIES: this
    // EFFECTS: creates a new stock using a given name, code and sector
    public boolean createNewStock(String stockName, String stockCode, String stockSector) {
        if (this.stockPortfolioBalance >= 1000) {
            Stock newStock = new Stock(stockName, stockCode, stockSector);
            newStock.setOriginalPrice(10.0);
            newStock.setCurrentPrice(10.0);
            newStock.buyShares(100);
            this.addStock(newStock);
            this.stockPool.add(newStock);
            this.stockPortfolioBalance -= 1000;
            EventLog.getInstance().logEvent(new Event("Created a new venture business: "
                    + stockName + " (" + stockCode + ");"));
            return true;
        } else {
            EventLog.getInstance().logEvent(new Event("Failed to create new business, insufficient funds;"));
            return false;
        }
    }

    // REQUIRES: shares > 0
    // MODIFIES: this
    // EFFECTS: buys n shares of the stock, registers buy price and adds stock to portfolio.
    public boolean buyStock(String code, int shares) {
        boolean returnVal = false;
        String desc = "Failed at buying stock (not enough balance or incorrect code);";
        for (Stock s : this.stockPool) {
            if (Objects.equals(s.getStockCode(), code)
                    && (s.getCurrentPrice() * shares) < this.stockPortfolioBalance) {
                s.buyShares(shares);
                addStock(s);
                stockPortfolioBalance -= s.getCurrentPrice() * shares;
                desc = "Bought " + shares + " shares of a stock: " + code + ";";
                returnVal = true;
            }
        }
        EventLog.getInstance().logEvent(new Event(desc));
        return returnVal;
    }

    // REQUIRES: stock is in the stock pool
    // MODIFIES: this
    // EFFECTS: given a certain stock code, sells all shares and adds/subtracts value from balance, sets the selling
    // price and removes stock from stock portfolio
    public boolean sellStock(String code) {
        Stock toBeRemoved = null;
        boolean returnVal = false;
        String desc = "Failed at selling stock (not currently held);";
        for (Stock s : this.stockPortfolio) {
            if (Objects.equals(s.getStockCode(), code)) {
                this.stockPortfolioBalance += s.getBuyPrice() * s.getSharesOwned();
                s.sellShares();
                this.stockPortfolioBalance += s.getStockRealizedProfit();
                toBeRemoved = s;
                desc = "Sold a stock: " + code + ";";
                returnVal = true;
            }
        }
        removeStock(toBeRemoved);
        EventLog.getInstance().logEvent(new Event(desc));
        return returnVal;
    }

    // MODIFIES: this
    // EFFECTS: returns market feeling, used to determine stock variation range and thus update prices
    public boolean determineMarketState() {
        List<String> possibleStates = new ArrayList<>();
        possibleStates.add("Very Confident");
        possibleStates.add("Confident");
        possibleStates.add("Neutral");
        possibleStates.add("Afraid");
        possibleStates.add("Very Afraid");

        int randomIndex = getRandomIndex(possibleStates.size());
        this.marketState = possibleStates.get(randomIndex);
        return true;
    }

    // EFFECTS: based on market feeling obtained, generate minimum value for Stock variations will be extracted.
    public double determineMinimumMarketRange(String marketState) {
        double minVar = 0;
        switch (marketState) {
            case "Very Confident":
                minVar = 0.1;
                break;
            case "Confident":
                minVar = 0.05;
                break;
            case "Neutral":
                minVar = -0.05;
                break;
            case "Afraid":
                minVar = -0.1;
                break;
            case "Very Afraid":
                minVar = -0.3;
                break;
        }
        return minVar;
    }

    // EFFECTS: based on market feeling obtained, generate maximum value for Stock variations will be extracted.
    public double determineMaximumMarketRange(String marketState) {
        double maxVar = 0;
        switch (marketState) {
            case "Very Confident":
                maxVar = 0.3;
                break;
            case "Confident":
                maxVar = 0.1;
                break;
            case "Neutral":
                maxVar = 0.05;
                break;
            case "Afraid":
                maxVar = -0.05;
                break;
            case "Very Afraid":
                maxVar = -0.1;
                break;
        }
        return maxVar;
    }

    // EFFECTS: determines if the outlier effect will be applied.
    public boolean determineOutlierEffect() {
        Random rand = new Random();
        double randomValue = rand.nextDouble();
        double trueThreshold = 0.05; // 5%
        return randomValue < trueThreshold;
    }

    // EFFECTS: determines actual stock variation
    public double determineActualVariation() {
        double variationPercent;
        if (determineOutlierEffect()) {
            variationPercent = ThreadLocalRandom.current().nextDouble(-1, 5);
        } else {
            String marketState = this.marketState;
            double minVar = determineMinimumMarketRange(marketState);
            double maxVar = determineMaximumMarketRange(marketState);
            variationPercent = ThreadLocalRandom.current().nextDouble(minVar, maxVar);
        }
        return variationPercent;
    }

    // EFFECTS: generates a random index within an array's length
    public static int getRandomIndex(int size) {
        Random rand = new Random();
        return rand.nextInt(size);
    }

    // MODIFIES: this
    // EFFECTS: updates all prices in a pool of stocks
    public void updateAllPrices() {
        for (Stock s : stockPool) {
            double percentage = determineActualVariation();
            s.updatePrice(percentage);
        }
    }

    // MODIFIES: this
    // EFFECTS: updates historic data on stock prices
    public void updateHistoricalPrices() {
        for (Stock s : stockPool) {
            s.addPriceToHistory();
        }
    }

    // MODIFIES: this
    // EFFECTS: updates general profit or loss of the portfolio
    public void updateStockProfits() {
        for (Stock s : stockPortfolio) {
            s.updateProfitSoFar();
        }
    }

    // MODIFIES: this
    // EFFECTS: updates the stock variations for all stocks in the pool
    public void updateStockVariations() {
        for (Stock s : stockPool) {
            s.updateDailyVariation();
        }
    }

    // MODIFIES: this
    // EFFECTS: makes sure stock

    // MODIFIES: this
    // EFFECTS: proceeds to the next day, updates all: prices, profits, variations and historical price arrays
    public void progressDay() {
        this.tradingDay += 1;
        this.updateAllPrices();
        this.updateStockProfits();
        this.updateStockVariations();
        this.updateHistoricalPrices();
        this.addPnLtoHistory();
        EventLog.getInstance().logEvent(new Event("Progressed to day " + this.tradingDay + " of trading;"));
    }

    // MODIFIES: this
    // EFFECTS: calculates portfolio's cumulative profit or loss so far
    public boolean calculateTotalPNL() {
        double totalPNL = 0;
        for (Stock s : this.getStockPortfolio()) {
            totalPNL = totalPNL + s.getStockPotentialProfit();
        }
        this.totalPNL =  totalPNL;
        return true;
    }

    // REQUIRES: portfolio is non-empty
    // MODIFIES: this
    // EFFECTS: sells all stocks currently in the portfolio, returns true if successful
    public boolean sellAllStock() {
        String codeToSell = "this";
        List<String> codesToRemove = new ArrayList<>();
        if (this.getStockPortfolio().size() > 0) {
            for (Stock s : this.getStockPortfolio()) {
                codeToSell = s.getStockCode();
                codesToRemove.add(codeToSell);
            }

            for (String code : codesToRemove) {
                sellStock(code);
            }

            EventLog.getInstance().logEvent(new Event("Sold all stocks;"));
            return true;
        } else {
            EventLog.getInstance().logEvent(new Event("Failed to sell all stock (no stocks held);"));
            return false;
        }
    }

    // EFFECTS: returns current price of a stock given its code
    public double getPriceFromCode(String code) {
        double toReturn = 0.0;
        for (Stock s : this.getStockPool()) {
            if (Objects.equals(s.getStockCode(), code)) {
                toReturn = s.getCurrentPrice();
            }
        }
        return toReturn;
    }

    // MODIFIES: this
    // EFFECTS: has a 25% chance of conceding a loan of $2000, if successful, returns true, if not, false
    public boolean requestLoanReturnVal() {
        String desc;
        Random rand = new Random();
        double randomValue = rand.nextDouble();
        double trueThreshold = 0.25;
        boolean chance = randomValue < trueThreshold;
        boolean returnValue;

        if (chance) {
            this.stockPortfolioBalance += 2000;
            returnValue = true;
            desc = "Successfully obtained a loan;";
        } else {
            returnValue = false;
            desc = "Failed at obtaining a loan;";
        }
        EventLog.getInstance().logEvent(new Event(desc));
        return returnValue;
    }

    // MODIFIES: this
    // EFFECTS: adds current PNL to historical list of all PNLs so far for given portfolio
    public void addPnLtoHistory() {
        this.calculateTotalPNL();
        double pnl = this.getTotalPNL();
        this.pnlHistory.add(pnl);
    }

    // EFFECTS: adds current PNL to historical list of all PNLs so far for given portfolio
    public List<String> getAllStockCodes() {
        List<String> allStockNames = new ArrayList<>();
        for (Stock s : this.stockPortfolio) {
            allStockNames.add(s.getStockCode());
        }
        return allStockNames;
    }

    public List<String> getAllStockCodesPool() {
        List<String> allStockNames = new ArrayList<>();
        for (Stock s : this.stockPool) {
            allStockNames.add(s.getStockCode());
        }
        return allStockNames;
    }

    // EFFECTS: creates JSON representation of current stock portfolio
    @Override
    public JSONObject toJson() {
        JSONObject json = new JSONObject();
        json.put("stock_portfolio", stockPortfolioToJson());
        json.put("stock_pool", stockPoolToJson());
        json.put("trading_day", tradingDay);
        json.put("balance", stockPortfolioBalance);
        json.put("total_pnl", totalPNL);
        json.put("market_state", marketState);
        json.put("name", stockPortfolioName);
        json.put("pnl_history", pnlHistory);
        return json;
    }

    private JSONArray stockPortfolioToJson() {
        JSONArray jsonArray = new JSONArray();

        for (Stock s : stockPortfolio) {
            jsonArray.put(s.toJson());
        }
        return jsonArray;
    }

    private JSONArray stockPoolToJson() {
        JSONArray jsonArray = new JSONArray();

        for (Stock s : stockPool) {
            jsonArray.put(s.toJson());
        }
        return jsonArray;
    }

}
