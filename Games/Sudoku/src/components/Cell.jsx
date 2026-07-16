import React from 'react';

export default function Cell({ value, isInitial, isSelected, isError, row, col, onClick }) {
  // Determine margins for 3x3 grids
  const marginRight = (col === 2 || col === 5) ? 'mr-1 md:mr-2' : '';
  const marginBottom = (row === 2 || row === 5) ? 'mb-1 md:mb-2' : '';

  let bgClass = 'bg-[#fbf7ec] hover:bg-white text-[#073b4c] border-white/10';
  if (isSelected) bgClass = 'bg-white ring-4 ring-[#ffd166] text-[#073b4c] z-10';
  if (isError) bgClass = 'bg-[#fff1ef] text-[#e64343] border-[#ff6b6b]/35 ring-2 ring-[#ff6b6b]';

  let textClass = 'text-[clamp(1rem,4vw,2rem)] font-black';
  if (isInitial) textClass = 'text-[clamp(1rem,4vw,2rem)] font-black text-[#00a896]';
  if (isError) textClass = 'text-[clamp(1rem,4vw,2rem)] font-black text-[#e64343]';

  return (
    <button 
      type="button"
      className={`relative grid min-h-0 place-items-center overflow-hidden rounded-[6px] border transition-all duration-200 select-none ${bgClass} ${marginRight} ${marginBottom}`}
      onClick={() => onClick(row, col)}
      aria-label={`Cell row ${row + 1} column ${col + 1}`}
    >
      <span className={textClass}>
        {value !== '-' && value !== '0' && value !== 0 ? value : ''}
      </span>
    </button>
  );
}
