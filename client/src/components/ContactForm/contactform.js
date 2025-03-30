import React, { useState } from 'react';
import { Form, Button, Col, Spinner } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import './contactform.css';

function Contactform() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs.send(
      'service_qwsu089',   
      'template_5h0xcmw',    
      formData,
      'T8Lgc6_NYZ_YOSfKh'   
    )
    
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setStatus('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    })
    .catch((err) => {
      setStatus('Failed to send message. Please try again later.');
      console.error('Email send failed:', err);
      setLoading(false);
    });
  };

  return (
    <Col md={6} className="mx-auto contact-form-container">
      <h2 className='contact-heading'>Contact Us</h2>
      <p className="contact-subtext">
        Got a question? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.
      </p>
      {status && (
        <p className={`status-message ${status.includes('successfully') ? 'success' : 'error'}`}>
          {status}
        </p>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message here"
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
        </Button>
      </Form>
    </Col>
  );
}

export default Contactform;