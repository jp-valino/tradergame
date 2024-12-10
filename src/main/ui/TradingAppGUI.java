package ui;

import model.*;
import model.Event;
import persistence.JsonReader;
import persistence.JsonWriter;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Scanner;


/*
Represents a Trading Application GUI. Visually represents the application built thus far.
Has separate frames for:
 - Stock Portfolio Viewer
 - Portfolio Manager Viewer
 - All Stocks Viewer
 - Support buttons (save, load, reset and exit)
 */
public class TradingAppGUI extends JFrame implements ActionListener  {

    // FIELDS:
    // Unchanged from TradingSimulatorApp class:
    private StockPortfolio stockPortfolio;
    private Scanner input;
    String nameInput;
    double valueInput;
    private static final String JSON_PATH = "./data/stock_portfolio.json";
    private JsonWriter jsonWriter;
    private JsonReader jsonReader;

    DecimalFormat df = new DecimalFormat("0.00");

    // Components of the main screen:

    JPanel mainPanel;
    JPanel mainContents;
    HeaderGUI headerBar = new HeaderGUI();
    ViewPortfolioGUI viewPortfolioGUI;
    ViewPoolGUI viewPoolGUI;
    StockManagerGUI stockManagerGUI;


    // Starting screen:
    JButton viewPortfolioButton;
    JButton managePortfolioButton;
    JButton viewAllStockPortfolioButton;
    JButton progressDayButton;
    JButton loadStockPortfolioButton;
    JButton saveStockPortfolioButton;
    JButton resetStockPortfolioButton;
    JButton exitButton;

    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);

    //EFFECTS : main methods
    public static void main(String[] args) {
        new TradingAppGUI();
    }

    // Constructor
    public TradingAppGUI() {
        stockPortfolio = new StockPortfolio("My Stock Portfolio");
        jsonWriter = new JsonWriter(JSON_PATH);
        jsonReader = new JsonReader(JSON_PATH);

        initButtons();

        JPanel header = createHeader();
        JPanel mainContents = createMainContents();

        this.setBackground(bgColor2);
        this.setLayout(null);
        this.setSize(750,900);
        this.setDefaultCloseOperation(DO_NOTHING_ON_CLOSE);
        this.setVisible(true);
        this.add(header);
        this.add(mainContents);
    }

    // EFFECTS: adds all contents to the main panel
    private JPanel createMainContents() {
        mainContents = new JPanel();
        mainContents.setBackground(bgColor2);
        mainContents.setBounds(0,75,750,980);
        mainContents.setLayout(new BoxLayout(mainContents,BoxLayout.Y_AXIS));
        mainContents.setVisible(true);


        recenterButtons();
        addAllContents();

        return mainContents;
    }

    // EFFECTS: adds all main components to the frame
    private void addAllContents() {
        Dimension space = new Dimension(10, 10);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(viewPortfolioButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(managePortfolioButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(progressDayButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(viewAllStockPortfolioButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(saveStockPortfolioButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(loadStockPortfolioButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(resetStockPortfolioButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(exitButton);
    }

    // EFFECTS: recenters all buttons and contents to the center of the X-axis
    private void recenterButtons() {
        viewPortfolioButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        managePortfolioButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        progressDayButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        viewAllStockPortfolioButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        saveStockPortfolioButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        loadStockPortfolioButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        resetStockPortfolioButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        exitButton.setAlignmentX(Component.CENTER_ALIGNMENT);
    }


    // EFFECTS: creates a new panel for the header GUI
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    // EFFECTS: initializes all buttons and contents for the frame
    private void initButtons() {
        viewPortfolioButton = new FancyButtonGUI("View My Portfolio");
        viewPortfolioButton.setMinimumSize(new Dimension(250,50));
        viewPortfolioButton.setMaximumSize(new Dimension(250,50));
        viewPortfolioButton.addActionListener(this);

        managePortfolioButton = new FancyButtonGUI("Manage Stock Portfolio");
        managePortfolioButton.setMinimumSize(new Dimension(250,50));
        managePortfolioButton.setMaximumSize(new Dimension(250,50));
        managePortfolioButton.addActionListener(this);

        progressDayButton = new FancyButtonGUI("Progress to Next Day");
        progressDayButton.setMinimumSize(new Dimension(250,50));
        progressDayButton.setMaximumSize(new Dimension(250,50));
        progressDayButton.addActionListener(this);

        addButtonsPartTwo();
    }

    // EFFECTS: creates the second batch of buttons to be used in the method initButtons();
    private void addButtonsPartTwo() {
        viewAllStockPortfolioButton = new FancyButtonGUI("View All Stocks");
        viewAllStockPortfolioButton.setMinimumSize(new Dimension(250,50));
        viewAllStockPortfolioButton.setMaximumSize(new Dimension(250,50));
        viewAllStockPortfolioButton.addActionListener(this);

        saveStockPortfolioButton = new FancyButtonGUI("Save Stock Portfolio");
        saveStockPortfolioButton.setMinimumSize(new Dimension(250,50));
        saveStockPortfolioButton.setMaximumSize(new Dimension(250,50));
        saveStockPortfolioButton.addActionListener(this);

        loadStockPortfolioButton = new FancyButtonGUI("Load Stock Portfolio");
        loadStockPortfolioButton.setMinimumSize(new Dimension(250,50));
        loadStockPortfolioButton.setMaximumSize(new Dimension(250,50));
        loadStockPortfolioButton.addActionListener(this);

        resetStockPortfolioButton = new FancyButtonGUI("Reset Simulation");
        resetStockPortfolioButton.setMinimumSize(new Dimension(250,50));
        resetStockPortfolioButton.setMaximumSize(new Dimension(250,50));
        resetStockPortfolioButton.addActionListener(this);

        exitButton = new FancyButtonGUI("Exit");
        exitButton.setMinimumSize(new Dimension(125,50));
        exitButton.setMaximumSize(new Dimension(125,50));
        exitButton.addActionListener(this);
    }


    // EFFECTS: handles button presses at the main screen of the GUI
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == viewPortfolioButton) {
            viewPortfolioGUI = new ViewPortfolioGUI(stockPortfolio);
        } else if (e.getSource() == managePortfolioButton) {
            stockManagerGUI = new StockManagerGUI(stockPortfolio);
        } else if (e.getSource() == viewAllStockPortfolioButton) {
            viewPoolGUI = new ViewPoolGUI(stockPortfolio);
        } else if (e.getSource() == progressDayButton) {
            progressNextDayGUI();
        } else if (e.getSource() == saveStockPortfolioButton) {
            saveStockPortfolioGUI();
        } else if (e.getSource() == loadStockPortfolioButton) {
            loadStockPortfolioGUI();
        } else if (e.getSource() == resetStockPortfolioButton) {
            resetStockPortfolioGUI();
        } else if (e.getSource() == exitButton) {
            exitStockPortfolioGUI();
        }
    }

    // EFFECTS: exits the application
    private void exitStockPortfolioGUI() {
        JOptionPane.showMessageDialog(null,
                "Thank you for using Trading Simulator! See you soon.",
                "Goodbye!", JOptionPane.PLAIN_MESSAGE);
        printLoggedEvents(EventLog.getInstance());
        System.exit(0);
    }

    // EFFECTS: progresses to the next day, updates all fiels of the stock portfolio
    private void progressNextDayGUI() {
        this.stockPortfolio.progressDay();
        JOptionPane.showMessageDialog(null,
                "Progressed to next day. Current day: " + stockPortfolio.getTradingDay(),
                "Progress a Day!", JOptionPane.PLAIN_MESSAGE);
    }

    // EFFECTS; resets the stock portfolio
    private void resetStockPortfolioGUI() {
        JOptionPane.showMessageDialog(null,
                "Resetting the simulation, beep beep boop boop!",
                "Reset under way!", JOptionPane.PLAIN_MESSAGE);
        stockPortfolio = new StockPortfolio("New Stock Portfolio");
    }

    // EFFECTS: loads the current save file
    private void loadStockPortfolioGUI() {
        try {
            stockPortfolio = jsonReader.read();
            JOptionPane.showMessageDialog(null,
                    "Loaded previously saved stock portfolio from: " + JSON_PATH,
                    "Stock Portfolio Loaded", JOptionPane.INFORMATION_MESSAGE);
        } catch (IOException e) {
            JOptionPane.showMessageDialog(null,
                    "Unable to load stock portfolio from: " + JSON_PATH,
                    "Failed to Load Stock Portfolio", JOptionPane.ERROR_MESSAGE);
        }
    }

    // EFFECTS: saves current stock portfolio
    private void saveStockPortfolioGUI() {
        try {
            jsonWriter.open();
            jsonWriter.write(stockPortfolio);
            jsonWriter.close();
            JOptionPane.showMessageDialog(null,
                    "Saved the stock portfolio to: " + JSON_PATH + " :D",
                    "Stock Portfolio Saved", JOptionPane.INFORMATION_MESSAGE);
        } catch (FileNotFoundException e) {
            JOptionPane.showMessageDialog(null,
                    "Unable to save stock portfolio to: " + JSON_PATH,
                    "Failed to Save", JOptionPane.ERROR_MESSAGE);
        }
    }

    // EFFECTS: prints all events currently logged to console
    private void printLoggedEvents(EventLog events) {
        System.out.println("Log:" + "\n");
        for (Event e : events) {
            System.out.println(e.toString());
        }
        System.out.println("\n" + "End of Log.");
    }

}
