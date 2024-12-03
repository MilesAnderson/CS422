# CS422

## Abstract

MooDengCapital is a papertrading service that aims to make pragmatic and risk-free education accessible to all. Through becoming 
a registered trader, users are provided a clean-slate balance of $10,000 to build a financial portfolio of real stocks. Additionally, a watchlist page is available to each user, where they can monintor and group certain stocks of interest. Through buying and selling stocks with real-time prices, users can analyze trends and learn about the inner workings of the stokc market all while developing a simulated portfolio. 

## Authors

Miles Anderson, Liam Bouffard, Andrew Chan, Jacob Kolster </br>
Team: MooDeng </br>
Class: CS 422, Fall 2024 </br>
Last Modified: 12/2/2024

## Installation

### Requirements
The project requires these tools:
* PostgreSQL
* .env file
* Node.js
* Npm (Node Package Manager)

### Repository
Download the repository with the following command: 
```
git pull https://github.com/AndrewChan8/CS422/tree/main
```

### `PostgreSQL` & Database
To setup your database, download PostgreSQL from :[https://www.postgresql.org/](https://www.postgresql.org/). Provide a password that you will remember for the superuser `postgres`, and ensure that the port is `5432`. Startup `pgAdmin4` once it is downloaded, and click the drop-down arrow next to `Servers` to enter your password and sign-in as postgres. Double-click on the `Databases` tab under `Servers` and click `Create Database`, name the database `MooDengCapital`. Double-click the `MooDengCapital` directory that now appears, and select `Create Script`. The window on your right should display an SQL script with CREATE DATABASE "MooDengCapital" at the top. Delete all of this code, copy & paste the `tables.sql` file that is provided into the submission documents, and click the `Play` or `Execute Script` button that is above this window. The database and its tables have been created.

### `.env`

Create a file called `.env` in the `server` directory. Write to the file the code below
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=MooDengCaptial
DB_PASSWORD=______
DB_PORT=5432
API_KEY=______
```
* `DB_Password` - should be set to the password provided for postgres superuser
* `API_KEY` - should be set to API key provided in submission

### `node.js` & `npm` Installation

Node.js is a javascript runtime environment that is used to help build web applications. NPM is a common 
package manager used in conjunction with node.js. Both of these can be installed succinctly for MacOS and 
Windows using the pre-built installer at [https://nodejs.org/en/download/prebuilt-installer](https://nodejs.org/en/download/prebuilt-installer).

Linux users can install node.js and npm through `nvm` by following and running the commands posted at:
[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

### Final Startup

To startup the web application on your local host, you will need to download the repo and have both the frontend and backend server running. To run the backend, open a terminal, cd into the `server` directory and execute `node server.js`. To run the frontend, open another terminal, cd into the `client` directory and execute `npm start`.


## Overview of Pages

### Sign-Up/Sign-In

Sign-Up used to register a username, email, and password with a new trader account, automatically signs in on completion. Sign-in used to connect with already registered trader account. This is necessary to access functionality such as buying/selling stock or adding a stock to the watchlist

### Home Page

Used to search stocks by their ticker. Given a successful search a user has an option to add any number of shares that don't exceed the
balance of their portfolio, or add the stock to their watchlist. By default Google (GOOG) is shown.

### Watchlists Page

Users can add stocks of interest to their watchlist page. Instead of buying stocks, here they can monitor them to keep track of trends
within the market. 

### Profile Page

The center for a trader's financial overview! Displays all shares within a user's portfolio, as well as other vital information such as
liquid money, asset money, and net worth.


## Further Reading

Dedicated READMEs are provided for the backend and frontend in the `server` and `client` directories respectively.