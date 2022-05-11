const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == "") {
        board[i][j] = player.getPiece;
        let score = minimax(board, 0, ai);
        board[i][j] = "";
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
}

let scores = {
  X: 1,
  O: -1,
  tie: 0,
};

function minimax(otherboard,player) {
  let result = checkWinner();
  if (result !== null) return scores[result];
  if (player) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = ai.getPiece;
          let score = minimax(otherboard, depth + 1, player);
          board[i][j] = "";
          bestScore = max(score,bestScore);
        }
      }
    }
    return bestScore;
  }else{ //Other Player
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == "") {
          board[i][j] = human.getPiece;
          let score = minimax(otherboard, depth + 1, player);
          board[i][j] = "";
          bestScore = min(score,bestScore);
        }
      }
    }
    return bestScore;
  }
}
