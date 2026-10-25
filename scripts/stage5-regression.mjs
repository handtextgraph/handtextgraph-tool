import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { countSudokuSolutions, generateSudoku, calculatePosterTiles, floodFillPixels } from "../lib/stage5-tools.ts";

for (const difficulty of ["easy","medium","hard"]) for (const seed of ["alpha","classroom-42","repeatable"]) {
  const first = generateSudoku(seed, difficulty), second = generateSudoku(seed, difficulty);
  assert.deepEqual(first.puzzle, second.puzzle, `${difficulty} seed must be deterministic`);
  assert.equal(countSudokuSolutions(first.puzzle), 1, `${difficulty} puzzle must have exactly one solution`);
  for (let index=0; index<9; index+=1) {
    assert.equal(new Set(first.solution[index]).size, 9, "solution row must contain 1–9");
    assert.equal(new Set(first.solution.map((row) => row[index])).size, 9, "solution column must contain 1–9");
  }
}
const tiles = calculatePosterTiles(4000, 3000, 3, 2, .05);
assert.equal(tiles.length, 6);
assert.deepEqual(tiles.map(({row,col}) => [row,col]), [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]]);
assert.equal(tiles.every((tile) => tile.sx >= 0 && tile.sy >= 0 && tile.sx + tile.sw <= 4000.001 && tile.sy + tile.sh <= 3000.001), true);
assert.deepEqual(floodFillPixels(["a","a","b","a","b","b","c","c","b"],3,3,0,"x"),["x","x","b","x","b","b","c","c","b"]);
const routes = ["number-grid-generator","printable-number-charts","sudoku-generator","blank-table-generator","virtual-graph-paper","pixel-art-generator","block-poster-maker","multi-page-image-poster-generator"];
const catalog = readFileSync(join(process.cwd(),"lib","tool-catalog.ts"),"utf8"), sitemap = readFileSync(join(process.cwd(),"app","sitemap.ts"),"utf8");
for (const route of routes) { assert.equal(existsSync(join(process.cwd(),"app",route,"page.tsx")),true,`${route} route missing`); assert.match(catalog,new RegExp(`/${route}`)); assert.match(sitemap,new RegExp(`/${route}`)); }
console.log(`Stage 5 regression passed: 9 unique Sudoku puzzles and ${routes.length} public routes verified.`);
