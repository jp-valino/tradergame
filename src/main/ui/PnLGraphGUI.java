package ui;

import model.StockPortfolio;

import javax.swing.*;
import java.util.List;
import java.awt.*;
import java.util.ArrayList;

/*
Represents a Graph GUI, implements the visualization of the current PnL History for a given stock portfolio:
- Line graph (displays trading days in the x-axis and pnl in y-axis)
 */
public class PnLGraphGUI extends JPanel {

    // Support values
    final int padding = 25;
    final int labelPadding = 25;
    final int pointWidth = 4;
    final int numberYDivisions = 10;

    // Colors:
    final Color lineColor = new Color(174, 53, 255, 255);
    final Color pointColor = new Color(72, 0, 255, 180);
    final Color gridColor = new Color(185, 185, 185, 199);

    // Stroke: line for graph
    private static final Stroke GRAPH_STROKE = new BasicStroke(2f);

    // Models: stock-portfolio and scores (holds all pnl values)
    final StockPortfolio stockPortfolio;
    List<Double> pnlValues;

    // Constructor
    public PnLGraphGUI(StockPortfolio stockPortfolio) {
        this.stockPortfolio = stockPortfolio;
        pnlValues = stockPortfolio.getPnLHistory();
    }

    // EFFECTS: creates line graph visualization, paints according to the colors and stroke size informed by variables
    @Override
    @SuppressWarnings("methodlength")
    protected void paintComponent(Graphics g) {

        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        double xscale = ((double) getWidth() - (2 * padding) - labelPadding) / (pnlValues.size() - 1);
        double yscale = ((double) getHeight() - 2 * padding - labelPadding) / (getMaxValue() - getMinValue());

        List<Point> graphPoints = new ArrayList<>();
        for (int i = 0; i < pnlValues.size(); i++) {
            int x1 = (int) (i * xscale + padding + labelPadding);
            int y1 = (int) ((getMaxValue() - pnlValues.get(i)) * yscale + padding);
            graphPoints.add(new Point(x1, y1));
        }

        // Draws graph's background
        g2.setColor(new Color(65,65,65));
        g2.fillRect(padding + labelPadding, padding, getWidth() - (2 * padding) - labelPadding,
                getHeight() - 2 * padding - labelPadding);
        g2.setColor(new Color(65, 65, 65));

        // Creates grid lines for y-axis.
        for (int i = 0; i < numberYDivisions + 1; i++) {
            int x0 = padding + labelPadding;
            int x1 = pointWidth + padding + labelPadding;
            int y0 = getHeight() - ((i * (getHeight() - padding * 2 - labelPadding))
                    / numberYDivisions + padding + labelPadding);
            int y1 = y0;
            if (pnlValues.size() > 0) {
                g2.setColor(gridColor);
                g2.drawLine(padding + labelPadding + 1 + pointWidth, y0, getWidth() - padding, y1);
                g2.setColor(new Color(185, 185, 185, 199));
                String ylabel = "$" + ((int) ((getMinValue() + (getMaxValue() - getMinValue()) * ((i * 1.0)
                        / numberYDivisions)) * 100)) / 100.0 + "";
                FontMetrics metrics = g2.getFontMetrics();
                int labelWidth = metrics.stringWidth(ylabel);
                g2.drawString(ylabel, x0 - labelWidth - 5, y0 + (metrics.getHeight() / 2) - 3);
            }
            g2.drawLine(x0, y0, x1, y1);
        }

        // Creates grid lines for x-axis.
        for (int i = 0; i < pnlValues.size(); i++) {
            if (pnlValues.size() > 1) {
                int x0 = i * (getWidth() - padding * 2 - labelPadding)
                        / (pnlValues.size() - 1) + padding + labelPadding;
                int x1 = x0;
                int y0 = getHeight() - padding - labelPadding;
                int y1 = y0 - pointWidth;
                if ((i % ((int) ((pnlValues.size() / 20.0)) + 1)) == 0) {
                    g2.setColor(gridColor);
                    g2.drawLine(x0, getHeight() - padding - labelPadding - 1 - pointWidth, x1, padding);
                    g2.setColor(new Color(185, 185, 185, 199));
                    String xlabel = i + "";
                    FontMetrics metrics = g2.getFontMetrics();
                    int labelWidth = metrics.stringWidth(xlabel);
                    g2.drawString(xlabel, x0 - labelWidth / 2, y0 + metrics.getHeight() + 3);
                }
                g2.drawLine(x0, y0, x1, y1);
            }
        }

        // Draws lines for x and y axes
        g2.drawLine(padding + labelPadding,
                getHeight() - padding - labelPadding,
                padding + labelPadding, padding);
        g2.drawLine(padding + labelPadding,
                getHeight() - padding - labelPadding,
                getWidth() - padding,
                getHeight() - padding - labelPadding);


        Stroke oldStroke = g2.getStroke();

        // Draws the actual graph's lines
        g2.setColor(lineColor);
        g2.setStroke(GRAPH_STROKE);
        for (int i = 0; i < graphPoints.size() - 1; i++) {
            int x1 = graphPoints.get(i).x;
            int y1 = graphPoints.get(i).y;
            int x2 = graphPoints.get(i + 1).x;
            int y2 = graphPoints.get(i + 1).y;
            g2.drawLine(x1, y1, x2, y2);
        }

        // Draws the actual graph's points at each value
        g2.setStroke(oldStroke);
        g2.setColor(pointColor);
        for (int i = 0; i < graphPoints.size(); i++) {
            int x = graphPoints.get(i).x - pointWidth / 2;
            int y = graphPoints.get(i).y - pointWidth / 2;
            int ovalW = pointWidth;
            int ovalH = pointWidth;
            g2.fillOval(x, y, ovalW, ovalH);
        }
    }


    // EFFECTS: Gets minimum value stored in pnlValues
    private double getMinValue() {
        double minScore = Double.MAX_VALUE;
        for (Double score : pnlValues) {
            minScore = Math.min(minScore, score);
        }
        return minScore;
    }

    // EFFECTS: Gets maximum value stored in pnlValues
    private double getMaxValue() {
        double maxScore = Double.MIN_VALUE;
        for (Double score : pnlValues) {
            maxScore = Math.max(maxScore, score);
        }
        return maxScore;
    }


}
