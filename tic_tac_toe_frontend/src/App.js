import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Square component renders a single Tic Tac Toe cell.
 * Props:
 * - value: 'X' | 'O' | null
 * - onClick: () => void
 * - isWinning: boolean (if this square is part of the winning line)
 * - disabled: boolean (if interactions should be disabled)
 */
function Square({ value, onClick, isWinning, disabled }) {
  const contentClass =
    value === 'X' ? 'x' : value === 'O' ? 'o' : '';

  return (
    <button
      type="button"
      className={[
        'square',
        contentClass,
        isWinning ? 'won' : '',
        disabled ? 'disabled' : '',
      ].join(' ').trim()}
      onClick={onClick}
      aria-label={value ? `Cell contains ${value}` : 'Empty cell'}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

/**
 * Calculate winning line and winner symbol for a given board.
 * Returns:
 * - { winner: 'X' | 'O' | null, line: number[] | null }
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diag
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * PUBLIC_INTERFACE
 * Main App component: renders the game board, turn indicator, status, and restart control.
 * Frontend-only; no backend calls. Runs on the default port 3000 in this environment.
 */
function App() {
  // Board state: 9 cells initialized to null
  const [squares, setSquares] = useState(Array(9).fill(null));
  // Track X's turn as boolean
  const [xIsNext, setXIsNext] = useState(true);

  // Derive winner and line
  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const isBoardFull = useMemo(
    () => squares.every((s) => s !== null),
    [squares]
  );

  const gameOver = Boolean(winner) || isBoardFull;

  // Status texts
  const currentPlayer = xIsNext ? 'X' : 'O';
  const statusText = winner
    ? `Winner: ${winner}`
    : isBoardFull
      ? 'Draw game'
      : `Turn: ${currentPlayer}`;

  // Handle a square click
  const handleClick = (index) => {
    // Ignore if game finished or cell filled
    if (gameOver || squares[index]) return;
    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // Restart the game
  const restart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="ttt-container" role="application" aria-label="Tic Tac Toe game">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          {!gameOver && (
            <div
              className="ttt-turn"
              aria-live="polite"
              aria-atomic="true"
            >
              Player turn: {currentPlayer}
            </div>
          )}
        </header>

        {/* Board */}
        <section
          className="board"
          role="grid"
          aria-label="Tic Tac Toe board"
          aria-disabled={gameOver ? 'true' : 'false'}
        >
          {squares.map((v, i) => {
            const isWinning = line ? line.includes(i) : false;
            return (
              <Square
                key={i}
                value={v}
                isWinning={isWinning}
                disabled={gameOver || Boolean(v)}
                onClick={() => handleClick(i)}
              />
            );
          })}
        </section>

        {/* Status message */}
        <div
          className={[
            'status',
            winner ? 'win' : isBoardFull ? 'draw' : '',
          ].join(' ').trim()}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusText}
        </div>

        {/* Restart button visible when game over */}
        {gameOver && (
          <div className="actions">
            {/* PUBLIC_INTERFACE: Restart control */}
            <button type="button" className="button" onClick={restart}>
              Restart
            </button>
          </div>
        )}

        <div className="footer-note">
          Two-player local play. No data stored.
        </div>
      </main>
    </div>
  );
}

export default App;
