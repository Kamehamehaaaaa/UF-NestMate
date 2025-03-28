import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import './searchresults.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SearchResults = () => {
  const [show, setShow] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [housingData, setHousingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        const response = await fetch('http://localhost:8080/pull');
        if (!response.ok) {
          throw new Error('Failed to fetch housing data');
        }
        const data = await response.json();
        console.log('API response:', data);
        setHousingData(data.properties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHousingData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (housing) => {
    setSelectedHousing(housing);
    setComments(housing.comments || []);
    setShow(true);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = `User: ${comment}`;
      const newComments = [...comments, newComment];
      setComments(newComments);
      setComment('');
    }
  };

  if (loading) return <div>Loading housing options...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Row>
        {housingData.length > 0 ? (
          housingData.map((housing) => (
            <Col key={housing.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
              <Card className="clickable-card flex-grow-1" onClick={() => handleShow(housing)}>
                <Card.Img 
                  variant="top" 
                  src={housing.image} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback-image.jpg';
                  }}
                />
                <Card.Body>
                  <Card.Title>{housing.name}</Card.Title>
                  <Card.Text>
                    <strong>Location:</strong> {housing.address}<br />
                    <strong>Vacancy:</strong> {housing.vacancy}<br />
                    <strong>Rating:</strong>
                    {Array(5).fill(0).map((_, i) => (
                      <i
                        key={i}
                        className={`bi bi-star${i < Math.floor(housing.rating) ? '-fill' : ''}`}
                      />
                    ))}
                    <span className="ms-1">({housing.comments?.length || 0} reviews)</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="no-results-container">
            <h4 className="no-results">No housing options found</h4>
          </Col>
        )}
      </Row>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        className="housing-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedHousing?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHousing?.image && (
            <div className="modal-image-container">
              <img 
                src={selectedHousing.image}
                alt={selectedHousing.name}
                className="modal-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback-image.jpg';
                }}
              />
            </div>
          )}
          {selectedHousing?.description && (
            //this is place holder for nlp generated descriptipn
            <p className="property-description">{selectedHousing.description}</p>
          )}
          <div className="property-details">
            <p><strong>ID:</strong> {selectedHousing?.id}</p>
            <p><strong>Name:</strong> {selectedHousing?.name}</p>
            <p><strong>Location:</strong> {selectedHousing?.address}</p>
            <p><strong>Vacancy:</strong> {selectedHousing?.vacancy}</p>
          </div>
          <div className="comments-section">
            <h5>Comments:</h5>
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <div key={idx} className="comment">
                  <p>{comment}</p>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to leave one!</p>
            )}
            <Form onSubmit={handleCommentSubmit}>
              <Form.Group controlId="commentForm">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comment..."
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                Submit Comment
              </Button>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SearchResults;
