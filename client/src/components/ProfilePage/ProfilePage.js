import React, { useState,useEffect } from 'react';
import './ProfilePage.css'; 
import SearchResults from '../../components/SearchResults/searchresults';


const ProfilePage = ({ profile, onClose, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [favorites, setFavorites] = useState(profile.favorites || []);
  const [selectedApartment, setSelectedApartment] = useState(null);


  useEffect(() => {
    setFavorites(profile.favorites || []);
  }, [profile.favorites]);


  const handleApartmentClick = (apartment) => {
    setSelectedApartment(apartment);
  };
  
  const closeApartmentModal = () => {
    setSelectedApartment(null);
  };
  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedProfile);
    setEditMode(false);
  };

  return (
    <div className="profile-modal-overlay profile-page">
      <div className="profile-modal">
      <div className="profile-modal-header">
  <h2 className="myprofile" >{editMode ? 'Edit Profile' : 'My Profile'}</h2>
  <button className="close-btn" onClick={onClose}>&times;</button>
</div>


        <div className="profile-content">
          {editMode ? (
            <div className="edit-form">
              <div className="form-group">
                <label>First Name</label>
                <input 
                  name="firstName" 
                  value={editedProfile.firstName} 
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  name="lastName" 
                  value={editedProfile.lastName} 
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
                  <span className="info-label">First Name:</span>
                  <span className="info-value">{profile.firstName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Name:</span>
                  <span className="info-value">{profile.lastName}</span>
                </div>
              </div>

              <div className="profile-section">
  <h3>Favorite Apartments</h3>
  {favorites.length > 0 ? (
    <div className="favorites-grid">
      {favorites.map((apartment) => (
        <div 
          key={apartment.id} 
          className="favorite-item" 
          onClick={() => handleApartmentClick(apartment)}
        >
          <img 
            src={apartment.image} 
            alt={apartment.name} 
            className="favorite-image"
          />
          <p className="favorite-name">{apartment.name}</p>
        </div>
      ))}
      {selectedApartment && (
  <div className="apartment-modal-overlay">
    <div className="apartment-modal">
      <button className="back-btn" onClick={closeApartmentModal}>Back</button>
      <img 
        src={selectedApartment.image} 
        alt={selectedApartment.name} 
        className="modal-image"
      />
      <h2>{selectedApartment.name}</h2>
      <p><strong>Location:</strong> {selectedApartment.address}</p>
      <p><strong>Vacancy:</strong> {selectedApartment.vacancy}</p>
      <p><strong>Description:</strong> {selectedApartment.description}</p>
    </div>
  </div>
)}
    </div>
  ) : (
    <p className="text-muted">No favorite apartments yet.</p>
  )
  }
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
