export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameMode = "classic" | "ai" | "power";
export type AIDifficulty = "easy" | "medium" | "impossible";
export type PowerId = "freeze" | "swap" | "undo";

export type WinningLine = [number, number, number];

export interface WinnerResult {
  winner: Player | null;
  line: WinningLine | null;
}
