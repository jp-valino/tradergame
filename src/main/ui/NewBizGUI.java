package ui;

import model.StockPortfolio;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/*
Represents a New Business GUI, implements functionality so that the user can create a new stock. Has:
 - Entry fields (JTextField) that allows the user to input the new stock's information
 - Dropdown fields (JComboBox) that allows the user to select the sector of the new field
 */
public class NewBizGUI extends JFrame implements ActionListener {

    private StockPortfolio stockPortfolio;

    DecimalFormat df = new DecimalFormat("0.00");

    // Support GUIs:
    HeaderGUI headerBar = new HeaderGUI();

    // Colors:
    Color bgColor = new Color(50, 50, 50);
    Color bgColor2 = new Color(65, 65,65);

    // Components:
    JLabel nameLabel;
    JTextField nameOfBizField;
    JLabel codeLabel;
    JTextField codeOfBizField;
    JLabel sectorLabel;
    JComboBox possibleSectorsCombo;
    JButton confirmCreationButton;
    JPanel mainContents;

    // Constructor
    public NewBizGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;
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

    // EFFECTS: Creates Header GUI
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setBackground(bgColor);
        header.setBounds(0,0, 750, 75);
        header.add(headerBar);
        return header;
    }

    // EFFECTS: unifies the main contents of this panel in a single panel
    private JPanel createMainContents() {
        mainContents = new JPanel();
        mainContents.setBackground(bgColor2);
        mainContents.setBounds(0,75,750,980);
        mainContents.setLayout(new BoxLayout(mainContents, BoxLayout.Y_AXIS));
        mainContents.setVisible(true);

        initComponents();
        recenterButtons();
        addAllComponents();

        return mainContents;
    }

    // EFFECTS: adds all components to the main panel
    private void addAllComponents() {
        Dimension space = new Dimension(10, 25);
        Dimension space2 = new Dimension(10, 10);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(nameLabel);
        mainContents.add(Box.createRigidArea(space2));
        mainContents.add(nameOfBizField);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(codeLabel);
        mainContents.add(Box.createRigidArea(space2));
        mainContents.add(codeOfBizField);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(sectorLabel);
        mainContents.add(Box.createRigidArea(space2));
        mainContents.add(possibleSectorsCombo);
        mainContents.add(Box.createRigidArea(space));
        mainContents.add(confirmCreationButton);

    }

    // EFFECTS: initializes Components uses in this panel
    private void initComponents() {
        nameLabel = new JLabel("Please inform your new company's name:");
        nameLabel.setForeground(new Color(200, 200, 200));
        nameLabel.setHorizontalAlignment(JLabel.CENTER);

        nameOfBizField = new JTextField();
        nameOfBizField.setMinimumSize(new Dimension(300, 25));
        nameOfBizField.setMaximumSize(new Dimension(300, 25));

        codeLabel = new JLabel("Please inform your new company's code:");
        codeLabel.setForeground(new Color(200, 200, 200));
        codeLabel.setHorizontalAlignment(JLabel.CENTER);

        codeOfBizField = new JTextField();
        codeOfBizField.setMinimumSize(new Dimension(300, 25));
        codeOfBizField.setMaximumSize(new Dimension(300, 25));

        sectorLabel = new JLabel("Please inform your new company's sector:");
        sectorLabel.setForeground(new Color(200, 200, 200));
        sectorLabel.setHorizontalAlignment(JLabel.CENTER);

        createOtherButtons();
    }

    // EFFECTS: creates remamining buttons for this JFrame
    private void createOtherButtons() {
        List<String> entries = new ArrayList<>();
        entries.add("Technology");
        entries.add("Healthcare");
        entries.add("Financial");
        entries.add("Energy");
        entries.add("Consumer Goods");

        String[] entryArray = entries.toArray(new String[0]);
        possibleSectorsCombo = new JComboBox(entryArray);
        possibleSectorsCombo.setMinimumSize(new Dimension(300, 25));
        possibleSectorsCombo.setMaximumSize(new Dimension(300, 25));

        confirmCreationButton = new FancyButtonGUI("Confirm Venture Business");
        confirmCreationButton.setMinimumSize(new Dimension(250,50));
        confirmCreationButton.setMaximumSize(new Dimension(250,50));
        confirmCreationButton.addActionListener(this);
    }

    // EFFECTS: recenters the components to the center of the screen
    private void recenterButtons() {
        nameLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        nameOfBizField.setAlignmentX(Component.CENTER_ALIGNMENT);
        codeLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        codeOfBizField.setAlignmentX(Component.CENTER_ALIGNMENT);
        sectorLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        possibleSectorsCombo.setAlignmentX(Component.CENTER_ALIGNMENT);
        confirmCreationButton.setAlignmentX(Component.CENTER_ALIGNMENT);
    }

    // EFFECTS: controls user input according to button press
    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == confirmCreationButton) {
            createNewBizGUI();
        }
    }

    // MODIFIES: this, stockPortfolio
    // EFFECTS: method that handles the creation of a new stock
    private void createNewBizGUI() {
        String newCompName = nameOfBizField.getText();
        String newCompCode = codeOfBizField.getText();
        String newCompSector = possibleSectorsCombo.getSelectedItem().toString();

        if (stockPortfolio.createNewStock(newCompName, newCompCode, newCompSector)) {
            JOptionPane.showMessageDialog(null,
                    "Congratulations, you created a new company, your new balance is: $"
                            + df.format(stockPortfolio.getStockPortfolioBalance()),
                    "Stock Created!", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(null, "Could not create stock.",
                    "Failed to Create Stock", JOptionPane.INFORMATION_MESSAGE);
        }
    }
}
