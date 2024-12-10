package ui;

import model.StockPortfolio;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.*;
import java.util.List;
import java.text.DecimalFormat;

public class BuyStockGUI extends JFrame implements ActionListener {
    private StockPortfolio stockPortfolio;
    private Scanner input;
    String nameInput;
    double valueInput;
    DecimalFormat df = new DecimalFormat("0.00");

    // Buttons:
    JButton confirmButton;
    JComboBox possibleBuyStocks;
    HeaderGUI headerBar = new HeaderGUI();

    // Labels:
    JLabel buyLabel;
    JLabel numberLabel;

    // Fields:
    JTextField numberOfSharesField;


    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);

    public BuyStockGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;

        initComponents();

        JPanel header = createHeader();
        JPanel mainContents = createBuyStockPanel();
        this.setBackground(bgColor2);
        this.setLayout(null);
        this.setSize(750,900);
        this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        this.setVisible(true);
        this.add(header);
        this.add(mainContents);
    }

    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    private JPanel createBuyStockPanel() {
        JPanel buyStockPanel = new JPanel();
        buyStockPanel.setBackground(bgColor2);
        buyStockPanel.setBounds(0, 75, 750, 980);
        buyStockPanel.setLayout(new BoxLayout(buyStockPanel, BoxLayout.Y_AXIS));
        buyStockPanel.setVisible(true);

        recenterComponents();
        Dimension space = new Dimension(10, 10);

        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(buyLabel);
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(possibleBuyStocks);
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(numberLabel);
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(numberOfSharesField);
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(Box.createRigidArea(space));
        buyStockPanel.add(confirmButton);

        return buyStockPanel;
    }

    private void initComponents() {
        buyLabel = new JLabel("Please select a stock to buy:");
        buyLabel.setForeground(new Color(200, 200, 200));
        buyLabel.setHorizontalAlignment(JLabel.CENTER);

        List<String> entries = stockPortfolio.getAllStockCodesPool();
        String[] entryArray = entries.toArray(new String[0]);
        possibleBuyStocks = new JComboBox(entryArray);
        possibleBuyStocks.setMinimumSize(new Dimension(300, 25));
        possibleBuyStocks.setMaximumSize(new Dimension(300, 25));

        numberLabel = new JLabel("Please select number of shares to buy:");
        numberLabel.setForeground(new Color(200, 200, 200));
        numberLabel.setHorizontalAlignment(JLabel.CENTER);

        numberOfSharesField = new JTextField();
        numberOfSharesField.setMinimumSize(new Dimension(300, 25));
        numberOfSharesField.setMaximumSize(new Dimension(300, 25));

        confirmButton = new FancyButtonGUI("Buy Stock");
        confirmButton.setMinimumSize(new Dimension(250, 50));
        confirmButton.setMaximumSize(new Dimension(250, 50));
        confirmButton.addActionListener(this);
    }

    private void recenterComponents() {
        buyLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        possibleBuyStocks.setAlignmentX(Component.CENTER_ALIGNMENT);
        numberLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        numberOfSharesField.setAlignmentX(Component.CENTER_ALIGNMENT);
        confirmButton.setAlignmentX(Component.CENTER_ALIGNMENT);
    }

    private void buyStockGUI() {
        String toBuy = possibleBuyStocks.getSelectedItem().toString();
        int numShares = Integer.parseInt(numberOfSharesField.getText());
        if (stockPortfolio.buyStock(toBuy, numShares)) {
            JOptionPane.showMessageDialog(null,
                    "Bought " + numShares + " of " + toBuy +  ", your new balance is: $"
                            + df.format(stockPortfolio.getStockPortfolioBalance()),
                    "Stock Bought!", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null, "Could not buy stock.",
                    "Failed to Buy Stock", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == confirmButton) {
            buyStockGUI();
        }
    }

}
