/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
import Header from './components/Header/header';
import Contactform from './components/ContactForm/contactform';
import SearchResults from './components/SearchResults/searchresults';
import Matches from './components/Matches/matches'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Home_pic from './images/home_pic.jpg';
import { BsFillFilterCircleFill } from 'react-icons/bs';

// Define Home component outside App to prevent re-creation
const Home = ({ searchTerm, filterType, searchResults, loggedInUser, handleSearchInputChange, handleSearch, handleFilterChange, contactRef, inputRef }) => (
  <>
    <Row className="home-background-row">
      <Col xs={4} className="roommate-finder-col">
        <div className="roommate-finder-text">
          <div className="roommate">Apartment</div>
          <div className="finder">Finder</div>
        </div>

        <Form className="search-form">
          <InputGroup className="rounded-search-bar">
            <Form.Control
              placeholder={filterType === 'apartment' || filterType === 'rating' ? 'Apartment Name' : 'University Name'}
              aria-label="Apartment Name"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchInputChange}
              ref={inputRef} // Attach ref for focus management
            />
            <div className="search-button-wrapper">
              <Button aria-label="Search" className="search-button" onClick={handleSearch}>
                <FaSearch className="search-icon" />
              </Button>
              <Dropdown align="end">
                <Dropdown.Toggle
                  aria-label="Filter"
                  as={Button}
                  variant="light"
                  data-testid="filter-button"
                  className="filter-button no-caret"
                >
                  <BsFillFilterCircleFill />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Sort By</Dropdown.Header>
                  <Dropdown.Item onClick={() => handleFilterChange('apartment')}>Apartment Name</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange('location')}>Location (University)</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterChange('rating')}>Rating</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </InputGroup>
        </Form>
      </Col>
      <Col xs={8} className="image-col">
        <img src={Home_pic} alt="Home" className="home-pic" />
      </Col>
    </Row>

    <Row className="card-class-row no-gutters">
      <SearchResults housingData={searchResults || []} loggedInUser={loggedInUser} />
    </Row>

    <Row ref={contactRef} className="contact-section">
      <Contactform />
    </Row>
  </>
);

function App() {
  const contactRef = useRef(null);
  const inputRef = useRef(null); // Ref for the input
  const [searchTerm, setSearchTerm] = useState('');
  const [housingData, setHousingData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filterType, setFilterType] = useState('apartment');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false); // Track focus state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/housing/getAll`);
        if (!response.ok) throw new Error('Failed to fetch housing data');
        const data = await response.json();
        setHousingData(data.properties || []);
        setSearchResults(data.properties || []);
      } catch (err) {
        console.error('Error fetching housing data:', err);
      }
    };
    fetchHousingData();
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollToContact) {
      navigate(location.pathname, { replace: true, state: {} });
  
      setTimeout(() => {
        contactRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location, navigate]);

  // Handle outside clicks to blur input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Refocus input if isInputFocused is true
  useEffect(() => {
    if (isInputFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchTerm, isInputFocused]);

  const scrollToContact = () => {
    navigate('/', { state: { scrollToContact: true } });
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsInputFocused(true);
  
    let filteredResults = [];
  
    if (value.trim() === '') {
      if (filterType === 'rating') {
        handleFilterChange('rating'); // re-fetching sorted data
      } else {
        setSearchResults(housingData);
      }
      return;
    }
  
    if (filterType === 'apartment') {
      filteredResults = searchResults.filter((result) =>
        result.name && result.name.toLowerCase().includes(value.toLowerCase())
      );
    } else if (filterType === 'location') {
      return;
    } else if (filterType === 'rating') {
      filteredResults = searchResults.filter((result) =>
        result.name && result.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  
    setSearchResults(filteredResults);
    console.log('searchTerm:', value);
  };
  

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const handleSearch = async () => {

    if (filterType === 'apartment') {
      const filteredResults = housingData.filter((result) =>
        result.name && result.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else if (filterType === 'location') {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/apt/housing/sortByDistance?university=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) throw new Error('Failed to fetch sorted data');
        const data = await response.json();
        setSearchResults(data || []);
      } catch (err) {
        console.error('Error fetching sorted data:', err);
      }
    }
  };


  const handleFilterChange = async (type) => {
    setFilterType(type);
    setSearchTerm('');
    setIsInputFocused(true);
    if (inputRef.current) inputRef.current.focus();
  
    if (type === 'rating') {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/filter/ratings`);
        if (!response.ok) throw new Error('Failed to fetch sorted data');
        const data = await response.json();
        setSearchResults(data || []);
      } catch (err) {
        console.error('Error fetching sorted data:', err);
      }
    } else {
      
      setSearchResults(housingData);
    }
  };

  const handleSearchButtonClick = () => {
    if (filterType === 'location') {
      const filtered = housingData.filter((result) =>
        result.university &&
        result.university.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };
  

  return (
    <Container fluid className="App">
      <Row>
        <Header scrollToContact={scrollToContact} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
      </Row>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchTerm={searchTerm}
              filterType={filterType}
              searchResults={searchResults}
              loggedInUser={loggedInUser}
              handleSearchInputChange={handleSearchInputChange}
              handleSearch={handleSearch}
              handleFilterChange={handleFilterChange}
              contactRef={contactRef}
              inputRef={inputRef}
            />
          }
        />
        <Route path="/matches" element={<Matches loggedInUser={loggedInUser} />} />
      </Routes>
    </Container>
  );
}

export default App;