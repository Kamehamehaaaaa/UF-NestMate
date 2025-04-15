// matches.js
import React, { useEffect, useState } from 'react';
import Header from './components/Header/header';
import './matches.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const username = localStorage.getItem('username');  // Assuming username is stored in localStorage
        const response = await fetch(`http://localhost:8080/api/matches/${username}`);
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();
        setMatches(data);  // Set the fetched user matches
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <Container fluid className="App">
      <Row>
        <Header />
      </Row>

      <Row className="matches-header">
        <Col>
          <h1>Your Roommate Matches</h1>
        </Col>
      </Row>

      <Row className="matches-row">
        {matches.map((match, index) => (
          <Col xs={12} md={6} lg={4} key={index} className="match-col">
            <Card className="match-card">
              <Card.Body>
                <Card.Title>{match.username}</Card.Title>
                <Card.Text>
                  <strong>Budget:</strong> ${match.budget.min} - ${match.budget.max} <br />
                  <strong>Major:</strong> {match.major} <br />
                  <strong>Hobbies:</strong> {match.hobbies} <br />
                  <strong>Food Preference:</strong> {match.food} <br />
                  <strong>Sleeping Habit:</strong> {match.sleeping_habit} <br />
                  <strong>Smoking:</strong> {match.smoking} <br />
                  <strong>Cleanliness:</strong> {match.cleanliness} <br />
                  <strong>Gender Preference:</strong> {match.gender_preference} <br />
                  <strong>Pet Preference:</strong> {match.pet_preference} <br />
                </Card.Text>
                <Button variant="primary">Contact</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Matches;
