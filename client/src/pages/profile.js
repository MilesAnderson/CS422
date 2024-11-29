import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import StockRow from '../components/StockRow';

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
    <>
      <NavBar />
      <div className="ProfileWrapper">
        {error ? (
          <div className="ErrorMessage">{error}</div>
        ) : (
          <>
            <h1>Welcome, {user.username}!</h1>
            <button className="SubmitButton" onClick={handleLogout}>Logout</button>

            <h2>Your Portfolio:</h2>

            {/* Display financial breakdown */}
            <div className="FinancialSummary">
              <h3>Financial Overview:</h3>
              <p>Liquid Money: ${liquidMoney.toFixed(2)}</p>
              <p>Asset Money: ${assetMoney.toFixed(2)}</p>
              <p>Total Money: ${totalWorth.toFixed(2)}</p>
            </div>

            {portfolio.length > 0 ? (
              <>
                <ul className="PortfolioList">
                  {portfolio.map((stock, index) => (
                    <StockRow key={index} stock={stock} />
                  ))}
                </ul>
              </>
            ) : (
              <p>Your portfolio is empty or could not be loaded.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
