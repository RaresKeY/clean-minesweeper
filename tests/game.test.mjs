import assert from "node:assert/strict";
import { DIFFICULTIES, MARK_FLAG, MARK_NONE, MARK_QUESTION, MinesweeperGame } from "../public/src/game.js";

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

testFirstRevealSafety();
testMarkCycle();
testWinFlagsRemainingMines();
testLossRevealsMinesAndWrongFlags();
testChordRevealsWhenFlagsMatch();

console.log("game tests passed");
