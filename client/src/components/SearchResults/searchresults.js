import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import './searchresults.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaMapMarkerAlt } from 'react-icons/fa';


const SearchResults = ({housingData}) => {
  console.log(housingData)
  const [show, setShow] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  
 
  const [showCommentForm, setShowCommentForm] = useState(false);

  

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
      
      
      fetch('http://localhost:8080/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId: selectedHousing.id,
          comment: newComment
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save comment');
        }
        return response.json();
      })
      .then(data => {
        
        setComments([...comments, newComment]);
        setComment('');
        setShowCommentForm(false);
      })
      .catch(error => {
        console.error('Error:', error);
       
      });
    }
  };
  


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
      <p className="property-description">{selectedHousing.description}</p>
    )}
    <div className="property-details">
      
      <p><strong>Name:</strong> {selectedHousing?.name}</p>
      <p>
  <strong>Location: </strong> {selectedHousing?.address +" " }
  <FaMapMarkerAlt 
    className=" cursor-pointer"
    onClick={() => openGoogleMaps(selectedHousing?.address)}
    
  />
</p>

      <p><strong>Vacancy:</strong> {selectedHousing?.vacancy}</p>
    </div>
    <div className="comments-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Comments ({comments.length})</h5>
        <Button  className="custom-btn"
          variant="outline-primary" 
          size="sm"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          {showCommentForm ? 'Cancel' : 'Add Comment'}
        </Button>
      </div>
      
      {comments.length > 0 ? (
        <div className="comments-list mb-3">
          {comments.map((comment, idx) => (
            <div key={idx} className="comment-card mb-2 p-2">
              <div className="d-flex align-items-center">
                <div className="user-icon me-2">
                  <i className="bi bi-person-circle"></i>
                </div>
                <div>
                  <div className="comment-meta text-muted small">
                    <span className="me-2">Anonymous User</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <p className="comment-text mb-0">{comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-comments text-center py-3">
          <i className="bi bi-chat-dots fs-4 text-muted"></i>
          <p className="text-muted mt-2">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {showCommentForm && (
        <Form onSubmit={handleCommentSubmit} className="mt-3">
          <Form.Group controlId="commentForm">
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="mb-2"
            />
            <div className="d-flex justify-content-end gap-2">
              <Button  className="custom-btn"
                variant="secondary" 
                onClick={() => setShowCommentForm(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button  className="custom-btn"
                variant="primary" 
                type="submit" 
                size="sm"
                disabled={!comment.trim()}
              >
                Post Comment
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button  className="custom-btn" variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};


const openGoogleMaps = (address) => {
  const encodedAddress = encodeURIComponent(address);
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
};

export default SearchResults;
