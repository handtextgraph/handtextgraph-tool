import { createSeededRandom, shuffleWithRandom, type RandomSource } from "./seeded-random.ts";

export type SudokuDifficulty = "easy" | "medium" | "hard" | "expert";
export type SudokuSize = 4 | 6 | 9;
export type SudokuPuzzle = { puzzle: number[][]; solution: number[][]; seed: string; difficulty: SudokuDifficulty; size: SudokuSize };

/** Box dimensions per grid size: 4x4 uses 2x2 boxes, 6x6 uses 2-row x 3-column boxes, 9x9 uses 3x3 boxes. */
export const sudokuBoxDimensions: Record<SudokuSize, [number, number]> = { 4: [2, 2], 6: [2, 3], 9: [3, 3] };

/**
 * Target clue counts per size and difficulty. These are the counts the
 * generator removes down to while keeping exactly one solution. Measured
 * 10 Nov 2026 (20 puzzles per combination, 60 for 9x9 expert): every
 * combination hits its target exactly except 9x9 expert, which lands at
 * 24-26 clues (24 x35, 25 x21, 26 x4 in 60 puzzles) — publish that one
 * as a range, the rest as exact numbers.
 */
export const sudokuClueTargets: Record<SudokuSize, Record<SudokuDifficulty, number>> = {
  4: { easy: 12, medium: 10, hard: 8, expert: 6 },
  6: { easy: 26, medium: 22, hard: 18, expert: 16 },
  9: { easy: 40, medium: 33, hard: 27, expert: 24 },
};

function sudokuCandidates(board: number[][], row: number, col: number, size: SudokuSize) {
  const [boxRows, boxCols] = sudokuBoxDimensions[size];
  const used = new Set<number>();
  for (let i = 0; i < size; i += 1) { used.add(board[row][i]); used.add(board[i][col]); }
  const boxRow = Math.floor(row / boxRows) * boxRows, boxCol = Math.floor(col / boxCols) * boxCols;
  for (let r = boxRow; r < boxRow + boxRows; r += 1) for (let c = boxCol; c < boxCol + boxCols; c += 1) used.add(board[r][c]);
  return Array.from({ length: size }, (_, index) => index + 1).filter((value) => !used.has(value));
}

function solveBoard(board: number[][], size: SudokuSize, random?: RandomSource) {
  let target: { row: number; col: number; choices: number[] } | undefined;
  for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) if (!board[row][col]) {
    const choices = sudokuCandidates(board, row, col, size);
    if (!choices.length) return false;
    if (!target || choices.length < target.choices.length) target = { row, col, choices };
  }
  if (!target) return true;
  const choices = random ? shuffleWithRandom(target.choices, random) : target.choices;
  for (const value of choices) { board[target.row][target.col] = value; if (solveBoard(board, size, random)) return true; }
  board[target.row][target.col] = 0;
  return false;
}

export function countSudokuSolutions(source: number[][], size: SudokuSize, limit = 2) {
  const board = source.map((row) => [...row]); let count = 0;
  const walk = () => {
    if (count >= limit) return;
    let target: { row: number; col: number; choices: number[] } | undefined;
    for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) if (!board[row][col]) {
      const choices = sudokuCandidates(board, row, col, size);
      if (!choices.length) return;
      if (!target || choices.length < target.choices.length) target = { row, col, choices };
    }
    if (!target) { count += 1; return; }
    for (const value of target.choices) { board[target.row][target.col] = value; walk(); if (count >= limit) break; }
    board[target.row][target.col] = 0;
  };
  walk(); return count;
}

export function generateSudokuPuzzle(seed: string | number, difficulty: SudokuDifficulty, size: SudokuSize): SudokuPuzzle {
  const seedText = String(seed);
  // 9x9 keeps the original seed string so seeds shared before the 4x4/6x6
  // work still reproduce the same puzzle; other sizes add their size.
  const random = createSeededRandom(size === 9 ? `sudoku\u001f${seedText}\u001f${difficulty}` : `sudoku\u001f${seedText}\u001f${difficulty}\u001f${size}`);
  const solution = Array.from({ length: size }, () => Array<number>(size).fill(0));
  solveBoard(solution, size, random);
  const puzzle = solution.map((row) => [...row]);
  const targetClues = sudokuClueTargets[size][difficulty];
  const cells = shuffleWithRandom(Array.from({ length: size * size }, (_, index) => index), random);
  for (const index of cells) {
    if (puzzle.flat().filter(Boolean).length <= targetClues) break;
    const row = Math.floor(index / size), col = index % size, previous = puzzle[row][col];
    puzzle[row][col] = 0;
    if (countSudokuSolutions(puzzle, size, 2) !== 1) puzzle[row][col] = previous;
  }
  return { puzzle, solution, seed: seedText, difficulty, size };
}

/** Short shareable ID for one puzzle: base64url of size, difficulty, seed, version, index. */
export function encodeSudokuId(size: SudokuSize, difficulty: SudokuDifficulty, seed: string, version: number, index: number) {
  const raw = [size, difficulty, seed, version, index].join("\u001f");
  const bytes = new TextEncoder().encode(raw);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeSudokuId(id: string) {
  try {
    const bytes = Uint8Array.from(atob(id.replaceAll("-", "+").replaceAll("_", "/")), (c) => c.charCodeAt(0));
    const [size, difficulty, seed, version, index] = new TextDecoder().decode(bytes).split("\u001f");
    const parsedSize = Number(size);
    if (![4, 6, 9].includes(parsedSize) || !["easy", "medium", "hard", "expert"].includes(difficulty) || !seed) return null;
    return { size: parsedSize as SudokuSize, difficulty: difficulty as SudokuDifficulty, seed, version: Number(version) || 0, index: Number(index) || 0 };
  } catch {
    return null;
  }
}

/** 9x9 wrapper kept for existing callers; new code should use generateSudokuPuzzle. */
export function generateSudoku(seed: string | number, difficulty: SudokuDifficulty): SudokuPuzzle {
  return generateSudokuPuzzle(seed, difficulty, 9);
}

export type PaperKind = "a4" | "letter" | "a3" | "legal";
export type Orientation = "portrait" | "landscape";
export const paperMillimeters: Record<PaperKind, [number, number]> = { a4: [210, 297], letter: [215.9, 279.4], a3: [297, 420], legal: [215.9, 355.6] };

export type PosterTile = { page: number; row: number; col: number; sx: number; sy: number; sw: number; sh: number };
export function calculatePosterTiles(imageWidth: number, imageHeight: number, columns: number, rows: number, overlapRatio: number): PosterTile[] {
  const safeOverlap = Math.max(0, Math.min(0.25, overlapRatio));
  const stepX = imageWidth / (columns - Math.max(0, columns - 1) * safeOverlap);
  const stepY = imageHeight / (rows - Math.max(0, rows - 1) * safeOverlap);
  const tileWidth = stepX * (1 + safeOverlap), tileHeight = stepY * (1 + safeOverlap);
  return Array.from({ length: rows * columns }, (_, page) => {
    const row = Math.floor(page / columns), col = page % columns;
    const sx = Math.max(0, col * stepX - (col ? tileWidth - stepX : 0));
    const sy = Math.max(0, row * stepY - (row ? tileHeight - stepY : 0));
    return { page: page + 1, row, col, sx, sy, sw: Math.min(tileWidth, imageWidth - sx), sh: Math.min(tileHeight, imageHeight - sy) };
  });
}

export function floodFillPixels(cells: string[], columns: number, rows: number, start: number, replacement: string) {
  const output = [...cells], target = output[start];
  if (!target || target === replacement) return output;
  const queue = [start], seen = new Set<number>();
  while (queue.length) {
    const index = queue.pop()!; if (seen.has(index) || output[index] !== target) continue;
    seen.add(index); output[index] = replacement;
    const row = Math.floor(index / columns), col = index % columns;
    if (row) queue.push(index - columns); if (row + 1 < rows) queue.push(index + columns);
    if (col) queue.push(index - 1); if (col + 1 < columns) queue.push(index + 1);
  }
  return output;
}
