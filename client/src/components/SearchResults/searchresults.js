import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './searchresults.css';

const SearchResults = ({ results }) => {
  return (
    <Row xs={1} md={2} lg={3} >
      {results.map((result, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Img variant="top" src={result.image} />
            <Card.Body>
              <Card.Title>{result.name}</Card.Title>
              <Card.Text>
                University: {result.university}<br />
                Year: {result.year}<br />
                Major: {result.major}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SearchResults;
