import { describe, expect, it } from "vitest";
import { chooseAiMove } from "./ai";
import { canPlaceMark, createEmptyBoard, getAvailableMoves, getWinner, isDraw, placeMark } from "./engine";
import type { Board } from "../types";

describe("game engine", () => {
  it("detects a row winner", () => {
    const board: Board = ["X", "X", "X", null, "O", null, "O", null, null];

    expect(getWinner(board)).toEqual({ winner: "X", line: [0, 1, 2] });
  });

  it("detects a draw when the board is full without a winner", () => {
    const board: Board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];

    expect(isDraw(board)).toBe(true);
  });

  it("does not allow a mark on a frozen tile", () => {
    const board = createEmptyBoard();

    expect(canPlaceMark(board, 4, [4])).toBe(false);
    expect(getAvailableMoves(board, [4])).not.toContain(4);
  });

  it("places a mark without mutating the original board", () => {
    const board = createEmptyBoard();
    const next = placeMark(board, 0, "X");

    expect(board[0]).toBeNull();
    expect(next[0]).toBe("X");
  });
});

describe("ai", () => {
  it("medium AI takes an immediate win", () => {
    const board: Board = ["O", "O", null, "X", "X", null, null, null, null];

    expect(chooseAiMove(board, "medium", "O")).toBe(2);
  });

  it("medium AI blocks an immediate loss", () => {
    const board: Board = ["X", "X", null, "O", null, null, null, null, null];

    expect(chooseAiMove(board, "medium", "O")).toBe(2);
  });

  it("impossible AI picks a winning move when available", () => {
    const board: Board = ["X", "X", null, "O", "O", null, null, null, null];

    expect(chooseAiMove(board, "impossible", "O")).toBe(5);
  });
});
