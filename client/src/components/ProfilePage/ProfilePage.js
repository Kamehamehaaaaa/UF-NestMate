import React, { useState } from 'react';

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
    <div className="profile-page">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>{editMode ? 'Edit Profile' : 'User Profile'}</h2>
      {editMode ? (
        <div className="edit-form">
          <input name="name" value={editedProfile.name} onChange={handleChange} />
          <input name="university" value={editedProfile.university} onChange={handleChange} />
          <input name="phone" value={editedProfile.phone} onChange={handleChange} />
          <input name="email" value={editedProfile.email} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="profile-info">
          <p>Name: {profile.name}</p>
          <p>University: {profile.university}</p>
          <p>Phone: {profile.phone}</p>
          <p>Email: {profile.email}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
