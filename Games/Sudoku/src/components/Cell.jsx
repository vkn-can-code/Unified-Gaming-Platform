import React from 'react';

export default function Cell({ value, isInitial, isSelected, isError, row, col, onClick }) {
  // Determine border styles for 3x3 grids
  const borderRight = (col === 2 || col === 5) ? 'border-r-2 border-r-gold' : 'border-r border-r-purple/30';
  const borderBottom = (row === 2 || row === 5) ? 'border-b-2 border-b-gold' : 'border-b border-b-purple/30';
  const borderLeft = col === 0 ? 'border-l-2 border-l-gold' : '';
  const borderTop = row === 0 ? 'border-t-2 border-t-gold' : '';
  
  // Last row/col thick borders
  const borderRightThick = col === 8 ? 'border-r-2 border-r-gold' : '';
  const borderBottomThick = row === 8 ? 'border-b-2 border-b-gold' : '';

  const borderClasses = `${borderRight} ${borderBottom} ${borderLeft} ${borderTop} ${borderRightThick} ${borderBottomThick}`;
  
  let bgClass = 'bg-bg-panel/50 hover:bg-purple/20';
  if (isSelected) bgClass = 'bg-purple/40 shadow-[inset_0_0_10px_rgba(255,215,0,0.5)]';
  if (isError) bgClass = 'bg-red-900/50 shadow-[inset_0_0_10px_rgba(255,0,0,0.5)]';

  let textClass = 'text-white font-ui text-xl md:text-2xl';
  if (isInitial) textClass = 'text-gold font-heading font-bold text-xl md:text-2xl text-shadow-[0_0_5px_rgba(255,215,0,0.5)]';
  if (isError) textClass = 'text-red-400 font-ui text-xl md:text-2xl';

  return (
    <div 
      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-colors duration-200 select-none ${borderClasses} ${bgClass}`}
      onClick={() => onClick(row, col)}
    >
      <span className={textClass}>
        {value !== '-' && value !== '0' && value !== 0 ? value : ''}
      </span>
    </div>
  );
}
