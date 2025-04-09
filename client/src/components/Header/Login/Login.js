import React, { useState } from 'react';
import './login.css';
import SHA256 from 'crypto-js/sha256'; 
function Login({ onClose, onLoginSuccess }) {
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
        const response = await fetch('http://localhost:8080/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
          }),
        });

        const responseData = await response.json();
        if (response.ok) {
          alert('Registration successful! Please log in.');
          setIsSignup(false);
        } else {
          setError(responseData.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred during registration');
      }
    } else {
      try {
        const response = await fetch('http://localhost:8080/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const responseData = await response.json();
        if (response.ok) {
          
          
          // Fetch user details from backend using username
          const userResponse = await fetch(`http://localhost:8080/api/user/getUser?username=${username}`);
          const userData = await userResponse.json();
          
          if (userResponse.ok) {
         
            onLoginSuccess({
              email: userData.username || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
            });
            onClose(); 
          } else {
            setError('Failed to fetch user details');
          }
        } else {
          setError(responseData.error || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('An error occurred during login');
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
        <h2><span className="animation ">{isSignup ? 'Sign Up' : 'Login'}</span></h2>
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
          
          <label>Email:</label>
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
          <button className='button-signup ' type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p onClick={handleToggle} className="toggle-link">
          <span className="animation ">
            {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
