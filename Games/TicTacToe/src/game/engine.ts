import type { Board, CellValue, Player, WinnerResult, WinningLine } from "../types";

export const BOARD_SIZE = 9;

export const WIN_LINES: WinningLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export function createEmptyBoard(): Board {
  return Array<CellValue>(BOARD_SIZE).fill(null);
}

export function getOpponent(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function getWinner(board: Board): WinnerResult {
  for (const [a, b, c] of WIN_LINES) {
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { winner: mark, line: [a, b, c] };
    }
  }

  return { winner: null, line: null };
}

export function isBoardFull(board: Board): boolean {
  return board.every(Boolean);
}

export function isDraw(board: Board): boolean {
  return !getWinner(board).winner && isBoardFull(board);
}

export function canPlaceMark(board: Board, index: number, frozenIndexes: number[] = []): boolean {
  return index >= 0 && index < BOARD_SIZE && board[index] === null && !frozenIndexes.includes(index);
}

export function getAvailableMoves(board: Board, frozenIndexes: number[] = []): number[] {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null && !frozenIndexes.includes(index)) {
      moves.push(index);
    }

    return moves;
  }, []);
}

export function placeMark(board: Board, index: number, player: Player): Board {
  if (!canPlaceMark(board, index)) {
    return board;
  }

  const next = [...board];
  next[index] = player;
  return next;
}

export function boardKey(board: Board): string {
  return board.map((cell) => cell ?? "-").join("");
}

export function randomMove(moves: number[], random: () => number = Math.random): number | null {
  if (moves.length === 0) {
    return null;
  }

  return moves[Math.floor(random() * moves.length)];
}
