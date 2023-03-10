import React, { useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

export default function SignUp({ showLogIn }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);

  const API_URL = '/api/auth';

  // const validateEmail = address => {
  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   // eslint-disable-next-line no-console
  //   console.log(re.test(address));
  //   // eslint-disable-next-line no-console
  //   console.log('validator', isEmail(address));
  //   setEmailIsValid(re.test(address));
  // };

  const handleSubmit = event => {
    event.preventDefault();
    // validateEmail(email);
    setEmailIsValid(isEmail(email));
    setPasswordIsValid(isStrongPassword(password));
    if (!isEmail(email) || !isStrongPassword(password)) {
      setEmail('');
      setPassword('');
      return;
    }
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    };
    fetch(`${API_URL}/sign-up`, request)
      .then(res => res.json())
      .then(newUser => {
        // eslint-disable-next-line no-console
        console.log('newUser', newUser);
        setEmail('');
        setUsername('');
        setPassword('');
        showLogIn();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center main">
      <div className='card text-center'>
        <div className="card-header">
          Create Account
        </div>
        <div className="card-body">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="col-form-label">Email:</label>
              <input type="text" id="email" value={email} onChange={event => {
                setEmail(event.target.value);
                setEmailIsValid(true);
              }} className={`form-control ${!emailIsValid ? 'is-invalid' : ''}`} />
              {!emailIsValid && <div className="invalid-feedback">Please enter a valid email address.</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input type="text" id="username" value={username} onChange={event => {
                setUsername(event.target.value);
              }} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input type="password" id="password" value={password} onChange={event => {
                setPassword(event.target.value);
                setPasswordIsValid(true);
              }} className={`form-control ${!passwordIsValid ? 'is-invalid' : ''}`}/>
              {!passwordIsValid && <div className="invalid-feedback">Please enter a valid password.</div>}
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
          </form>
        </div>
        <div className="card-footer text-muted">
          <p>Already have an account?</p>
          <button className='btn btn-secondary' onClick={() => showLogIn()}>Sign In</button>
        </div>
      </div>
    </div>
  );
}
