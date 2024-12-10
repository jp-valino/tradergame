package ui;

import model.StockPortfolio;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.DecimalFormat;
import java.util.Scanner;

/*
Represents a Stock Manager GUI, provides access to other frames
- frame for buying new stocks
- frame for selling stocks
- frame for creating a new business
Also allows users to:
- sell all stocks
- ask for a loan
 */
public class StockManagerGUI extends JFrame implements ActionListener {

    // fields:
    private StockPortfolio stockPortfolio;
    private Scanner input;
    String nameInput;
    double valueInput;
    DecimalFormat df = new DecimalFormat("0.00");

    // Children GUIs
    HeaderGUI headerBar = new HeaderGUI();
    BuyStockGUI buyStockGUI;
    SellStockGUI sellStockGUI;
    NewBizGUI newBizGUI;

    // support:
    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);

    // Manager screen:
    JButton buyStockButton;
    JButton sellStockButton;
    JButton sellAllStockButton;
    JButton newBizButton;
    JButton askForLoanButton;

    // Constructor
    public StockManagerGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;

        initButtons();

        JPanel header = createHeader();
        JPanel mainContents = createMainContents();
        this.setBackground(bgColor2);
        this.setLayout(null);
        this.setSize(750,900);
        this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        this.setVisible(true);
        this.add(header);
        this.add(mainContents);
    }

    // EFFECTS: adds all contents to main panel
    private JPanel createMainContents() {
        JPanel mainContents = new JPanel();
        mainContents.setBackground(bgColor2);
        mainContents.setBounds(0,75,750,980);
        mainContents.setLayout(new BoxLayout(mainContents, BoxLayout.Y_AXIS));
        mainContents.setVisible(true);

        recenterButtons();
        Dimension space = new Dimension(10, 10);

        mainContents.add(Box.createRigidArea(space));
        mainContents.add(buyStockButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(sellStockButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(sellAllStockButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(newBizButton);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(askForLoanButton);
        mainContents.add(Box.createRigidArea(space));

        return mainContents;
    }

    // EFFECTS: creates a header GUI
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    // EFFECTS: handles button presses
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == buyStockButton) {
            buyStockGUI = new BuyStockGUI(stockPortfolio);
        } else if (e.getSource() == sellStockButton) {
            sellStockGUI = new SellStockGUI(stockPortfolio);
        } else if (e.getSource() == sellAllStockButton) {
            sellAllStockGUI();
        } else if (e.getSource() == askForLoanButton) {
            askForLoanGUI();
        } else if (e.getSource() == newBizButton) {
            newBizGUI = new NewBizGUI(stockPortfolio);
        }
    }

    // MODIFIES: this, stockPortfolio
    // EFFECTS: asks for a loan given that the button press was to ask for a loan
    private void askForLoanGUI() {
        if (this.stockPortfolio.requestLoanReturnVal()) {
            JOptionPane.showMessageDialog(null,
                    "Loan accepted, your balance is now: $"
                            + this.stockPortfolio.getStockPortfolioBalance(),
                    "Loan Accepted", JOptionPane.PLAIN_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null,
                    "Loan not accepted, your balance is still: $"
                            + this.stockPortfolio.getStockPortfolioBalance(),
                    "Not today", JOptionPane.PLAIN_MESSAGE);
        }
    }

    // MODIFIES: this, stockPortfolio
    // EFFECTS: sells all stocks
    private void sellAllStockGUI() {
        if (this.stockPortfolio.sellAllStock()) {
            JOptionPane.showMessageDialog(null,
                    "All stock has been sold, your new balance is: $"
                            + df.format(this.stockPortfolio.getStockPortfolioBalance()),
                    "Success: all stocks sold", JOptionPane.PLAIN_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null,
                    "No stocks to sell! Go buy some right now.",
                    "Failure: couldn't sell stocks", JOptionPane.PLAIN_MESSAGE);
        }
    }

    // EFFECTS: recenters all contents at the center of the X-axis
    private void recenterButtons() {
        buyStockButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        sellStockButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        newBizButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        sellAllStockButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        askForLoanButton.setAlignmentX(Component.CENTER_ALIGNMENT);
    }

    // EFFECTS: initializes all buttons and contents and buttons
    private void initButtons() {
        buyStockButton = new FancyButtonGUI("Buy a Stock");
        buyStockButton.setMinimumSize(new Dimension(250, 50));
        buyStockButton.setMaximumSize(new Dimension(250, 50));
        buyStockButton.addActionListener(this);

        sellStockButton = new FancyButtonGUI("Sell a Stock");
        sellStockButton.setMinimumSize(new Dimension(250,50));
        sellStockButton.setMaximumSize(new Dimension(250,50));
        sellStockButton.addActionListener(this);

        sellAllStockButton = new FancyButtonGUI("Sell All Stocks");
        sellAllStockButton.setMinimumSize(new Dimension(250,50));
        sellAllStockButton.setMaximumSize(new Dimension(250,50));
        sellAllStockButton.addActionListener(this);

        newBizButton = new FancyButtonGUI("Create a Venture Business");
        newBizButton.setMinimumSize(new Dimension(250,50));
        newBizButton.setMaximumSize(new Dimension(250,50));
        newBizButton.addActionListener(this);

        askForLoanButton = new FancyButtonGUI("Ask For a Loan");
        askForLoanButton.setMinimumSize(new Dimension(250,50));
        askForLoanButton.setMaximumSize(new Dimension(250,50));
        askForLoanButton.addActionListener(this);
    }
}
