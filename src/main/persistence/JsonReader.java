package persistence;

import model.Stock;
import model.StockPortfolio;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.stream.Stream;


public class JsonReader {

    /*
    CLASS-LEVEL COMMENT: Json Reader
    Reads data from the stored JSON file and returns new objects of type Stock and StockPortfolio from it.
    */

    private String source;

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

    // MODIFIES: this
    // EFFECTS: constructs reader to read from source file
    public JsonReader(String source) {
        this.source = source;
    }

    // MODIFIES: this
    // EFFECTS: reads Stock Portfolio and returns it as JSONObject;
    // throws IOException if an error occurs reading data from file
    public StockPortfolio read() throws IOException {
        String jsonData = readFile(source);
        JSONObject jsonObject = new JSONObject(jsonData);
        return parseStockPortfolio(jsonObject);
    }

    // MODIFIES: this
    // EFFECTS: reads source file as string and returns it
    private String readFile(String source) throws IOException {
        StringBuilder contentBuilder = new StringBuilder();

        try (Stream<String> stream = Files.lines(Paths.get(source), StandardCharsets.UTF_8)) {
            stream.forEach(s -> contentBuilder.append(s));
        }

        return contentBuilder.toString();
    }

    // MODIFIES: this
    // EFFECTS: parses stockPortfolio from JSON object and returns it
    private StockPortfolio parseStockPortfolio(JSONObject jsonObject) {
        StockPortfolio stockPortfolio = new StockPortfolio("My Stock Portfolio");
        addStocksToPool(stockPortfolio, jsonObject);
        addStocksToPortfolio(stockPortfolio, jsonObject);
        setRemainingFields(stockPortfolio, jsonObject);
        return stockPortfolio;
    }


    // MODIFIES: this
    // EFFECTS: Parse each stock from stock portfolio's stock portfolio
    private void addStocksToPortfolio(StockPortfolio stockPortfolio, JSONObject jsonObject) {
        JSONArray jsonArray = jsonObject.getJSONArray("stock_portfolio");
        for (Object json : jsonArray) {
            JSONObject nextEntry = (JSONObject) json;
            addStockToPortfolio(stockPortfolio, nextEntry);
            createNewStockFromJsonAddToPortfolio(stockPortfolio);
        }
    }

    // MODIFIES: this
    // EFFECTS: Parses stock data from JSON object to private fields
    private void addStockToPortfolio(StockPortfolio stockPortfolio, JSONObject jsonObject) {
        this.stockName = jsonObject.getString("name");
        this.stockCode = jsonObject.getString("code");
        this.stockSector = jsonObject.getString("sector");
        this.originalPrice = jsonObject.getDouble("original_price");
        this.currentPrice = jsonObject.getDouble("current_price");
        this.sharesOwned = jsonObject.getInt("shares_owned");
        this.buyPrice = jsonObject.getDouble("buy_price");
        this.sellPrice = jsonObject.getDouble("sell_price");
        this.stockRealizedProfit = jsonObject.getDouble("realized_profit");
        this.stockPotentialProfit = jsonObject.getDouble("potential_profit");
        this.stockDailyVariation = jsonObject.getDouble("daily_variation");

        JSONArray priceHistoryArray = jsonObject.getJSONArray("price_history");
        priceHistory = new ArrayList<>();
        for (int i = 0; i < priceHistoryArray.length(); i++) {
            priceHistory.add(priceHistoryArray.getDouble(i));
        }
    }


    // EFFECTS: from information provided in Json file, creates new stock
    private void createNewStockFromJsonAddToPortfolio(StockPortfolio stockPortfolio) {
        Stock stock = new Stock("placeholder", "XYZ", "placeholder");
        stock.setStockName(stockName);
        stock.setStockCode(stockCode);
        stock.setStockSector(stockSector);
        stock.setOriginalPrice(originalPrice);
        stock.setCurrentPrice(currentPrice);
        stock.setSharesOwned(sharesOwned);
        stock.setBuyPrice(buyPrice);
        stock.setSellPrice(sellPrice);
        stock.setStockRealizedProfit(stockRealizedProfit);
        stock.setStockPotentialProfit(stockPotentialProfit);
        stock.setStockDailyVariation(stockDailyVariation);
        stock.setPriceHistory(priceHistory);

        stockPortfolio.addStock(stock);
        stockPortfolio.addStockToPool(stock);
    }


    // MODIFIES: StockPortfolio
    // EFFECTS: Parse each stock from stock portfolio's stock pool
    private void addStocksToPool(StockPortfolio stockPortfolio, JSONObject jsonObject) {
        JSONArray jsonArray = jsonObject.getJSONArray("stock_pool");
        for (Object json : jsonArray) {
            JSONObject nextEntry = (JSONObject) json;
            addStockToPool(stockPortfolio, nextEntry);
            createNewStockFromJsonAddToPool(stockPortfolio);
        }
    }

    // MODIFIES: Stock
    // EFFECTS: Parses stock data from JSON object to private fields
    private void addStockToPool(StockPortfolio stockPortfolio, JSONObject jsonObject) {
        this.stockName = jsonObject.getString("name");
        this.stockCode = jsonObject.getString("code");
        this.stockSector = jsonObject.getString("sector");
        this.originalPrice = jsonObject.getDouble("original_price");
        this.currentPrice = jsonObject.getDouble("current_price");
        this.sharesOwned = jsonObject.getInt("shares_owned");
        this.buyPrice = jsonObject.getDouble("buy_price");
        this.sellPrice = jsonObject.getDouble("sell_price");
        this.stockRealizedProfit = jsonObject.getDouble("realized_profit");
        this.stockPotentialProfit = jsonObject.getDouble("potential_profit");
        this.stockDailyVariation = jsonObject.getDouble("daily_variation");

        JSONArray priceHistoryArray = jsonObject.getJSONArray("price_history");
        priceHistory = new ArrayList<>();
        for (int i = 0; i < priceHistoryArray.length(); i++) {
            priceHistory.add(priceHistoryArray.getDouble(i));
        }
    }

    // EFFECTS: set Stock's fields when going into the stock pool
    private void createNewStockFromJsonAddToPool(StockPortfolio stockPortfolio) {
        Stock stock = new Stock("placeholder", "XYZ", "placeholder");
        stock.setStockName(stockName);
        stock.setStockCode(stockCode);
        stock.setStockSector(stockSector);
        stock.setOriginalPrice(originalPrice);
        stock.setCurrentPrice(currentPrice);
        stock.setSharesOwned(sharesOwned);
        stock.setBuyPrice(buyPrice);
        stock.setSellPrice(sellPrice);
        stock.setStockRealizedProfit(stockRealizedProfit);
        stock.setStockPotentialProfit(stockPotentialProfit);
        stock.setStockDailyVariation(stockDailyVariation);
        stock.setPriceHistory(priceHistory);

        stockPortfolio.addStockToPool(stock);
    }

    // EFFECTS: sets remaining fields of the stock portfolio parsing from stored Json file
    private void setRemainingFields(StockPortfolio stockPortfolio, JSONObject jsonObject) {
        String stockPortfolioName = jsonObject.getString("name");
        double stockPortfolioBalance = jsonObject.getDouble("balance");
        int tradingDay = jsonObject.getInt("trading_day");
        String marketState = jsonObject.getString("market_state");
        double totalPNL = jsonObject.getDouble("total_pnl");

        JSONArray pnlHistoryArray = jsonObject.getJSONArray("pnl_history");
        ArrayList<Double> pnlHistory = new ArrayList<>();
        for (int i = 0; i < pnlHistoryArray.length(); i++) {
            pnlHistory.add(pnlHistoryArray.getDouble(i));
        }

        stockPortfolio.setStockPortfolioName(stockPortfolioName);
        stockPortfolio.setStockPortfolioBalance(stockPortfolioBalance);
        stockPortfolio.setTradingDay(tradingDay);
        stockPortfolio.setMarketState(marketState);
        stockPortfolio.setTotalPNL(totalPNL);
        stockPortfolio.setPnlHistory(pnlHistory);
    }

}
