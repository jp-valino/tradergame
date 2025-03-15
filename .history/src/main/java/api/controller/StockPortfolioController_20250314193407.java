package api.controller;

import api.dto.StockDTO;
import api.dto.StockPortfolioDTO;
import api.dto.StockTransactionDTO;
import model.Stock;
import model.StockPortfolio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolio")
public class StockPortfolioController {

    private final StockPortfolio stockPortfolio;

    @Autowired
    public StockPortfolioController(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;
    }

    @GetMapping
    public ResponseEntity<StockPortfolioDTO> getPortfolio() {
        return ResponseEntity.ok(convertToDTO(stockPortfolio));
    }

    @GetMapping("/stocks")
    public ResponseEntity<List<StockDTO>> getStocks() {
        List<StockDTO> stockDTOs = stockPortfolio.getStocks().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(stockDTOs);
    }

    @GetMapping("/pool")
    public ResponseEntity<List<StockDTO>> getStockPool() {
        List<StockDTO> stockDTOs = stockPortfolio.getStockPool().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(stockDTOs);
    }

    @PostMapping("/buy")
    public ResponseEntity<StockDTO> buyStock(@RequestBody StockTransactionDTO transaction) {
        Stock stock = stockPortfolio.buyStock(transaction.getSymbol(), transaction.getQuantity());
        if (stock != null) {
            return ResponseEntity.ok(convertToDTO(stock));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<StockDTO> sellStock(@RequestBody StockTransactionDTO transaction) {
        Stock stock = stockPortfolio.sellStock(transaction.getSymbol(), transaction.getQuantity());
        if (stock != null) {
            return ResponseEntity.ok(convertToDTO(stock));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/progress-day")
    public ResponseEntity<StockPortfolioDTO> progressDay() {
        stockPortfolio.progressDay();
        return ResponseEntity.ok(convertToDTO(stockPortfolio));
    }

    @PostMapping("/reset")
    public ResponseEntity<StockPortfolioDTO> resetPortfolio() {
        // Create a new portfolio with the same name
        String name = stockPortfolio.getName();
        // We can't directly reset the portfolio since it's a bean, so we'll clear it
        stockPortfolio.getStocks().clear();
        stockPortfolio.getStockPool().clear();
        stockPortfolio.resetCash();
        stockPortfolio.resetTradingDay();
        
        return ResponseEntity.ok(convertToDTO(stockPortfolio));
    }

    private StockDTO convertToDTO(Stock stock) {
        return new StockDTO(
                stock.getSymbol(),
                stock.getName(),
                stock.getCurrentPrice(),
                stock.getPriceChange(),
                stock.getQuantity(),
                new ArrayList<>(stock.getPriceHistory())
        );
    }

    private StockPortfolioDTO convertToDTO(StockPortfolio portfolio) {
        List<StockDTO> stockDTOs = portfolio.getStocks().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        List<StockDTO> poolDTOs = portfolio.getStockPool().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new StockPortfolioDTO(
                portfolio.getName(),
                portfolio.getTradingDay(),
                portfolio.getCash(),
                portfolio.getPortfolioValue(),
                stockDTOs,
                poolDTOs,
                new ArrayList<>(portfolio.getPnlHistory())
        );
    }
} 