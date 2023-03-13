import React, { useState } from 'react';

export default function SignIn({ onSignIn, signUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalidLogin, setInvalidLogin] = useState(null);

  const API_URL = '/api/auth';

  const handleUsernameChange = event => {
    setUsername(event.target.value);
    setInvalidLogin(null);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
    setInvalidLogin(null);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    };
    fetch(`${API_URL}/sign-in`, request)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setInvalidLogin(data.error);
        }
        if (!data.token) return;
        onSignIn(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center main">
      <h1 className='blue heading'>SLCTrips</h1>
      <div className='card text-center w-50'>
        <div className="card-header">
          <p className='m-2'>Plan your next trip to Salt Lake City!</p>
        </div>
        <div className="card-body">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3 d-flex flex-column align-items-center">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input type="text" id="username" value={username} onChange={handleUsernameChange} className={`form-control ${invalidLogin ? 'is-invalid' : ''} w-50`}/>
            </div>
            <div className="mb-3 d-flex flex-column align-items-center">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} className={`form-control ${invalidLogin ? 'is-invalid' : ''} w-50`} onClick={invalidLogin ? () => setPassword('') : null}/>
              {invalidLogin && <div className="invalid-feedback">{invalidLogin}</div>}
            </div>
            <button className="btn btn-primary" type="submit">Sign In</button>
          </form>
        </div>
        <div className="card-footer text-muted d-flex flex-column justify-content-between align-items-center">
          <p>No account?</p>
          <button className='mb-3 btn btn-secondary' onClick={() => signUp()}>Sign Up Here</button>
          <p><a href='#' onClick={() => onSignIn('guest')}>Continue as guest</a></p>
        </div>
      </div>
    </div>
  );
}
