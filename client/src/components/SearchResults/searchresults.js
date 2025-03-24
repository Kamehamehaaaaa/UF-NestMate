import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import './searchresults.css';
import Centric from '../../images/centric.png';
import Stone from '../../images/stoneridge.png';
import BL from '../../images/blvd.png';
import Gains from '../../images/gainesvilleplace.png';
import Hide from '../../images/hideaway.png';
import Sweet from '../../images/sweetwater.png';


const SearchResults = () => {
  const [show, setShow] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [housingData, setHousingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const housingImages = {
    'Stoneridge Apartments': Stone,
    'BLVD': BL,
    'Centric': Centric,
    'Gainesville Place': Gains,
    'Hideaway': Hide,
    'Sweetwater': Sweet,
  };
  const imageArray = Object.values(housingImages);

  

  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/housing/get');
        if (!response.ok) {
          throw new Error('Failed to fetch housing data');
        }
        const data = await response.json();
        console.log('API response:', data);
        const housingArray = Object.values(data);
        console.log('Housing array:', housingArray);
        setHousingData(housingArray);
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
          housingData.map((housing,index) => (
            <Col key={housing.ID} xs={12} sm={6} md={4} lg={3} className="d-flex">
              <Card className="clickable-card flex-grow-1" onClick={() => handleShow(housing)}>
              <Card.Img variant="top" src={imageArray[index % imageArray.length]} />
                <Card.Body>
                  <Card.Title>{housing.Name}</Card.Title>
                  <Card.Text>
                    <strong>Location:</strong> {housing.Location}<br />
                    <strong>Vacancy:</strong> {housing.Vacancy}
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
          <Modal.Title>{selectedHousing?.Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>ID:</strong> {selectedHousing?.ID}</p>
          <p><strong>Name:</strong> {selectedHousing?.Name}</p>
          <p><strong>Location:</strong> {selectedHousing?.Location}</p>
          <p><strong>Vacancy:</strong> {selectedHousing?.Vacancy}</p>

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
