import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './css/App.css';
import './css/NavBar.css';
import './css/Auth.css';
import './css/About.css';
import './css/SearchBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import SearchIcon from './img/SearchIcon.png';
import StockCard from './components/StockCard';

function App() {
  const [stocks, setStocks] = useState(null); // Initialize as null to distinguish from empty data
  const [searchQuery, setSearchQuery] = useState("GOOG");
  const [inputValue, setInputValue] = useState("GOOG");
  const [loading, setLoading] = useState(false); // Loading state to manage API call status

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks?q=${searchQuery}`);
        if (response.data && Object.keys(response.data).length > 0) {
          setStocks(response.data); // Set stocks to the response data if valid
        } else {
          setStocks(null); // Set stocks to null if no data
        }
      } catch (error) {
        console.error("Error fetching the API:", error);
        setStocks(null); // Set stocks to null if there's an error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (searchQuery) {
      fetchStocks();
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <h1 className="Title">Search up a stock!</h1>
      </header>
      <form className="SearchBarContainer" onSubmit={handleSubmit}>
        <input
          className="SearchBar"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for a stock..."
        />
        <button type="submit" className="SearchButton">
          <img src={SearchIcon} alt="Search Icon" className="SearchIcon" />
        </button>
      </form>

      {/* Display loading, stock data, or a no-data message based on state */}
      {loading ? (
        <p>Loading...</p>
      ) : stocks ? (
        <StockCard stocks={stocks} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default App;
