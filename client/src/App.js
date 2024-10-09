import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    // Make an API call to the backend when the component mounts
    axios.get('http://localhost:5000/api/message')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the message:', error);
      });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Type something..."
        value={inputValue}
        onChange={handleChange}
      />
      <h1>{inputValue}</h1>
      <p>{message}</p> {/* Display the fetched message here */}
    </div>
  );
}

export default App;
