import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/userService';

import EmailIcon from "../img/EmailIcon.png";
import UserIcon from "../img/UserIcon.png";
import PasswordIcon from "../img/PasswordIcon.png";

import styles from '../css/Auth.module.css';


const SignUp = ({ toggleForm }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, email, password };
    setLoading(true);
    setError('');
    try {
      const response = await createUser(newUser);
      // Store user information in local storage
      localStorage.setItem('user', JSON.stringify(response));
      navigate('/profile');
    } catch (error) {
      setError(error.message);
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.AuthWrapper}>
      <div className={styles.leftPanel}>
        <h1 className={styles.heading}>Moo-Deng Capital</h1>
        <p className={styles.message}>Welcome!</p>
      </div>
      <div className={styles.userForm}>
        <h1 className={styles.AuthTitle}>Sign Up</h1>
        <form className={styles.formBox} onSubmit={handleSubmit}>
          <div className={styles.AuthFormInput}>
            <img src={UserIcon} alt="User Icon" className={styles.AuthIcon} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="eg. JohnDoe_14"
              required
            />
          </div>
          <div className={styles.AuthFormInput}>
            <img src={EmailIcon} alt="Email Icon" className={styles.AuthIcon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eg. JohnDoe@gmail.com"
              required
            />
          </div>
          <div className={styles.AuthFormInput}>
            <img src={PasswordIcon} alt="Password Icon" className={styles.AuthIcon} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>
          {error && <p className={styles.ErrorMessage}>{error}</p>}
          <div className={styles.ButtonWrapper}>
            <button type="submit" className={styles.SubmitButton} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
          <p onClick={toggleForm} className={styles.AuthInfo}>Returning to Moo-Deng? Sign in</p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;