import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './header.css';
import Login from './Login/Login'

function Header({ scrollToContact }) {
    const [activeLink, setActiveLink] = useState('home');
    const [showLogin, setShowLogin] = useState(false);

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
                <div className="logo">NestMate</div>
                <ul className="nav-links">
                    {/* <li>
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
                    </li> */}
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
        </header>
    );
}

export default Header;