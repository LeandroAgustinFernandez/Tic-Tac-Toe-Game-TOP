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
console.log(player1.getPlayerPiece());
let player2 = Player((getActivePiece() == 'X')? 'O' : 'X');

const pieceBtns = document.querySelectorAll(".btn");
const cellsPad = document.querySelectorAll(".cell");
let currentPlayer = (player1.getPlayerPiece() == 'X') ? player1 : player2;

const board = [
  ['','',''],
  ['','',''],
  ['','',''],
]

let players = [player1,player2];

console.log(player2.getPlayerPiece());
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
  }
}

for (const btn of pieceBtns) {
  btn.addEventListener("click", changePiece);
}

function setPiece() {
  if (this.textContent) return;
  this.textContent = currentPlayer.getPlayerPiece();
  nextTurn()
}

for (const cell of cellsPad) {
  cell.addEventListener("click", setPiece);
}

function nextTurn() {
   currentPlayer = (currentPlayer == player1)? player2 : player1;
}

