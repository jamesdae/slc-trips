import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  return (
    <div className="d-flex justify-content-center align-items-center main">
      <div className='card text-center'>
        <div className="card-header">
          User Login
        </div>
        <div className="card-body ">
          <form autoComplete="off" onSubmit={() => onLogin(true)}>
            <div className="mb-3">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input type="text" id="username" value={username} onChange={handleUsernameChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">Login</button>
            </div>
          </form>
        </div>
        <div className="card-footer text-muted">
          <p>No account?</p>
          <button className='btn btn-secondary'>Sign Up Here</button>
        </div>
      </div>
    </div>
  );
}
