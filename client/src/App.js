import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header/header';
import Contactform from './components/ContactForm/contactform';
import SearchResults from './components/SearchResults/searchresults';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Home_pic from './images/home_pic.jpg';

function App() {
  const contactRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [housingData, setHousingData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

 
  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        const response = await fetch('http://localhost:8080/pull');
        if (!response.ok) throw new Error('Failed to fetch housing data');
        const data = await response.json();
        setHousingData(data.properties);
        setSearchResults(data.properties); 
      } catch (err) {
        console.error('Error fetching housing data:', err);
      }
    };
    fetchHousingData();
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredResults = housingData.filter(result =>
      result.name.toLowerCase().includes(value)
    );

    setSearchResults(filteredResults);
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
                placeholder="Apartment Name"
                aria-label="Apartment Name"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="search-button-wrapper">
                <Button className="search-button">
                  <FaSearch className="search-icon" />
                </Button>
              </div>
            </InputGroup>
          </Form>
        </Col>
        <Col xs={8} className="image-col">
          <img src={Home_pic} alt="Home" className="home-pic" />
        </Col>
      </Row>
      <Row>
        <SearchResults housingData={searchResults} />
      </Row>
      <Row ref={contactRef} className="contact-section">
        <Contactform />
      </Row>
    </Container>
  );
}

export default App;
