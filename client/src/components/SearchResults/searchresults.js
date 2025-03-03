import React, { useState } from 'react';
import { Card, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import './searchresults.css';

const SearchResults = ({ results }) => {
  const [show, setShow] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (apartment) => {
    setSelectedApartment(apartment);
    setComments(apartment.comments || []);
    setShow(true);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = `Lakksh: ${comment}`;
      const newComments = [...comments, newComment];
      setComments(newComments);
      setComment('');
    }
  };

  return (
    <>
      <Row >
  {results.length > 0 ? (
    results.map((result, idx) => (
      <Col key={idx} xs={12} sm={6} md={4} lg={3} className="d-flex">
        <Card className="clickable-card flex-grow-1" onClick={() => handleShow(result)}>
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
      <h4 className="no-results">No results found</h4>
    </Col>
  )}
</Row>


      {/* Modal for displaying more information */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        className="apartment-modal"
      >
        {/* Modal Header without the close button */}
        <Modal.Header>
          <Modal.Title>{selectedApartment?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={selectedApartment?.image} 
            alt={selectedApartment?.name} 
            className="modal-img"
          />
          <p><strong>Address:</strong> {selectedApartment?.address}</p>
          <p><strong>Pincode:</strong> {selectedApartment?.pincode}</p>
          <p><strong>Rating:</strong> {selectedApartment?.rating}</p>
          <p><strong>Description:</strong> <i>The NLP generated user review summary can go here.</i></p>

          <p style={{ color: 'green' }}><strong>Comments:</strong></p>
          {comments.length > 0 ? (
            comments.map((comment, idx) => (
              <div key={idx} className="comment">
                <p>
                  {comment.includes('Lakksh') ? (
                    <span>Lakksh: </span>
                  ) : (
                    ''
                  )}
                  {comment.replace('Lakksh: ', '')}
                </p>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to leave one!</p>
          )}

          {/* Comment Form */}
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group controlId="commentForm">
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
              />
            </Form.Group>
            <Button variant="primary" className="add-comment-button" type="submit">
              Add Comment
            </Button>
          </Form>
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
