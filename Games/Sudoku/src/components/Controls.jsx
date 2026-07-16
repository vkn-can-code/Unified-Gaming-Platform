import React from 'react';

export default function Controls({ onNumberClick, onErase, onNewGame, onDifficultyChange, currentDifficulty }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col items-center mt-6 max-w-md w-full gap-6">
      
      {/* Numpad */}
      <div className="grid grid-cols-5 gap-2 w-full px-4">
        {numbers.map(num => (
          <button
            key={`num-${num}`}
            className="bg-bg-panel border border-purple text-gold font-ui text-xl py-2 rounded shadow-md hover:bg-purple/30 hover:border-gold transition-colors active:scale-95"
            onClick={() => onNumberClick(num.toString())}
          >
            {num}
          </button>
        ))}
        <button
          className="bg-bg-panel border border-red-500/50 text-red-400 font-ui text-lg py-2 rounded shadow-md hover:bg-red-900/30 hover:border-red-500 transition-colors active:scale-95"
          onClick={onErase}
        >
          Erase
        </button>
      </div>

      {/* Game Actions */}
      <div className="flex flex-col gap-4 w-full px-4">
        <div className="flex justify-between gap-2">
          {['easy', 'medium', 'hard'].map(diff => (
            <button
              key={diff}
              className={`flex-1 py-1 px-2 rounded font-ui capitalize text-sm transition-colors border ${currentDifficulty === diff ? 'bg-gold text-bg-dark border-gold' : 'bg-transparent text-purple border-purple hover:border-gold hover:text-gold'}`}
              onClick={() => onDifficultyChange(diff)}
            >
              {diff}
            </button>
          ))}
        </div>
        
        <button className="btn-fantasy w-full" onClick={onNewGame}>
          Summon New Puzzle
        </button>
      </div>
    </div>
  );
}
