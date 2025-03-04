import React, { useState } from 'react';
import './ProfilePage.css'; 

const ProfilePage = ({ profile, onClose, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedProfile);
    setEditMode(false);
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="profile-modal-header">
          <h2>{editMode ? 'Edit Profile' : 'My Profile'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="profile-content">
          {editMode ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  name="name" 
                  value={editedProfile.name} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>University</label>
                <input 
                  name="university" 
                  value={editedProfile.university} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    name="phone" 
                    value={editedProfile.phone} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    name="email" 
                    value={editedProfile.email} 
                    onChange={handleChange}
                    className="form-input"
                    type="email"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{profile.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">University:</span>
                  <span className="info-value">{profile.university}</span>
                </div>
              </div>

              <div className="profile-section">
                <h3>Contact Information</h3>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
              </div>

              <button 
                className="edit-profile-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
