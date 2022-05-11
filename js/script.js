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

const gamePlay = (function () {
  let player1 = Player(getActivePiece(), "Player1");
  let player2 = Player(getActivePiece() == "X" ? "O" : "X", "Player2");
  const pieceBtns = document.querySelectorAll(".btn");
  const cellsPad = document.querySelectorAll(".cell");
  const result = document.querySelector(".result");
  const gamepad = document.querySelector(".gamePad");
  const dificulty = document.querySelector("#dificulty");
  let percentage = 0;

  const gameDificulty = {
    veryeasy: 0,
    easy: 25,
    medium: 50,
    hard: 75,
    imposible: 100,
  };

  dificulty.addEventListener("change", (e) => {
    getPercenge(e);
    resetStatusPad();
  });

  function getPercenge(e) {
    let selection = e.target.value;
    for (const key in gameDificulty) {
      if (selection == key) {
        percentage = gameDificulty[key];
        console.log(percentage);
      }
    }
  }

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
      changeButtonClass();
    }
    resetStatusPad();
  }

  function resetStatusPad() {
    gamepad.classList.remove("disabledPad");
    result.innerHTML = "";
    result.style.display = "none";
    cleanBoard();
    gameEnd = false;
    player1.setPlayerPiece(getActivePiece());
    player2.setPlayerPiece(getActivePiece() == "X" ? "O" : "X");
    if (player2.getPlayerPiece() == "X") {
      nextTurn();
    }
  }

  function changeButtonClass() {
    for (const btn of pieceBtns) {
      btn.classList.contains("clicked")
        ? btn.classList.remove("clicked")
        : btn.classList.add("clicked");
    }
    player1.setPlayerPiece(getActivePiece());
    player2.setPlayerPiece(getActivePiece() == "X" ? "O" : "X");
  }

  for (const btn of pieceBtns) {
    btn.addEventListener("click", changePiece);
  }

  function setPiece() {
    let column = this.dataset.column;
    let row = this.dataset.row;
    if (this.textContent) return;
    board[row][column] = currentPlayer.getPlayerPiece();
    this.textContent = currentPlayer.getPlayerPiece();
    if (!gameEnd) {
      nextTurn();
    }
  }

  for (const cell of cellsPad) {
    cell.addEventListener("click", setPiece);
  }

  function nextTurn() {
    let status = checkGameStatus();
    if (status == undefined) {
      currentPlayer = currentPlayer == player1 ? player2 : player1;
      console.log(currentPlayer.getPlayerName());
      if (currentPlayer == player2) {
        iaChoose();
      }
    } else {
      displayWinner(status);
    }
  }

  let scoresX = {
    X: -10,
    O: 10,
    tie: 0,
  };
  let scoresY = {
    X: 10,
    O: -10,
    tie: 0,
  };
  function iaChoose() {
    let randomValue = Math.floor(Math.random() * 100);
    if (randomValue <= percentage) {
      let bestScore = -100;
      let move = {i:0,j:0};
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            board[i][j] = player2.getPlayerPiece();
            let score = minimax(board, false);
            board[i][j] = "";
            if (score > bestScore) {
              bestScore = score;
              move = { i:i, j:j };
              console.log(move);
            }
          }
        }
      }
      for (const cell of cellsPad) {
        if (cell.dataset.row == move.i && cell.dataset.column == move.j)
          cell.click();
      }
    } else {
      let avaiablePositions = getAviablePositions();
      let position = Math.floor(Math.random() * avaiablePositions.length);
      avaiablePositions[position].click();
    }
  }

  function minimax(board, isMaximizing) {
    let result = checkGameStatus();
    if (result != undefined) {
      return (player1.getPlayerPiece() == 'X') ? scoresX[result] : scoresY[result];
    };
    if (isMaximizing) {
      let bestScore = -100;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            board[i][j] = player2.getPlayerPiece();
            let score = minimax(board, false);
            board[i][j] = "";
            if (score > bestScore) bestScore = score;
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = 100;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            board[i][j] = player1.getPlayerPiece();
            let score = minimax(board, true);
            board[i][j] = "";
            if (score < bestScore) bestScore = score;
          }
        }
      }
      return bestScore;
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
    return gameEnd;
  }

  function resetGame() {
    gamepad.classList.remove("disabledPad");
    result.innerHTML = "";
    result.style.display = "none";
    cleanBoard();
    pieceBtns[0].classList.contains("clicked")
      ? null
      : pieceBtns[0].classList.add("clicked");
    pieceBtns[1].classList.contains("clicked")
      ? pieceBtns[1].classList.remove("clicked")
      : null;
    player1.setPlayerPiece(getActivePiece());
    player2.setPlayerPiece(getActivePiece() == "X" ? "O" : "X");
    currentPlayer = player1.getPlayerPiece() == "X" ? player1 : player2;
    gameEnd = false;
  }

  function checkGameStatus() {
    let winner = undefined;
    
    checkRows() != undefined ? (winner = checkRows()) : null;
    checkColumns() != undefined ? (winner = checkColumns()) : null;
    checkDiagonals() != undefined ? (winner = checkDiagonals()) : null;
    if (checkAllCells() != undefined && winner == null) {
      winner = checkAllCells();
      return winner;
    }
    return winner;
  }

  function checkRows() {
    for (let i = 0; i < board.length; i++) {
      if (board[i].every((element) => element == "X")) return "X";
      if (board[i].every((element) => element == "O")) return "O";
    }
  }
  function checkColumns() {
    for (let i = 0; i < board.length; i++) {
      let column = [];
      for (let j = 0; j < board.length; j++) {
        column.push(board[j][i]);
      }
      if (column.every((element) => element == "X")) return "X";
      if (column.every((element) => element == "O")) return "O";
    }
  }
  function checkDiagonals() {
    let diagonalTB = [board[0][0], board[1][1], board[2][2]];
    let diagonalBT = [board[2][0], board[1][1], board[0][2]];
    if (
      diagonalTB.every((element) => element == "X") ||
      diagonalBT.every((element) => element == "X")
    ) {
      return "X";
    } else if (
      diagonalTB.every((element) => element == "O") ||
      diagonalBT.every((element) => element == "O")
    ) {
      return "O";
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
      return "tie";
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
})();
