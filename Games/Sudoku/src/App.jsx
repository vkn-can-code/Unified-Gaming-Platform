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
    <main className="min-h-screen bg-[#f7f3ea] text-[#102027] relative pb-12">
      <div className="absolute top-4 left-4 z-50">
        <a 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#073b4c]/20 text-[#073b4c] rounded-lg hover:bg-[#073b4c] hover:text-white transition-all font-bold text-sm shadow-[0_4px_12px_rgba(7,59,76,0.1)]"
        >
          <span>← Back to Portal</span>
        </a>
      </div>
      
      <section className="border-b border-[#102027]/10 bg-[#fffaf0] pt-16 md:pt-12 pb-6 mb-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 md:px-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00a896]/30 bg-[#00a896]/10 px-3 py-1 text-sm font-semibold text-[#075f59]">
              <span aria-hidden="true">✨</span>
              Innovative Puzzle
            </div>
            <h1 className="text-4xl font-black tracking-normal text-[#073b4c] sm:text-5xl">Sudoku Tactics</h1>
            <p className="mt-2 max-w-2xl text-base text-[#38535f]">
              Classic number puzzle upgraded with a clean, modern aesthetic.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex flex-col lg:flex-row w-full max-w-7xl gap-8 px-5 md:px-8 items-start justify-center">
        
        <div className="flex-1 w-full max-w-md mx-auto order-2 lg:order-1">
          <Controls 
            onNumberClick={handleNumberInput}
            onErase={handleErase}
            onNewGame={initGame}
            onDifficultyChange={setDifficulty}
            currentDifficulty={difficulty}
          />
        </div>

        <div className="w-full max-w-[520px] mx-auto order-1 lg:order-2">
          {isWon && (
            <div className="mb-4 p-4 rounded-lg bg-[#e8fbf7] border border-[#00a896]/30 text-[#007f76] font-bold text-center shadow-sm">
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
        </div>
      </section>
    </main>
  );
}

export default App;
