import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import './header.css';
import Login from './Login/Login';
import ProfilePage from '../ProfilePage/ProfilePage';

function Header({ scrollToContact, onLoginSuccess , onLogout}) {
  const [activeLink, setActiveLink] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  const handleLogoutClick = () => {
    setUserProfile({});
    onLogout();
    setShowProfile(false); 
  };

  const handleShowProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/favorites?username=${userProfile.email}`);
      const data = await response.json();
      setUserProfile((prev) => ({
        ...prev,
        favorites: data.favorites || [],
      }));
      setShowProfile(true);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const handleProfileSave = (updatedProfile) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save profile');
        return response.json();
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
      });
  };

  const handleLoginSuccess = (profileData) => {
    setUserProfile(profileData);
    onLoginSuccess(profileData);
  };

  useEffect(() => {
    document.addEventListener('mousemove', eyeball);
    return () => document.removeEventListener('mousemove', eyeball);
  }, []);

  const eyeball = (event) => {
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach((eye) => {
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      const deltaX = event.clientX - eyeX;
      const deltaY = event.clientY - eyeY;
      const angle = Math.atan2(deltaY, deltaX);
      const maxMove = 8;
      const pupilX = Math.cos(angle) * maxMove;
      const pupilY = Math.sin(angle) * maxMove;
      eye.style.setProperty('--pupil-x', `${pupilX}px`);
      eye.style.setProperty('--pupil-y', `${pupilY}px`);
    });
  };

  return (
    <header className="app-header">
      <nav>
        <div className="logo-avatar-container">
        <div
  className="profile-avatar"
  onClick={() => {
    if (userProfile && userProfile.firstName) {
      handleShowProfile();
    } else {
      setShowLogin(true);
    }
  }}
>
  {userProfile?.firstName ? userProfile.firstName.charAt(0) : "?"}
</div>

          <div className="logo-container">
            <div className="logo">NestMate</div>
            <div className="eyes-container">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
          </div>
        </div>
        <ul className="nav-links">
  <li>
    <Link
      to="/"
      className={activeLink === 'home' ? 'active' : ''}
      onClick={() => setActiveLink('home')}
    >
      Home
    </Link>
  </li>
  <li>
    <Link
      to="/matches"
      className={activeLink === 'matches' ? 'active' : ''}
      onClick={() => setActiveLink('matches')}
    >
      Match
    </Link>
  </li>
  <li>
    <a
      href="#contact"
      className={activeLink === 'contact' ? 'active' : ''}
      onClick={(e) => {
        e.preventDefault();
        scrollToContact();
        setActiveLink('contact');
      }}
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
          onLogout={handleLogoutClick}
        />
      )}
    </header>
  );
}

export default Header;