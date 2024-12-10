package persistence;

import model.Stock;
import model.StockPortfolio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

public class JsonWriterTest extends JsonTest {

    @Test
    void testWriterInvalidFile() {
        try {
            StockPortfolio stockPortfolio = new StockPortfolio("Sample Stock Portfolio");
            JsonWriter writer = new JsonWriter("./data/my\0illegal:fileName.json");
            writer.open();
            fail("IOException was expected");
        } catch (IOException e) {
            // pass
        }
    }

    @Test
    void testWriterEmptyPortfolio() {
        try {
            StockPortfolio stockPortfolio = new StockPortfolio("Sample Stock Portfolio");
            JsonWriter writer = new JsonWriter("./data/testWriterEmptyPortfolio.json");
            writer.open();
            writer.write(stockPortfolio);
            writer.close();

            JsonReader reader = new JsonReader("./data/testWriterEmptyPortfolio.json");
            stockPortfolio = reader.read();
            assertEquals("Sample Stock Portfolio", stockPortfolio.getStockPortfolioName());
            assertEquals(5000, stockPortfolio.getStockPortfolioBalance());
            assertEquals(0, stockPortfolio.getNumStocksInPortfolio());
            assertEquals(11, stockPortfolio.getStockPool().size());
            assertEquals(0, stockPortfolio.getPnLHistory().size());
        } catch (IOException e) {
            fail("Exception should not have been thrown");
        }
    }

    @Test
    void testWriterGeneralPortfolio() {
        try {
            StockPortfolio stockPortfolio = new StockPortfolio("sample portfolio");
            Stock sampleStock = createSampleStock();

            stockPortfolio.addStock(sampleStock);

            JsonWriter writer = new JsonWriter("./data/testWriterGeneralPortfolio.json");
            writer.open();
            writer.write(stockPortfolio);
            writer.close();

            JsonReader reader = new JsonReader("./data/testWriterGeneralPortfolio.json");
            stockPortfolio = reader.read();
            assertEquals("sample portfolio", stockPortfolio.getStockPortfolioName());
            List<Stock> stocks = stockPortfolio.getStockPortfolio();
            assertEquals(1, stocks.size());
            assertEquals(12, stockPortfolio.getStockPool().size());
            ArrayList<Double> prices = new ArrayList<>();
            prices.add(111.0);
            prices.add(222.0);
            checkStock("sample name", "abcde", "sample sector", 111.0,
                    222.0, 10, 144.0, 233.0, 123.0, 321.0,
                    0.666, prices, stockPortfolio.getStockPortfolio().get(0));

        } catch (IOException e) {
            fail("Exception should not have been thrown");
        }
    }

    @Test
    void testWriterGeneralPortfolioProgressDay() {
        try {
            StockPortfolio stockPortfolio = new StockPortfolio("sample portfolio");
            Stock sampleStock = createSampleStock();

            stockPortfolio.addStock(sampleStock);
            stockPortfolio.progressDay();
            stockPortfolio.progressDay();
            stockPortfolio.progressDay();

            JsonWriter writer = new JsonWriter("./data/testWriterGeneralPortfolioProgDay.json");
            writer.open();
            writer.write(stockPortfolio);
            writer.close();

            JsonReader reader = new JsonReader("./data/testWriterGeneralPortfolioProgDay.json");
            stockPortfolio = reader.read();
            assertEquals("sample portfolio", stockPortfolio.getStockPortfolioName());
            List<Stock> stocks = stockPortfolio.getStockPortfolio();
            assertEquals(1, stocks.size());
            assertEquals(12, stockPortfolio.getStockPool().size());
            assertEquals(3, stockPortfolio.getPnLHistory().size());
        } catch (IOException e) {
            fail("Exception should not have been thrown");
        }
    }

    public Stock createSampleStock() {
        Stock sampleStock = new Stock("Stock 1", "S1", "Tech");

        sampleStock.setStockName("sample name");
        sampleStock.setStockSector("sample sector");
        sampleStock.setStockCode("abcde");
        sampleStock.setOriginalPrice(111.0);
        sampleStock.setCurrentPrice(222.0);
        sampleStock.setSharesOwned(10);
        sampleStock.setBuyPrice(144.0);
        sampleStock.setSellPrice(233.0);
        sampleStock.setStockRealizedProfit(123.0);
        sampleStock.setStockPotentialProfit(321.0);
        sampleStock.setStockDailyVariation(0.666);
        ArrayList<Double> prices = new ArrayList<>();
        prices.add(111.0);
        prices.add(222.0);
        sampleStock.setPriceHistory(prices);
        return sampleStock;
    }

    public StockPortfolio createSamplePortfolio() {
        StockPortfolio sampleStockPortfolio = new StockPortfolio("sample portfolio");

        sampleStockPortfolio.setStockPortfolioName("sample name");
        sampleStockPortfolio.setStockPortfolioBalance(4321.0);
        sampleStockPortfolio.setTradingDay(15);
        sampleStockPortfolio.setMarketState("sample state");
        sampleStockPortfolio.setTotalPNL(5555.0);

        return sampleStockPortfolio;
    }
}
