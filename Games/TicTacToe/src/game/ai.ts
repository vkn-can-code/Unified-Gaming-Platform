import type { AIDifficulty, Board, Player } from "../types";
import { getAvailableMoves, getOpponent, getWinner, isDraw, placeMark, randomMove } from "./engine";

export function chooseAiMove(
  board: Board,
  difficulty: AIDifficulty,
  aiPlayer: Player,
  frozenIndexes: number[] = [],
  random: () => number = Math.random
): number | null {
  const moves = getAvailableMoves(board, frozenIndexes);

  if (moves.length === 0) {
    return null;
  }

  if (difficulty === "easy") {
    return randomMove(moves, random);
  }

  const tacticalMove = findImmediateMove(board, aiPlayer, moves) ?? findImmediateMove(board, getOpponent(aiPlayer), moves);

  if (tacticalMove !== null) {
    return tacticalMove;
  }

  if (difficulty === "medium") {
    if (moves.includes(4)) {
      return 4;
    }

    const corners = moves.filter((move) => [0, 2, 6, 8].includes(move));
    return randomMove(corners.length > 0 ? corners : moves, random);
  }

  return findBestMove(board, aiPlayer, moves);
}

function findImmediateMove(board: Board, player: Player, moves: number[]): number | null {
  for (const move of moves) {
    const result = getWinner(placeMark(board, move, player));
    if (result.winner === player) {
      return move;
    }
  }

  return null;
}

function findBestMove(board: Board, aiPlayer: Player, moves: number[]): number {
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestMove = moves[0];

  for (const move of moves) {
    const score = minimax(placeMark(board, move, aiPlayer), getOpponent(aiPlayer), aiPlayer, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(board: Board, currentPlayer: Player, aiPlayer: Player, depth: number): number {
  const winner = getWinner(board).winner;

  if (winner === aiPlayer) {
    return 10 - depth;
  }

  if (winner === getOpponent(aiPlayer)) {
    return depth - 10;
  }

  if (isDraw(board)) {
    return 0;
  }

  const moves = getAvailableMoves(board);
  const nextPlayer = getOpponent(currentPlayer);

  if (currentPlayer === aiPlayer) {
    return Math.max(
      ...moves.map((move) => minimax(placeMark(board, move, currentPlayer), nextPlayer, aiPlayer, depth + 1))
    );
  }

  return Math.min(
    ...moves.map((move) => minimax(placeMark(board, move, currentPlayer), nextPlayer, aiPlayer, depth + 1))
  );
}
