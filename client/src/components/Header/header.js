import React, { useState } from 'react';
import './header.css';
import Login from './Login'

function Header() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="app-header">
      <nav>
        <div className="logo">NestMate</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><button onClick={() => setShowLogin(true)} className="login-btn">Login</button></li>
        </ul>
      </nav>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </header>
  );
}

export default Header;
