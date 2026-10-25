import assert from "node:assert/strict";
import { createPuzzleSeed, makeWordSearch, scrambleSentence, scrambleWord } from "../lib/puzzle-generators.ts";
import { createSeededRandom } from "../lib/seeded-random.ts";

const wordSearchSeed = createPuzzleSeed("word-search", 0, "APPLE\nBANANA\nORANGE\nGRAPE\nMANGO", 12, "medium");
const serverPuzzle = makeWordSearch(["APPLE", "BANANA", "ORANGE", "GRAPE", "MANGO"], 12, "medium", wordSearchSeed);
const clientPuzzle = makeWordSearch(["APPLE", "BANANA", "ORANGE", "GRAPE", "MANGO"], 12, "medium", wordSearchSeed);
assert.deepEqual(clientPuzzle, serverPuzzle, "word search must be deterministic across server and client renders");
assert.equal(serverPuzzle.failed.length, 0);
for (const placement of serverPuzzle.placements) {
  const rendered = Array.from({ length: placement.word.length }, (_, index) => serverPuzzle.grid[placement.row + placement.dr * index][placement.col + placement.dc * index]).join("");
  assert.equal(rendered, placement.word, `${placement.word} must match its answer-key placement`);
}

const sentenceSeed = createPuzzleSeed("sentence", 0, "The curious fox jumps over the log.", "medium", 1, 0);
assert.equal(
  scrambleSentence("The curious fox jumps over the log.", "medium", createSeededRandom(sentenceSeed)),
  scrambleSentence("The curious fox jumps over the log.", "medium", createSeededRandom(sentenceSeed)),
  "sentence scramble must be deterministic",
);

const wordSeed = createPuzzleSeed("word-scramble", 0, "planet", "medium");
assert.equal(scrambleWord("planet", "medium", createSeededRandom(wordSeed)), scrambleWord("planet", "medium", createSeededRandom(wordSeed)), "word scramble must be deterministic");
assert.notEqual(makeWordSearch(["APPLE", "BANANA"], 10, "medium", "seed-a").grid.flat().join(""), makeWordSearch(["APPLE", "BANANA"], 10, "medium", "seed-b").grid.flat().join(""), "different seeds should regenerate a different puzzle");

console.log("Puzzle hydration regression checks passed.");
