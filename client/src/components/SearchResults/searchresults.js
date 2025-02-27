import React, { useState } from 'react';
import { Card, Col, Row, Modal, Button } from 'react-bootstrap';
import './searchresults.css';

const SearchResults = ({ results }) => {
  const [show, setShow] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (apartment) => {
    setSelectedApartment(apartment);
    setShow(true);
  };

  return (
    <>
      <Row xs={1} md={2} lg={3}>
        {results.length > 0 ? (
          results.map((result, idx) => (
            <Col key={idx}>
              <Card className="clickable-card" onClick={() => handleShow(result)}>
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

      {/* Modal for displaying more information */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        className="apartment-modal"
      >
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
          <p><strong>Description:</strong> Using NLP, description made from user reviews can be added here.</p>
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