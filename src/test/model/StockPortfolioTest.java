package model;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class StockPortfolioTest {

    StockPortfolio testPortfolio;
    StockPortfolio testPortfolio2;
    StockPortfolio testPortfolio3;

    @BeforeEach
    void runBefore() {
        testPortfolio = new StockPortfolio("Test Portfolio 1");
        testPortfolio2 = new StockPortfolio("Test Portfolio 2");
        testPortfolio3 = new StockPortfolio("Test Portfolio 3");
    }

    @Test
    void testConstructor() {
        assertEquals("Test Portfolio 1", testPortfolio.getStockPortfolioName());
        assertEquals(0, testPortfolio.getTradingDay());
        assertEquals(0, testPortfolio.getStockPortfolio().size());
        assertEquals(11, testPortfolio.getStockPool().size());
        assertEquals(5000, testPortfolio.getStockPortfolioBalance());
        assertEquals("Neutral", testPortfolio.getMarketState());
    }

    @Test
    void testAddStock() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        Stock stockTest2 = new Stock("Test Stock 2", "TSTS2", "None");
        testPortfolio.addStock(stockTest);
        assertEquals(1, testPortfolio.getStockPortfolio().size());
        testPortfolio.addStock(stockTest2);
        assertEquals(2, testPortfolio.getStockPortfolio().size());
    }

    @Test
    void testRemoveStock() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        Stock stockTest2 = new Stock("Test Stock 2", "TSTS2", "None");
        testPortfolio.addStock(stockTest);
        assertEquals(1, testPortfolio.getStockPortfolio().size());
        testPortfolio.removeStock(stockTest);
        assertEquals(0, testPortfolio.getStockPortfolio().size());
    }

    @Test
    void testCreateNewStock() {
        testPortfolio.createNewStock("New Stock A", "NSA", "Technology");
        assertEquals(4000, testPortfolio.getStockPortfolioBalance());
        assertEquals(1, testPortfolio.getNumStocksInPortfolio());
    }

    @Test
    void testBuyStocks() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        Stock stockTest2 = new Stock("Test Stock 2", "TSTS2", "None");
        testPortfolio.addStockToPool(stockTest);
        testPortfolio.addStockToPool(stockTest2);
        testPortfolio.buyStock("TSTS", 10);
        testPortfolio.buyStock("TSTS2", 10);
        assertEquals(2, testPortfolio.getNumStocksInPortfolio());
        assertTrue(testPortfolio.getStockPortfolioBalance() < 5000);
    }

    @Test
    void testFailToCreate() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        stockTest.setCurrentPrice(11.0);
        testPortfolio.addStockToPool(stockTest);
        testPortfolio.buyStock("TSTS", 400);
        assertEquals(1, testPortfolio.getNumStocksInPortfolio());
        assertEquals(600, testPortfolio.getStockPortfolioBalance());
        assertFalse(testPortfolio.createNewStock("Test", "T", "None"));
    }

    @Test
    void testBuyPreExistingStock() {
        testPortfolio.buyStock("AAPL", 10);
        testPortfolio.buyStock("GOOGL", 15);
        assertEquals(2, testPortfolio.getNumStocksInPortfolio());
        assertTrue(testPortfolio.getStockPortfolioBalance() < 5000);
    }

    @Test
    void testSellStockSamePrice() {
        testPortfolio.buyStock("AAPL", 10);
        assertEquals(1, testPortfolio.getNumStocksInPortfolio());
        assertTrue(testPortfolio.getStockPortfolioBalance() < 5000);
        testPortfolio.sellStock("AAPL");
        assertEquals(5000, testPortfolio.getStockPortfolioBalance());
    }

    @Test
    void testSellStockDiffPrice() {
        testPortfolio.buyStock("AAPL", 10);
        assertEquals(1, testPortfolio.getNumStocksInPortfolio());
        assertTrue(testPortfolio.getStockPortfolioBalance() < 5000);
        testPortfolio.progressDay();
        assertEquals(1, testPortfolio.getTradingDay());
        testPortfolio.sellStock("AAPL");
        assertNotEquals(5000, testPortfolio.getStockPortfolioBalance());
    }

    @Test
    void testProgressSeveralDays() {
        testPortfolio.buyStock("GOOGL", 10);
        testPortfolio.buyStock("META", 10);
        assertTrue(testPortfolio.getStockPortfolioBalance() < 5000);
        testPortfolio.sellStock("GOOGL");
        testPortfolio.sellStock("META");
        testPortfolio.buyStock("GOOGL", 50);
        testPortfolio.buyStock("META", 35);
        testPortfolio.progressDay();
        testPortfolio.progressDay();
        testPortfolio.progressDay();
        assertEquals(3, testPortfolio.getTradingDay());
        testPortfolio.sellStock("GOOGL");
        testPortfolio.sellStock("META");
        assertNotEquals(5000, testPortfolio.getStockPortfolioBalance());
    }

    @Test
    void testBuyFail() {
        assertFalse(testPortfolio.buyStock("NVDA", 50));
        assertFalse(testPortfolio.buyStock("ABCD", 50));
    }

    @Test
    void testBuyNotEnoughBalance() {
        assertFalse(testPortfolio.buyStock("AAPL", 50000));
    }

    @Test
    void testSellFail() {
        assertFalse(testPortfolio.sellStock("NVDA"));
        assertFalse(testPortfolio.sellStock("GOOGL"));
    }

    @Test
    void testMarketState() {
        assertTrue(testPortfolio.determineMarketState());
    }

    @Test
    void testTotalPNL() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        testPortfolio.addStockToPool(stockTest);
        testPortfolio.buyStock("TSTS", 10);
        ArrayList<String> expectedCodes = new ArrayList<>();
        expectedCodes.add("TSTS");
        assertEquals(expectedCodes, testPortfolio.getAllStockCodes());
        testPortfolio.progressDay();
        testPortfolio.progressDay();
        testPortfolio.progressDay();
        assertTrue(testPortfolio.calculateTotalPNL());
        assertNotEquals(0, testPortfolio.getTotalPNL());
    }


    @Test
    void testSellAllStock() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        Stock stockTest2 = new Stock("Test Stock 2", "TSTS2", "None");
        Stock stockTest3 = new Stock("Test Stock 3", "TSTS3", "None");
        testPortfolio.addStockToPool(stockTest);
        testPortfolio.addStockToPool(stockTest2);
        testPortfolio.addStockToPool(stockTest3);
        testPortfolio.buyStock("TSTS", 10);
        testPortfolio.buyStock("TSTS2", 10);
        testPortfolio.buyStock("TSTS3", 10);
        assertEquals(3, testPortfolio.getNumStocksInPortfolio());
        testPortfolio.progressDay();
        testPortfolio.progressDay();
        testPortfolio.progressDay();
        testPortfolio.sellAllStock();
        assertEquals(0, testPortfolio.getNumStocksInPortfolio());
    }

    @Test
    void testSellAllStockFail() {
        assertFalse(testPortfolio.sellAllStock());
        assertEquals(0, testPortfolio.getNumStocksInPortfolio());
    }

    @Test
    void testGetPriceFromCode() {
        Stock stockTest = new Stock("Test Stock", "TSTS", "None");
        stockTest.setCurrentPrice(111.0);
        testPortfolio.addStockToPool(stockTest);
        testPortfolio.buyStock("TSTS", 1);
        assertEquals(1, testPortfolio.getNumStocksInPortfolio());
        assertEquals(111.0,testPortfolio.getPriceFromCode("TSTS"));
    }

    @Test
    void testRequestLoan() {
        testPortfolio.requestLoanReturnVal();
        assertTrue(testPortfolio.getStockPortfolioBalance() == 5000
                || testPortfolio.getStockPortfolioBalance()==7000);
    }

    @Test
    void testCodesInPool() {
        ArrayList<String> expectedCodes = new ArrayList<>();
        expectedCodes.add("AAPL");
        expectedCodes.add("GOOGL");
        expectedCodes.add("META");
        expectedCodes.add("PFE");
        expectedCodes.add("AZN");
        expectedCodes.add("HSBC");
        expectedCodes.add("JPM");
        expectedCodes.add("SHEL");
        expectedCodes.add("XOM");
        expectedCodes.add("KO");
        expectedCodes.add("PEP");
        assertEquals(expectedCodes, testPortfolio.getAllStockCodesPool());
    }

    @Test
    void testMinVar() {
        String marketState = testPortfolio.getMarketState();
        assertTrue(testPortfolio.determineMinimumMarketRange(marketState) == 0.1
                || testPortfolio.determineMinimumMarketRange(marketState) == 0.05
                || testPortfolio.determineMinimumMarketRange(marketState) == -0.05
                || testPortfolio.determineMinimumMarketRange(marketState) == -0.1
                || testPortfolio.determineMinimumMarketRange(marketState) == -0.3 );
    }

    @Test
    void testMinVarManual() {
        String marketState;
        marketState = "Neutral";
        assertTrue(testPortfolio.determineMinimumMarketRange(marketState) == -0.05);
        marketState = "Confident";
        assertTrue(testPortfolio.determineMinimumMarketRange(marketState) == 0.05);
        marketState = "Very Confident";
        assertTrue(testPortfolio.determineMinimumMarketRange(marketState) == 0.1);
        marketState = "Afraid";
        assertTrue(testPortfolio.determineMinimumMarketRange(marketState) == -0.1);
        marketState = "Very Afraid";
        assertTrue(testPortfolio.determineMinimumMarketRange(marketState) == -0.3);
    }

    @Test
    void testMaxVar() {
        String marketState = testPortfolio.getMarketState();
        assertTrue(testPortfolio.determineMaximumMarketRange(marketState) == 0.3
                || testPortfolio.determineMaximumMarketRange(marketState) == 0.1
                || testPortfolio.determineMaximumMarketRange(marketState) == 0.05
                || testPortfolio.determineMaximumMarketRange(marketState) == -0.05
                || testPortfolio.determineMaximumMarketRange(marketState) == -0.1 );
    }

    @Test
    void testMaxVarManual() {
        String marketState;
        marketState = "Neutral";
        assertTrue(testPortfolio.determineMaximumMarketRange(marketState) == 0.05);
        marketState = "Confident";
        assertTrue(testPortfolio.determineMaximumMarketRange(marketState) == 0.1);
        marketState = "Very Confident";
        assertTrue(testPortfolio.determineMaximumMarketRange(marketState) == 0.3);
        marketState = "Afraid";
        assertTrue(testPortfolio.determineMaximumMarketRange(marketState) == -0.05);
        marketState = "Very Afraid";
        assertTrue(testPortfolio.determineMaximumMarketRange(marketState) == -0.1);
    }

    @Test
    void testRequestLoanManual() {
        assertTrue((testPortfolio.requestLoanReturnVal() == true
                && testPortfolio.getStockPortfolioBalance() == 7000)
                || (testPortfolio.requestLoanReturnVal() == false
                && testPortfolio.getStockPortfolioBalance() == 5000));
    }
}