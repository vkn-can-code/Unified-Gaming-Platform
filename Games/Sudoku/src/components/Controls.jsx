import React from 'react';

export default function Controls({ onNumberClick, onErase, onNewGame, onDifficultyChange, currentDifficulty }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Game Mode Panel */}
      <section className="rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.06)]">
        <div className="mb-4">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ff6b6b]">Game Mode</p>
          <h2 className="text-xl font-black text-[#073b4c]">Difficulty Level</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {['easy', 'medium', 'hard'].map(diff => (
            <button
              key={diff}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${currentDifficulty === diff ? 'bg-[#ff6b6b] text-white' : 'bg-white text-[#38535f] hover:bg-[#ffe0dc] border border-[#102027]/10'}`}
              onClick={() => onDifficultyChange(diff)}
            >
              {diff}
            </button>
          ))}
        </div>

        <button 
          className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-[#102027] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#073b4c]" 
          onClick={onNewGame}
        >
          Generate New Puzzle
        </button>
      </section>

      {/* Input Panel */}
      <section className="rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.06)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#00a896]">Input</p>
            <h2 className="text-xl font-black text-[#073b4c]">Number Pad</h2>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 w-full">
          {numbers.map(num => (
            <button
              key={`num-${num}`}
              className="rounded-lg border border-[#102027]/10 bg-[#fffaf0] p-3 text-xl font-black text-[#073b4c] hover:border-[#00a896] hover:bg-white transition-all shadow-sm active:scale-95"
              onClick={() => onNumberClick(num.toString())}
            >
              {num}
            </button>
          ))}
          <button
            className="rounded-lg border border-[#ff6b6b]/30 bg-[#fff1ef] p-3 text-sm font-bold text-[#e64343] hover:border-[#ff6b6b] hover:bg-[#ffe0dc] transition-all shadow-sm active:scale-95 flex items-center justify-center"
            onClick={onErase}
          >
            Erase
          </button>
        </div>
      </section>
      
    </div>
  );
}
