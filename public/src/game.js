export const DIFFICULTIES = Object.freeze({
  beginner: Object.freeze({ key: "beginner", label: "Beginner", width: 9, height: 9, mines: 10 }),
  intermediate: Object.freeze({
    key: "intermediate",
    label: "Intermediate",
    width: 16,
    height: 16,
    mines: 40,
  }),
  expert: Object.freeze({ key: "expert", label: "Expert", width: 30, height: 16, mines: 99 }),
});

export const MARK_NONE = "none";
export const MARK_FLAG = "flag";
export const MARK_QUESTION = "question";

export class MinesweeperGame {
  constructor(config = DIFFICULTIES.beginner, options = {}) {
    this.rng = options.rng ?? Math.random;
    this.reset(config);
  }

  reset(config = this.config) {
    this.config = { ...config };
    this.width = config.width;
    this.height = config.height;
    this.mineTotal = config.mines;
    this.status = "ready";
    this.firstReveal = true;
    this.revealedSafe = 0;
    this.cells = Array.from({ length: this.width * this.height }, (_, index) => {
      const x = index % this.width;
      const y = Math.floor(index / this.width);
      return {
        x,
        y,
        mine: false,
        adjacent: 0,
        revealed: false,
        mark: MARK_NONE,
        hit: false,
        wrong: false,
      };
    });
  }

  index(x, y) {
    return y * this.width + x;
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  cellAt(x, y) {
    if (!this.inBounds(x, y)) {
      return null;
    }
    return this.cells[this.index(x, y)];
  }

  neighbors(x, y) {
    const cells = [];
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        const neighbor = this.cellAt(x + dx, y + dy);
        if (neighbor) {
          cells.push(neighbor);
        }
      }
    }
    return cells;
  }

  cycleMark(x, y) {
    const cell = this.cellAt(x, y);
    if (!cell || cell.revealed || this.isComplete()) {
      return { changed: false };
    }

    if (cell.mark === MARK_NONE) {
      cell.mark = MARK_FLAG;
    } else if (cell.mark === MARK_FLAG) {
      cell.mark = MARK_QUESTION;
    } else {
      cell.mark = MARK_NONE;
    }
    return { changed: true };
  }

  reveal(x, y) {
    const cell = this.cellAt(x, y);
    if (!cell || this.isComplete() || cell.revealed || cell.mark === MARK_FLAG) {
      return { changed: false, started: false };
    }

    if (cell.mark === MARK_QUESTION) {
      cell.mark = MARK_NONE;
    }

    const started = this._ensureStarted(x, y);
    if (cell.mine) {
      cell.revealed = true;
      cell.hit = true;
      this._lose();
      return { changed: true, started, lost: true };
    }

    const revealed = this._revealSafeFrom(cell);
    this._checkWin();
    return {
      changed: revealed > 0,
      started,
      revealed,
      won: this.status === "won",
    };
  }

  chord(x, y) {
    const cell = this.cellAt(x, y);
    if (!cell || this.isComplete() || !cell.revealed || cell.adjacent === 0) {
      return { changed: false, started: false };
    }

    const neighbors = this.neighbors(x, y);
    const flagCount = neighbors.filter((neighbor) => neighbor.mark === MARK_FLAG).length;
    if (flagCount !== cell.adjacent) {
      return { changed: false, started: false };
    }

    let changed = false;
    let revealed = 0;
    for (const neighbor of neighbors) {
      if (neighbor.revealed || neighbor.mark === MARK_FLAG) {
        continue;
      }
      if (neighbor.mine) {
        neighbor.revealed = true;
        neighbor.hit = true;
        this._lose();
        return { changed: true, started: false, lost: true };
      }
      neighbor.mark = MARK_NONE;
      revealed += this._revealSafeFrom(neighbor);
      changed = true;
    }
    this._checkWin();
    return { changed, started: false, revealed, won: this.status === "won" };
  }

  isComplete() {
    return this.status === "won" || this.status === "lost";
  }

  stats() {
    const flags = this.cells.filter((cell) => cell.mark === MARK_FLAG).length;
    const questions = this.cells.filter((cell) => cell.mark === MARK_QUESTION).length;
    return {
      flags,
      questions,
      minesRemaining: this.mineTotal - flags,
      safeRemaining: this.width * this.height - this.mineTotal - this.revealedSafe,
    };
  }

  _ensureStarted(x, y) {
    if (!this.firstReveal) {
      if (this.status === "ready") {
        this.status = "playing";
      }
      return false;
    }

    this._placeMines(x, y);
    this._setAdjacentCounts();
    this.firstReveal = false;
    this.status = "playing";
    return true;
  }

  _placeMines(safeX, safeY) {
    const wideSafeZone = new Set([
      this.index(safeX, safeY),
      ...this.neighbors(safeX, safeY).map((cell) => this.index(cell.x, cell.y)),
    ]);
    const centerOnlySafeZone = new Set([this.index(safeX, safeY)]);
    const safeZone =
      this.cells.length - wideSafeZone.size >= this.mineTotal
        ? wideSafeZone
        : centerOnlySafeZone;
    const candidates = this.cells.filter((cell) => !safeZone.has(this.index(cell.x, cell.y)));

    if (candidates.length < this.mineTotal) {
      throw new Error("Mine count exceeds available board space");
    }

    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(this.rng() * (index + 1));
      [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
    }

    for (const cell of candidates.slice(0, this.mineTotal)) {
      cell.mine = true;
    }
  }

  _setAdjacentCounts() {
    for (const cell of this.cells) {
      cell.adjacent = this.neighbors(cell.x, cell.y).filter((neighbor) => neighbor.mine).length;
    }
  }

  _revealSafeFrom(startCell) {
    const stack = [startCell];
    let revealed = 0;

    while (stack.length) {
      const cell = stack.pop();
      if (!cell || cell.revealed || cell.mine || cell.mark !== MARK_NONE) {
        continue;
      }
      cell.revealed = true;
      revealed += 1;
      this.revealedSafe += 1;

      if (cell.adjacent !== 0) {
        continue;
      }

      for (const neighbor of this.neighbors(cell.x, cell.y)) {
        if (!neighbor.revealed && !neighbor.mine && neighbor.mark === MARK_NONE) {
          stack.push(neighbor);
        }
      }
    }

    return revealed;
  }

  _lose() {
    this.status = "lost";
    for (const cell of this.cells) {
      if (cell.mine) {
        cell.revealed = true;
      }
      if (cell.mark === MARK_FLAG && !cell.mine) {
        cell.wrong = true;
      }
    }
  }

  _checkWin() {
    if (this.revealedSafe === this.width * this.height - this.mineTotal) {
      this.status = "won";
      for (const cell of this.cells) {
        if (cell.mine && cell.mark === MARK_NONE) {
          cell.mark = MARK_FLAG;
        }
      }
    }
  }
}
