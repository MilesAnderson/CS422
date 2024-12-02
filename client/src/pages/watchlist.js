import React, { useEffect, useState, useRef } from 'react';
import WatchlistRow from '../components/WatchlistRow';
import NavBar from '../components/NavBar';
import axios from 'axios';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const user = userRef.current || {};

  // Fetches the watchlist and stock prices from the backend
  const fetchWatchlist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/watchlist/${user.user_id}/watchlist`);
      if (response.ok) {
        const data = await response.json();

        // Fetch stock prices for each symbol
        const symbols = data.watchlist || [];
        const pricePromises = symbols.map(async (symbol) => {
          try {
            const priceResponse = await axios.get(`http://localhost:5000/api/stocks?q=${symbol}`);
            return {
              symbol,
              companyName: priceResponse.data?.data?.companyName,
              price: priceResponse.data?.data?.price || "N/A", // Gracefully handle missing price
            };
          } catch {
            return { symbol, price: "N/A" }; // Handle individual stock price fetch failure
          }
        });

        const watchlistWithPrices = await Promise.all(pricePromises);
        setWatchlist(watchlistWithPrices);
      } else {
        throw new Error('Failed to fetch watchlist');
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err.message);
      setError("Failed to load watchlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemoveStock = (symbol) => {
    setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol));
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="watchlist-container">
          <h1>Loading Watchlist...</h1>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="watchlist-container">
          <h1>Error: {error}</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="watchlist-container">
        <h1>Your Watchlist</h1>
        {watchlist.length === 0 ? (
          <p>No stocks in your watchlist.</p>
        ) : (
          <ul>
            {watchlist.map((stock, index) => (
              <WatchlistRow key={index} stock={stock} onRemove={handleRemoveStock} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Watchlist;
