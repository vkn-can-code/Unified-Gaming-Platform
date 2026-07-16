import React from 'react';
import Cell from './Cell';

export default function Board({ board, initialBoard, selectedCell, onCellClick, errors }) {
  return (
    <div className="inline-block p-1 bg-gradient-to-br from-gold to-purple rounded shadow-[0_0_20px_rgba(138,43,226,0.6)]">
      <div className="bg-bg-dark rounded-sm overflow-hidden">
        {board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex">
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
    </div>
  );
}
