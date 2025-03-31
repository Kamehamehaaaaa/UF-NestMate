import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contactform from './contactform'; 
import '@testing-library/jest-dom/';
import emailjs from '@emailjs/browser';

jest.mock('@emailjs/browser', () => ({
  send: jest.fn(),
}));

describe('Contactform Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('renders ContactForm correctly', () => {
    render(<Contactform />);
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test('handles input change correctly', () => {
    render(<Contactform />);
    
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const messageInput = screen.getByLabelText(/Message/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello, I have a question.' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(messageInput.value).toBe('Hello, I have a question.');
  });

  test('displays success message on successful submission', async () => {
    emailjs.send.mockResolvedValueOnce({ status: 200, text: 'OK' });

    render(<Contactform />);

    const submitButton = screen.getByText(/Submit/i);
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const messageInput = screen.getByLabelText(/Message/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello, I have a question.' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Your message has been sent successfully!/i)).toBeInTheDocument();
    });

    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  test('displays error message on failed submission', async () => {
    
    emailjs.send.mockRejectedValueOnce(new Error('Failed to send'));

    render(<Contactform />);

    const submitButton = screen.getByText(/Submit/i);
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const messageInput = screen.getByLabelText(/Message/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello, I have a question.' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to send message. Please try again later./i)).toBeInTheDocument();
    });
  });
});
