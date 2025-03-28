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
      name: "John Doe",
      university: "Example University",
      phone: "123-456-7890",
      email: "john.doe@example.com"
    });

    const handleProfileSave = (updatedProfile) => {
        setUserProfile(updatedProfile);
      };
  


    useEffect(() => {
        const path = window.location.pathname;
        let activePage = 'home';

        if (path.includes('/about')) {
            activePage = 'about';
        } else if (path.includes('/login')) {
            activePage = 'login';
        } else if (path.includes('/contact')) {
            activePage = 'contact';
        }

        setActiveLink(activePage);
    }, []);

    const handleContactClick = (e) => {
        e.preventDefault();
        setActiveLink('contact');
        scrollToContact();
    };

    return (
        <header className="app-header">
            <nav>
            <div className="logo-avatar-container">
    <div className="profile-avatar" onClick={() => setShowProfile(true)}>
      {userProfile.name.charAt(0)}
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
                            
                            onClick={handleContactClick}
                        >
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>
            
            {showLogin && <Login onClose={() => setShowLogin(false)} />}

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

