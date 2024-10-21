import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './css/App.css';
import './css/NavBar.css';
import './css/Auth.css';
import './css/About.css';
import './css/SearchBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar'
import SearchIcon from './img/SearchIcon.png';

function App() {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Test");

  const handleSearch = (query) => {
    setStocks([]);
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/test?q=${searchQuery}`);
        setStocks(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the API:", error);
      }
    };
    fetchBooks();
  }, [searchQuery]);

  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <h1 className="Title">Search up a stock!</h1>
      </header>
      <div className="SearchBarContainer">
          <input
          className="SearchBar"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a stock..."
        />
        <img src={ SearchIcon } alt="Search Icon" className="SearchIcon"/>
      </div>
    </div>
  );
}

export default App;
