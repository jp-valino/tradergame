package persistence;

import model.Stock;
import model.StockPortfolio;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

public class JsonReaderTest extends JsonTest {


    @Test
    void testReaderNonExistentFile() {
        JsonReader reader = new JsonReader("./data/noSuchFile.json");
        try {
            StockPortfolio stockPortfolio = reader.read();
            fail("IOException expected");
        } catch (IOException e) {
            // pass
        }
    }

    @Test
    void testReaderEmptyPortfolio() {
        JsonReader reader = new JsonReader("./data/testWriterEmptyPortfolio.json");
        try {
            StockPortfolio stockPortfolio = reader.read();
            assertEquals("Sample Stock Portfolio", stockPortfolio.getStockPortfolioName());
            assertEquals(5000, stockPortfolio.getStockPortfolioBalance());
            assertEquals(0, stockPortfolio.getNumStocksInPortfolio());
            assertEquals(11, stockPortfolio.getStockPool().size());
            assertEquals(0, stockPortfolio.getPnLHistory().size());
        } catch (IOException e) {
            fail("Couldn't read from file");
        }
    }

    @Test
    void testReaderGeneralPortfolio() {
        JsonReader reader = new JsonReader("./data/testWriterGeneralPortfolio.json");
        try {
            StockPortfolio stockPortfolio = reader.read();
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
            fail("Couldn't read from file");
        }
    }

    @Test
    void testReaderGeneralPortfolioProgressDay() {
        JsonReader reader = new JsonReader("./data/testWriterGeneralPortfolio.json");
        try {
            StockPortfolio stockPortfolio = reader.read();
            stockPortfolio.progressDay();
            assertEquals("sample portfolio", stockPortfolio.getStockPortfolioName());
            List<Stock> stocks = stockPortfolio.getStockPortfolio();
            assertEquals(1, stocks.size());
            assertEquals(12, stockPortfolio.getStockPool().size());
            assertEquals(1, stockPortfolio.getPnLHistory().size());
            stockPortfolio.progressDay();
            assertEquals(2, stockPortfolio.getPnLHistory().size());
        } catch (IOException e) {
            fail("Couldn't read from file");
        }
    }
}
