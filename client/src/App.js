import React, { useState } from 'react';
import axios from 'axios';

import './css/App.css';
import './css/NavBar.css';
import './css/Auth.css';
import './css/About.css';
import './css/SearchBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import SearchIcon from './img/SearchIcon.png';

function App() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stocks?q=${searchQuery}`);
      setStocks(response.data || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching the API:", error);
    }
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a stock..."
        />
        <button type="submit" className="SearchButton">
          <img src={SearchIcon} alt="Search Icon" className="SearchIcon" />
        </button>
      </form>
      <div className='test'>
        {stocks.length > 0 ? stocks.map(stock => <div key={stock.id}>{stock.name}</div>) : "No stocks found"}
      </div>
    </div>
  );
}

export default App;
