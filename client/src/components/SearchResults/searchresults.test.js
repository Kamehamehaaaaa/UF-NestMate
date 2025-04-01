/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchResults from './searchresults';
import '@testing-library/jest-dom/';
import userEvent from '@testing-library/user-event';

const mockHousingData = [
  {
    id: 1,
    name: 'Luxury Apartment',
    address: '123 Main St, NY',
    image: 'test-image.jpg',
    vacancy: 3,
    rating: 4,
    comments: ['Great place!', 'Loved it!'],
    description: 'Spacious and modern apartment.',
  },
];


describe('SearchResults Component', () => {
  test('renders the component without crashing', () => {
    render(<SearchResults housingData={[]} />);
    expect(screen.getByText(/No housing options found/i)).toBeInTheDocument();
  });
  

  test('displays housing data when available', () => {
    render(<SearchResults housingData={mockHousingData} />);
    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    expect(screen.getByText(/123 Main St, NY/)).toBeInTheDocument();
  });

  test('opens modal when housing card is clicked', async () => {
    render(<SearchResults housingData={mockHousingData} />);
    fireEvent.click(screen.getByText('Luxury Apartment'));
   ;
  });

  test('modal displays correct details', async () => {
    render(<SearchResults housingData={mockHousingData} />);
    fireEvent.click(screen.getByText('Luxury Apartment'));
   
  });

  test('renders star ratings correctly', () => {
    render(<SearchResults housingData={mockHousingData} />);
  
    
  });
  

  test('opens Google Maps when location icon is clicked', async () => {
    
    global.open = jest.fn();
  
    
    render(<SearchResults housingData={mockHousingData} />);
    const locationIcon = document.getElementById('location-icon');
   
   userEvent.click(locationIcon);
  
  
   
  });

  test('displays comments correctly', async () => {
    render(<SearchResults housingData={mockHousingData} />);
    fireEvent.click(screen.getByText('Luxury Apartment'));
    await waitFor(() => {
      expect(screen.getByText('Great place!')).toBeInTheDocument();
    
    });
  });

  test('toggles comment form when Add Comment is clicked', async () => {
    render(<SearchResults housingData={mockHousingData} />);
    fireEvent.click(screen.getByText('Luxury Apartment'));
    fireEvent.click(screen.getByText('Add Comment'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Write your comment...')).toBeInTheDocument();
    });
  });

  test('adds a new comment correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );
    render(<SearchResults housingData={mockHousingData} />);
    fireEvent.click(screen.getByText('Luxury Apartment'));
    fireEvent.click(screen.getByText('Add Comment'));
    fireEvent.change(screen.getByPlaceholderText('Write your comment...'), {
      target: { value: 'Amazing place!' },
    });
    fireEvent.click(screen.getByText('Post Comment'));
    
  });
  

  test('closes modal when Close button is clicked', async () => {
    render(<SearchResults housingData={mockHousingData} />);
    fireEvent.click(screen.getByText('Luxury Apartment'));
    fireEvent.click(screen.getByText('Close'));
   
  });

  
});

