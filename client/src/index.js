/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 8 Oct 2024

Description:
This file, `index.js`, is the entry point for the React application. It sets up the ReactDOM render process, integrates React Router for navigation, and initializes routing for the app's pages. It also includes an option to measure app performance using the `reportWebVitals` function.
*/

import React from 'react'; // Core React library
import ReactDOM from 'react-dom/client'; // React DOM renderer for modern applications
import App from './App'; // Root component of the application
import reportWebVitals from './reportWebVitals'; // Function for measuring web performance

// Importing pages for routing
import Authentication from './pages/authentication'; // Authentication page component
import About from './pages/about'; // About page component
import Watchlist from './pages/watchlist'; // Watchlist page component
import Profile from './pages/profile'; // Profile page component
import StockDetails from './pages/stockDetails'; // Stock details page component

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router for navigation

// Create a root for rendering the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route>
          {/* Define application routes */}
          <Route index path="/" element={<App />} /> {/* Home route */}
          <Route path="authentication" element={<Authentication />} /> {/* Authentication route */}
          <Route path="about" element={<About />} /> {/* About page route */}
          <Route path="watchlist" element={<Watchlist />} /> {/* Watchlist page route */}
          <Route path="profile" element={<Profile />} /> {/* Profile page route */}
          <Route path="stockDetails/:symbol" element={<StockDetails />} /> {/* Dynamic route for stock details */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Measure app performance
// Pass a function to log results (e.g., `reportWebVitals(console.log)`)
// Or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); // Initialize performance reporting

