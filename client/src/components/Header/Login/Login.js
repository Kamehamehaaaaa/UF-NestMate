import React, { useState } from 'react';
import './login.css';

function Login({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSignup) {
      if (password !== confirmPassword) {
        setError("Passwords don't match!");
        return;
      }
  
      try {
        const response = await fetch('http://192.168.0.190:8080/api/register', { // Fixed endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Added header
          },
          body: new URLSearchParams({
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
          }),
        });
  
        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', responseText);
  
        if (response.ok) {
          alert('Registration successful!');
          onClose();
        } else {
          setError(responseText || 'Registration failed');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred during registration');
      }
    }
  };
  
  

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setFirstName('');
    setLastName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2><span>{isSignup ? 'Sign Up' : 'Login'}</span></h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>First Name:</label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required
              />
              
              <label>Last Name:</label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required
              />
            </>
          )}
          
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          {isSignup && (
            <>
              <label>Confirm Password:</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </>
          )}
          
          {error && <p className="error-message">{error}</p>}
          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p onClick={handleToggle} className="toggle-link">
          <span>
            {isSignup ? 'Already have an account? Login' : 'Dont have an account? Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
