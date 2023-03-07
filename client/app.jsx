import React, { useState } from 'react';
import Home from './pages/home';
import Login from './pages/login-form';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? <Home user={user}/> : <Login onLogin={userInfo => setUser(userInfo)} />}
    </div>
  );
}
