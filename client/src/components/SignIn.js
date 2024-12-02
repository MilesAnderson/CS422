import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../services/userService';

import EmailIcon from "../img/EmailIcon.png";
import PasswordIcon from "../img/PasswordIcon.png";

import styles from '../css/Auth.module.css';

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
    <div className= { styles.AuthWrapper }>
      <div className={styles.leftPanel}>
        <h1 className={styles.heading}>Moo-Deng Capital</h1>
        <p className={styles.message}>Welcome Back!</p>
      </div>
      <div className={ styles.userForm }>
        <h1 className={styles.AuthTitle }>Sign In</h1>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <div className={ styles.AuthFormInput }>
            <img src={EmailIcon} alt="Email Icon" className={styles.AuthIcon } />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className= {styles.AuthFormInput}>
            <img src={PasswordIcon} alt="Password Icon" className={styles.AuthIcon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {error && <p className={styles.ErrorMessage}>{error}</p>}
          <div className={styles.ButtonWrapper}>
            <button type="submit" className={styles.SubmitButton} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          <p onClick={toggleForm} className={styles.AuthInfo}>New to Moo-Deng? Sign up</p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;