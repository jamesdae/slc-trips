import React from 'react';

export default function Login({ onLogin }) {
  return (
    <div>
      <button onClick={() => onLogin(true)} />
    </div>
  );
}
