import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Contactform from './components/ContactForm/contactform';
import SearchResults from './components/SearchResults/searchresults';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function App() {
  const contactRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Default dummy results  for the cards
  const defaultResults = [
    { name: 'John Doe', university: 'University of Florida', year: '2nd', major: 'Computer Science', image: 'https://via.placeholder.com/150' },
    { name: 'Jane Smith', university: 'Florida State University', year: '3rd', major: 'Biology', image: 'https://via.placeholder.com/150' },
    { name: 'Alice Johnson', university: 'University of Miami', year: '1st', major: 'Psychology', image: 'https://via.placeholder.com/150' },
   
  ];

  useEffect(() => {
    setSearchResults(defaultResults);
  }, []);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter results based on search term
    const filteredResults = defaultResults.filter(result => 
      result.university.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="roommate">Roommate</div>
            <div className="finder">Finder</div>
          </div>

          <Form className="search-form" onSubmit={handleSearch}>
            <InputGroup className="rounded-search-bar">
              <Form.Control
                placeholder="University Name"
                aria-label="University Name"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
