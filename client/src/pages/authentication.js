import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';

function Authentication() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div>
      <NavBar />
      {isSignIn ? <SignIn toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />}
    </div>
  );
}

export default Authentication;