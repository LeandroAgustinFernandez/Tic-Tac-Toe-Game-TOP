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

let player1 = Player(getActivePiece());
let player2 = Player(getActivePiece() == "X" ? "O" : "X");

const pieceBtns = document.querySelectorAll(".btn");
const cellsPad = document.querySelectorAll(".cell");
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
  console.log(board);
  nextTurn();
  for (let i = 0; i < board.length; i++) {
    if (board[i].every((element) => element == "X")) console.log("gano X");
    if (board[i].every((element) => element == "O")) console.log("gano O");
  }
  for (let i = 0; i < board.length; i++) {
    let column = [];
    for (let j = 0; j < board.length; j++) {
      column.push(board[j][i]);
    }
    if (column.every((element) => element == "X")) console.log("gano X");
    if (column.every((element) => element == "O")) console.log("gano O");
  }
  let diagonalTB = [board[0][0],board[1][1],board[2][2]];
  let diagonalBT = [board[2][0],board[1][1],board[0][2]];
  if (diagonalTB.every(element => element == 'X') || diagonalBT.every(element => element == 'X')) {
    console.log("gano X");
  }
  if (diagonalTB.every(element => element == 'O') || diagonalBT.every(element => element == 'O')) {
    console.log("gano O");
  }
  
  
}

for (const cell of cellsPad) {
  cell.addEventListener("click", setPiece);
}

function nextTurn() {
  currentPlayer = currentPlayer == player1 ? player2 : player1;
}
