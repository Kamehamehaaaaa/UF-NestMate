import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './header.css';
import Login from './Login/Login'

function Header({ scrollToContact }) {
    const [activeLink, setActiveLink] = useState('home');

    useEffect(() => {
        const path = window.location.pathname;
        let activePage = 'home';

        if (path.includes('/about')) {
            activePage = 'about';
        } else if (path.includes('/services')) {
            activePage = 'services';
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
                        <a
                            href="services"
                            className={activeLink === 'services' ? 'active' : ''}
                            onClick={() => setActiveLink('services')}
                        >
                            Services
                        </a>
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
        </header>
    );
}

export default Header;
