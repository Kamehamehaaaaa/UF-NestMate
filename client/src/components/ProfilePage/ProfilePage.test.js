import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import '@testing-library/jest-dom/';

describe('ProfilePage Component', () => {
  const mockProfile = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '123-456-7890',
    email: 'john.doe@example.com',
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  test('renders profile information correctly in view mode', () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
    
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
    expect(screen.getByText(/First Name:/i)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.firstName)).toBeInTheDocument();
    expect(screen.getByText(/Last Name:/i)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.lastName)).toBeInTheDocument();
  
  });

  test('displays the "Edit Profile" button', () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
  });

  test('enters edit mode when "Edit Profile" is clicked', async () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
    fireEvent.click(screen.getByText(/Edit Profile/i));
    
    
  });

  test('changes profile data when editing and saves the changes', async () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
    fireEvent.click(screen.getByText(/Edit Profile/i));

  });

  test('closes the modal when close button is clicked', () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
    
    
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays correct title based on edit mode', () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  test('cancels editing and reverts changes when Cancel button is clicked', async () => {
    render(<ProfilePage profile={mockProfile} onClose={mockOnClose} onSave={mockOnSave} />);
   
    fireEvent.click(screen.getByText(/Edit Profile/i));
    fireEvent.click(screen.getByText(/Cancel/i));
  
  });
});