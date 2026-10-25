import { createSeededRandom, shuffleWithRandom, type RandomSource } from "./seeded-random.ts";

export type SudokuDifficulty = "easy" | "medium" | "hard";
export type SudokuPuzzle = { puzzle: number[][]; solution: number[][]; seed: string; difficulty: SudokuDifficulty };

function sudokuCandidates(board: number[][], row: number, col: number) {
  const used = new Set<number>();
  for (let i = 0; i < 9; i += 1) { used.add(board[row][i]); used.add(board[i][col]); }
  const boxRow = Math.floor(row / 3) * 3, boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r += 1) for (let c = boxCol; c < boxCol + 3; c += 1) used.add(board[r][c]);
  return [1,2,3,4,5,6,7,8,9].filter((value) => !used.has(value));
}

function solveBoard(board: number[][], random?: RandomSource) {
  let target: { row: number; col: number; choices: number[] } | undefined;
  for (let row = 0; row < 9; row += 1) for (let col = 0; col < 9; col += 1) if (!board[row][col]) {
    const choices = sudokuCandidates(board, row, col);
    if (!choices.length) return false;
    if (!target || choices.length < target.choices.length) target = { row, col, choices };
  }
  if (!target) return true;
  const choices = random ? shuffleWithRandom(target.choices, random) : target.choices;
  for (const value of choices) { board[target.row][target.col] = value; if (solveBoard(board, random)) return true; }
  board[target.row][target.col] = 0;
  return false;
}

export function countSudokuSolutions(source: number[][], limit = 2) {
  const board = source.map((row) => [...row]); let count = 0;
  const walk = () => {
    if (count >= limit) return;
    let target: { row: number; col: number; choices: number[] } | undefined;
    for (let row = 0; row < 9; row += 1) for (let col = 0; col < 9; col += 1) if (!board[row][col]) {
      const choices = sudokuCandidates(board, row, col);
      if (!choices.length) return;
      if (!target || choices.length < target.choices.length) target = { row, col, choices };
    }
    if (!target) { count += 1; return; }
    for (const value of target.choices) { board[target.row][target.col] = value; walk(); if (count >= limit) break; }
    board[target.row][target.col] = 0;
  };
  walk(); return count;
}

export function generateSudoku(seed: string | number, difficulty: SudokuDifficulty): SudokuPuzzle {
  const seedText = String(seed), random = createSeededRandom(`sudoku\u001f${seedText}\u001f${difficulty}`);
  const solution = Array.from({ length: 9 }, () => Array<number>(9).fill(0));
  solveBoard(solution, random);
  const puzzle = solution.map((row) => [...row]);
  const targetClues = { easy: 40, medium: 33, hard: 27 }[difficulty];
  const cells = shuffleWithRandom(Array.from({ length: 81 }, (_, index) => index), random);
  for (const index of cells) {
    if (puzzle.flat().filter(Boolean).length <= targetClues) break;
    const row = Math.floor(index / 9), col = index % 9, previous = puzzle[row][col];
    puzzle[row][col] = 0;
    if (countSudokuSolutions(puzzle, 2) !== 1) puzzle[row][col] = previous;
  }
  return { puzzle, solution, seed: seedText, difficulty };
}

export type PaperKind = "a4" | "letter";
export type Orientation = "portrait" | "landscape";
export const paperMillimeters: Record<PaperKind, [number, number]> = { a4: [210, 297], letter: [215.9, 279.4] };

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
