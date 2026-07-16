import React, { useState, useEffect, useCallback } from 'react';
import { getSudoku } from 'sudoku-gen';
import Board from './components/Board';
import Controls from './components/Controls';

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [initialBoard, setInitialBoard] = useState([]);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback(() => {
    const puzzle = getSudoku(difficulty);
    
    // Convert 81 char strings to 9x9 arrays
    const parseBoard = (str) => {
      const arr = [];
      for (let i = 0; i < 9; i++) {
        arr.push(str.slice(i * 9, i * 9 + 9).split(''));
      }
      return arr;
    };

    const initial = parseBoard(puzzle.puzzle);
    setInitialBoard(initial);
    // Deep copy for playable board
    setBoard(initial.map(row => [...row]));
    setSolution(parseBoard(puzzle.solution));
    setSelectedCell(null);
    setErrors([]);
    setIsWon(false);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell) return;
      
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'ArrowUp') {
        setSelectedCell(prev => ({ r: Math.max(0, prev.r - 1), c: prev.c }));
      } else if (e.key === 'ArrowDown') {
        setSelectedCell(prev => ({ r: Math.min(8, prev.r + 1), c: prev.c }));
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell(prev => ({ r: prev.r, c: Math.max(0, prev.c - 1) }));
      } else if (e.key === 'ArrowRight') {
        setSelectedCell(prev => ({ r: prev.r, c: Math.min(8, prev.c + 1) }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, board]);

  const validateBoard = (newBoard) => {
    const newErrors = [];
    let isFull = true;
    let isCorrect = true;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = newBoard[r][c];
        if (val === '-' || val === '0') {
          isFull = false;
          continue;
        }

        // Validate against solution
        if (val !== solution[r][c]) {
          newErrors.push({ r, c });
          isCorrect = false;
        }
      }
    }

    setErrors(newErrors);
    
    if (isFull && isCorrect) {
      setIsWon(true);
    }
  };

  const handleNumberInput = (numStr) => {
    if (!selectedCell || isWon) return;
    const { r, c } = selectedCell;
    
    // Don't modify initial given numbers
    if (initialBoard[r][c] !== '-') return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = numStr;
    setBoard(newBoard);
    validateBoard(newBoard);
  };

  const handleErase = () => {
    if (!selectedCell || isWon) return;
    const { r, c } = selectedCell;
    if (initialBoard[r][c] !== '-') return;

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = '-';
    setBoard(newBoard);
    validateBoard(newBoard);
  };

  const handleCellClick = (r, c) => {
    if (isWon) return;
    setSelectedCell({ r, c });
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-screen relative">
      <a 
        href="/" 
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-purple-900/40 border border-purple-500/50 text-purple-200 rounded-lg hover:bg-purple-800/60 hover:text-white transition-all font-ui"
      >
        <span>← Back to Portal</span>
      </a>

      <header className="mb-6 mt-8">
        <h1 className="glow-text">Arcane Sudoku</h1>
      </header>

      {isWon && (
        <div className="mb-4 text-gold font-ui text-2xl animate-pulse-glow">
          Victory! The puzzle is solved!
        </div>
      )}

      {board.length > 0 && (
        <Board 
          board={board}
          initialBoard={initialBoard}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          errors={errors}
        />
      )}

      <Controls 
        onNumberClick={handleNumberInput}
        onErase={handleErase}
        onNewGame={initGame}
        onDifficultyChange={setDifficulty}
        currentDifficulty={difficulty}
      />
    </div>
  );
}

export default App;
