/*
Moo-Deng
Authors:
Liam Bouffard
Andrew Chan

Date Created: 23 Oct 2024

Description:
This file, `profile.js`, is a React component that displays the user's profile and portfolio overview. It fetches portfolio and financial data, handles user logout, and renders a detailed view of the user's stocks and financial summary. This file is apart of the profile system. It handles the frontend for a users profile.
*/

import React, { useEffect, useState, useRef } from 'react'; // Core React functionalities
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import NavBar from '../components/NavBar'; // Navigation bar component
import StockRow from '../components/StockRow'; // Component to display individual stock rows

import styles from "../css/Profile.module.css"; // Component-specific CSS styles

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api'; // Use environment variable or fallback

/**
 * Component: Profile
 * Displays the user's profile, portfolio, and financial overview.
 * Handles user authentication, data fetching, and user logout functionality.
 */
const Profile = () => {
  const navigate = useNavigate(); // Navigation hook for redirection
  const [portfolio, setPortfolio] = useState([]); // State for storing the user's portfolio
  const [totalWorth, setTotalWorth] = useState(0); // Total net worth (liquid + assets)
  const [liquidMoney, setLiquidMoney] = useState(0); // Liquid money (balance)
  const [assetMoney, setAssetMoney] = useState(0); // Asset value (stocks)
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(''); // Error state for handling errors

  const userRef = useRef(JSON.parse(localStorage.getItem('user'))); // Get user data from local storage
  const user = userRef.current; // Current logged-in user

  // Redirect to authentication if the user is not logged in
  useEffect(() => {
    if (!user || !user.user_id) {
      navigate('/authentication'); // Redirect to authentication page
    }
  }, [navigate, user]);

  // Fetch portfolio and financial data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(`${API_URL}/getPortfolioStocks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        if (response.ok) {
          const data = await response.json();
          setPortfolio(data); // Update portfolio state

          // Fetch financial details
          fetchFinancialData(user.user_id);
        } else {
          throw new Error("Failed to fetch portfolio data.");
        }
      } catch (err) {
        console.error(err.message);
        setError('Failed to load your portfolio. Please try again later.');
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    const fetchFinancialData = async (userId) => {
      try {
        const response = await fetch(`${API_URL}/calcWorth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setTotalWorth(data.net_worth || 0); // Update total net worth
          setLiquidMoney(data.balance || 0); // Update liquid money
          setAssetMoney(data.assetWorth || 0); // Update asset value
        } else {
          throw new Error("Failed to fetch financial data.");
        }
      } catch (err) {
        console.error(err.message);
        setError('Failed to calculate financial data.');
      }
    };

    if (user && user.user_id) {
      fetchPortfolioData();
    }
  }, [user]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from local storage
    navigate('/'); // Redirect to the home page
  };

  if (loading) {
    // Display loading message while fetching data
    return <div>Loading your portfolio...</div>;
  }

  if (!user) {
    return null; // Fallback case if user data is not available
  }

  return (
    <div className={styles.wrapper}>
      <NavBar /> {/* Render the navigation bar */}
      <div className={styles.ProfileWrapper}>
        {error ? (
          <div className="ErrorMessage">{error}</div> // Display error message
        ) : (
          <>
            <div className={styles.overview}>
              <div className={styles.ProfileCredentials}>
                <h1 className={styles.Heading}>Profile Overview</h1>
                <p className={styles.UserInfo}><strong>Username: </strong></p>
                <p className={styles.Username}>{user.username}</p>
                <div className={styles.ButtonWrapper}>
                  <button className={styles.SubmitButton} onClick={handleLogout}>Logout</button>
                </div>
              </div>
              
              {/* Financial Summary */}
              <div className={styles.FinancialSummary}>
                <h3 className={styles.Heading}>Financial Overview:</h3>
                <div className={styles.InfoWrapper}>
                  <div className={styles.LiquidMoney}>
                    <p className={styles.FinanceInfo}><strong>Available Funds</strong></p>
                    <p>${liquidMoney.toFixed(2)}</p>
                  </div>
                  <div className={styles.AssetMoney}>
                    <p className={styles.FinanceInfo}><strong>Asset Value</strong></p>
                    <p>${assetMoney.toFixed(2)}</p>
                  </div>
                  <div className={styles.TotalMoney}>
                    <p className={styles.FinanceInfo}><strong>Net Worth</strong></p>
                    <p>${totalWorth.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.PortfolioWrapper}>
              <div className={styles.Portfolio}>
                <h2 className={styles.PortfolioHeading}>Your Portfolio</h2>
                <div className={styles.StockTableWrapper}>
                  {portfolio.length > 0 ? (
                    <table className={styles.StockTable}>
                      <thead>
                        <tr>
                          <th className={styles.Symbol}>Symbol</th>
                          <th className={styles.CompanyName}>Company Name</th>
                          <th className={styles.Quantity}>Quantity</th>
                          <th className={styles.CurrPrice}>Current Price</th>
                          <th className={styles.TotalValue}>Total Value</th>
                          <th className={styles.Actions}>Actions</th>
                          <th className={styles.SellBtn}>Sell Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.map((stock, index) => (
                          <StockRow key={index} stock={stock} />
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className={styles.Empty}>Your portfolio is empty or could not be loaded.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile; // Export the component
