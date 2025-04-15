import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import './matches.css';

const Matches = ({ loggedInUser }) => {
  const [matches, setMatches] = useState([]);

  // Fetch matches on component mount
  useEffect(() => {
    const fetchMatches = async () => {
      if (loggedInUser) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/user/matches?username=${loggedInUser.email}`
          );
          const data = await response.json();
          setMatches(data.matches || []);
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      }
    };
    fetchMatches();
  }, [loggedInUser]);

  return (
    <Row>
      {matches.length > 0 ? (
        matches.map((match) => (
          <Col key={match.username} xs={12} sm={6} md={4} lg={3} className="d-flex">
            <Card className="clickable-card flex-grow-1">
              <Card.Img
                variant="top"
                src="/user-placeholder.jpg" // Fallback image for users
                onError={(e) => {
                  e.target.onerror = null;
                 // e.target.src = '/user-placeholder.jpg';
                }}
              />
              <Card.Body>
                <Card.Title>
                  {match.firstName} {match.lastName}
                </Card.Title>
                <Card.Text>
                  <strong>Major:</strong> {match.preferences.major || 'Not specified'}<br />
                  <strong>Hobbies:</strong> {match.preferences.hobbies || 'Not specified'}<br />
                  <strong>Budget:</strong> $
                  {match.preferences.budget.min || 0} - $
                  {match.preferences.budget.max || 0}<br />
                  <strong>Smoking:</strong> {match.preferences.smoking || 'Not specified'}<br />
                  <strong>Pets:</strong> {match.preferences.pet_preference || 'Not specified'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <Col className="no-results-container">
          <h4 className="no-results">No matches found</h4>
        </Col>
      )}
    </Row>
  );
};

export default Matches;