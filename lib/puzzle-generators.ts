import { createSeededRandom, shuffleWithRandom, type RandomSource } from "./seeded-random.ts";

export type PuzzleDifficulty = "easy" | "medium" | "hard";

export function createPuzzleSeed(kind: string, seed: number, ...inputs: Array<string | number>) {
  return [kind, seed, ...inputs].join("\u001f");
}

export function scrambleWord(word: string, difficulty: PuzzleDifficulty, random: RandomSource) {
  const characters = Array.from(word);
  if (characters.length < 2) return word;
  let output = characters;
  for (let attempt = 0; attempt < 12 && output.join("") === word; attempt += 1) output = shuffleWithRandom(characters, random);
  if (difficulty === "easy" && characters.length > 3) output = [characters[0], ...shuffleWithRandom(characters.slice(1, -1), random), characters.at(-1)!];
  return output.join("");
}

export function scrambleSentence(sentence: string, difficulty: PuzzleDifficulty, random: RandomSource) {
  const match = sentence.trim().match(/^(.*?)([.!?]*)$/);
  const core = match?.[1] ?? sentence;
  const punctuation = match?.[2] ?? "";
  const words = core.split(/\s+/).filter(Boolean);
  if (words.length < 2) return sentence;
  if (difficulty === "easy" && words.length > 3) return `${[words[0], ...shuffleWithRandom(words.slice(1, -1), random), words.at(-1)!].join(" ")}${punctuation}`;
  let output = words;
  for (let attempt = 0; attempt < 12 && output.join(" ") === words.join(" "); attempt += 1) output = shuffleWithRandom(words, random);
  return `${output.join(" ")}${punctuation}`;
}

export type WordSearchPlacement = { word: string; row: number; col: number; dr: number; dc: number };

export type WordSearchDirection = [number, number];

/** Fold accents to their base letter (café → CAFE, piñata → PINATA) instead of dropping them. */
export function foldAccents(word: string) {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const wordSearchDirections: Record<string, WordSearchDirection[]> = {
  easy: [[0, 1], [1, 0]],
  medium: [[0, 1], [1, 0], [1, 1], [-1, 1]],
  hard: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]],
};

export function makeWordSearch(
  words: string[],
  size: number,
  difficulty: PuzzleDifficulty,
  seed: string | number,
  allowedDirections?: WordSearchDirection[],
) {
  const random = createSeededRandom(seed);
  const clean = words.map((word) => foldAccents(word).toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean).toSorted((a, b) => b.length - a.length);
  const grid: string[][] = Array.from({ length: size }, () => Array<string>(size).fill(""));
  const placements: WordSearchPlacement[] = [];
  const directions = allowedDirections?.length ? allowedDirections : wordSearchDirections[difficulty];
  for (const word of clean) {
    // Score candidate slots by matching-letter overlaps and keep the best:
    // words prefer to cross each other instead of landing in empty space.
    let best: { score: number; row: number; col: number; dr: number; dc: number } | undefined;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const [dr, dc] = directions[Math.floor(random() * directions.length)];
      const row = Math.floor(random() * size), col = Math.floor(random() * size);
      const endRow = row + dr * (word.length - 1), endCol = col + dc * (word.length - 1);
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;
      let available = true, overlaps = 0;
      for (let index = 0; index < word.length; index += 1) {
        const cell = grid[row + dr * index][col + dc * index];
        if (cell && cell !== word[index]) { available = false; break; }
        if (cell === word[index]) overlaps += 1;
      }
      if (!available) continue;
      if (!best || overlaps > best.score) best = { score: overlaps, row, col, dr, dc };
      // A slot that crosses an existing word is good enough; stop early.
      if (overlaps > 0 && attempt > 40) break;
    }
    if (best) {
      for (let index = 0; index < word.length; index += 1) grid[best.row + best.dr * index][best.col + best.dc * index] = word[index];
      placements.push({ word, row: best.row, col: best.col, dr: best.dr, dc: best.dc });
    }
  }
  // Filler letters are drawn from the word list's own letter distribution
  // (plus one of every letter, so no letter is impossible) — random filler
  // stands out less against the placed words than uniform A–Z filler.
  const fillerPool = [...clean.join(""), ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  for (const row of grid) for (let column = 0; column < size; column += 1) if (!row[column]) row[column] = fillerPool[Math.floor(random() * fillerPool.length)];
  return { grid, placements, failed: clean.filter((word) => !placements.some((placement) => placement.word === word)) };
}
