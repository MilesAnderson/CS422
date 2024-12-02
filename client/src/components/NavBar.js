import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Hamburger from 'hamburger-react'


import profile from "../img/profile.png";
import styles from "../css/NavBar.module.css";

function NavBar() {
  const [inputValue, setInputValue] = useState("GOOG");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/stockDetails/${inputValue}`);
  };

  /* Hamburger Menu */
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
    <nav className={styles.navBar}>
      <div className={ styles.navBarMainContent }>
        <Link className={styles.logo} to="/"></Link>
        <div className={`${styles.navBarMenu} ${isOpen ? styles.open : ""}`}>
          <Link className={styles.navbarItem} to="/" onClick={ closeMenu}>Home</Link>
          <Link className={styles.navbarItem} to="/watchlist" onClick={ closeMenu}>Watchlist</Link>
          <Link className={styles.navbarItem} to="/about" onClick={ closeMenu}>About</Link>

          {!JSON.parse(localStorage.getItem('user')) && <Link className={styles.hidden} to="/authentication">Sign In</Link>}
          {JSON.parse(localStorage.getItem('user')) && <Link className={styles.hidden} onClick={handleLogout}>Logout</Link>}
        </div>
      </div>
      <form className={styles.SearchBarContainer} onSubmit={handleSubmit}>
        <input
          className={styles.SearchBar}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="eg. GOOG"
          />
      </form>
      <div className={styles.profile}>
        <div className={styles.hamburgerContainer}>
          <Hamburger toggled={isOpen} toggle={setIsOpen} /> 
        </div>
        <Link className={styles.navbarItem} to="/profile">
          <img className= {styles.profileIcon} src={ profile } alt="profile" />
        </Link>
        {!JSON.parse(localStorage.getItem('user')) && <Link className={ `${styles.navbarItem} ${styles.smHidden}` } to="/authentication">Sign In</Link>}
        {JSON.parse(localStorage.getItem('user')) && <Link className={ `${styles.navbarItem} ${styles.smHidden}` } onClick={handleLogout}>Logout</Link>}
      </div>
      

    </nav>
    </>
  );
}

export default NavBar;