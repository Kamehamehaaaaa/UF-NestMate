import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          properties: [
            { id: '1', name: 'Test Apartment 1' },
            { id: '2', name: 'Test Apartment 2' },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});


test('renders search input field', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Apartment Name/i);
  expect(inputElement).toBeInTheDocument();
});

test('updates search input value on change', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Apartment Name/i);
  fireEvent.change(inputElement, { target: { value: 'Test Apartment' } });
  expect(inputElement.value).toBe('Test Apartment');
});

test('fetches housing data on initial load', async () => {
  render(<App />);
  
  const resultItem1 = await screen.findByText(/Test Apartment 1/i);
  const resultItem2 = await screen.findByText(/Test Apartment 2/i);

  expect(resultItem1).toBeInTheDocument();
  expect(resultItem2).toBeInTheDocument();
});

test('calls handleSearch when search button is clicked', async () => {
    render(<App />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.click(searchButton);
  
    // Assert that fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

test('filters results based on apartment name', async () => {
  render(<App />);
  
  const inputElement = screen.getByPlaceholderText(/Apartment Name/i);
  
  fireEvent.change(inputElement, { target: { value: 'Test Apartment 1' } });
  
  const searchButton = screen.getByRole('button', { name: /search/i });
  
  fireEvent.click(searchButton);

  const filteredResult = await screen.findByText(/Test Apartment 1/i);
  
  expect(filteredResult).toBeInTheDocument();
});

test('changes filter type to location when selected from dropdown', () => {
    render(<App />);
  
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
  
   
    fireEvent.click(filterButton);
    const locationOption = screen.getByText(/Location \(University\)/i);
    fireEvent.click(locationOption);

    const inputElement = screen.getByPlaceholderText(/University Name/i);
    expect(inputElement).toBeInTheDocument();
  });

test('scrolls to contact section when scrollToContact is called', () => {
    render(<App />);

    const contactSection = document.querySelector('.contact-section');
    contactSection.scrollIntoView = jest.fn();

});


  
  test('displays all dropdown options when filter button is clicked', () => {
    render(<App />);
  
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
  
    const locationOption = screen.getByText(/Location \(University\)/i);
    const ratingOption = screen.getByText(/Rating/i);
   
  
    expect(locationOption).toBeInTheDocument();
    expect(ratingOption).toBeInTheDocument();
  });
  
  test('changes placeholder text to "University Name" when location filter is selected', () => {
    render(<App />);
  
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
  
    const locationOption = screen.getByText(/Location \(University\)/i);
    fireEvent.click(locationOption);
  
    const inputElement = screen.getByPlaceholderText(/University Name/i);
    expect(inputElement).toBeInTheDocument();
  });
  

  test('search results update correctly when a new filter is selected and search is performed', async () => {
    render(<App />);
  
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    const locationOption = screen.getByText(/Location \(University\)/i);
    fireEvent.click(locationOption);
  
  
    const inputElement = screen.getByPlaceholderText(/University Name/i);
    fireEvent.change(inputElement, { target: { value: 'Test University' } });
  
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
  
  });