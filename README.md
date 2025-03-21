# Trader Game

A stock trading simulation game with a modern web interface.

## Project Structure

The project is divided into two main parts:

1. **Backend**: Java-based backend using Spring Boot to expose the existing trading simulation logic as a REST API.
2. **Frontend**: Modern React-based frontend with TypeScript, providing a sleek user interface with a dark grey and purple color scheme.

## Technologies Used

### Backend
- Java 8
- Spring Boot 2.7.0
- JSON Library

### Frontend
- React 18
- TypeScript
- Chart.js for data visualization
- CSS with custom variables for theming

## Getting Started

### Prerequisites
- Java 8 JDK
- Node.js and npm

### Running the Backend

1. Compile the Java code:
```bash
javac -d out -cp "lib/*;src/main" src/main/java/api/TraderGameApplication.java
```

2. Run the Spring Boot application:
```bash
java -cp "out;lib/*" api.TraderGameApplication
```

Alternatively, if you have Maven installed:
```bash
mvn spring-boot:run
```

The backend API will be available at http://localhost:8080/api/portfolio

### Running the Frontend

1. Navigate to the web-ui directory:
```bash
cd web-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## Features

- View your stock portfolio and performance
- Buy and sell stocks
- Progress to the next trading day to see price changes
- Reset the simulation
- Modern, responsive UI with a dark theme
- Interactive charts for stock prices and portfolio performance

## API Endpoints

- `GET /api/portfolio`: Get the full portfolio data
- `GET /api/portfolio/stocks`: Get owned stocks
- `GET /api/portfolio/pool`: Get available stocks in the market
- `POST /api/portfolio/buy`: Buy a stock
- `POST /api/portfolio/sell`: Sell a stock
- `POST /api/portfolio/progress-day`: Progress to the next trading day
- `POST /api/portfolio/reset`: Reset the simulation

## Screenshots

(Screenshots will be added here)

## License

This project is licensed under the MIT License - see the LICENSE file for details.