package ui;

import javax.swing.*;
import javax.swing.border.Border;
import java.awt.*;

/*
Creates a custom border for the new overriden version of the button used for wider aspects of this GUI.
 */
public class FancyButtonBorderGUI extends JComponent implements Border {

    private int radius;

    // Constructor
    FancyButtonBorderGUI(int radius) {
        this.radius = radius;
    }

    // EFFECTS: gets current border of the component
    public Insets getBorderInsets(Component c) {
        return new Insets(this.radius + 1, this.radius + 1, this.radius + 2, this.radius);
    }

    // EFFECTS: determines if the border of the button border is opaque
    public boolean isBorderOpaque() {
        return true;
    }

    // EFFECTS: paints the border of the fancy button according to the informed radius
    @Override
    public void paintBorder(Component c, Graphics g, int x, int y, int width, int height) {
        g.drawRoundRect(x, y, width - 1, height - 1, radius, radius);
    }
}
