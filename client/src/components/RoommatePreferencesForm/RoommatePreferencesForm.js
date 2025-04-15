import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './RoommatePreferencesForm.css';

const RoommatePreferencesForm = ({ preferences, onSave, username }) => {
  const [formData, setFormData] = useState({
    budget: { min: '0', max: '1000' },
    major: 'N/A',
    hobbies: 'N/A',
    food: "any",
    sleeping_habit: "any",
    smoking: 'no',
    cleanliness: 3,
    gender_preference: "any",
    pet_preference: 'fine with pets',
    ...preferences,
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

      {/* Major */}
      <Form.Group className="mb-4">
          <Form.Label>Major</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your major"
            value={formData.major}
            onChange={(e) => handleChange('major', e.target.value)}
          />
      </Form.Group>

      {/* Hobbies */}
      <Form.Group className="mb-4">
          <Form.Label>Hobbies</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your hobbies"
            value={formData.hobbies}
            onChange={(e) => handleChange('hobbies', e.target.value)}
          />
      </Form.Group>

      {/* Food Preference */}
      <Form.Group className="mb-4">
          <Form.Label>Food Preference</Form.Label>
          <Form.Select
            value={formData.food}
            onChange={(e) => handleChange('food', e.target.value)}
          >
            <option value="any">Any</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
          </Form.Select>
      </Form.Group>

      {/* Sleeping Habit */}
      <Form.Group className="mb-4">
          <Form.Label>Sleeping Habit</Form.Label>
          <Form.Select
            value={formData.sleeping_habit}
            onChange={(e) => handleChange('sleeping_habit', e.target.value)}
          >
            <option value="any">Any</option>
            <option value="late sleeper">Late Sleeper</option>
            <option value="early sleeper">Early Sleeper</option>
          </Form.Select>
      </Form.Group>

    
      <div className="lifestyle-section">
        {/* Smoking/Drinking */}
        <Form.Group className="mb-4">
          <Form.Label>Smoking / Drinking</Form.Label>
          <div className="radio-group">
            {['YES', 'NO'].map((option) => (
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
              <span>Very Clean</span>
            </div>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Gender Preference</Form.Label>
          <div className="radio-group">
            {['MALE', 'FEMALE', 'ANY'].map((option) => (
              <Form.Check
                key={option}
                type="radio"
                label={option}
                name="gender_preference"
                id={`gender-${option}`}
                value={option.toLowerCase()}
                checked={formData.gender_preference === option.toLowerCase()}
                onChange={(e) => handleChange('gender_preference', e.target.value)}
              />
            ))}
          </div>
        </Form.Group>


        {/* Pet Preference */}
        <Form.Group className="mb-4">
          <Form.Label>Pet Preference</Form.Label>
          <Form.Select
            value={formData.pet_preference}
            onChange={(e) => handleChange('pet_preference', e.target.value)}
          >
            <option value="fine with pets">Fine with pets</option>
            <option value="not fine with pets">Not fine with pets</option>
          </Form.Select>
        </Form.Group>

      </div>

      <Button variant="primary" type="submit" className="save-button">
        Save Preferences
      </Button>
    </Form>
  );
};

export default RoommatePreferencesForm;