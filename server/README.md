# The Backend

## Available Scripts

### `node server.js`

Starts up the backend server when executed in the `server` directory

### `npm install _____`

Installs npm dependencies with title "_____." The dependencies used for this backend were installed using
this format and are listed below:
* axios
* bcrypt
* bcryptjs
* cookie-parser
* cors
* dotenv
* express
* jade
* morgan
* pg

## Backend Architecture

The backend server consists of API routes connecting the front-end react app to the database.
These API calls can be seperated into three main categories:

1. Database Table CRUD API
2. Vanguard Stock API
3. User Functionality API

### Database Table CRUD API

Basic CRUD operations were provided with each table in the database. These API methods are contained within
a controller file with the same name of the database table, and help abstract higher user functionality
such as buying a stock or signing up as a trader. For instance, the portfolio table's API methods are found 
within `portfolioController.js` of the controller directory, and consist of createPortfolio, deletePortfolio,
and changeBalance. Thus Database Table CRUD API are provided for the tables:

* stocks (within controllers/stockController.js)
* users
* portfolios
* trades (within controllers/transactionsController.js)
* watchlists


### Vanguard Stock API

Provides functionality for interacting with a 3rd party service that stores and retrieves the real-time prices
of stocks in the stock market.

### User Functionality API

Higher level user-functionality such as buying a stock or signing up as a trader are accessed through these API
methods. These methods have their separate routes and controllers and typically call other Database Table CRUD 
APIs. For instance, given the scenario where a user signs up successfully, an HTTP POST request will be sent to
`/api/signUp` and given a valid HTTP body, one post request will be sent to `/api/users` and one POST request 
will be sent to `/api/portfolios` to create a user and portfolio within the database.

The methods associated with this type of API are:
- buyStock
- sellStock
- calcWorth  (Calculate user's net worth)
- signIn
- signUp
- getPortfolioStocks (within controllers/viewPortfolioController.js)


## The Database

### Stock Table

A set of existing unique stocks within all portfolios and watchlists of registered traders. Each record
contains of a stock_id for identification, a symbol representing the stock's ticker, curr_price representing 
the most recently known price of the stock, as well as a timestamp of when the record was created.

### Users Table

Stores each registered trader and their vital information. Each record consists of a user_id for identification,
a username, a unique email, a password, and a timestamp of when the record was created. The password is encrypted
for security purposes

### Portfolios Table

Stores the portfolios of all registered traders. These records contain a portfolio_id for identification, a 
user_id to reference the user associated with the portfolio, a balance for the ammount of uninvested money within
the account, as well as a timestamp of when the record was created.

### Trades Table

Stores the trade history of all registered traders. Each record consists of a trade_id for identification, a
portfolio_id to reference the portfolio associated with the trade, symbol representing the stock involved in 
the trade, trade_type which is set to either 'BUY' or 'SELL', the quantity of shares involved in the trade, the
price_per_share of the stock, as well as a timestamp for when the trade was enacted. Notably, the trades table is
traversed to calculate the current shares within a portfolio. The combination of the real-time prices of these 
shares alongside the balance left in the portfolio calculates a trader's net worth.

### Watchlists Table

Stores all stocks within the watchlists of all registered traders. These records contain a watchlist_id, a name
representing the symbol of the stock, a user_id to reference the user associated, a stock_id to reference the stock
associated, and a timestamp of when the stock was added to the user's watchlist. Both name and user_id are used to
identify a specific stock within a specific user's watchlist.

