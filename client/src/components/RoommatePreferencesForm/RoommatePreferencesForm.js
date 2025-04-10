import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './RoommatePreferencesForm.css';

const RoommatePreferencesForm = ({ preferences, onSave }) => {
    const [formData, setFormData] = useState({
        budget: { min: '', max: '' }, 
        smoking: 'no',
        cleanliness: 3,
        ...preferences  
      });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form onSubmit={handleSubmit} className="roommate-preferences-form">
     

      {/* Budget Range */}
      <Form.Group className="mb-4">
        <Form.Label>Monthly Budget Range ($)</Form.Label>
        <div className="budget-input-group">
          <Form.Control
            type="number"
            placeholder="Minimum"
            value={formData.budget.min}
            onChange={(e) => handleChange('budget', {
              ...formData.budget,
              min: e.target.value
            })}
          />
          <span className="budget-separator">to</span>
          <Form.Control
            type="number"
            placeholder="Maximum"
            value={formData.budget.max}
            onChange={(e) => handleChange('budget', {
              ...formData.budget,
              max: e.target.value
            })}
          />
        </div>
      </Form.Group>

    

      {/* Lifestyle Preferences */}
      <div className="lifestyle-section">
        {/* Smoking */}
        <Form.Group className="mb-4">
          <Form.Label>Smoking Preference</Form.Label>
          <div className="radio-group">
            {['No', 'Occasionally', 'Regularly'].map(option => (
              <Form.Check
                key={option}
                type="radio"
                label={option}
                name="smoking"
                id={`smoking-${option}`}
                value={option.toLowerCase()}
                checked={formData.smoking === option.toLowerCase()}
                onChange={(e) => handleChange('smoking', e.target.value)}
              />
            ))}
          </div>
        </Form.Group>


        {/* Cleanliness */}
        <Form.Group className="mb-4">
          <Form.Label>Cleanliness Preference</Form.Label>
          <div className="cleanliness-slider">
            <Form.Range
              min="1"
              max="5"
              value={formData.cleanliness}
              onChange={(e) => handleChange('cleanliness', parseInt(e.target.value))}
            />
            <div className="cleanliness-labels">
              <span>Casual</span>
              <span>Neutral</span>
              <span>Very Clean</span>
            </div>
          </div>
        </Form.Group>
      </div>

      <Button variant="primary" type="submit" className="save-button">
        Save Preferences
      </Button>
    </Form>
  );
};

export default RoommatePreferencesForm;
