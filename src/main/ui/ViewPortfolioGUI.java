package ui;

import model.Stock;
import model.StockPortfolio;

import javax.swing.*;
import java.awt.*;
import java.text.DecimalFormat;
import java.util.Scanner;


/*
Represents the visualization for the stock portfolio, shows:
- General information: balance, trading day, total PNL
- PNL graph: graph for profits and losses
- Stock's individual information: displays information about each stock in the portfolio
 */
public class ViewPortfolioGUI extends JFrame {
    private StockPortfolio stockPortfolio;
    private Scanner input;
    String nameInput;
    double valueInput;
    DecimalFormat df = new DecimalFormat("0.00");

    // GUI
    HeaderGUI headerBar = new HeaderGUI();

    // Colors
    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);
    Color textColor = new Color(185, 185, 185, 199);

    // Labels:
    JLabel currentBalanceLabel;
    JPanel portfolioPanel;
    JLabel tradingDayLabel;
    JLabel totalBalanceLabel;
    JLabel totalPnLLabel;
    JLabel pnlGraphDesc;


    // Constructor
    public ViewPortfolioGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;
        JPanel header = createHeader();
        JPanel mainInfo = createTopComponent();
        JPanel mainContents = createGraphComponent();
        JScrollPane stockPortfolioInfo = createPortfolioComponent();
        mainContents.setBackground(bgColor2);
        stockPortfolioInfo.setBackground(bgColor2);
        this.getContentPane().setBackground(bgColor2);
        this.setBackground(bgColor2);
        this.setLayout(new BorderLayout());
        this.setSize(750,900);
        this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);

        // Create a new panel to hold mainInfo and mainContents
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(mainInfo, BorderLayout.NORTH);
        topPanel.add(mainContents, BorderLayout.CENTER);

        this.add(header, BorderLayout.NORTH);
        this.add(topPanel, BorderLayout.CENTER);
        this.add(stockPortfolioInfo, BorderLayout.SOUTH);

        this.setVisible(true);
    }

    // EFFECTS; creates header panel
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    // EFFECTS: cretaes the graph panel basing off of PnLGraphGUI
    private JPanel createGraphComponent() {
        PnLGraphGUI graphUi = new PnLGraphGUI(stockPortfolio);
        graphUi.setBackground(bgColor2);
        JPanel graphPanel = new JPanel();
        graphPanel.setBackground(bgColor2);
        graphPanel.setBounds(0, 75, 750, 700);
        graphPanel.setLayout(new BoxLayout(graphPanel, BoxLayout.Y_AXIS));
        graphPanel.add(graphUi);
        graphPanel.setMinimumSize(new Dimension(750, 400));
        graphPanel.setMaximumSize(new Dimension(750, 400));
        return graphPanel;
    }

    // EFFECTS: creates the portfolio component, shows information about each of the stocks
    private JScrollPane createPortfolioComponent() {
        portfolioPanel = new JPanel();
        portfolioPanel.setLayout(new BoxLayout(portfolioPanel, BoxLayout.Y_AXIS));
        portfolioPanel.add(Box.createVerticalStrut(10));  // Add some spacing
        portfolioPanel.setBackground(bgColor2);

        createAllLabels();

        // Set the font color for labels inside portfolioPanel
        for (Component component : portfolioPanel.getComponents()) {
            if (component instanceof JLabel) {
                ((JLabel) component).setForeground(textColor);
                ((JLabel) component).setFont(new Font("Arial", Font.BOLD, 12));
            }
        }

        JScrollPane scrollPane = new JScrollPane(portfolioPanel);
        scrollPane.setPreferredSize(new Dimension(750, 250)); // Set the preferred size
        scrollPane.setBackground(bgColor2);

        portfolioPanel.setVisible(true);
        return scrollPane;
    }

    // EFFECTS: creates labels to be used in the display of stock information for each stock in the portfolio
    private void createAllLabels() {
        for (Stock s : stockPortfolio.getStockPortfolio()) {
            portfolioPanel.add(new JLabel(s.getStockName() + ":"));
            portfolioPanel.add(new JLabel("\t Stock code: " + s.getStockCode()));
            portfolioPanel.add(new JLabel("\t Stock sector: " + s.getStockSector()));
            portfolioPanel.add(new JLabel("\t Stock's current price: $" + df.format(s.getCurrentPrice())));
            portfolioPanel.add(new JLabel("\t Stock bought at: $" + df.format(s.getBuyPrice())));
            portfolioPanel.add(new JLabel("\t Number of shares owned: " + s.getSharesOwned()));
            portfolioPanel.add(new JLabel("\t Current profit / loss on this stock: $"
                    +  df.format(s.getStockPotentialProfit())));
            portfolioPanel.add(new JLabel("\t Stock's daily change: "
                    + df.format((s.getStockDailyVariation() * 100)) + "%"));
            portfolioPanel.add(Box.createVerticalStrut(10));
        }
    }

    // EFFECTS: creates top panel with general information about the portfolio
    private JPanel createTopComponent() {
        JPanel topComponent = new JPanel();
        topComponent.setLayout(new BoxLayout(topComponent, BoxLayout.Y_AXIS));
        topComponent.add(Box.createVerticalStrut(15));  // Add some spacing
        topComponent.setBackground(bgColor2);
        topComponent.setMinimumSize(new Dimension(750,250));
        topComponent.setMaximumSize(new Dimension(750,250));

        createLabelsTopComponent();

        topComponent.add(tradingDayLabel);
        topComponent.add(totalBalanceLabel);
        topComponent.add(totalPnLLabel);
        Dimension space = new Dimension(10, 10);
        topComponent.add(Box.createRigidArea(space));
        topComponent.add(Box.createRigidArea(space));
        topComponent.add(pnlGraphDesc);
        topComponent.setVisible(true);
        return topComponent;
    }

    // EFFECTS: creates labels to be used in the top component
    private void createLabelsTopComponent() {
        tradingDayLabel = new JLabel("Trading day: "
                + stockPortfolio.getTradingDay());
        tradingDayLabel.setFont(new Font("Arial", Font.BOLD, 13));
        tradingDayLabel.setForeground(textColor);

        totalBalanceLabel = new JLabel("Total balance: $"
                + df.format(stockPortfolio.getStockPortfolioBalance()));
        stockPortfolio.calculateTotalPNL();
        totalBalanceLabel.setForeground(textColor);
        totalBalanceLabel.setFont(new Font("Arial", Font.BOLD, 13));

        totalPnLLabel = new JLabel("Total forecasted profit / loss on all stocks: $"
                + df.format(stockPortfolio.getTotalPNL()));
        totalPnLLabel.setForeground(textColor);
        totalPnLLabel.setFont(new Font("Arial", Font.BOLD, 13));

        pnlGraphDesc = new JLabel("Profit & Losses Evolution ($) vs. Trading Days");
        pnlGraphDesc.setForeground(textColor);
        pnlGraphDesc.setFont(new Font("Arial", Font.BOLD, 13));
    }

}
