import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './header';

// Mock the child components
jest.mock('./Login/Login', () => () => <div data-testid="mock-login">Mock Login</div>);
jest.mock('../ProfilePage/ProfilePage', () => () => <div data-testid="mock-profile">Mock Profile</div>);

describe('Header Component', () => {
  const mockScrollToContact = jest.fn();

  beforeEach(() => {
    render(<Header scrollToContact={mockScrollToContact} />);
  });

  test('renders logo', () => {
    expect(screen.getByText('NestMate')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders login button', () => {
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('clicking contact link calls scrollToContact', () => {
    fireEvent.click(screen.getByText('Contact'));
    expect(mockScrollToContact).toHaveBeenCalled();
  });

  test('clicking login button shows login modal', () => {
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('mock-login')).toBeInTheDocument();
  });

  test('clicking avatar shows profile modal', () => {
    fireEvent.click(screen.getByText('J')); // Assuming 'John Doe' is the default name
    expect(screen.getByTestId('mock-profile')).toBeInTheDocument();
  });

  test('active link changes on click', () => {
    fireEvent.click(screen.getByText('About'));
    expect(screen.getByText('About').closest('a')).toHaveClass('active');
  });
});
