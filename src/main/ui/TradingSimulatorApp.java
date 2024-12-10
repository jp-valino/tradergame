package ui;

import model.Event;
import model.EventLog;
import model.Stock;
import model.StockPortfolio;
import persistence.JsonReader;
import persistence.JsonWriter;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;
import java.text.DecimalFormat;

/*
Represents a Trading Simulator Application. An application of this kind has some key fields like:
 - Stock Portfolio
 - inputs - user-fed, determines events in console UI
 */
public class TradingSimulatorApp {
    // Describes the main application, mainly concerned with the interactive part of the program.
    // User's point of access.
    
    private StockPortfolio stockPortfolio;
    private Scanner input;
    String nameInput;
    double valueInput;
    private static final String JSON_PATH = "./data/stock_portfolio.json";
    private JsonWriter jsonWriter;
    private JsonReader jsonReader;

    DecimalFormat df = new DecimalFormat("0.00");

    // EFFECTS: constructs new Trading Simulator Application
    public TradingSimulatorApp() {
        runTradingSimApp();
    }

    // EFFECTS: runs the program while keepGoing is true, determined by user inputs.
    private void runTradingSimApp() {
        boolean keepGoing = true;
        int command = 0;
        
        initialConstructs();
        
        while (keepGoing) {
            displayOptions();
            command = Integer.parseInt(input.next());
            
            if (command == 6) {
                keepGoing = false;
            } else {
                processCommand(command);
            }
        }
        System.out.println("Good trading with you! See you next time.");
        printLoggedEvents(EventLog.getInstance());
    }

    // EFFECTS: constructs initial objects needed to run program, namely, a portfolio and inputs.
    private void initialConstructs() {
        stockPortfolio = new StockPortfolio("Default Stock Portfolio");
        input = new Scanner(System.in).useDelimiter("\n");
        jsonReader = new JsonReader(JSON_PATH);
        jsonWriter = new JsonWriter(JSON_PATH);
    }

    // EFFECTS: displays main menu to the user, with key events that can be performed.
    private void displayOptions() {
        System.out.println("\n|-------------------------$ Trading Simulator $-------------------------|");
        System.out.println("\n This is Trading Simulator, your first contact with finance and trading. \n"
                + " Explore the world of stock trading free of risks and worries!");
        System.out.println("\n|-------------------------$ Please select an option $-------------------------| \n");
        System.out.println("\t0 + View my Stock Portfolio");
        System.out.println("\t1 + Manage my Stock Portfolio");
        System.out.println("\t2 + Save Stock Portfolio");
        System.out.println("\t3 + Load Stock Portfolio");
        System.out.println("\t4 + Progress to Next Day");
        System.out.println("\t");
        System.out.println("\t5 + Reset Simulation");
        System.out.println("\t6 + Exit");
    }

    // EFFECTS: according to selected input, executes a functionality of the app
    private void processCommand(int command) {
        switch (command) {
            case 0: // View Portfolio
                displayPortfolio();
                break;
            case 1: // Enter portfolio manager
                displayManagerOptions();
                break;
            case 2: // Create new Stock
                saveStockPortfolio();
                break;
            case 3:
                loadStockPortfolio();
                break;
            case 4:
                goToNextDay();
                break;
            case 5:
                resetTradingSimulator();
                break;
            default:
                System.out.println("Unknown command, try again.");
        }
    }

    // EFFECTS: saves Stock Portfolio to JSON file
    private void saveStockPortfolio() {
        try {
            jsonWriter.open();
            jsonWriter.write(stockPortfolio);
            jsonWriter.close();
            System.out.println("Saved Stock Portfolio to: " + JSON_PATH);
        } catch (FileNotFoundException e) {
            System.out.println("Unable to save Stock Portfolio to: " + JSON_PATH);
        }
    }

    // MODIFIES: this
    // EFFECTS: loads Stock Portfolio from JSON file
    private void loadStockPortfolio() {
        try {
            this.stockPortfolio = jsonReader.read();
            System.out.println("Loaded saved Stock Portfolio from: " + JSON_PATH);
        } catch (IOException e) {
            System.out.println("Unable to load Stock Portfolio from: " + JSON_PATH);
        }
    }

    // EFFECTS: resets Trading App
    private void resetTradingSimulator() {
        System.out.println("See you soon!");
        new TradingSimulatorApp();
    }

    // EFFECTS: progresses into next day
    private void goToNextDay() {
        System.out.println("Finished already? Okay, let's move on.");
        this.stockPortfolio.progressDay();
    }

    // EFFECTS: based on user input, creates new stock and adds it to portfolio and pool
    private void createVentureBusiness() {
        String newStockName;
        String newStockCode;
        String newStockSector;
        System.out.println("Let's do this! Time to create a business.");
        System.out.println("\t");
        System.out.println("Please inform your new company's name:");
        newStockName = input.next();

        System.out.println("Please inform your new company's code:");
        newStockCode = input.next();

        System.out.println("Please inform your new company's sector");
        newStockSector = input.next();

        System.out.println("\t");
        if (stockPortfolio.createNewStock(newStockName, newStockCode, newStockSector)) {
            System.out.println("Success! Company created.");
        } else {
            System.out.println("Maybe next time! Try to get your money up :|");
        }
    }

    // EFFECTS: displays events related to portfolio management and processes the selected input accordingly
    private void displayManagerOptions() {
        System.out.println("\n|-------------------------$ Stock Management $-------------------------| \n");
        System.out.println("Welcome to your stock management system. Here you can buy, sell and much more!");
        System.out.println("\t");
        System.out.println("\t0 + Buy a Stock");
        System.out.println("\t1 + Sell a Stock");
        System.out.println("\t2 + Sell all Stocks");
        System.out.println("\t3 + See all available stocks");
        System.out.println("\t4 + Create new venture business");
        System.out.println("\t5 + Request a loan");
        processManagerOptions();
    }


    private void processManagerOptions() {
        int command;
        command = Integer.parseInt(input.next());
        switch (command) {
            case 0:
                buyStockManager();
                break;
            case 1:
                sellStockManager();
                break;
            case 2:
                sellAllStockManager();
                break;
            case 3:
                displayStockPool();
                break;
            case 4:
                createVentureBusiness();
                break;
            case 5:
                requestLoan();
                break;
        }
    }

    // EFFECTS: requests a loan
    private void requestLoan() {
        if (this.stockPortfolio.requestLoanReturnVal()) {
            System.out.println("Loan conceded! Enjoy your new $2,000.00");
        } else {
            System.out.println("Not this time... Try again later.");
        }
    }

    // EFFECTS: displays all stocks in pool and their key information
    private void displayStockPool() {
        System.out.println("These are all the currently available stocks: ");
        System.out.println("\t");
        for (Stock s : stockPortfolio.getStockPool()) {
            System.out.println("Stock: " + s. getStockName() + " | "
                    + "Code: " + s.getStockCode() + " | "
                    + "Price: $" + df.format(s.getCurrentPrice()) + " | "
                    + "Change (%): " + df.format(s.getStockDailyVariation() * 100) + "%" + "|");
        }
    }

    // EFFECTS: sells all stock in portfolio
    private void sellAllStockManager() {
        System.out.println("Selling all your stock in 3.. 2.. 1... Now!");
        this.stockPortfolio.sellAllStock();
    }

    // EFFECTS: based on supplied code, sells a stock
    private void sellStockManager() {
        String sellStockCode;
        System.out.println("Okay, which stock would you like to sell? Please inform the stock code:");
        sellStockCode = input.next();
        System.out.println("\t");
        if (this.stockPortfolio.sellStock(sellStockCode)) {
            System.out.println("Successful! Stock sold.");
        } else if (!this.stockPortfolio.sellStock(sellStockCode)) {
            System.out.println("Couldn't complete the transaction, please try again.");
        }
        System.out.println("\t");

    }

    // EFFECTS: based on supplied code and share number, buys a stock
    private void buyStockManager() {
        String buyStockCode;
        String buyStockShares;

        System.out.println("Okay, which stock would you like to buy? Please inform the stock code:");
        buyStockCode = input.next();
        System.out.println("How many shares would you like to buy?:");
        buyStockShares = input.next();
        int sharesToBuy = Integer.parseInt(buyStockShares);

        System.out.println("\t");
        System.out.println("You wish to buy " + sharesToBuy + " shares of " + buyStockCode + " for a total of $"
                + (df.format(stockPortfolio.getPriceFromCode(buyStockCode) * sharesToBuy)));
        System.out.println("\t");
        if ((stockPortfolio.getPriceFromCode(buyStockCode) * sharesToBuy)
                > this.stockPortfolio.getStockPortfolioBalance()) {
            System.out.println("This value exceeds your current balance");
        } else {
            if (this.stockPortfolio.buyStock(buyStockCode, sharesToBuy)) {
                System.out.println("Successful! Stock bought.");
            } else if (!this.stockPortfolio.buyStock(buyStockCode, sharesToBuy)) {
                System.out.println("Couldn't complete the transaction, please try again.");
            }
        }
        System.out.println("\t");
    }

    // EFFECTS: displays key information about current portfolio
    private void displayPortfolio() {
        System.out.println(
                "\n|-------------------------$ "
                + stockPortfolio.getStockPortfolioName()
                + " $-------------------------| \n");
        System.out.println("Trading day: " + stockPortfolio.getTradingDay());
        System.out.println("\t");
        for (Stock s : stockPortfolio.getStockPortfolio()) {
            System.out.println(s.getStockName() + ":");
            System.out.println("\t Stock code: " + s.getStockCode());
            System.out.println("\t Stock sector: " + s.getStockSector());
            System.out.println("\t Stock's current price: $" + df.format(s.getCurrentPrice()));
            System.out.println("\t Stock bought at: $" + df.format(s.getBuyPrice()));
            System.out.println("\t Number of shares owned: " + s.getSharesOwned());
            System.out.println("\t Current profit / loss on this stock: $" +  df.format(s.getStockPotentialProfit()));
            System.out.println("\t Stock's daily change: " + df.format((s.getStockDailyVariation() * 100)) + "%");
            System.out.println("\t");
        }
        System.out.println("Total balance: $" + df.format(stockPortfolio.getStockPortfolioBalance()));
        stockPortfolio.calculateTotalPNL();
        System.out.println("Total forecasted profit / loss on all stocks: $" + df.format(stockPortfolio.getTotalPNL()));
    }

    // EFFECTS: prints all events currently logged to console
    private void printLoggedEvents(EventLog events) {
        System.out.println("Log:");
        for (Event e : events) {
            System.out.println(e.toString() + "\n");
        }
        System.out.println("End of Log");
    }

}
