import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header/header';
import Contactform from './components/ContactForm/contactform';
import SearchResults from './components/SearchResults/searchresults';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Centric from './images/centric.png';
import Stone from './images/stoneridge.png';
import BL from './images/blvd.png';
import Gains from './images/gainesvilleplace.png';
import Hide from './images/hideaway.png';
import Sweet from './images/sweetwater.png';

function App() {
  const contactRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Default dummy results  for the cards
  const defaultResults = [
    { name: 'Stoneridge Apartments', address: '3800 SW 34th St', pincode: '32608', image: Stone, rating: '4.6/5' },
    { name: 'BLVD', address: '3800 SW 34th St', pincode: '32608', image: BL, rating: '4.4/5' },
    { name: 'Centric', address: '3800 SW 34th St', pincode: '32608', image: Centric, rating: '4.3/5' },
    { name: 'Gainesville Place', address: '3800 SW 34th St', pincode: '32607', image: Gains, rating: '4.7/5' },
    { name: 'Hideaway', address: '3800 SW 34th St', pincode: '32609', image: Hide, rating: '4.5/5' },
    { name: 'Sweetwater', address: '2800 SW Williston Rd', pincode: '32610', image: Sweet, rating: '4.8/5' }
  ];

  useEffect(() => {
    setSearchResults(defaultResults);
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtering based on the name (case insensitive, starts with search term)
    const filteredResults = defaultResults.filter(result =>
      result.name.toLowerCase().startsWith(value)
    );

    setSearchResults(filteredResults);
  };

  return (
    <Container fluid className="App">
      <Row>
        <Header scrollToContact={scrollToContact} />
      </Row>

      <Row className='home-background-row'>
        <Col className="roommate-finder-col">
          <div className="roommate-finder-text">
            <div className="roommate">Apartment</div>
            <div className="finder">Finder</div>
          </div>

          <Form className="search-form" onSubmit={handleSearch}>
            <InputGroup className="rounded-search-bar">
              <Form.Control
                placeholder="Apartment Name"
                aria-label="Apartment Name"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="search-button-wrapper">
                <Button type="submit" className="search-button">
                  <FaSearch className="search-icon" />
                </Button>
              </div>
            </InputGroup>
          </Form>
        </Col>
        <Col>
        </Col>
      </Row>
      <Row>
        <SearchResults results={searchResults} />
      </Row>

      <Row ref={contactRef} className="contact-section">
        <Contactform />
      </Row>
    </Container>
  );
}

export default App;