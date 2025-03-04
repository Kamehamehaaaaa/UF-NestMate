import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contactform from './contactform';
import emailjs from '@emailjs/browser';

// Mock emailjs
jest.mock('@emailjs/browser');

describe('Contactform Component', () => {
  beforeEach(() => {
    render(<Contactform />);
  });

  test('renders Contact Us heading', () => {
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders form fields', () => {
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  test('updates form fields on input', () => {
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email address');
    const messageInput = screen.getByLabelText('Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(messageInput.value).toBe('Test message');
  });

  test('submits form and shows success message', async () => {
    emailjs.send.mockResolvedValue({ status: 200, text: 'OK' });

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email address');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Your message has been sent successfully!')).toBeInTheDocument();
    });

    expect(emailjs.send).toHaveBeenCalledWith(
      'service_qwsu089',
      'template_5h0xcmw',
      { name: 'John Doe', email: 'john@example.com', message: 'Test message' },
      'T8Lgc6_NYZ_YOSfKh'
    );
  });

  test('shows error message on submission failure', async () => {
    emailjs.send.mockRejectedValue(new Error('Failed to send'));

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email address');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });
});
