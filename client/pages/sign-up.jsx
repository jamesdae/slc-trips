import React, { useState } from 'react';
import { isEmail, isStrongPassword, isAlphanumeric } from 'validator';

export default function SignUp({ showLogIn }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [usernameIsValid, setUsernameIsValid] = useState(true);

  const API_URL = '/api/auth';

  const setValidity = {
    email: setEmailIsValid,
    password: setPasswordIsValid,
    username: setUsernameIsValid
  };

  const handleSubmit = event => {
    event.preventDefault();
    setEmailIsValid(isEmail(email));
    setPasswordIsValid(isStrongPassword(password));
    setUsernameIsValid(isAlphanumeric(username));
    if (!isEmail(email) || !isStrongPassword(password) || !isAlphanumeric(username)) return;
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    };
    fetch(`${API_URL}/sign-up`, request)
      .then(res => res.json())
      .then(newUser => {
        if (newUser.errors) {
          setValidity[newUser.errors[0].param](false);
          return;
        } else if (newUser.error) {
          console.error(newUser.error);
          setEmailIsValid(false);
          setUsernameIsValid(false);
          return;
        }
        setEmail('');
        setUsername('');
        setPassword('');
        showLogIn();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center main">
      <h1 className='blue heading'>SLCTrips</h1>
      <div className='card text-center w-75'>
        <div className="card-header">
          Create Account
        </div>
        <div className="card-body">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3 d-flex flex-column align-items-center">
              <label htmlFor="email" className="col-form-label">Email:</label>
              <input type="text" id="email" value={email} onChange={event => {
                setEmail(event.target.value);
                setEmailIsValid(true);
              }} className={`form-control ${!emailIsValid ? 'is-invalid' : ''} w-75`} />
              {!emailIsValid && <div className="invalid-feedback">Email already exists, or is not a valid email address.</div>}
            </div>
            <div className="mb-3 d-flex flex-column align-items-center">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input type="text" id="username" value={username} onChange={event => {
                setUsername(event.target.value);
                setUsernameIsValid(true);
              }} className={`form-control ${!usernameIsValid ? 'is-invalid' : ''} w-75`} />
              {!usernameIsValid && <div className="invalid-feedback">Username already exists, or is not alphanumeric.</div>}
            </div>
            <div className="mb-3 d-flex flex-column align-items-center">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input type="password" id="password" value={password} onClick={!passwordIsValid ? () => setPassword('') : null} onChange={event => {
                setPassword(event.target.value);
                setPasswordIsValid(true);
              }} className={`form-control ${!passwordIsValid ? 'is-invalid' : ''} w-75`}/>
              {!passwordIsValid && <div className="invalid-feedback">Password must be at least 8 characters, one symbol, and one number.</div>}
            </div>
            <button className="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>
        <div className="card-footer text-muted">
          <p>Already have an account?</p>
          <button className='mb-3 btn btn-secondary' onClick={() => showLogIn()}>Sign In</button>
        </div>
      </div>
    </div>
  );
}
