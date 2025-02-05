import React, { useState } from 'react';
import './login.css';

function Login({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup && password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setError('');
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2><span>{isSignup ? 'Sign Up' : 'Login'}</span></h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" required/>
          
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          {isSignup && (
            <>
              <label>Confirm Password:</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </>
          )}
          
          {error && <p className="error-message">{error}</p>}
          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p onClick={() => setIsSignup(!isSignup)} className="toggle-link">
            <span>
                {isSignup ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
            </span>
        </p>
      </div>
    </div>
  );
}

export default Login;