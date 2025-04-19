/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Modal, Tab, Tabs } from 'react-bootstrap';
import './matches.css';

const Matches = ({ loggedInUser }) => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (loggedInUser) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/user/matches?username=${loggedInUser.email}`
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

  const handleCardClick = (match) => {
    setSelectedMatch(match);
  };

  const parseHobbies = (hobbies) => {
    if (!hobbies) return [];
    return hobbies.split(',').map(h => h.trim()).filter(Boolean);
  };

  return (
    <div className="matches-container">
      <Row>
        {matches.length > 0 ? (
          matches.map((match) => (
            <Col key={match.username} xs={12} sm={6} md={4} lg={3} className="d-flex">
              <Card 
                className="clickable-card flex-grow-1"
                onClick={() => handleCardClick(match)}
              >
                <Card.Img
                  variant="top"
                  src={`https://res.cloudinary.com/dbldemxes/image/upload/v1744844160/${match.username?.includes('@') ? match.username.split('@')[0] : match.username}.png`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/dbldemxes/image/upload/v1744872550/empty.png';
                  }}
                />
                <Card.Body>
                  <Card.Title>
                    {match.firstName} {match.lastName}
                  </Card.Title>
                  <Card.Text>
                    <strong>Major:</strong> {match.preferences?.major || 'N/A'}<br />
                    <strong>Budget:</strong> ${match.preferences?.budget?.min || 0} - ${match.preferences?.budget?.max || 0}
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
      <Modal
        show={!!selectedMatch}
        onHide={() => setSelectedMatch(null)}
        size="lg"
        className="housing-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedMatch?.firstName} {selectedMatch?.lastName}'s Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-image-container">
            <img
              src={`https://res.cloudinary.com/dbldemxes/image/upload/v1744844160/${selectedMatch?.username?.includes('@') ? selectedMatch.username.split('@')[0] : selectedMatch?.username}.png`}
              alt={selectedMatch?.firstName}
              className="modal-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://res.cloudinary.com/dbldemxes/image/upload/v1744872550/empty.png';
              }}
            />
          </div>

          <Tabs defaultActiveKey="basic" className="mb-3">
            <Tab eventKey="basic" title="Basic Info">
              <div className="amenities-section">
                <h5>Personal Details</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Name:</strong> {selectedMatch?.firstName} { selectedMatch?.lastName}</p>
                    
                  </Col>
                  <Col md={6}>
                    <p><strong>Major:</strong> {selectedMatch?.preferences?.major || 'N/A'}</p>
                    
                  </Col>
                </Row>
              </div>
            </Tab>

            <Tab eventKey="preferences" title="Preferences">
              <div className="amenities-section">
                <h5>Living Preferences</h5>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Budget Range:</strong> $
                      {selectedMatch?.preferences?.budget?.min || 0} - $
                      {selectedMatch?.preferences?.budget?.max || 0}
                    </p>
                    <p>
                      <strong>Smoking/Drinking:</strong> {selectedMatch?.preferences?.smoking || 'N/A'}
                    </p>
                    <p>
                      <strong>Sleeping Habit:</strong> {selectedMatch?.preferences?.sleeping_habit || 'N/A'}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Cleanliness Level:</strong> {selectedMatch?.preferences?.cleanliness || 'N/A'}/5
                    </p>
                    <p>
                      <strong>Gender Preference:</strong> {selectedMatch?.preferences?.gender_preference || 'N/A'}
                    </p>
                    <p>
                      <strong>Pet Preference:</strong> {selectedMatch?.preferences?.pet_preference || 'N/A'}
                    </p>
                  </Col>
                </Row>
              </div>
             
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Matches;