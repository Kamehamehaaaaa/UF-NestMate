import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './searchresults.css';

const SearchResults = ({ results }) => {
  return (
    <Row xs={1} md={2} lg={3}>
      {results.length > 0 ? (
        results.map((result, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src={result.image} alt={result.name} />
              <Card.Body>
                <Card.Title>{result.name}</Card.Title>
                <Card.Text>
                  Address: {result.address}<br />
                  Pincode: {result.pincode}<br />
                  Rating: {result.rating}<br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <Col>
          <h4 className='no-results'>No results found</h4>
        </Col>
      )}
    </Row>
  );
};

export default SearchResults;