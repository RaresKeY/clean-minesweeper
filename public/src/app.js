import {
  CUSTOM_LIMITS,
  DIFFICULTIES,
  MARK_FLAG,
  MARK_QUESTION,
  MinesweeperGame,
  createCustomDifficulty,
  customMineMaximum,
} from "./game.js";

const board = document.querySelector("#board");
const boardStage = document.querySelector(".board-stage");
const customBoardButton = document.querySelector("#custom-board-button");
const customBoardError = document.querySelector("#custom-board-error");
const customBoardForm = document.querySelector("#custom-board-form");
const customHeight = document.querySelector("#custom-height");
const customMines = document.querySelector("#custom-mines");
const customWidth = document.querySelector("#custom-width");
const flagModeButton = document.querySelector("#flag-mode-button");
const gameMenu = document.querySelector("#game-menu");
const menuButton = document.querySelector("#menu-button");
const menuViews = document.querySelectorAll("[data-menu-view]");
const mineCount = document.querySelector("#mine-count");
const resetButton = document.querySelector("#reset-button");
const status = document.querySelector("#status");
const themeColor = document.querySelector('meta[name="theme-color"]');
const timer = document.querySelector("#timer");

let currentConfig = DIFFICULTIES.beginner;
let game = new MinesweeperGame(currentConfig);
let focusedIndex = 0;
let flagMode = false;
let timerHandle = 0;
let timerStartedAt = 0;
let elapsedSeconds = 0;
let touchHoldHandle = 0;
let touchHoldCell = null;
let touchActionHandled = false;
let ignoreClickUntil = 0;

const PIXEL_GLYPHS = Object.freeze({
  "-": ["000", "000", "111", "000", "000"],
  0: ["111", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "111"],
  2: ["111", "001", "111", "100", "111"],
  3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"],
  5: ["111", "100", "111", "001", "111"],
  6: ["111", "100", "111", "101", "111"],
  7: ["111", "001", "001", "001", "001"],
  8: ["111", "101", "111", "101", "111"],
  9: ["111", "101", "111", "001", "111"],
});

function formatCounter(value) {
  return String(Math.max(-99, Math.min(999, value)));
}

function createPixelGlyph(character, glyphClass, pixelClass) {
  const glyph = document.createElement("span");
  glyph.className = glyphClass;
  glyph.setAttribute("aria-hidden", "true");

  for (const row of PIXEL_GLYPHS[character]) {
    for (const pixel of row) {
      const square = document.createElement("span");
      square.className = `${pixelClass}${pixel === "1" ? " lit" : ""}`;
      glyph.append(square);
    }
  }

  return glyph;
}

function renderCounter(element, value, label) {
  const valueText = formatCounter(value);
  const accessibleLabel = label(valueText);

  if (element.dataset.value === valueText) {
    if (element.getAttribute("aria-label") !== accessibleLabel) {
      element.setAttribute("aria-label", accessibleLabel);
    }
    return;
  }

  const glyphs = [...valueText].map((character) =>
    createPixelGlyph(character, "counter-glyph", "counter-pixel")
  );

  element.replaceChildren(...glyphs);
  element.dataset.value = valueText;
  element.setAttribute("aria-label", accessibleLabel);
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
  timerHandle = globalThis.setInterval(updateTimer, 250);
  updateTimer();
}

function stopTimer() {
  if (timerHandle) {
    globalThis.clearInterval(timerHandle);
    timerHandle = 0;
  }
  updateTimer();
}

function updateTimer() {
  if (timerHandle) {
    elapsedSeconds = Math.min(
      999,
      Math.floor((Date.now() - timerStartedAt) / 1000),
    );
  }
  renderCounter(
    timer,
    elapsedSeconds,
    (value) => `Elapsed time: ${value} seconds`,
  );
}

function setStatusText() {
  const stats = game.stats();
  let nextStatus;
  if (game.status === "ready") {
    nextStatus = "Choose a square to start.";
  } else if (game.status === "won") {
    nextStatus = `Cleared in ${elapsedSeconds} seconds.`;
  } else if (game.status === "lost") {
    nextStatus = "Mine hit. Start a new board when ready.";
  } else {
    nextStatus = `${stats.safeRemaining} safe squares left.`;
  }
  if (status.textContent !== nextStatus) {
    status.textContent = nextStatus;
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
  board.setAttribute(
    "aria-label",
    `${game.config.label} Minesweeper grid, ${game.width} columns by ${game.height} rows`,
  );
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

function setAttributeIfChanged(element, name, value) {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}

function renderCellNumber(button, cell) {
  const value = cell.revealed && !cell.mine && cell.adjacent
    ? String(cell.adjacent)
    : "";

  if (button.dataset.number === value) {
    return;
  }

  button.dataset.number = value;
  if (!value) {
    button.replaceChildren();
    return;
  }

  const text = document.createElement("span");
  text.className = "sr-only";
  text.textContent = value;
  button.replaceChildren(
    text,
    createPixelGlyph(value, "cell-number-glyph", "cell-number-pixel"),
  );
}

function renderCells() {
  const ariaDisabled = game.isComplete() ? "true" : "false";

  for (const button of board.children) {
    const cell = cellFromButton(button);
    const className = classForCell(cell);
    const tabIndex = Number(button.dataset.index) === focusedIndex ? 0 : -1;

    if (button.className !== className) {
      button.className = className;
    }
    renderCellNumber(button, cell);
    setAttributeIfChanged(button, "aria-label", labelForCell(cell));
    setAttributeIfChanged(button, "aria-disabled", ariaDisabled);
    if (button.tabIndex !== tabIndex) {
      button.tabIndex = tabIndex;
    }
  }
}

function renderStats() {
  const stats = game.stats();
  renderCounter(
    mineCount,
    stats.minesRemaining,
    (value) => `Mines remaining: ${value}`,
  );
  setStatusText();
  updateTimer();
}

function render() {
  renderCells();
  renderStats();
}

function resizeBoard() {
  const availableWidth = Math.max(280, boardStage.clientWidth - 24);
  const availableHeight = Math.max(280, boardStage.clientHeight - 24);
  const tileSize = Math.floor(
    Math.max(
      22,
      Math.min(32, availableWidth / game.width, availableHeight / game.height),
    ),
  );
  board.style.setProperty("--tile-size", `${tileSize}px`);
  board.style.setProperty("--digit-pixel", `${tileSize < 28 ? 3 : 4}px`);
}

function setFocus(index, moveFocus = false) {
  const nextIndex = Math.max(0, Math.min(game.cells.length - 1, index));
  if (nextIndex !== focusedIndex) {
    const previousButton = board.children[focusedIndex];
    const nextButton = board.children[nextIndex];
    focusedIndex = nextIndex;
    if (previousButton && previousButton.tabIndex !== -1) {
      previousButton.tabIndex = -1;
    }
    if (nextButton && nextButton.tabIndex !== 0) {
      nextButton.tabIndex = 0;
    }
  }
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
  const result = cell.revealed
    ? game.chord(cell.x, cell.y)
    : game.reveal(cell.x, cell.y);
  finishAction(result);
}

function cycleCellMark(button) {
  const cell = cellFromButton(button);
  const result = game.cycleMark(cell.x, cell.y);
  if (result.changed) {
    render();
  }
}

function resetGame(nextConfig = currentConfig) {
  currentConfig = { ...nextConfig };
  game = new MinesweeperGame(currentConfig);
  focusedIndex = 0;
  elapsedSeconds = 0;
  stopTimer();
  renderBoardStructure();
  resizeBoard();
  render();
  updateMenuSelection();
}

function updateMenuSelection() {
  for (const button of gameMenu.querySelectorAll("[data-difficulty]")) {
    button.dataset.active = String(
      button.dataset.difficulty === currentConfig.key,
    );
  }
  customBoardButton.dataset.active = String(currentConfig.key === "custom");
  for (const button of gameMenu.querySelectorAll("[data-theme-option]")) {
    button.dataset.active = String(
      button.dataset.themeOption === document.body.dataset.theme,
    );
  }
  flagModeButton.setAttribute("aria-pressed", String(flagMode));
  flagModeButton.textContent = flagMode ? "Flag on" : "Flag off";
}

function setMenuView(name, moveFocus = false) {
  for (const view of menuViews) {
    view.hidden = view.dataset.menuView !== name;
  }
  if (moveFocus) {
    const view = gameMenu.querySelector(`[data-menu-view="${name}"]`);
    view?.querySelector("[data-menu-focus], .menu-item")?.focus();
  }
}

function updateCustomMineMaximum() {
  const width = customWidth.valueAsNumber;
  const height = customHeight.valueAsNumber;
  let maximum = CUSTOM_LIMITS.maxMines;
  try {
    maximum = customMineMaximum(width, height);
  } catch {
    // Keep the global limit until both dimensions are valid.
  }
  customMines.max = String(maximum);
  return maximum;
}

function prepareCustomBoardForm() {
  customWidth.value = String(game.width);
  customHeight.value = String(game.height);
  customMines.value = String(game.mineTotal);
  updateCustomMineMaximum();
  customBoardError.textContent = "";
}

function closeMenu(returnFocus = false) {
  gameMenu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  setMenuView("root");
  if (returnFocus) {
    menuButton.focus();
  }
}

function openMenu() {
  gameMenu.hidden = false;
  menuButton.setAttribute("aria-expanded", "true");
  setMenuView("root", true);
}

function setTheme(nextTheme) {
  document.body.dataset.theme = nextTheme;
  themeColor.content = nextTheme === "dark" ? "#1e2221" : "#ffffff";
  updateMenuSelection();
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
  if (
    !button || (event.pointerType !== "touch" && event.pointerType !== "pen")
  ) {
    return;
  }
  touchActionHandled = false;
  touchHoldCell = button;
  button.classList.add("pressed");
  touchHoldHandle = globalThis.setTimeout(() => {
    if (touchHoldCell) {
      touchActionHandled = true;
      ignoreClickUntil = Date.now() + 700;
      cycleCellMark(touchHoldCell);
      touchHoldCell.classList.remove("pressed");
    }
  }, 480);
});

board.addEventListener("pointerup", (event) => {
  if (
    !touchHoldCell ||
    (event.pointerType !== "touch" && event.pointerType !== "pen")
  ) {
    return;
  }
  event.preventDefault();
  globalThis.clearTimeout(touchHoldHandle);
  touchHoldCell.classList.remove("pressed");
  ignoreClickUntil = Date.now() + 700;
  if (!touchActionHandled) {
    setFocus(Number(touchHoldCell.dataset.index));
    if (flagMode) {
      cycleCellMark(touchHoldCell);
    } else {
      revealOrChord(touchHoldCell);
    }
  }
  touchHoldCell = null;
});

board.addEventListener("pointercancel", () => {
  globalThis.clearTimeout(touchHoldHandle);
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
    setFocus(Number(button.dataset.index));
  }
});

menuButton.addEventListener("click", () => {
  if (gameMenu.hidden) {
    openMenu();
  } else {
    closeMenu(true);
  }
});

resetButton.addEventListener("click", () => {
  resetGame();
  closeMenu(true);
});

for (const button of gameMenu.querySelectorAll("[data-menu-target]")) {
  button.addEventListener("click", () => {
    if (button.dataset.menuTarget === "custom") {
      prepareCustomBoardForm();
    }
    setMenuView(button.dataset.menuTarget, true);
  });
}

for (const button of gameMenu.querySelectorAll("[data-difficulty]")) {
  button.addEventListener("click", () => {
    resetGame(DIFFICULTIES[button.dataset.difficulty]);
    closeMenu(true);
  });
}

for (const input of [customWidth, customHeight, customMines]) {
  input.addEventListener("input", () => {
    updateCustomMineMaximum();
    customBoardError.textContent = "";
  });
}

customBoardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateCustomMineMaximum();
  if (!customBoardForm.reportValidity()) {
    customBoardError.textContent =
      "Enter whole numbers within the displayed limits.";
    return;
  }

  try {
    const config = createCustomDifficulty(
      customWidth.valueAsNumber,
      customHeight.valueAsNumber,
      customMines.valueAsNumber,
    );
    resetGame(config);
    closeMenu(true);
  } catch (error) {
    customBoardError.textContent = error.message;
  }
});

for (const button of gameMenu.querySelectorAll("[data-theme-option]")) {
  button.addEventListener("click", () => {
    setTheme(button.dataset.themeOption);
    closeMenu(true);
  });
}

flagModeButton.addEventListener("click", () => {
  flagMode = !flagMode;
  updateMenuSelection();
  closeMenu(true);
});

document.addEventListener("pointerdown", (event) => {
  if (
    !gameMenu.hidden && !gameMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !gameMenu.hidden) {
    event.preventDefault();
    closeMenu(true);
  } else if (
    (event.key.toLowerCase() === "m" || event.key.toLowerCase() === "o") &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault();
    if (gameMenu.hidden) {
      openMenu();
    } else {
      closeMenu(true);
    }
  }
});

globalThis.addEventListener("resize", resizeBoard);

setTheme("dark");
resetGame();
