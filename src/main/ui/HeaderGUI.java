package ui;

import javax.swing.*;
import java.awt.*;

/*
Represents a Header GUI, implements a header such that a banner with the text Trader Simulator is displayed
at all times when using the application.
 */
public class HeaderGUI extends JPanel {

    JLabel banner = new  JLabel();

    // Constructor
    public HeaderGUI() {

        ImageIcon bannerImage = new ImageIcon("static/banner.jpg");

        this.setPreferredSize(new Dimension(750, 60));
        this.setBackground(new Color(50, 50,50));

        banner.setIcon(bannerImage);
        banner.setHorizontalAlignment(JLabel.CENTER);
        banner.setVerticalAlignment(JLabel.TOP);
        banner.setPreferredSize(new Dimension(750, 60));
        banner.setHorizontalAlignment(JLabel.CENTER);
        this.add(this.banner);
    }
}
