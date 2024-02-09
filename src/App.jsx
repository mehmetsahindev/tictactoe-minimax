import { useEffect, useState } from "react";
import TableCell from "./components/TableCell";
import {
  gamePlayers,
  gamePlayerSymbols,
  gameResults,
  gameScores,
} from "./utils/constants";

function App() {
  const [tableLength, setTableLength] = useState(3);
  const [table, setTable] = useState(
    Array(tableLength * tableLength).fill(null)
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTurn, setGameTurn] = useState(gamePlayers.AI);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);

  const playerCanPlay = () => {
    return !gameFinished && gameWinner === null;
  };

  const handlePlayerPlay = (player, tableCellIndex) => {
    if (
      table[tableCellIndex] === null &&
      gameTurn === player &&
      playerCanPlay()
    ) {
      setTable((prevTable) => {
        const newTable = [...prevTable];
        newTable[tableCellIndex] = gamePlayerSymbols[player];
        return newTable;
      });

      setGameTurn(gamePlayers.AI);
    }
  };

  const handleAIPlay = () => {
    if (gameTurn === gamePlayers.AI && playerCanPlay()) {
      let tempTable = [...table];
      let bestScore = -Infinity;
      let nextMove;

      for (let i = 0; i < tempTable.length; i++) {
        if (tempTable[i] === null) {
          tempTable[i] = gamePlayerSymbols[gamePlayers.AI];
          let score = minimax(tempTable, 0, false);
          tempTable[i] = null;

          if (score > bestScore) {
            bestScore = score;
            nextMove = i;
          }
        }
      }

      handlePlayerPlay(gamePlayers.AI, nextMove);
      setGameTurn(gamePlayers.User);
    }
  };

  const minimax = (gameTable, depth, isMaximizing, debug = false) => {
    const result = checkWinner(gameTable);
    if (debug) {
      console.log(gameTable);
      console.log(result);
    }
    if (result) {
      return gameScores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < gameTable.length; i++) {
        if (gameTable[i] === null) {
          gameTable[i] = gamePlayerSymbols[gamePlayers.AI];
          let score = minimax(gameTable, depth + 1, false);
          gameTable[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }

      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < gameTable.length; i++) {
        if (gameTable[i] === null) {
          gameTable[i] = gamePlayerSymbols[gamePlayers.User];
          let score = minimax(gameTable, depth + 1, true);
          gameTable[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }

      return bestScore;
    }
  };

  const finishGame = () => {
    const winner = checkWinner();
    if (winner) {
      setGameFinished(true);
      setGameWinner(winner);
    }
  };

  const checkWinner = (gameTable = table) => {
    const size = Math.sqrt(gameTable.length);

    // Satırları kontrol et
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 2; j++) {
        const index = i * size + j;
        const row = gameTable.slice(index, index + 3);
        if (row.every((value) => value === "O")) {
          return gameResults.User;
        }
        if (row.every((value) => value === "X")) {
          return gameResults.AI;
        }
      }
    }

    // Sütunları kontrol et
    for (let i = 0; i < size - 2; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        const column = [
          gameTable[index],
          gameTable[index + size],
          gameTable[index + 2 * size],
        ];
        if (column.every((value) => value === "O")) {
          return gameResults.User;
        }
        if (column.every((value) => value === "X")) {
          return gameResults.AI;
        }
      }
    }

    // Soldan sağa çaprazı kontrol et
    for (let i = 0; i < size - 2; i++) {
      for (let j = 0; j < size - 2; j++) {
        const index = i * size + j;
        const diagonal = [
          gameTable[index],
          gameTable[index + size + 1],
          gameTable[index + 2 * size + 2],
        ];
        if (diagonal.every((value) => value === "O")) {
          return gameResults.User;
        }
        if (diagonal.every((value) => value === "X")) {
          return gameResults.AI;
        }
      }
    }

    // Sağdan sola çaprazı kontrol et
    for (let i = 0; i < size - 2; i++) {
      for (let j = 2; j < size; j++) {
        const index = i * size + j;
        const diagonal = [
          gameTable[index],
          gameTable[index + size - 1],
          gameTable[index + 2 * size - 2],
        ];
        if (diagonal.every((value) => value === "O")) {
          return gameResults.User;
        }
        if (diagonal.every((value) => value === "X")) {
          return gameResults.AI;
        }
      }
    }

    if (gameTable.indexOf(null) === -1) {
      return gameResults.Tie;
    }

    return false;
  };

  const reloadGame = () => {
    setTable(Array(tableLength * tableLength).fill(null));
    setGameTurn(gamePlayers.AI);
    setGameFinished(false);
    setGameWinner(null);
  };

  const getTableClassByLength = () => {
    if (tableLength === 4) return "grid-cols-[repeat(4,minmax(0,1fr))]";
    if (tableLength === 5) return "grid-cols-[repeat(5,minmax(0,1fr))]";
    if (tableLength === 6) return "grid-cols-[repeat(6,minmax(0,1fr))]";
    if (tableLength === 7) return "grid-cols-[repeat(7,minmax(0,1fr))]";
    if (tableLength === 8) return "grid-cols-[repeat(8,minmax(0,1fr))]";
    if (tableLength === 9) return "grid-cols-[repeat(9,minmax(0,1fr))]";
    if (tableLength === 10) return "grid-cols-[repeat(10,minmax(0,1fr))]";
    else return "grid-cols-[repeat(3,minmax(0,1fr))]";
  };

  const getGameResultText = () => {
    if (gameFinished) {
      if (gameWinner === gamePlayers.User) return "You won!";
      if (gameWinner === gamePlayers.AI) return "AI Player won!";
    } else {
      if (gameTurn === gamePlayers.User) return "Your turn!";
      if (gameTurn === gamePlayers.AI) return "AI Player's turn!";
    }

    return "";
  };

  //  X _ O
  //  X O X
  //  O X O

  //  X O X
  //  O X O
  //  _ X O

  const testMinimax = () => {
    const gameTable = ["X", null, "O", "X", "O", "X", "O", "X", "O"];
    const gameTable2 = ["X", "O", "X", "O", "X", "O", null, "X", "O"];

    const result = minimax(gameTable2, 0, true, true);

    console.log(result);
  };

  const testCheckWinner = () => {
    const gameTable = ["X", null, "O", "X", "O", "X", "O", "X", "O"];
    const gameTable2 = ["X", "O", "X", "O", "X", "O", "X", "X", "O"];

    const result = checkWinner(gameTable2);

    console.log(result);
  };

  useEffect(() => {
    if (checkWinner()) {
      finishGame();
    } else {
      handleAIPlay();
    }
  }, [gameTurn]);

  return (
    <>
      <div className="h-screen border-2 border-gray-700 flex flex-col gap-12 items-center justify-center">
        <div>
          <p>{getGameResultText()}</p>
        </div>
        <div
          className={`grid ${getTableClassByLength()} gap-[10px] p-[10px] border border-gray-200 rounded-xl`}
        >
          {table.map((tableCell, index) => (
            <TableCell
              value={tableCell}
              key={index}
              index={index}
              onClick={handlePlayerPlay}
            />
          ))}
        </div>
        <div>
          <button
            className="px-6 py-3 text-base text-white rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-green-300"
            onClick={reloadGame}
          >
            {gameFinished ? "Start Again" : "Reset Game"}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
