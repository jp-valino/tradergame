package ui;

import javax.swing.*;
import java.awt.*;

/*
Creates a custom button for user input in the GUI.
 */
public class FancyButtonGUI extends JButton {

    // Constructor
    public FancyButtonGUI(String text) {
        super(text);
        init();
    }

    // EFFECTS: initializes new button according to aesthetic needs
    private void init() {
        setForeground(new Color(200, 200, 200));
        setBackground(new Color(50, 50, 50));
        setFont(new Font("Arial", Font.BOLD, 12));
        setBorder(new FancyButtonBorderGUI(10));
        setPreferredSize(new Dimension(250, 40));
    }

}
