import React, { useState } from 'react';
import './login.css';

function Login({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2><span>{isSignup ? 'Sign Up' : 'Login'}</span></h2>
        <form>
          <label>Email:</label>
          <input type="email" required />
          
          <label>Password:</label>
          <input type="password" required />
          
          {isSignup && (
            <>
              <label>Confirm Password:</label>
              <input type="password" required />
            </>
          )}
          
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