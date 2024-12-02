import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import StockRow from '../components/StockRow';

import styles from "../css/Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [totalWorth, setTotalWorth] = useState(0); // Total money = liquid + asset
  const [liquidMoney, setLiquidMoney] = useState(0); // Liquid money (balance)
  const [assetMoney, setAssetMoney] = useState(0); // Asset money (stocks)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const user = userRef.current;

  // Redirect to authentication if user is not logged in
  useEffect(() => {
    if (!user || !user.user_id) {
      navigate('/authentication');
    }
  }, [navigate, user]);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getPortfolioStocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);

          // Fetch total worth, liquid money, and asset money
          fetchFinancialData(user.user_id);
        } else {
          throw new Error("Failed to fetch portfolio data.");
        }
      } catch (err) {
        console.error(err.message);
        setError('Failed to load your portfolio. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFinancialData = async (userId) => {
      try {
        const response = await fetch('http://localhost:5000/api/calcWorth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setTotalWorth(data.net_worth || 0); // Total money
          setLiquidMoney(data.balance || 0); // Liquid money
          setAssetMoney(data.assetWorth || 0); // Asset money
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return <div>Loading your portfolio...</div>;
  }

  if (!user) {
    return null; // This will redirect to authentication earlier, so this case may not occur
  }

  return (
    <div className={styles.wrapper}>
      <NavBar />
      <div className={styles.ProfileWrapper}>
        {error ? (
          <div className="ErrorMessage">{error}</div>
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
              
              {/* Display financial breakdown */}
              <div className={styles.FinancialSummary}>
                <h3 className={styles.Heading}>Financial Overview:</h3>
                <div className={styles.InfoWrapper}>
                  <div className={styles.LiquidMoney}>
                    <p className={styles.FinanceInfo}><strong>Liquid Money</strong></p>
                    <p>${liquidMoney.toFixed(2)}</p>
                  </div>

                  <div className={styles.AssetMoney}>
                    <p className={styles.FinanceInfo}><strong>Asset Money</strong></p>
                    <p>${assetMoney.toFixed(2)}</p>
                  </div>

                  <div className={styles.TotalMoney}>
                    <p className={styles.FinanceInfo}><strong>Total Money</strong></p>
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

export default Profile;