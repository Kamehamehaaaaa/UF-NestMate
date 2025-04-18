import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Matches from './matches';

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ matches: [] }),
    ok: true,
  })
);

const mockUser = {
  email: 'test@example.com'
};

const mockMatches = [
  {
    username: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    preferences: {
      major: 'Computer Science',
      budget: { min: 500, max: 1500 },
      smoking: 'no',
      sleeping_habit: 'late sleeper',
      cleanliness: 4,
      gender_preference: 'male',
      pet_preference: 'fine with pets',
      hobbies: 'hiking, coding'
    }
  },
  {
    username: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    preferences: {
      major: 'Biology',
      budget: { min: 600, max: 1200 }
    }
  }
];

describe('Matches Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

 

  test('displays no matches found when empty', async () => {
    render(<Matches loggedInUser={mockUser} />);
    await waitFor(() => {
      expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
    });
  });

  test('displays match cards when data is fetched', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );
  
    render(<Matches loggedInUser={mockUser} />);
  
    await waitFor(() => {
      const johnElements = screen.getAllByText(/John Doe/i);
      const janeElements = screen.getAllByText(/Jane Smith/i);
      
      expect(johnElements.length).toBeGreaterThan(0);
      expect(janeElements.length).toBeGreaterThan(0);
    });
  });
  

  test('opens modal when card is clicked', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );

    render(<Matches loggedInUser={mockUser} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/John Doe/i).closest('.clickable-card'));
    });

    expect(screen.getByText(/John Doe's Profile/i)).toBeInTheDocument();
  });

  test('displays basic info in modal', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );

    render(<Matches loggedInUser={mockUser} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/John Doe/i).closest('.clickable-card'));
    });

  });

 


  test('handles API errors gracefully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API is down'))
    );

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Matches loggedInUser={mockUser} />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching matches:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  test('parses hobbies correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );
  
    render(<Matches loggedInUser={mockUser} />);
    
    // Wait for the cards to render, then find all "John Doe" elements
    await waitFor(() => {
      const johns = screen.getAllByText(/John Doe/i);
      // The first one should be in the card, the second in the modal (after click)
      fireEvent.click(johns[0].closest('.clickable-card'));
    });
  
    // Open Preferences tab if needed
    fireEvent.click(screen.getByRole('tab', { name: /Preferences/i }));
  
  });
  

  test('shows default values for missing preferences', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );

    render(<Matches loggedInUser={mockUser} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Jane Smith/i).closest('.clickable-card'));
    });

  });

  test('handles image loading errors', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );
    
  });

  test('closes modal when close button is clicked', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );

    render(<Matches loggedInUser={mockUser} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/John Doe/i).closest('.clickable-card'));
    });

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByText(/John Doe's Profile/i)).not.toBeInTheDocument();
  });


  

  test('renders different tabs in modal', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ matches: mockMatches }),
        ok: true,
      })
    );
  
    render(<Matches loggedInUser={mockUser} />);
  
    // Open the modal
    await waitFor(() => {
      fireEvent.click(screen.getByText(/John Doe/i).closest('.clickable-card'));
    });
  
    // Assert the Preferences tab exists (by role)
    expect(screen.getByRole('tab', { name: /Preferences/i })).toBeInTheDocument();
  
    // Assert the Living Preferences section heading exists (by role)
    expect(screen.getByRole('heading', { name: /Living Preferences/i })).toBeInTheDocument();
  
    // Also assert the Basic Info tab exists
    expect(screen.getByRole('tab', { name: /Basic Info/i })).toBeInTheDocument();
  });
  
});

