package ui;

import model.StockPortfolio;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;
import java.text.DecimalFormat;


/*
Represents a Stock Selling GUI, has:
- Dropdown with current stock portfolio's stocks that is used in order to select which stock to sell
- Submit button, used to conclude stock's sale
 */
public class SellStockGUI extends JFrame implements ActionListener {

    // Support variables:
    final StockPortfolio stockPortfolio;
    DecimalFormat df = new DecimalFormat("0.00");

    // Components:
    JComboBox possibleSellStocks;
    JButton confirmSellStockButton;
    HeaderGUI headerBar = new HeaderGUI();

    // labels:
    JLabel sellLabel;

    // Support Colors:
    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);

    // Constructor
    public SellStockGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;

        initComponents();

        JPanel header = createHeader();
        JPanel mainContents = createSellStockPanel();
        this.setBackground(bgColor2);
        this.setLayout(null);
        this.setSize(750,900);
        this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        this.setVisible(true);
        this.add(header);
        this.add(mainContents);
    }

    // EFFECTS: creates header for this frame
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    // EFFECTS: adds all components to a single panel
    private JPanel createSellStockPanel() {
        JPanel sellStockPanel = new JPanel();
        sellStockPanel.setBackground(bgColor2);
        sellStockPanel.setBounds(0, 75, 750, 980);
        sellStockPanel.setLayout(new BoxLayout(sellStockPanel, BoxLayout.Y_AXIS));
        sellStockPanel.setVisible(true);

        recenterComponents();
        Dimension space = new Dimension(10, 10);

        sellStockPanel.add(Box.createRigidArea(space));
        sellStockPanel.add(Box.createRigidArea(space));
        sellStockPanel.add(sellLabel);
        sellStockPanel.add(Box.createRigidArea(space));
        sellStockPanel.add(possibleSellStocks);
        sellStockPanel.add(Box.createRigidArea(space));
        sellStockPanel.add(confirmSellStockButton);

        return sellStockPanel;
    }

    // EFFECTS: initializes components used in the panel
    private void initComponents() {
        sellLabel = new JLabel("Please select a stock to sell:");
        sellLabel.setForeground(new Color(200, 200, 200));
        sellLabel.setHorizontalAlignment(JLabel.CENTER);

        List<String> entries = stockPortfolio.getAllStockCodes();
        String[] entryArray = entries.toArray(new String[0]);
        possibleSellStocks = new JComboBox(entryArray);
        possibleSellStocks.setMaximumSize(new Dimension(300, 25));

        confirmSellStockButton = new FancyButtonGUI("Sell Stock");
        confirmSellStockButton.setMinimumSize(new Dimension(250, 50));
        confirmSellStockButton.setMaximumSize(new Dimension(250, 50));
        confirmSellStockButton.addActionListener(this);
    }

    // EFFECTS: recenters all components to the center of the x-axis
    private void recenterComponents() {
        sellLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        possibleSellStocks.setAlignmentX(Component.CENTER_ALIGNMENT);
        confirmSellStockButton.setAlignmentX(Component.CENTER_ALIGNMENT);
    }

    // MODIFIES: this, stockPortfolio
    // EFFECTS: sells stock (removes from portfolio and adds profit / subtract losses)
    private void sellStockGUI() {
        String toSell = possibleSellStocks.getSelectedItem().toString();
        if (stockPortfolio.sellStock(toSell)) {
            JOptionPane.showMessageDialog(null, "Stock sold! Your new balance is: $"
                            + df.format(stockPortfolio.getStockPortfolioBalance()),
                    "Stock Sold!", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null, "Could not find stock. Try again please.",
                    "Failed to Sell Stock", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    // EFFECTS: handles button press to conclude sale
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == confirmSellStockButton) {
            sellStockGUI();
        }
    }
}
