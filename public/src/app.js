import { DIFFICULTIES, MARK_FLAG, MARK_NONE, MARK_QUESTION, MinesweeperGame } from "./game.js";

const board = document.querySelector("#board");
const boardWrap = document.querySelector(".board-wrap");
const difficultySelect = document.querySelector("#difficulty-select");
const mineCount = document.querySelector("#mine-count");
const resetButton = document.querySelector("#reset-button");
const status = document.querySelector("#status");
const timer = document.querySelector("#timer");

let difficultyKey = "beginner";
let game = new MinesweeperGame(DIFFICULTIES[difficultyKey]);
let focusedIndex = 0;
let timerHandle = 0;
let timerStartedAt = 0;
let elapsedSeconds = 0;
let touchHoldHandle = 0;
let touchHoldCell = null;
let touchActionHandled = false;
let ignoreClickUntil = 0;

function formatCounter(value) {
  const sign = value < 0 ? "-" : "";
  return `${sign}${String(Math.abs(value)).padStart(3, "0")}`;
}

function cellButtonFromEvent(event) {
  return event.target.closest(".cell");
}

function cellFromButton(button) {
  return game.cells[Number(button.dataset.index)];
}

function startTimerIfNeeded() {
  if (timerHandle || game.status !== "playing") {
    return;
  }
  timerStartedAt = Date.now() - elapsedSeconds * 1000;
  timerHandle = window.setInterval(updateTimer, 250);
  updateTimer();
}

function stopTimer() {
  if (timerHandle) {
    window.clearInterval(timerHandle);
    timerHandle = 0;
  }
  updateTimer();
}

function updateTimer() {
  if (timerHandle) {
    elapsedSeconds = Math.min(999, Math.floor((Date.now() - timerStartedAt) / 1000));
  }
  timer.textContent = formatCounter(elapsedSeconds);
}

function setStatusText() {
  const stats = game.stats();
  if (game.status === "ready") {
    status.textContent = "Choose a square to start.";
  } else if (game.status === "won") {
    status.textContent = `Cleared in ${elapsedSeconds} seconds.`;
  } else if (game.status === "lost") {
    status.textContent = "Mine hit. Start a new board when ready.";
  } else {
    status.textContent = `${stats.safeRemaining} safe squares left.`;
  }
}

function labelForCell(cell) {
  const coordinate = `Row ${cell.y + 1}, column ${cell.x + 1}`;
  if (game.status === "lost" && cell.wrong) {
    return `${coordinate}, incorrect flag.`;
  }
  if (!cell.revealed) {
    if (cell.mark === MARK_FLAG) {
      return `${coordinate}, flagged.`;
    }
    if (cell.mark === MARK_QUESTION) {
      return `${coordinate}, marked question.`;
    }
    return `${coordinate}, closed.`;
  }
  if (cell.mine) {
    return `${coordinate}, mine.`;
  }
  if (cell.adjacent === 0) {
    return `${coordinate}, open empty.`;
  }
  return `${coordinate}, open ${cell.adjacent}.`;
}

function classForCell(cell) {
  const classes = ["cell"];
  if (cell.revealed) {
    classes.push("revealed");
  }
  if (cell.mark === MARK_FLAG) {
    classes.push("flagged");
  }
  if (cell.mark === MARK_QUESTION) {
    classes.push("questioned");
  }
  if (cell.mine && cell.revealed) {
    classes.push(cell.hit ? "mine-hit" : "mine");
  }
  if (cell.wrong) {
    classes.push("wrong-flag");
  }
  if (cell.revealed && cell.adjacent) {
    classes.push(`number-${cell.adjacent}`);
  }
  return classes.join(" ");
}

function renderBoardStructure() {
  board.replaceChildren();
  board.style.setProperty("--cols", game.width);
  board.style.setProperty("--rows", game.height);
  board.setAttribute("aria-rowcount", String(game.height));
  board.setAttribute("aria-colcount", String(game.width));

  for (const cell of game.cells) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cell";
    button.dataset.index = String(game.index(cell.x, cell.y));
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-rowindex", String(cell.y + 1));
    button.setAttribute("aria-colindex", String(cell.x + 1));
    board.append(button);
  }
}

function renderCells() {
  for (const button of board.children) {
    const cell = cellFromButton(button);
    button.className = classForCell(cell);
    button.textContent = cell.revealed && !cell.mine && cell.adjacent ? String(cell.adjacent) : "";
    button.setAttribute("aria-label", labelForCell(cell));
    button.setAttribute("aria-disabled", game.isComplete() ? "true" : "false");
    button.tabIndex = Number(button.dataset.index) === focusedIndex ? 0 : -1;
  }
}

function renderStats() {
  const stats = game.stats();
  mineCount.textContent = formatCounter(stats.minesRemaining);
  setStatusText();
  updateTimer();
}

function render() {
  renderCells();
  renderStats();
}

function resizeBoard() {
  const wrapRect = boardWrap.getBoundingClientRect();
  const availableHeight = Math.max(280, window.innerHeight - wrapRect.top - 24);
  const tileSize = Math.floor(
    Math.max(22, Math.min(38, (wrapRect.width - 8) / game.width, availableHeight / game.height)),
  );
  board.style.setProperty("--tile-size", `${tileSize}px`);
}

function setFocus(index, moveFocus = false) {
  focusedIndex = Math.max(0, Math.min(game.cells.length - 1, index));
  renderCells();
  if (moveFocus) {
    board.children[focusedIndex]?.focus();
  }
}

function finishAction(result) {
  if (result.started) {
    startTimerIfNeeded();
  }
  if (game.isComplete()) {
    stopTimer();
  }
  render();
}

function revealOrChord(button) {
  const cell = cellFromButton(button);
  const result = cell.revealed ? game.chord(cell.x, cell.y) : game.reveal(cell.x, cell.y);
  finishAction(result);
}

function cycleCellMark(button) {
  const cell = cellFromButton(button);
  const result = game.cycleMark(cell.x, cell.y);
  if (result.changed) {
    render();
  }
}

function resetGame(nextDifficultyKey = difficultyKey) {
  difficultyKey = nextDifficultyKey;
  game = new MinesweeperGame(DIFFICULTIES[difficultyKey]);
  focusedIndex = 0;
  elapsedSeconds = 0;
  stopTimer();
  renderBoardStructure();
  resizeBoard();
  render();
}

function moveFocusBy(dx, dy) {
  const current = game.cells[focusedIndex];
  const nextX = Math.max(0, Math.min(game.width - 1, current.x + dx));
  const nextY = Math.max(0, Math.min(game.height - 1, current.y + dy));
  setFocus(game.index(nextX, nextY), true);
}

board.addEventListener("click", (event) => {
  if (Date.now() < ignoreClickUntil) {
    event.preventDefault();
    return;
  }
  const button = cellButtonFromEvent(event);
  if (!button) {
    return;
  }
  setFocus(Number(button.dataset.index));
  revealOrChord(button);
});

board.addEventListener("contextmenu", (event) => {
  const button = cellButtonFromEvent(event);
  if (!button) {
    return;
  }
  event.preventDefault();
  setFocus(Number(button.dataset.index));
  cycleCellMark(button);
});

board.addEventListener("pointerdown", (event) => {
  const button = cellButtonFromEvent(event);
  if (!button || (event.pointerType !== "touch" && event.pointerType !== "pen")) {
    return;
  }
  touchActionHandled = false;
  touchHoldCell = button;
  button.classList.add("pressed");
  touchHoldHandle = window.setTimeout(() => {
    if (touchHoldCell) {
      touchActionHandled = true;
      ignoreClickUntil = Date.now() + 700;
      cycleCellMark(touchHoldCell);
      touchHoldCell.classList.remove("pressed");
    }
  }, 480);
});

board.addEventListener("pointerup", (event) => {
  if (!touchHoldCell || (event.pointerType !== "touch" && event.pointerType !== "pen")) {
    return;
  }
  event.preventDefault();
  window.clearTimeout(touchHoldHandle);
  touchHoldCell.classList.remove("pressed");
  ignoreClickUntil = Date.now() + 700;
  if (!touchActionHandled) {
    setFocus(Number(touchHoldCell.dataset.index));
    revealOrChord(touchHoldCell);
  }
  touchHoldCell = null;
});

board.addEventListener("pointercancel", () => {
  window.clearTimeout(touchHoldHandle);
  touchHoldCell?.classList.remove("pressed");
  touchHoldCell = null;
});

board.addEventListener("keydown", (event) => {
  const button = cellButtonFromEvent(event);
  if (!button) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveFocusBy(-1, 0);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveFocusBy(1, 0);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveFocusBy(0, -1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveFocusBy(0, 1);
  } else if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    revealOrChord(button);
  } else if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    cycleCellMark(button);
  } else if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    resetGame();
    setFocus(focusedIndex, true);
  }
});

board.addEventListener("focusin", (event) => {
  const button = cellButtonFromEvent(event);
  if (button) {
    focusedIndex = Number(button.dataset.index);
    renderCells();
  }
});

difficultySelect.addEventListener("change", () => {
  resetGame(difficultySelect.value);
});

resetButton.addEventListener("click", () => {
  resetGame();
  board.children[focusedIndex]?.focus();
});

window.addEventListener("resize", resizeBoard);

resetGame();
