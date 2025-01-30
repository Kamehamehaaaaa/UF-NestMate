import React from 'react';
import './header.css';

function Header() {
  return (
    <header className="app-header">
      <nav>
        <div className="logo">NestMate</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
