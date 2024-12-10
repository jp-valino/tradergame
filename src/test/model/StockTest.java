package model;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class StockTest {

    Stock testStock;
    Stock testStock2;
    Stock testStock3;

    @BeforeEach
    void runBefore() {
        testStock = new Stock("Stock A", "STKA", "Technology");
        testStock2 = new Stock("Stock B", "STKB", "Consumer Goods");
        testStock3 = new Stock("Stock C", "STKC", "Healthcare");
    }

    @Test
    void testConstructor() {
        assertEquals("Stock A", testStock.getStockName());
        assertEquals("STKA", testStock.getStockCode());
        assertEquals("Technology", testStock.getStockSector());
        assertTrue(testStock.getOriginalPrice() > 5 && testStock.getOriginalPrice() < 100);
        assertEquals(testStock.getOriginalPrice(), testStock.getCurrentPrice());

        List<Double> expectedList = new ArrayList<>();
        expectedList.add(testStock.getCurrentPrice());
        assertEquals(expectedList, testStock.getPriceHistory());
        assertEquals(0, testStock.getSharesOwned());
        assertEquals(0, testStock.getBuyPrice());
        assertEquals(0, testStock.getSellPrice());
        assertEquals(0, testStock.getStockRealizedProfit());
        assertEquals(0, testStock.getStockPotentialProfit());
        assertEquals(0, testStock.getStockDailyVariation());
    }

    @Test
    void testUpdatePrice() {
        double percentage = 0.25;
        double expectedPrice = testStock.getCurrentPrice();
        expectedPrice = expectedPrice + (expectedPrice * percentage);
        testStock.updatePrice(0.25);
        double actualPrice = testStock.getCurrentPrice();
        assertEquals(expectedPrice,actualPrice);
    }

    @Test
    void testBuyShares() {
        testStock.buyShares(100);
        assertEquals(100, testStock.getSharesOwned());
        assertEquals(testStock.getBuyPrice(), testStock.getCurrentPrice());
    }

    @Test
    void testSellShares() {
        testStock.sellShares();
        assertEquals(0, testStock.getStockRealizedProfit());
        assertEquals(0, testStock.getSharesOwned());
    }

    @Test
    void testUpdateVariation() {
        testStock.updateDailyVariation();
        assertEquals(0, testStock.getStockDailyVariation());
    }

    @Test
    void testAddPriceToHistory() {
        assertEquals(1, testStock.getPriceHistory().size());
        testStock.addPriceToHistory();
        assertEquals(2, testStock.getPriceHistory().size());
    }

    @Test
    void testSetOriginalPrice() {
        testStock.setOriginalPrice(10.0);
        assertEquals(10, testStock.getOriginalPrice());
    }

    @Test
    void testSetCurrentPrice() {
        testStock.setCurrentPrice(15.0);
        assertEquals(15, testStock.getCurrentPrice());
    }

    @Test
    void testUpdateProfitSoFar() {
        testStock.updateProfitSoFar();
        assertEquals(0, testStock.getStockPotentialProfit());
    }

    @Test
    void testComplexCaseUpdatingPrice() {
        testStock2.setOriginalPrice(100.0);
        testStock2.setCurrentPrice(100.0);
        testStock2.updatePrice(0.5);
        assertEquals(150, testStock2.getCurrentPrice());
        testStock2.updatePrice(0.5);
        assertEquals(225, testStock2.getCurrentPrice());
    }

    @Test
    void testComplexCaseBuyAndSell() {
        testStock2.setCurrentPrice(20.0);
        testStock2.buyShares(10);
        assertEquals(10, testStock2.getSharesOwned());
        assertEquals(20, testStock2.getBuyPrice());
        testStock2.setCurrentPrice(60.0);
        testStock2.sellShares();
        assertEquals(60, testStock2.getSellPrice());
        assertEquals(0, testStock2.getSharesOwned());
        assertEquals(400, testStock2.getStockRealizedProfit());
    }

}
