/**
 * DOM element representing the initial game area.
 * @type {HTMLDivElement}
 */
const gameAreaInitial = document.querySelector(
  ".game__area--initial",
)! as HTMLDivElement;

/**
 * DOM element representing the play area of the game.
 * @type {HTMLDivElement}
 */
const gameAreaPlay = document.querySelector(
  ".game__area--play",
)! as HTMLDivElement;

/**
 * DOM element representing the result area of the game.
 * @type {HTMLDivElement}
 */
const gameAreaResult = document.querySelector(
  ".game__area--result",
)! as HTMLDivElement;

/**
 * DOM element representing the game board.
 * @type {HTMLDivElement}
 */
const gameBoard = document.querySelector(".game__board")! as HTMLDivElement;

/**
 * Array of DOM elements representing the cells in the game board.
 * @type {HTMLSpanElement[]}
 */
const cells = Array.from(
  gameBoard.querySelectorAll(".game__cell")!,
) as HTMLSpanElement[];

/**
 * Number of moves made in the game.
 * @type {number}
 */
let moves: number;

/**
 * Flag indicating if the computer is currently making a move.
 * @type {boolean}
 */
let isComputerMoving: boolean;

/**
 * Represents the container element for the game options.
 * This element holds the options for the user to choose their symbol (X or O) and starts the game.
 * @type {HTMLDivElement}
 */
const gameOptions = document.querySelector(".game__options")! as HTMLDivElement;

/**
 * DOM element for the replay button.
 * @type {HTMLButtonElement}
 */
const replayBtn = document.querySelector(
  ".game__replay-btn",
)! as HTMLButtonElement;

/**
 * Symbol representing the user’s choice ("X" or "O").
 * @type {string}
 */
let userSymbol: string;

/**
 * Symbol representing the computer’s choice ("X" or "O").
 * @type {string}
 */
let computerSymbol: string;

/**
 * Initializes the game area for the initial state.
 * Shows the initial game area and hides the result and play areas.
 */
function initializeInitialGame() {
  gameAreaInitial.classList.remove("hide");
  gameAreaResult.classList.add("hide");

  gameAreaInitial.classList.remove("hidden");
  gameAreaPlay.classList.add("hidden");
  gameAreaResult.classList.add("hidden");

  gameBoard.removeEventListener("click", gameBoardClickHandler);
}
initializeInitialGame();

/**
 * Initializes the game for playing.
 * Resets the game state and transitions smoothly to the play area.
 */
function initializePlayGame() {
  moves = 0;
  isComputerMoving = false;

  gameAreaPlay.classList.remove("hide");
  gameAreaInitial.classList.add("hide");
  setTimeout(() => {
    gameAreaPlay.classList.remove("hidden");
    gameAreaInitial.classList.add("hidden");
  }, 250);

  cells.forEach((cell) => (cell.innerHTML = ""));
}

/**
 * Initializes the result area with a given message.
 * Transitions from the play area to the result area.
 * @param {string} message - The result message to display.
 */
function initializeResultGame(message: string) {
  gameAreaResult.classList.remove("hide");
  gameAreaPlay.classList.add("hide");
  setTimeout(() => {
    gameAreaResult.classList.remove("hidden");
    gameAreaPlay.classList.add("hidden");
  }, 250);

  resultGame(message);
}

/**
 * Displays the result message in the result area.
 * @param {string} message - The result message to display.
 */
function resultGame(message: string) {
  const resultMessage = document.querySelector(
    ".game__result-message",
  )! as HTMLSpanElement;
  resultMessage.textContent = message;
}

/**
 * Checks if the given symbol has a winning combination.
 * @param {string} symbol - The symbol to check ("X" or "O").
 * @returns {boolean} - True if the symbol has a winning combination, false otherwise.
 */
function checkWin(symbol: string): boolean {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some((combination) =>
    combination.every((index) => {
      const cell = cells[index];
      const img = cell.querySelector("img") as HTMLImageElement;
      return img && img.src.includes(`-${symbol.toLowerCase()}`);
    }),
  );
}

/**
 * Handles the computer's move.
 * Chooses a random empty cell and updates it.
 */
function computerMove() {
  const emptyCells = Array.from(
    gameBoard.querySelectorAll(".game__cell"),
  ).filter((cell) => cell.innerHTML.trim() === "");

  if (emptyCells.length === 0) return;

  const randomCell = emptyCells[
    Math.trunc(Math.random() * emptyCells.length)
  ]! as HTMLSpanElement;

  updateCellAndCheckEnd(randomCell, computerSymbol);
  updateActiveClass();

  isComputerMoving = false;
}

/**
 * Updates the active class for the current and opponent's turns.
 */
function updateActiveClass() {
  document
    .querySelector(`.game__turn--${userSymbol.toLowerCase()}`)
    ?.classList.toggle("active");
  document
    .querySelector(`.game__turn--${computerSymbol.toLowerCase()}`)
    ?.classList.toggle("active");
}

/**
 * Updates the cell with the given symbol and checks if the game has ended.
 * @param {HTMLSpanElement} cell - The cell to update.
 * @param {string} symbol - The symbol to place in the cell ("X" or "O").
 */
function updateCellAndCheckEnd(cell: HTMLSpanElement, symbol: string) {
  cell.innerHTML = `<img src="../assets/images/icon-${symbol.toLowerCase()}.svg" class="game__icon" alt="" />`;

  moves++;

  setTimeout(() => {
    if (moves >= 4 && checkWin(symbol)) {
      initializeResultGame(
        symbol === userSymbol ? "You won the Game!" : "You lost the Game!",
      );
      return;
    }

    if (moves === 9) {
      initializeResultGame("Match has been drawn!");
    }
  }, 500);
}

/**
 * Handles clicks on the game board.
 * Updates the clicked cell and triggers the computer's move if necessary.
 * @param {Event} e - The click event.
 */
function gameBoardClickHandler(e: Event) {
  if (isComputerMoving) return;

  const clickedCell = (e.target as HTMLDivElement).closest(
    ".game__cell",
  )! as HTMLSpanElement;

  if (!clickedCell || clickedCell.innerHTML.trim() !== "") return;

  isComputerMoving = true;

  updateCellAndCheckEnd(clickedCell, userSymbol);
  updateActiveClass();

  setTimeout(computerMove, 1500);
}

/**
 * Starts the game with the specified user and computer symbols.
 * Initializes the game for play and sets up the game board click handler.
 * @param {string} userSymbol - The symbol chosen by the user ("X" or "O").
 * @param {string} computerSymbol - The symbol chosen by the computer ("X" or "O").
 */
function playGame(userSymbol: string, computerSymbol: string) {
  initializePlayGame();
  gameBoard.addEventListener("click", gameBoardClickHandler);
}

/**
 * Handles the game option selection.
 * Sets the user's and computer's symbols based on the clicked option and starts the game.
 * @param {Event} e - The click event on the game options.
 */
gameOptions.addEventListener("click", function (e) {
  const clicked = (e.target! as HTMLDivElement).closest(
    ".game__option",
  )! as HTMLDivElement;

  if (!clicked) return;

  userSymbol = clicked.classList.contains("game__option--x") ? "X" : "O";
  computerSymbol = userSymbol === "X" ? "O" : "X";

  document
    .querySelectorAll(".game__turn")
    .forEach((turn) => turn.classList.remove("active"));

  document
    .querySelector(`.game__turn--${userSymbol.toLowerCase()}`)
    ?.classList.add("active");

  playGame(userSymbol, computerSymbol);
});

/**
 * Resets the game to the initial state when the replay button is clicked.
 */
replayBtn.addEventListener("click", initializeInitialGame);
