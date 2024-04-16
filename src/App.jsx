import Player from "./components/Player";
import GameBoard from './components/GameBoard';
import { useState } from 'react';
import Log from './components/Log';
import GameOver from './components/GameOver';
import { WINNING_COMBINATIONS } from './winning-combinations';

const initialGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

function deriveActivePlayer(turns) {
    let currentPlayer = 'X';

    if (turns.length > 0 && turns[0].player === 'X') {
        currentPlayer = 'O';
    }
    return currentPlayer;
}

function App()
{
    const [players, setPlayers] = useState({
        X: 'Player 1',
        O: 'Player 2',
    })
    const [gameTurns, setGameTurns] = useState([]);
    const activePlayer = deriveActivePlayer(gameTurns);
    let gameBoard = [...initialGameBoard.map((array) => [...array])];
    for (const turn of gameTurns) {
        const { square, player } = turn;
        const { row, col } = square;
        gameBoard[row][col] = player;
    }
    let winner;

    for (const combination of WINNING_COMBINATIONS) {
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
        if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol == thirdSquareSymbol) {
            winner = players[firstSquareSymbol];
        }
    }

    const hasDraw = gameTurns.length === 9 & !winner;

    function handleSelectSquare(rowIndex, colIndex)
    {
        console.log(rowIndex,colIndex);
        
        setGameTurns((prevTurns) =>
        {
            let currentPlayer = deriveActivePlayer(prevTurns);
            const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...prevTurns];
            return updatedTurns;
        });
    }
    function handleRestart() {
        setGameTurns([]);
    }
    function handlePlayerNameChange(symbol, playerName) {
        setPlayers((prevPlayers) => {
            return {
                ...prevPlayers,
                [symbol]: playerName
            }; 
        });
    }

  return (
    <main>
      <div id='game-container'>
        <ol id="players" className='highlight-player'>
                  <Player initialName="Player 1" isActive={activePlayer === 'X'} symbol="X" onChangeName={handlePlayerNameChange } />
            <Player initialName="Player 2" isActive={ activePlayer === 'O' } symbol="O" onChangeName={handlePlayerNameChange }/>
              </ol>
              {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
              <GameBoard
                  onSelectSquare={handleSelectSquare}
                  activePlayerSymbol={activePlayer}
                  board={ gameBoard }
              />
          </div>
          <Log turns={gameTurns}/>
    </main>
  )
}

export default App
