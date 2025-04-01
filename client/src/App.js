import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header/header';
import Contactform from './components/ContactForm/contactform';
import SearchResults from './components/SearchResults/searchresults';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Home_pic from './images/home_pic.jpg';
import { BsFillFilterCircleFill } from "react-icons/bs";

function App() {
  const contactRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [housingData, setHousingData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filterType, setFilterType] = useState('apartment');

  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/housing/getAll');
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

  
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

 
  const handleSearch = async () => {

    if (filterType === 'rating') {
      
      try {
        const response = await fetch(
          `http://localhost:8080/api/filter/ratings`
        );
        if (!response.ok) throw new Error('Failed to fetch sorted data');
        const data = await response.json();
        setSearchResults(data || []); 
      } catch (err) {
        console.error('Error fetching sorted data:', err);
      }
    }

    if (filterType === 'apartment' ) {
      
      const filteredResults = housingData.filter((result) =>
        result.name && result.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else if (filterType === 'location') {
     
      try {
        const response = await fetch(
          `http://localhost:8080/apt/housing/sortByDistance?university=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) throw new Error('Failed to fetch sorted data');
        const data = await response.json();
        setSearchResults(data || []); 
      } catch (err) {
        console.error('Error fetching sorted data:', err);
      }
    }
  };

  
  const handleFilterChange = (type) => {
    setFilterType(type);
    setSearchTerm(''); 
    setSearchResults(housingData);
  };

  return (
    <Container fluid className="App">
      <Row>
        <Header scrollToContact={scrollToContact} />
      </Row>

      <Row className='home-background-row'>
        <Col xs={4} className="roommate-finder-col">
          <div className="roommate-finder-text">
            <div className="roommate">Apartment</div>
            <div className="finder">Finder</div>
          </div>

          <Form className="search-form">
            <InputGroup className="rounded-search-bar">
              <Form.Control
                placeholder={
                   filterType === 'apartment' || filterType === 'rating'
                    ? 'Apartment Name'
                    : 'University Name'
                }
                aria-label="Apartment Name"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <div className="search-button-wrapper">
                <Button aria-label="Search" className="search-button" onClick={handleSearch}>
                  <FaSearch className="search-icon" />
                </Button>
                <Dropdown align="end">
                  <Dropdown.Toggle aria-label="Filter" as={Button} variant="light" data-testid="filter-button" className="filter-button no-caret">
                    <BsFillFilterCircleFill />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>Sort By</Dropdown.Header>
                    <Dropdown.Item onClick={() => handleFilterChange('location')}>
                      Location (University)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('rating')}>
                      Rating
                    </Dropdown.Item>
                    
                    
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
        {}
        <SearchResults housingData={searchResults || []} />
      </Row>

      <Row ref={contactRef} className="contact-section">
        <Contactform />
      </Row>
    </Container>
  );
}

export default App;