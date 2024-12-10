package ui;

import model.*;

import javax.swing.*;
import java.awt.*;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Scanner;

/*
Represents the visualization for the stock pool, displays all stocks and their related info
 */
public class ViewPoolGUI extends JFrame {

    // Fields:
    private StockPortfolio stockPortfolio;
    Dimension space = new Dimension(10, 10);

    // Support GUIs:
    HeaderGUI headerBar = new HeaderGUI();
    private JPanel stockPanel;

    // Support colors:
    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);

    // Constructor
    public ViewPoolGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;
        JPanel header = createHeader();
        JPanel mainContents = createStockPoolPanel();
        this.setBackground(bgColor2);
        this.setLayout(null);
        this.setSize(750,900);
        this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        this.setVisible(true);
        this.add(header);
        this.add(mainContents);
    }

    // EFFECTS: creates a header panel
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    // EFFECTS: adds main components to the main panel of the frame, creates JLabels for each stock in pool
    public JPanel createStockPoolPanel() {

        stockPanel = new JPanel();
        stockPanel.setBackground(bgColor2);
        stockPanel.setBounds(0,75,750,980);
        stockPanel.setLayout(new BoxLayout(stockPanel, BoxLayout.Y_AXIS));
        stockPanel.add(Box.createRigidArea(space));
        stockPanel.add(Box.createRigidArea(space));
        stockPanel.add(Box.createRigidArea(space));

        createAllLabels();

        stockPanel.revalidate();
        stockPanel.repaint();
        stockPanel.setVisible(true);
        return stockPanel;
    }

    // EFFECTS: creates labels for all stock in the stock portfolio's pool
    private void createAllLabels() {
        List<Stock> stocks = stockPortfolio.getStockPool();
        for (Stock s : stocks) {
            JLabel label = new JLabel(
                    "Stock: " + s.getStockName() + " | "
                            + "Code: " + s.getStockCode() + " | "
                            + "Price: $" + String.format("%.2f", s.getCurrentPrice()) + " | "
                            + "Change (%): " + String.format("%.2f", s.getStockDailyVariation() * 100) + "%"
            );
            label.setForeground(new Color(200, 200, 200));
            label.setFont(new Font("Arial", Font.BOLD, 15));
            label.setAlignmentX(Component.CENTER_ALIGNMENT);

            stockPanel.add(label);
            stockPanel.add(Box.createRigidArea(space));
        }
    }

}
