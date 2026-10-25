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

export function makeWordSearch(words: string[], size: number, difficulty: PuzzleDifficulty, seed: string | number) {
  const random = createSeededRandom(seed);
  const clean = words.map((word) => word.toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean).toSorted((a, b) => b.length - a.length);
  const grid: string[][] = Array.from({ length: size }, () => Array<string>(size).fill(""));
  const placements: WordSearchPlacement[] = [];
  const directions = difficulty === "easy" ? [[0, 1], [1, 0]] : difficulty === "medium" ? [[0, 1], [1, 0], [1, 1], [-1, 1]] : [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
  for (const word of clean) {
    let placed = false;
    for (let attempt = 0; attempt < 500 && !placed; attempt += 1) {
      const [dr, dc] = directions[Math.floor(random() * directions.length)];
      const row = Math.floor(random() * size), col = Math.floor(random() * size);
      const endRow = row + dr * (word.length - 1), endCol = col + dc * (word.length - 1);
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;
      let available = true;
      for (let index = 0; index < word.length; index += 1) { const cell = grid[row + dr * index][col + dc * index]; if (cell && cell !== word[index]) available = false; }
      if (available) {
        for (let index = 0; index < word.length; index += 1) grid[row + dr * index][col + dc * index] = word[index];
        placements.push({ word, row, col, dr, dc }); placed = true;
      }
    }
  }
  for (const row of grid) for (let column = 0; column < size; column += 1) if (!row[column]) row[column] = String.fromCharCode(65 + Math.floor(random() * 26));
  return { grid, placements, failed: clean.filter((word) => !placements.some((placement) => placement.word === word)) };
}
