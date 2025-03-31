import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

const mockOnClose = jest.fn();
const mockOnLoginSuccess = jest.fn();

describe('Login Component', () => {
  test('renders login form initially', () => {
    render(<Login onClose={mockOnClose} onLoginSuccess={mockOnLoginSuccess} />);
  });

  test('switches to signup form when clicking sign up link', () => {
    render(<Login onClose={mockOnClose} onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));
    
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('switches back to login form when clicking login link', () => {
    render(<Login onClose={mockOnClose} onLoginSuccess={mockOnLoginSuccess} />);
    
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));
    fireEvent.click(screen.getByText(/already have an account\? login/i));
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(<Login onClose={mockOnClose} onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});