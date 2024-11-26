// // andrews version

// import React from 'react';
// import NavBar from '../components/NavBar';

// const Watchlist = () => {
//   return (
//     <>
//       <NavBar />
//       <div className="watchlist-container">
//         <h1>Watchlist</h1>
//       </div>
//     </>
//   );
// };

// export default Watchlist;


import React, { useEffect, useState, useRef } from 'react';

import NavBar from '../components/NavBar';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const user = userRef.current || {};

  // This function fetches the watchlist from the backend
  const fetchWatchlist = async () => {
    try {
      // Replace with the actual API endpoint
      const response = await fetch(`http://localhost:5000/api/watchlist/${user.user_id}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: 1 }), // Replace with dynamic user_id if needed
      });

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.watchlist);
      } else {
        throw new Error('Failed to fetch watchlist');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []); // Empty dependency array ensures this runs once when the component mounts

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
        <h1>Watchlist</h1>
        <ul>
          {watchlist.length === 0 ? (
            <p>No stocks in your watchlist.</p>
          ) : (
            watchlist.map((symbol, index) => (
              <li key={index}>{symbol}</li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Watchlist;
