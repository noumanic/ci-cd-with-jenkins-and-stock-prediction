import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('React Components', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders App component', () => {
    render(<App />);
    expect(screen.getAllByText('Stockify')).toHaveLength(3); // Header, Main title, Footer
  });

  test('renders Header component', () => {
    render(<Header />);
    expect(screen.getByText('Stockify')).toBeInTheDocument();
  });

  test('renders Footer component', () => {
    render(<Footer />);
    expect(screen.getByText('MNH 21I-0416')).toBeInTheDocument();
  });

  test('renders LoadingSpinner component', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('App component has search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/enter stock symbol/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('App component has predict button', () => {
    render(<App />);
    const predictButton = screen.getByText(/predict price/i);
    expect(predictButton).toBeInTheDocument();
  });
});
