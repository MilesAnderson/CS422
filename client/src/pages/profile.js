// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../components/NavBar';

// const Profile = () => {
//   const navigate = useNavigate();
//   const [favoriteBooks, setFavoriteBooks] = useState([]);
//   const userRef = useRef(JSON.parse(localStorage.getItem('user')));
//   const user = userRef.current;

//   useEffect(() => {
//     const fetchFavoriteBooks = async () => {
//       if (user) {
//         console.log("User found");
//       } else {
//         console.log('No user found, navigating to authentication');
//         navigate('/authentication');
//       }
//     };

//     fetchFavoriteBooks();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   if (!user) {
//     return null;
//   }

//   console.log('Favorite books:', favoriteBooks);

//   return (
//     <>
//       <NavBar />
//       <div className="ProfileWrapper">
//         <h1>Welcome, {user.username}!</h1>
//         <button className="SubmitButton" onClick={handleLogout}>Logout</button>
//       </div>
//     </>
//   );
// };

// export default Profile;

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Profile = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]); // State to store portfolio data
  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const user = userRef.current || {};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchPortfolioData = async () => {
          if (!user.user_id) {
              navigate('/authentication');
              return;
          }
          try {
              const response = await fetch('http://localhost:5000/api/getPortfolioStocks', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user_id: user.user_id }),
              });
  
              if (response.ok) {
                  const data = await response.json();
                  setPortfolio(data);
              } else {
                  console.error("Failed to fetch portfolio:", await response.json());
              }
          } catch (err) {
              console.error("Error while fetching portfolio data:", err.message);
          } finally {
              setLoading(false);
          }
      };
  
      fetchPortfolioData();
  }, [user, navigate]);
  
  if (loading) {
      return <div>Loading your portfolio...</div>;
  }
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="ProfileWrapper">
        <h1>Welcome, {user.username}!</h1>
        <button className="SubmitButton" onClick={handleLogout}>Logout</button>

        <h2>Your Portfolio:</h2>
        {portfolio.length > 0 ? (
          <ul>
            {portfolio.map((stock, index) => (
              <li key={index}>
                {stock.symbol}: {stock.quantity} shares
              </li>
            ))}
          </ul>
        ) : (
          <p>Your portfolio is empty or could not be loaded.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
