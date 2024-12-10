package persistence;

import model.StockPortfolio;
import model.Stock;

import java.util.*;
import static org.junit.jupiter.api.Assertions.assertEquals;


public class JsonTest {

    protected void checkStock(String name, String code, String sector, double ogPrice, double currPrice, int shares,
                              double buyPrice, double sellPrice, double realProfit, double potProfit, double variation,
                              ArrayList<Double> priceHistory, Stock stock) {
        assertEquals(name, stock.getStockName());
        assertEquals(code, stock.getStockCode());
        assertEquals(sector, stock.getStockSector());
        assertEquals(ogPrice, stock.getOriginalPrice());
        assertEquals(currPrice, stock.getCurrentPrice());
        assertEquals(shares, stock.getSharesOwned());
        assertEquals(buyPrice, stock.getBuyPrice());
        assertEquals(sellPrice, stock.getSellPrice());
        assertEquals(realProfit, stock.getStockRealizedProfit());
        assertEquals(potProfit, stock.getStockPotentialProfit());
        assertEquals(variation, stock.getStockDailyVariation());
        assertEquals(priceHistory, stock.getPriceHistory());
    }

    protected void checkStockPortfolio(String name, ArrayList<Stock> portfolio, ArrayList<Stock> pool,
                                       double balance, int day, String state, double profitLoss,
                                       ArrayList<Double> pnlHist, StockPortfolio stockPortfolio) {
        assertEquals(name, stockPortfolio.getStockPortfolioName());
        assertEquals(portfolio, stockPortfolio.getStockPortfolio());
        assertEquals(pool, stockPortfolio.getStockPool());
        assertEquals(balance, stockPortfolio.getStockPortfolioBalance());
        assertEquals(day, stockPortfolio.getTradingDay());
        assertEquals(state, stockPortfolio.getMarketState());
        assertEquals(profitLoss, stockPortfolio.getTotalPNL());
        assertEquals(pnlHist, stockPortfolio.getPnLHistory());
    }
}
