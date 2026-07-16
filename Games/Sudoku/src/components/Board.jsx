import React from 'react';
import Cell from './Cell';

export default function Board({ board, initialBoard, selectedCell, onCellClick, errors }) {
  return (
    <div className="relative mx-auto grid w-full aspect-square grid-rows-9 gap-1 rounded-[8px] bg-[#102027] p-3 shadow-[0_18px_45px_rgba(16,32,39,0.18)]">
      {board.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-9 gap-1 h-full">
          {row.map((val, colIndex) => {
            const isSelected = selectedCell && selectedCell.r === rowIndex && selectedCell.c === colIndex;
            const isInitial = initialBoard[rowIndex][colIndex] !== '-';
            
            // Check if cell is in errors array
            const isError = errors.some(e => e.r === rowIndex && e.c === colIndex);

            return (
              <Cell 
                key={`cell-${rowIndex}-${colIndex}`}
                value={val}
                isInitial={isInitial}
                isSelected={isSelected}
                isError={isError}
                row={rowIndex}
                col={colIndex}
                onClick={onCellClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
