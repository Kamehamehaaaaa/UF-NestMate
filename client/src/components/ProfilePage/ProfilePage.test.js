import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './ProfilePage';

describe('ProfilePage Component', () => {
  const mockProfile = {
    name: 'John Doe',
    university: 'Example University',
    phone: '123-456-7890',
    email: 'john.doe@example.com'
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
  });

  test('renders profile information', () => {
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText(`Name: ${mockProfile.name}`)).toBeInTheDocument();
    expect(screen.getByText(`University: ${mockProfile.university}`)).toBeInTheDocument();
    expect(screen.getByText(`Phone: ${mockProfile.phone}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockProfile.email}`)).toBeInTheDocument();
  });

  test('switches to edit mode when Edit Profile button is clicked', () => {
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.university)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.phone)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.email)).toBeInTheDocument();
  });

  test('updates profile information when edited', () => {
    fireEvent.click(screen.getByText('Edit Profile'));
    
    const nameInput = screen.getByDisplayValue(mockProfile.name);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    expect(nameInput.value).toBe('Jane Doe');
  });

  test('saves edited profile when Save button is clicked', () => {
    fireEvent.click(screen.getByText('Edit Profile'));
    
    const nameInput = screen.getByDisplayValue(mockProfile.name);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockProfile,
      name: 'Jane Doe'
    });
  });

  test('closes profile page when close button is clicked', () => {
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
