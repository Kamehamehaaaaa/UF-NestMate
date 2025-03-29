import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './header.css';
import Login from './Login/Login'
import ProfilePage from '../ProfilePage/ProfilePage';


function Header({ scrollToContact }) {
    const [activeLink, setActiveLink] = useState('home');
    const [showLogin, setShowLogin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userProfile, setUserProfile] = useState({
      firstName: "John Doe",
      lastName: "Example University",
      email: "john.doe@example.com"
    });
  
    const handleProfileSave = (updatedProfile) => {
      setUserProfile(updatedProfile);

      
  fetch('http://localhost:8080/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProfile),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to save profile');
      }
      return response.json();
    })
    
    .catch((error) => {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    });


    };
  
    const handleLoginSuccess = (profileData) => {
      setUserProfile(profileData);
      console.log(profileData)
    };
  
    return (
      <header className="app-header">
        <nav>
          <div className="logo-avatar-container">
            <div className="profile-avatar" onClick={() => setShowProfile(true)}>
            {userProfile.firstName ? userProfile.firstName.charAt(0) : "?"}
            </div>
            <div className="logo">NestMate</div>
          </div>
  
          <ul className="nav-links">
            <li>
              <a
                href="home"
                className={activeLink === 'home' ? 'active' : ''}
                onClick={() => setActiveLink('home')}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="about"
                className={activeLink === 'about' ? 'active' : ''}
                onClick={() => setActiveLink('about')}
              >
                About
              </a>
            </li> 
            <li>
              <button onClick={() => setShowLogin(true)} className="login-btn">Login</button>
            </li>
            <li>
              <a
                href="contact"
                className={activeLink === 'contact' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToContact(); }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
  
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}
  
        {showProfile && (
          <ProfilePage 
            profile={userProfile} 
            onClose={() => setShowProfile(false)}
            onSave={handleProfileSave}
          />
        )}
      </header>
    );
  }
  
  export default Header;
  