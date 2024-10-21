import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../services/userService';

import EmailIcon from "../img/EmailIcon.png";
import PasswordIcon from "../img/PasswordIcon.png";

const SignIn = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    setLoading(true);
    setError('');
    try {
      const response = await authenticateUser(credentials);
      // Store user information in local storage
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/profile');
    } catch (error) {
      setError(error.message);
      console.error('Error authenticating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AuthWrapper">
      <div className="userForm">
        <h1 className="AuthTitle">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="AuthFormInput">
            <img src={EmailIcon} alt="Email Icon" className="AuthIcon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="AuthFormInput">
            <img src={PasswordIcon} alt="Password Icon" className="AuthIcon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="ErrorMessage">{error}</p>}
          <div className="ButtonWrapper">
            <button type="submit" className="SubmitButton" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          <p onClick={toggleForm} className="AuthInfo">Don't have an account? Sign up</p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
