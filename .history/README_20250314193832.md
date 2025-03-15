# 💸 Trader Game 💸
***
## Overview and Introduction 📍
Have you ever wondered how it is to be a trader in the busy 
and complex world of stocks and financial markets? Trader Game
is an application that offers an interactive opportunity to engage
with this world, and the best of all: **free of all and any risks!**

***

## Application Description 💾
This application is designed to simulate a real (or as close to real as possible)
scenario of trading stocks and financial assets, and as such, will involve building
a portfolio from a series of financial investments, as in the real world, there will
also be a simulated randomness involved with the profits or losses of such investments. 
The investor will be able to build a portfolio from existing options or create a new stock
for a company they will build with their financial gains, being able to choose between different
sectors. 

Everyone curious to start investing or even see how it feels to make the right or wrong
decision is encouraged to try out the Trader Game, even if they do not understand how
this all functions in the real world.

As someone who has already had some experience in the financial market and analysed data 
pertaining to this sector, I understand that starting out can be very mystifying and daunting, and I aim 
to change that even if just a little with my project.

***

## User Stories 👤
As a user, I want to be able to:
- Add **(buy)** existing stock options to my portfolio;
- Remove **(sell)** existing stock options from my portfolio;
- Extract the profit or losses resulting from selling my stock(s);
- Create new stock opportunities from my profits, and add this new option to my portfolio;
- Visualize each previously existing or created stocks' performance;
- Visualize my portfolio's overall performance;
- See statistics from my trading performance, including a log of all purchases and sales previously done;
- Visualize market conditions and expect a corresponding effect on related stocks;
- Finish my trading activities for the day and progress to the next one;
- Save my progress if I wish to do so;
- Load trading where I previously stopped If I choose to do so;
- Reset the game;

***

## Instruction for Grader (Phase 3: GUI)
- In order to buy stocks and add them to the portfolio, click the button "Manage Stock Portfolio" in the starting screen
and then "Buy a Stock" in the manager screen. Then, select the stock which you wish to buy and input the number of 
shares, click "Buy Stock" to confirm the purchase.
- In order to sell stocks and remove them from the portfolio, click the button "Manage Stock Portfolio" in the starting 
screen and then "Sell a Stock" in the manager screen. Then, select the stock which you wish to sell and click
"Sell Stock" to confirm the purchase.
- In order to check all the stocks currently in the portfolio, click "View My Portfolio" in the starting screen, a graph
with all the profit and losses value, the general information about the portfolio and all stocks currently held will be 
displayed, provided you own one or more stocks and have progressed the trading day.
- In order to view all the stocks in the stock pool, click "View All Stocks" in the starting screen, all stocks as well
as their information (name, code, price and daily change) will be displayed.
- In order to progress to the next day, click "Progress to Next Day" in the starting screen.
- In order to save the portfolio, click "Save Stock Portfolio" in the main screen.
- In order to load the portfolio, click "Load Stock Portfolio" in the main screen.
- In order to reset the simulation, click "Reset Simulation" in the main screen.
- In order to exit the simulation, click "Exit" in the main screen.
- In order to sell all stocks, click "Manage Stock Portfolio" and then in the manager screen, click "Sell All Stocks".
- In order to ask for a loan, click "Manage Stock Portfolio" and then in the manager screen, click "Ask For a Loan".
- In order to create a new business, click "Manage Stock Portfolio" and then in the manager screen, input
the new business's name, the code and select the sector, then, click "Confirm Venture Business" to confirm the creation.

***

## Phase 4: Task 2
Given a standard usage of the application, where a user buys selected stocks and sells one or more of them, creates a 
new business, progresses the trading day once or more and asks for a loan, the following log can be expected to be
printed as the program terminates:

Log:

Wed Nov 29 06:53:32 PST 2023 - Bought 10 shares of a stock: AAPL; <br>
Wed Nov 29 06:53:37 PST 2023 - Bought 15 shares of a stock: GOOGL; <br>
Wed Nov 29 06:53:43 PST 2023 - Bought 20 shares of a stock: META; <br>
Wed Nov 29 06:53:50 PST 2023 - Bought 10 shares of a stock: KO; <br>
Wed Nov 29 06:53:55 PST 2023 - Sold a stock: GOOGL; <br>
Wed Nov 29 06:54:12 PST 2023 - Created a new venture business: JP Tech Biz (JPTCH); <br>
Wed Nov 29 06:54:15 PST 2023 - Failed at obtaining a loan; <br>
Wed Nov 29 06:54:16 PST 2023 - Successfully obtained a loan; <br>
Wed Nov 29 06:54:21 PST 2023 - Progressed to day 1 of trading; <br>
Wed Nov 29 06:54:22 PST 2023 - Progressed to day 2 of trading; <br>
Wed Nov 29 06:54:22 PST 2023 - Progressed to day 3 of trading; <br>

End of Log.

***
## Phase 4: Task 3

![](UML_Design_Diagram.jpg)

This project represented a great challenge but also a very good opportunity to materialize ideas that I have had for a 
long time. However, it has become evident through this process and also through the UML diagram provided for this case 
that some parts of the code could be refactored in order to become more modular and robust.

The first point which I would assuredly spend time refactoring would be the general user experience and layout of my UI.
Although I am satisfied with the result, I now realize that it would have been much more effective to implement a sidebar 
in order to navigate through the application's different screens and options.

The second point which now seems obvious is the fact that Stock Portfolio should be, in fact, a singleton class, since 
at any given moment in my application, there is only one portfolio, and having a singleton with a universal point of 
access would have benefited the overall design and robustness of a large portion of my code.

The third and final point which I would certainly spend time refactoring is the usage of exceptions. In my current code,
exceptions are quite rare, but I believe that they could've been applied to multiple scenarios that are currently dealt
with using if-else statements and boolean return values.

***

### Citations: 
- For Phase 1 of this project, some key aspects of the _Teller Application_ were considered as reference, namely, the 
structure of the _Main_ class and _TradingSimulatorApp_ class
- For phase 2 of this project, the JsonReader and JsonWriter classes, including their methods 
and tests were influenced by the provided JSON Serialization (Workroom) example.
- For phase 3 of this project, the PnLGraphGUI was based on several internet articles explaining how to produce a graph
using java Swing and java AWT. 