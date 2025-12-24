import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title and initial turn', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Player turn: X/i)).toBeInTheDocument();
});
