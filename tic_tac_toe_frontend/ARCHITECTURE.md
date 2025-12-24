# Architecture Overview — Tic Tac Toe Frontend

## System Context
The Tic Tac Toe application is a single-page React frontend that implements all game logic client-side. It does not require any backend services for core gameplay, persistence, or authentication. The application is intended to run in a preview/development environment on port 3000.

Interfaces:
- Web UI (browser-based interaction with mouse, touch, and keyboard)
- No external network dependencies are required for the core game loop

## Container Overview
Container: tic_tac_toe_frontend
- Platform: Web
- Framework: React
- Purpose: Provide an interactive Tic Tac Toe game with turn indication, win/draw detection, and restart functionality
- Default preview port: 3000

## Component Design
App shell:
- Responsibilities: Initialize game state, orchestrate layout and theming, render high-level components (TurnIndicator, Board, StatusMessage, Restart control), and manage game lifecycle transitions.

Board:
- Responsibilities: Render a 3x3 grid, delegate cell interactions to the parent via callbacks, reflect the current board state.
- Interface:
  - Props: board (array of 9 cells), onCellClick(index), maybe gameActive for interaction gating.
  - Renders nine Cell components in a 3x3 layout.

Cell:
- Responsibilities: Represent a single square; display X, O, or empty; handle click or keyboard activation and pass index upward.
- Interface:
  - Props: value ("X" | "O" | null), onClick()

TurnIndicator:
- Responsibilities: Display the current player’s turn.
- Interface:
  - Props: currentPlayer ("X" | "O")

StatusMessage:
- Responsibilities: Display status below the board; shows winner, draw, or remains neutral while active.
- Interface:
  - Props: winner ("X" | "O" | null), isDraw (boolean), gameActive (boolean)

Restart control:
- Responsibilities: Provide a button to restart the game; displayed only when the game has ended.
- Interface:
  - Props: onRestart()

## State Management
Approach: Local component state in the App shell using React state hooks.
Core state:
- board: string[] of length 9 with values "X", "O", or null (or undefined). Index 0–8 maps to the grid.
- currentPlayer: "X" | "O".
- winner: "X" | "O" | null.
- isDraw: boolean.
- gameActive: boolean (derived: true when no winner and not a draw).

State transitions:
- onCellClick(index):
  - If gameActive and board[index] is empty, set board[index] = currentPlayer, then evaluate winner/draw.
  - If winner found: set winner, gameActive = false.
  - Else if board full: set isDraw = true, gameActive = false.
  - Else: toggle currentPlayer.
- onRestart():
  - Reset board to all empty, set currentPlayer to "X", winner = null, isDraw = false, gameActive = true.

## Game Logic
Win detection:
- Evaluate 8 winning lines:
  - Rows: [0,1,2], [3,4,5], [6,7,8]
  - Columns: [0,3,6], [1,4,7], [2,5,8]
  - Diagonals: [0,4,8], [2,4,6]
- For each line, if board[a] is non-empty and board[a] === board[b] === board[c], declare that symbol as winner.

Draw detection:
- If no winner and all 9 cells are non-empty, declare draw.

Algorithm outline (illustrative):
```javascript
function calculateWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
```

## Routing
- None required for a single-view application. All interactions occur on one screen.

## Build and Deployment Notes
- The frontend runs as a React app and is previewed on port 3000.
- Scripts and tooling may be introduced by the chosen scaffold (e.g., Vite).
- Ensure environment variables are injected at build time according to the bundler (for CRA: process.env.REACT_APP_*, for Vite: import.meta.env.VITE_*). This codebase currently lists REACT_APP_* envs; these can be read if CRA-like behavior is used or adapted to Vite naming if the toolchain changes.

## Configuration and Environment Variables
Present in .env (container-level):
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT (3000)
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

Usage notes:
- Core gameplay does not depend on network calls; these variables are placeholders for future telemetry, logging, or feature gating.
- If using Vite in the future, rename variables to VITE_* or provide appropriate build-time mapping.

## Testing Strategy
Unit tests:
- Test calculateWinner(board) across typical winning scenarios (rows, columns, diagonals), non-winning states, and draw detection.
- Test state transitions: clicking an empty cell, attempting to click an occupied cell, and behavior after game end.

Component tests:
- Board/Cell: cell click places correct symbol; blocked interaction after game completion.
- TurnIndicator: toggles accurately after moves.
- StatusMessage: shows winner, draw, or neutral state appropriately.
- Restart: appears only when game is finished and resets state.

## Accessibility and Performance Considerations
Accessibility:
- Provide role="grid" for the board and role="gridcell" for cells, with aria-labels indicating index/ownership.
- Manage focus states and keyboard input (Enter/Space activates a focused cell).
- Use aria-live="polite" for status messages so screen readers get updates after each move or result.

Performance:
- Keep component tree minimal; renders only affected cells on each move.
- Avoid unnecessary re-renders by passing stable callbacks or memoized components where beneficial (optional for MVP).

## Future Enhancements
- AI opponent (single-player mode).
- Score tracking and session history (local storage).
- Animations and subtle transitions for cell marking and winning line highlight.
- Highlight winning line upon victory.
- Theme customization and dark mode toggle.
