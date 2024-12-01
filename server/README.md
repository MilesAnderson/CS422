# The Backend

### `node.js` & `npm` Installation

Node.js is a javascript runtime environment that is used to help build web applications. NPM is a common 
package manager used in conjunction with node.js. Both of these can be installed succinctly for MacOS and 
Windows using the pre-built installer at [https://nodejs.org/en/download/prebuilt-installer](https://nodejs.org/en/download/prebuilt-installer).

Linux users can install node.js and npm through `nvm` by following and running the commands posted at:
[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

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

