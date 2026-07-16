import confetti from "canvas-confetti";
import {
  Bot,
  Brain,
  History,
  RotateCcw,
  Shield,
  Shuffle,
  Snowflake,
  Sparkles,
  Swords,
  Trophy,
  Zap
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { chooseAiMove } from "./game/ai";
import {
  boardKey,
  canPlaceMark,
  createEmptyBoard,
  getAvailableMoves,
  getOpponent,
  getWinner,
  isDraw
} from "./game/engine";
import { usePersistentState } from "./hooks/usePersistentState";
import type { AIDifficulty, Board, GameMode, Player, PowerId, WinningLine } from "./types";

type MatchStatus = "playing" | "won" | "draw";

interface FrozenCell {
  index: number;
  blockedFor: Player;
  by: Player;
}

interface MoveRecord {
  id: string;
  player: Player;
  label: string;
  board: Board;
  type: "move" | "freeze" | "swap" | "undo";
}

type PowerUseMap = Record<Player, Record<PowerId, boolean>>;

interface MatchState {
  id: string;
  board: Board;
  currentPlayer: Player;
  status: MatchStatus;
  winner: Player | null;
  winningLine: WinningLine | null;
  frozenCells: FrozenCell[];
  wildCell: number | null;
  moves: MoveRecord[];
  powersUsed: PowerUseMap;
  lastPlacedIndex: Record<Player, number | null>;
}

interface Stats {
  games: number;
  draws: number;
  wins: Record<Player, number>;
  currentStreak: {
    player: Player | null;
    count: number;
  };
  bestStreak: number;
}

const EMPTY_POWERS: PowerUseMap = {
  X: { freeze: false, swap: false, undo: false },
  O: { freeze: false, swap: false, undo: false }
};

const INITIAL_STATS: Stats = {
  games: 0,
  draws: 0,
  wins: { X: 0, O: 0 },
  currentStreak: { player: null, count: 0 },
  bestStreak: 0
};

const MODE_OPTIONS: Array<{ id: GameMode; label: string; description: string }> = [
  { id: "classic", label: "Classic", description: "Local two-player match" },
  { id: "ai", label: "AI Duel", description: "Face the computer" },
  { id: "power", label: "Power Mode", description: "Tactical abilities and wild cells" }
];

const DIFFICULTIES: AIDifficulty[] = ["easy", "medium", "impossible"];

function createMatch(mode: GameMode): MatchState {
  const board = createEmptyBoard();

  return {
    id: crypto.randomUUID(),
    board,
    currentPlayer: "X",
    status: "playing",
    winner: null,
    winningLine: null,
    frozenCells: [],
    wildCell: mode === "power" ? pickRandom(getAvailableMoves(board)) : null,
    moves: [],
    powersUsed: structuredClone(EMPTY_POWERS),
    lastPlacedIndex: { X: null, O: null }
  };
}

function pickRandom(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return values[Math.floor(Math.random() * values.length)];
}

function frozenForPlayer(state: MatchState, player = state.currentPlayer): number[] {
  return state.frozenCells.filter((cell) => cell.blockedFor === player).map((cell) => cell.index);
}

function finishActionForPlayer(state: MatchState, player: Player): FrozenCell[] {
  return state.frozenCells.filter((cell) => cell.blockedFor !== player);
}

function describeCell(index: number): string {
  return `tile ${index + 1}`;
}

function App() {
  const [mode, setMode] = usePersistentState<GameMode>("tic-tac-tactics-mode", "classic");
  const [difficulty, setDifficulty] = usePersistentState<AIDifficulty>("tic-tac-tactics-difficulty", "medium");
  const [stats, setStats] = usePersistentState<Stats>("tic-tac-tactics-stats", INITIAL_STATS);
  const [game, setGame] = useState(() => createMatch(mode));
  const [activePower, setActivePower] = useState<PowerId | null>(null);
  const [swapFrom, setSwapFrom] = useState<number | null>(null);
  const finishedMatchRef = useRef<string | null>(null);

  const isAiTurn = mode === "ai" && game.currentPlayer === "O" && game.status === "playing";
  const boardSignature = boardKey(game.board);

  useEffect(() => {
    setGame(createMatch(mode));
    setActivePower(null);
    setSwapFrom(null);
    finishedMatchRef.current = null;
  }, [mode]);

  useEffect(() => {
    if (!isAiTurn) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setGame((current) => {
        if (current.status !== "playing" || current.currentPlayer !== "O") {
          return current;
        }

        const move = chooseAiMove(current.board, difficulty, "O", frozenForPlayer(current, "O"));
        return move === null ? current : applyMove(current, move, mode, "AI claims");
      });
    }, 560);

    return () => window.clearTimeout(timeout);
  }, [boardSignature, difficulty, isAiTurn, mode]);

  useEffect(() => {
    if (game.status === "playing" || finishedMatchRef.current === game.id) {
      return;
    }

    finishedMatchRef.current = game.id;
    setStats((current) => updateStats(current, game.winner));

    if (game.winner) {
      confetti({
        particleCount: 120,
        spread: 72,
        origin: { y: 0.72 },
        colors: ["#00a896", "#ff6b6b", "#ffd166", "#073b4c"]
      });
    }
  }, [game.id, game.status, game.winner, setStats]);

  const statusText = useMemo(() => {
    if (game.status === "won") {
      return `${game.winner} wins the board`;
    }

    if (game.status === "draw") {
      return "Draw. Perfectly balanced.";
    }

    if (isAiTurn) {
      return "AI is thinking";
    }

    return `${game.currentPlayer}'s turn`;
  }, [game.currentPlayer, game.status, game.winner, isAiTurn]);

  function restartMatch() {
    setGame(createMatch(mode));
    setActivePower(null);
    setSwapFrom(null);
    finishedMatchRef.current = null;
  }

  function handleCellClick(index: number) {
    if (isAiTurn || game.status !== "playing") {
      return;
    }

    if (mode === "power" && activePower === "freeze") {
      setGame((current) => applyFreeze(current, index));
      setActivePower(null);
      return;
    }

    if (mode === "power" && activePower === "swap") {
      handleSwapSelection(index);
      return;
    }

    setGame((current) => applyMove(current, index, mode));
  }

  function handleSwapSelection(index: number) {
    if (game.board[index] === game.currentPlayer) {
      setSwapFrom(index);
      return;
    }

    if (swapFrom === null) {
      return;
    }

    setGame((current) => applySwap(current, swapFrom, index, mode));
    setActivePower(null);
    setSwapFrom(null);
  }

  function selectPower(power: PowerId) {
    if (mode !== "power" || game.status !== "playing" || game.powersUsed[game.currentPlayer][power]) {
      return;
    }

    if (power === "undo") {
      setGame((current) => applyUndo(current));
      setActivePower(null);
      setSwapFrom(null);
      return;
    }

    setActivePower((current) => (current === power ? null : power));
    setSwapFrom(null);
  }

  const frozenIndexes = frozenForPlayer(game);

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#102027]">
      <section className="border-b border-[#102027]/10 bg-[#fffaf0]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 md:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00a896]/30 bg-[#00a896]/10 px-3 py-1 text-sm font-semibold text-[#075f59]">
                <Sparkles size={16} aria-hidden="true" />
                Innovative Tic Tac Toe
              </div>
              <h1 className="text-4xl font-black tracking-normal text-[#073b4c] sm:text-5xl">Tic Tac Tactics</h1>
              <p className="mt-2 max-w-2xl text-base text-[#38535f]">
                Classic grid strategy upgraded with AI pressure, power moves, wild cells, and a replayable move trail.
              </p>
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Game mode">
              {MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMode(option.id)}
                  className={`rounded-lg border px-4 py-3 text-left transition ${
                    mode === option.id
                      ? "border-[#073b4c] bg-[#073b4c] text-white shadow-[0_12px_30px_rgba(7,59,76,0.18)]"
                      : "border-[#102027]/15 bg-white text-[#102027] hover:border-[#00a896]"
                  }`}
                >
                  <span className="block text-sm font-bold">{option.label}</span>
                  <span className={`block text-xs ${mode === option.id ? "text-white/75" : "text-[#526a73]"}`}>
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {mode === "ai" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#38535f]">AI level</span>
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                    difficulty === level ? "bg-[#ff6b6b] text-white" : "bg-white text-[#38535f] hover:bg-[#ffe0dc]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 md:px-8 lg:grid-cols-[minmax(280px,1fr)_minmax(320px,520px)_minmax(280px,1fr)]">
        <aside className="order-2 space-y-4 lg:order-1">
          <ScorePanel stats={stats} currentPlayer={game.currentPlayer} mode={mode} />
          <PowerPanel
            activePower={activePower}
            currentPlayer={game.currentPlayer}
            game={game}
            mode={mode}
            onSelectPower={selectPower}
            swapFrom={swapFrom}
          />
        </aside>

        <section className="order-1 lg:order-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#00a896]">Match Status</p>
              <h2 className="text-2xl font-black text-[#073b4c]">{statusText}</h2>
            </div>
            <button
              type="button"
              onClick={restartMatch}
              className="inline-flex items-center gap-2 rounded-lg bg-[#102027] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#073b4c]"
            >
              <RotateCcw size={18} aria-hidden="true" />
              New game
            </button>
          </div>

          <BoardView
            activePower={activePower}
            board={game.board}
            currentPlayer={game.currentPlayer}
            frozenIndexes={frozenIndexes}
            frozenCells={game.frozenCells}
            isAiTurn={isAiTurn}
            onCellClick={handleCellClick}
            status={game.status}
            swapFrom={swapFrom}
            wildCell={game.wildCell}
            winningLine={game.winningLine}
          />

          <AnimatePresence>
            {game.status !== "playing" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="mt-4 rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-lg bg-[#ffd166] text-[#073b4c]">
                    <Trophy size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-black text-[#073b4c]">{game.status === "won" ? `Player ${game.winner} wins` : "Draw game"}</p>
                    <p className="text-sm text-[#526a73]">
                      {game.status === "won" ? "The final line is locked in." : "No empty route left on the board."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="order-3">
          <Timeline moves={game.moves} />
        </aside>
      </section>
    </main>
  );
}

function applyMove(state: MatchState, index: number, mode: GameMode, prefix = "Player"): MatchState {
  if (state.status !== "playing" || !canPlaceMark(state.board, index, frozenForPlayer(state))) {
    return state;
  }

  const board = [...state.board];
  board[index] = state.currentPlayer;
  const result = getWinner(board);
  const draw = isDraw(board);
  const bonusTurn = mode === "power" && state.wildCell === index && !result.winner && !draw;
  const nextPlayer = bonusTurn ? state.currentPlayer : getOpponent(state.currentPlayer);
  const wildCell = mode === "power" && state.wildCell === index ? pickRandom(getAvailableMoves(board)) : state.wildCell;
  const label = bonusTurn
    ? `${prefix} ${state.currentPlayer} captured wild ${describeCell(index)}`
    : `${prefix} ${state.currentPlayer} marked ${describeCell(index)}`;

  return {
    ...state,
    board,
    currentPlayer: result.winner || draw ? state.currentPlayer : nextPlayer,
    status: result.winner ? "won" : draw ? "draw" : "playing",
    winner: result.winner,
    winningLine: result.line,
    frozenCells: finishActionForPlayer(state, state.currentPlayer),
    wildCell,
    moves: addMove(state, {
      player: state.currentPlayer,
      label,
      board,
      type: "move"
    }),
    lastPlacedIndex: {
      ...state.lastPlacedIndex,
      [state.currentPlayer]: index
    }
  };
}

function applyFreeze(state: MatchState, index: number): MatchState {
  if (
    state.status !== "playing" ||
    state.powersUsed[state.currentPlayer].freeze ||
    state.board[index] !== null ||
    state.frozenCells.some((cell) => cell.index === index)
  ) {
    return state;
  }

  const blockedFor = getOpponent(state.currentPlayer);
  const frozenCells = [
    ...finishActionForPlayer(state, state.currentPlayer),
    {
      index,
      blockedFor,
      by: state.currentPlayer
    }
  ];

  return {
    ...state,
    currentPlayer: blockedFor,
    frozenCells,
    powersUsed: markPowerUsed(state, "freeze"),
    moves: addMove(state, {
      player: state.currentPlayer,
      label: `Player ${state.currentPlayer} froze ${describeCell(index)}`,
      board: state.board,
      type: "freeze"
    })
  };
}

function applySwap(state: MatchState, from: number, to: number, mode: GameMode): MatchState {
  if (
    state.status !== "playing" ||
    state.powersUsed[state.currentPlayer].swap ||
    state.board[from] !== state.currentPlayer ||
    !canPlaceMark(state.board, to, frozenForPlayer(state))
  ) {
    return state;
  }

  const board = [...state.board];
  board[from] = null;
  board[to] = state.currentPlayer;
  const result = getWinner(board);
  const draw = isDraw(board);
  const bonusTurn = mode === "power" && state.wildCell === to && !result.winner && !draw;
  const nextPlayer = bonusTurn ? state.currentPlayer : getOpponent(state.currentPlayer);
  const wildCell = mode === "power" && state.wildCell === to ? pickRandom(getAvailableMoves(board)) : state.wildCell;

  return {
    ...state,
    board,
    currentPlayer: result.winner || draw ? state.currentPlayer : nextPlayer,
    status: result.winner ? "won" : draw ? "draw" : "playing",
    winner: result.winner,
    winningLine: result.line,
    frozenCells: finishActionForPlayer(state, state.currentPlayer),
    wildCell,
    powersUsed: markPowerUsed(state, "swap"),
    moves: addMove(state, {
      player: state.currentPlayer,
      label: `Player ${state.currentPlayer} swapped ${describeCell(from)} to ${describeCell(to)}`,
      board,
      type: "swap"
    }),
    lastPlacedIndex: {
      ...state.lastPlacedIndex,
      [state.currentPlayer]: to
    }
  };
}

function applyUndo(state: MatchState): MatchState {
  const index = state.lastPlacedIndex[state.currentPlayer];

  if (
    state.status !== "playing" ||
    state.powersUsed[state.currentPlayer].undo ||
    index === null ||
    state.board[index] !== state.currentPlayer
  ) {
    return state;
  }

  const board = [...state.board];
  board[index] = null;
  const nextPlayer = getOpponent(state.currentPlayer);

  return {
    ...state,
    board,
    currentPlayer: nextPlayer,
    frozenCells: finishActionForPlayer(state, state.currentPlayer),
    powersUsed: markPowerUsed(state, "undo"),
    moves: addMove(state, {
      player: state.currentPlayer,
      label: `Player ${state.currentPlayer} pulsed back ${describeCell(index)}`,
      board,
      type: "undo"
    }),
    lastPlacedIndex: {
      ...state.lastPlacedIndex,
      [state.currentPlayer]: null
    }
  };
}

function markPowerUsed(state: MatchState, power: PowerId): PowerUseMap {
  return {
    ...state.powersUsed,
    [state.currentPlayer]: {
      ...state.powersUsed[state.currentPlayer],
      [power]: true
    }
  };
}

function addMove(
  state: MatchState,
  move: Omit<MoveRecord, "id">
): MoveRecord[] {
  return [
    ...state.moves,
    {
      ...move,
      id: `${state.id}-${state.moves.length + 1}`
    }
  ];
}

function updateStats(stats: Stats, winner: Player | null): Stats {
  if (!winner) {
    return {
      ...stats,
      games: stats.games + 1,
      draws: stats.draws + 1,
      currentStreak: { player: null, count: 0 }
    };
  }

  const nextStreak =
    stats.currentStreak.player === winner
      ? { player: winner, count: stats.currentStreak.count + 1 }
      : { player: winner, count: 1 };

  return {
    ...stats,
    games: stats.games + 1,
    wins: {
      ...stats.wins,
      [winner]: stats.wins[winner] + 1
    },
    currentStreak: nextStreak,
    bestStreak: Math.max(stats.bestStreak, nextStreak.count)
  };
}

function BoardView({
  activePower,
  board,
  currentPlayer,
  frozenCells,
  frozenIndexes,
  isAiTurn,
  onCellClick,
  status,
  swapFrom,
  wildCell,
  winningLine
}: {
  activePower: PowerId | null;
  board: Board;
  currentPlayer: Player;
  frozenCells: FrozenCell[];
  frozenIndexes: number[];
  isAiTurn: boolean;
  onCellClick: (index: number) => void;
  status: MatchStatus;
  swapFrom: number | null;
  wildCell: number | null;
  winningLine: WinningLine | null;
}) {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[520px] grid-cols-3 gap-3 rounded-[8px] bg-[#102027] p-3 shadow-[0_18px_45px_rgba(16,32,39,0.18)]">
      {board.map((cell, index) => {
        const isWinner = winningLine?.includes(index) ?? false;
        const isFrozen = frozenIndexes.includes(index);
        const frozenBy = frozenCells.find((frozen) => frozen.index === index);
        const isWild = wildCell === index && !cell && status === "playing";
        const isSwapSource = swapFrom === index;
        const isDisabled = status !== "playing" || isAiTurn || (activePower !== "freeze" && isFrozen);

        return (
          <motion.button
            key={index}
            type="button"
            whileHover={isDisabled ? undefined : { y: -3 }}
            whileTap={isDisabled ? undefined : { scale: 0.98 }}
            onClick={() => onCellClick(index)}
            disabled={isDisabled}
            aria-label={`${describeCell(index)} ${cell ? `marked ${cell}` : "empty"}`}
            className={`relative grid min-h-0 place-items-center overflow-hidden rounded-[8px] border text-[clamp(3rem,15vw,6rem)] font-black transition ${
              isWinner
                ? "border-[#ffd166] bg-[#fff2bf] text-[#073b4c]"
                : cell === "X"
                  ? "border-[#ff6b6b]/35 bg-[#fff1ef] text-[#e64343]"
                  : cell === "O"
                    ? "border-[#00a896]/35 bg-[#e8fbf7] text-[#007f76]"
                    : "border-white/10 bg-[#fbf7ec] text-[#073b4c] hover:bg-white"
            } ${isSwapSource ? "ring-4 ring-[#ffd166]" : ""} ${isFrozen ? "opacity-60" : ""}`}
          >
            {isWild && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#ffd166] px-2 py-1 text-xs font-black text-[#073b4c]"
              >
                <Zap size={13} aria-hidden="true" />
                Wild
              </motion.span>
            )}

            {isFrozen && (
              <span className="absolute inset-x-2 bottom-2 rounded-md bg-[#073b4c] px-2 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                Frozen by {frozenBy?.by}
              </span>
            )}

            <AnimatePresence mode="wait">
              {cell && (
                <motion.span
                  key={cell}
                  initial={{ scale: 0.35, rotate: -8, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.35, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

function ScorePanel({ stats, currentPlayer, mode }: { stats: Stats; currentPlayer: Player; mode: GameMode }) {
  const items = [
    { label: "X wins", value: stats.wins.X, accent: "bg-[#ff6b6b]" },
    { label: "O wins", value: stats.wins.O, accent: "bg-[#00a896]" },
    { label: "Draws", value: stats.draws, accent: "bg-[#ffd166]" },
    { label: "Best streak", value: stats.bestStreak, accent: "bg-[#073b4c]" }
  ];

  return (
    <section className="rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#00a896]">Score</p>
          <h2 className="text-xl font-black text-[#073b4c]">Player {currentPlayer} is active</h2>
        </div>
        <div className="grid size-11 place-items-center rounded-lg bg-[#e8fbf7] text-[#007f76]">
          {mode === "ai" ? <Bot aria-hidden="true" /> : mode === "power" ? <Sparkles aria-hidden="true" /> : <Swords aria-hidden="true" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-[#102027]/10 p-3">
            <span className={`mb-3 block h-1.5 w-10 rounded-full ${item.accent}`} />
            <p className="text-2xl font-black text-[#073b4c]">{item.value}</p>
            <p className="text-sm font-semibold text-[#526a73]">{item.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-[#526a73]">
        Total games: <span className="font-black text-[#073b4c]">{stats.games}</span>
      </p>
    </section>
  );
}

function PowerPanel({
  activePower,
  currentPlayer,
  game,
  mode,
  onSelectPower,
  swapFrom
}: {
  activePower: PowerId | null;
  currentPlayer: Player;
  game: MatchState;
  mode: GameMode;
  onSelectPower: (power: PowerId) => void;
  swapFrom: number | null;
}) {
  const powers: Array<{ id: PowerId; label: string; description: string; icon: typeof Snowflake }> = [
    { id: "freeze", label: "Freeze", description: "Lock one empty tile for the opponent", icon: Snowflake },
    { id: "swap", label: "Swap", description: "Move one of your marks to an empty tile", icon: Shuffle },
    { id: "undo", label: "Undo Pulse", description: "Remove your latest mark from the board", icon: Shield }
  ];

  if (mode !== "power") {
    return (
      <section className="rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.06)]">
        <div className="mb-3 grid size-11 place-items-center rounded-lg bg-[#fff2bf] text-[#073b4c]">
          <Brain aria-hidden="true" />
        </div>
        <h2 className="text-xl font-black text-[#073b4c]">Tactics are waiting</h2>
        <p className="mt-2 text-sm text-[#526a73]">
          Switch to Power Mode to unlock Freeze, Swap, Undo Pulse, and the bonus-turn Wild Cell.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.06)]">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#ff6b6b]">Power Mode</p>
        <h2 className="text-xl font-black text-[#073b4c]">Player {currentPlayer} tools</h2>
      </div>

      <div className="space-y-2">
        {powers.map((power) => {
          const Icon = power.icon;
          const used = game.powersUsed[currentPlayer][power.id];
          const active = activePower === power.id;

          return (
            <button
              key={power.id}
              type="button"
              onClick={() => onSelectPower(power.id)}
              disabled={used || game.status !== "playing"}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                active
                  ? "border-[#073b4c] bg-[#073b4c] text-white"
                  : used
                    ? "border-[#102027]/10 bg-[#f2eee3] text-[#87939a]"
                    : "border-[#102027]/10 bg-[#fffaf0] text-[#102027] hover:border-[#00a896]"
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                  active ? "bg-white/15 text-white" : "bg-[#e8fbf7] text-[#007f76]"
                }`}
              >
                <Icon size={19} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-black">{power.label}</span>
                <span className={`block text-sm ${active ? "text-white/75" : "text-[#526a73]"}`}>
                  {used ? "Used this match" : power.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 rounded-lg bg-[#e8fbf7] p-3 text-sm font-semibold text-[#075f59]">
        {activePower === "freeze" && "Choose an empty tile to freeze for the opponent's next turn."}
        {activePower === "swap" &&
          (swapFrom === null ? "Choose one of your marks, then choose where it should move." : `Moving from ${describeCell(swapFrom)}. Choose an empty target.`)}
        {!activePower && "Wild cells grant a bonus turn when captured."}
      </p>
    </section>
  );
}

function Timeline({ moves }: { moves: MoveRecord[] }) {
  return (
    <section className="rounded-lg border border-[#102027]/10 bg-white p-4 shadow-[0_14px_35px_rgba(16,32,39,0.06)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-[#073b4c] text-white">
          <History aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#00a896]">Timeline</p>
          <h2 className="text-xl font-black text-[#073b4c]">Replay trail</h2>
        </div>
      </div>

      {moves.length === 0 ? (
        <p className="rounded-lg bg-[#fffaf0] p-4 text-sm text-[#526a73]">Moves appear here as the match unfolds.</p>
      ) : (
        <ol className="max-h-[520px] space-y-3 overflow-auto pr-1">
          {moves.map((move, index) => (
            <li key={move.id} className="rounded-lg border border-[#102027]/10 bg-[#fffaf0] p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-black text-[#073b4c]">Move {index + 1}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-black ${
                    move.player === "X" ? "bg-[#ffe0dc] text-[#b72f2f]" : "bg-[#e8fbf7] text-[#007f76]"
                  }`}
                >
                  {move.player}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#38535f]">{move.label}</p>
              <MiniBoard board={move.board} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function MiniBoard({ board }: { board: Board }) {
  return (
    <div className="mt-3 grid w-24 grid-cols-3 gap-1">
      {board.map((cell, index) => (
        <span
          key={index}
          className={`grid aspect-square place-items-center rounded text-xs font-black ${
            cell === "X" ? "bg-[#ffe0dc] text-[#b72f2f]" : cell === "O" ? "bg-[#dff8f3] text-[#007f76]" : "bg-white text-[#a6b0b5]"
          }`}
        >
          {cell ?? ""}
        </span>
      ))}
    </div>
  );
}

export default App;
