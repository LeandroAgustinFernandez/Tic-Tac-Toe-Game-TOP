// const gameBoard = (function () {})();
const Player = (piece, name = "player") => {
  let _playerName = name;
  let _playerPiece = piece;
  let getPlayerPiece = () => {
    return _playerPiece;
  };
  let getPlayerName = () => {
    return _playerName;
  };
  let setPlayerPiece = (newPiece) => {
    _playerPiece = newPiece;
  };
  return {
    getPlayerPiece,
    getPlayerName,
    setPlayerPiece,
  };
};

let player1 = Player(getActivePiece(), "Player1");
let player2 = Player(getActivePiece() == "X" ? "O" : "X", "Player2");

const pieceBtns = document.querySelectorAll(".btn");
const cellsPad = document.querySelectorAll(".cell");
const result = document.querySelector(".result");
const gamepad = document.querySelector(".gamePad");
let avaiable = [];

let gameEnd = false;

let currentPlayer = player1.getPlayerPiece() == "X" ? player1 : player2;

const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

function getActivePiece() {
  let piece = document.querySelector(".clicked").dataset.piece;
  return piece;
}

function changePiece() {
  if (this.classList.contains("clicked")) {
    return;
  } else {
    for (const btn of pieceBtns) {
      btn.classList.contains("clicked")
        ? btn.classList.remove("clicked")
        : btn.classList.add("clicked");
    }
    player1.setPlayerPiece(getActivePiece());
    player2.setPlayerPiece(getActivePiece() == "X" ? "O" : "X");
  }
  resetGame();
  if (player2.getPlayerPiece() == 'X') {
    nextTurn();  
  }
}

for (const btn of pieceBtns) {
  btn.addEventListener("click", changePiece);
}

function setPiece() {
  let column = this.dataset.column;
  let row = this.dataset.row;
  board[row][column] = currentPlayer.getPlayerPiece();
  if (this.textContent) return;
  this.textContent = currentPlayer.getPlayerPiece();
  if (!gameEnd) {
    nextTurn();
  }
}

for (const cell of cellsPad) {
  cell.addEventListener("click", setPiece);
}

function nextTurn() {
  if (!checkGameStatus()) {
    currentPlayer = currentPlayer == player1 ? player2 : player1;
    if (currentPlayer == player2) {
      let avaiablePositions = getAviablePositions();
      let position = Math.floor(Math.random() * avaiablePositions.length);
      avaiablePositions[position].click();
    }
  }
}

function displayWinner(winner) {
  let p = document.createElement("p");
  p.classList.add("textResult");
  p.textContent = winner != "tie" ? `The winner: ${winner}!` : `It's a Tie!`;
  let button = document.createElement("button");
  button.classList.add("buttonResult");
  button.textContent = "Restart";
  button.addEventListener("click", resetGame);
  result.appendChild(p);
  result.appendChild(button);
  result.style.display = "block";
  gamepad.classList.add("disabledPad");
  gameEnd = true;
}

function resetGame() {
  gamepad.classList.remove("disabledPad");
  result.innerHTML = "";
  result.style.display = "none";
  cleanBoard();
  gameEnd = false;
}

function checkGameStatus() {
  checkRows();
  checkColumns();
  checkDiagonals();
  checkAllCells();
  return gameEnd;
}

function checkRows() {
  for (let i = 0; i < board.length; i++) {
    if (board[i].every((element) => element == "X")) displayWinner("X");
    if (board[i].every((element) => element == "O")) displayWinner("O");
  }
}
function checkColumns() {
  for (let i = 0; i < board.length; i++) {
    let column = [];
    for (let j = 0; j < board.length; j++) {
      column.push(board[j][i]);
    }
    if (column.every((element) => element == "X")) displayWinner("X");
    if (column.every((element) => element == "O")) displayWinner("O");
  }
}
function checkDiagonals() {
  let diagonalTB = [board[0][0], board[1][1], board[2][2]];
  let diagonalBT = [board[2][0], board[1][1], board[0][2]];
  if (
    diagonalTB.every((element) => element == "X") ||
    diagonalBT.every((element) => element == "X")
  ) {
    displayWinner("X");
  } else if (
    diagonalTB.every((element) => element == "O") ||
    diagonalBT.every((element) => element == "O")
  ) {
    displayWinner("O");
  }
}
function checkAllCells() {
  let all = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      all.push(board[i][j]);
    }
  }
  if (all.every((element) => element != "") && gameEnd == false) {
    displayWinner("tie");
  }
}
function cleanBoard() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      board[i][j] = "";
    }
  }
  for (const cell of cellsPad) {
    cell.textContent = "";
  }
}

function getAviablePositions() {
  avaiable = [];
  for (const cell of cellsPad) {
    if (cell.textContent == "") avaiable.push(cell);
  }
  return avaiable;
}
