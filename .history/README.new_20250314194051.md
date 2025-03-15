# 🚀 Trader Game

A modern stock trading simulation game with a sleek web interface and Java backend.

![Trader Game](https://img.shields.io/badge/Trader%20Game-1.0-8a2be2)
![Java](https://img.shields.io/badge/Java-8-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)

## ✨ Features

- **Portfolio Management**: View your stock portfolio and track performance
- **Trading**: Buy and sell stocks with real-time price updates
- **Market Simulation**: Progress to the next trading day to see price changes
- **Data Visualization**: Interactive charts for stock prices and portfolio performance
- **Modern UI**: Sleek dark-themed interface with purple accents
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

The project follows a modern client-server architecture:

### Backend
- **Java 8** core with existing trading simulation logic
- **Spring Boot** REST API layer to expose functionality
- **JSON** for data serialization

### Frontend
- **React 18** with **TypeScript** for type safety
- **Chart.js** for interactive data visualization
- **CSS Variables** for theming with dark grey and purple color scheme
- **Switzer Font** for a clean, modern typography

## 🚀 Getting Started

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

## 📊 Screenshots

(Screenshots will be added here)

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portfolio` | GET | Get the full portfolio data |
| `/api/portfolio/stocks` | GET | Get owned stocks |
| `/api/portfolio/pool` | GET | Get available stocks in the market |
| `/api/portfolio/buy` | POST | Buy a stock |
| `/api/portfolio/sell` | POST | Sell a stock |
| `/api/portfolio/progress-day` | POST | Progress to the next trading day |
| `/api/portfolio/reset` | POST | Reset the simulation |

## 🧩 Project Structure

```
tradergame/
├── src/
│   └── main/
│       ├── java/
│       │   ├── api/                 # REST API layer
│       │   │   ├── controller/      # REST controllers
│       │   │   └── dto/             # Data Transfer Objects
│       │   ├── model/               # Domain models
│       │   ├── persistence/         # Data persistence
│       │   └── ui/                  # Original Swing UI
│       └── resources/               # Application resources
├── web-ui/                          # React frontend
│   ├── public/                      # Static assets
│   └── src/
│       ├── components/              # React components
│       ├── services/                # API services
│       ├── styles/                  # CSS styles
│       └── types/                   # TypeScript interfaces
├── lib/                             # Java libraries
└── data/                            # Application data
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Legacy Documentation

The original README with additional details about the project's history and development can be found in [README.md](README.md). 