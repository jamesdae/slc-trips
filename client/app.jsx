import React, { useState, useEffect } from 'react';
import Home from './pages/home';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData !== null) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div>
      {user
        ? <Home user={user} signOut={() => {
          setUser(null);
          localStorage.clear();
        }} />
        : (!showSignUp
            ? <SignIn onSignIn={userInfo => setUser(userInfo)} signUp={() => setShowSignUp(true)} />
            : <SignUp setShowSignUp={() => setShowSignUp(true)} showLogIn={() => setShowSignUp(false)}/>
          )
      }
    </div>
  );
}
