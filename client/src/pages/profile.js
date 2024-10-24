import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Profile = () => {
  const navigate = useNavigate();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const userRef = useRef(JSON.parse(localStorage.getItem('user')));
  const user = userRef.current;

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      if (user) {
        console.log("User found");
      } else {
        console.log('No user found, navigating to authentication');
        navigate('/authentication');
      }
    };

    fetchFavoriteBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  console.log('Favorite books:', favoriteBooks);

  return (
    <>
      <NavBar />
      <div className="ProfileWrapper">
        <h1>Welcome, {user.username}!</h1>
        <button className="SubmitButton" onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
