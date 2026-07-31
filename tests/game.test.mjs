import assert from "node:assert/strict";
import {
  DIFFICULTIES,
  MARK_FLAG,
  MARK_NONE,
  MARK_QUESTION,
  MinesweeperGame,
  createCustomDifficulty,
  customMineMaximum,
} from "../public/src/game.js";

function fixedRng(value) {
  return () => value;
}

function testFirstRevealSafety() {
  const game = new MinesweeperGame(DIFFICULTIES.beginner, { rng: fixedRng(0.5) });
  const result = game.reveal(4, 4);
  assert.equal(result.started, true);
  assert.equal(game.cellAt(4, 4).mine, false);
  for (const neighbor of game.neighbors(4, 4)) {
    assert.equal(neighbor.mine, false, `neighbor ${neighbor.x},${neighbor.y} should be safe`);
  }
}

function testMarkCycle() {
  const game = new MinesweeperGame(DIFFICULTIES.beginner);
  const cell = game.cellAt(0, 0);
  assert.equal(cell.mark, MARK_NONE);
  game.cycleMark(0, 0);
  assert.equal(cell.mark, MARK_FLAG);
  assert.equal(game.stats().minesRemaining, 9);
  game.cycleMark(0, 0);
  assert.equal(cell.mark, MARK_QUESTION);
  assert.equal(game.stats().minesRemaining, 10);
  game.cycleMark(0, 0);
  assert.equal(cell.mark, MARK_NONE);
}

function testQuestionRevealClearsMarker() {
  const game = new MinesweeperGame(DIFFICULTIES.beginner, { rng: fixedRng(0.5) });
  const cell = game.cellAt(3, 3);
  game.cycleMark(3, 3);
  game.cycleMark(3, 3);
  assert.equal(cell.mark, MARK_QUESTION);
  const result = game.reveal(3, 3);
  assert.equal(result.started, true);
  assert.equal(cell.mark, MARK_NONE);
  assert.equal(cell.revealed, true);
}

function testWinFlagsRemainingMines() {
  const game = new MinesweeperGame({ width: 2, height: 2, mines: 1 }, { rng: fixedRng(0) });
  game.reveal(0, 0);
  for (const cell of game.cells) {
    if (!cell.mine) {
      game.reveal(cell.x, cell.y);
    }
  }
  assert.equal(game.status, "won");
  assert.equal(game.cells.filter((cell) => cell.mine && cell.mark === MARK_FLAG).length, 1);
  assert.equal(game.stats().safeRemaining, 0);
}

function testLossRevealsMinesAndWrongFlags() {
  const game = new MinesweeperGame({ width: 2, height: 2, mines: 1 });
  game.firstReveal = false;
  game.status = "playing";
  const mine = game.cellAt(1, 1);
  const safe = game.cellAt(0, 1);
  mine.mine = true;
  game.cycleMark(safe.x, safe.y);
  game.reveal(mine.x, mine.y);
  assert.equal(game.status, "lost");
  assert.equal(mine.revealed, true);
  assert.equal(mine.hit, true);
  assert.equal(safe.wrong, true);
}

function testChordRevealsWhenFlagsMatch() {
  const game = new MinesweeperGame({ width: 2, height: 2, mines: 1 });
  game.firstReveal = false;
  game.status = "playing";
  game.revealedSafe = 1;

  const origin = game.cellAt(0, 0);
  const mine = game.cellAt(1, 0);
  const safeA = game.cellAt(0, 1);
  const safeB = game.cellAt(1, 1);

  origin.revealed = true;
  origin.adjacent = 1;
  mine.mine = true;
  mine.mark = MARK_FLAG;
  safeA.adjacent = 1;
  safeB.adjacent = 1;

  const result = game.chord(0, 0);
  assert.equal(result.changed, true);
  assert.equal(safeA.revealed, true);
  assert.equal(safeB.revealed, true);
}

function testCustomDifficultyValidation() {
  assert.deepEqual(createCustomDifficulty(30, 24, 160), {
    key: "custom",
    label: "Custom",
    width: 30,
    height: 24,
    mines: 160,
  });
  assert.equal(customMineMaximum(30, 24), 668);
  assert.equal(customMineMaximum(9, 9), 80);
  assert.throws(() => createCustomDifficulty(8, 9, 10), /Width/);
  assert.throws(() => createCustomDifficulty(9, 25, 10), /Height/);
  assert.throws(() => createCustomDifficulty(9, 9, 9), /Mines/);
  assert.throws(() => createCustomDifficulty(9, 9, 81), /Mines/);
  assert.throws(() => createCustomDifficulty(9.5, 9, 10), /whole number/);
}

function testMaximumDensityCustomBoardStartsSafely() {
  const config = createCustomDifficulty(9, 9, 80);
  const game = new MinesweeperGame(config, { rng: fixedRng(0) });
  const result = game.reveal(4, 4);
  assert.equal(result.started, true);
  assert.equal(game.cellAt(4, 4).mine, false);
  assert.equal(game.cells.filter((cell) => cell.mine).length, 80);
  assert.equal(game.status, "won");
}

testFirstRevealSafety();
testMarkCycle();
testQuestionRevealClearsMarker();
testWinFlagsRemainingMines();
testLossRevealsMinesAndWrongFlags();
testChordRevealsWhenFlagsMatch();
testCustomDifficultyValidation();
testMaximumDensityCustomBoardStartsSafely();

console.log("game tests passed");
