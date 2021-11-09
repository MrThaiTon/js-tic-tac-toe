import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCellListElement, getCurrentTurnElement, getGameStatusElement, getReplayButtonElement } from "./selectors.js";
import {checkGameStatus} from "./utils.js";


console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    //toggle turn
    currentTurn = currentTurn ===  TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    // update turn on DOM element

    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);

    }

}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;
    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
    
}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add('show');

}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove('show');

}

function highlightWinCells(winPositions) {
    if (!Array.isArray(winPositions)|| winPositions.length !== 3) {
        throw new Error('Invalid Win position');
    };
    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add('win');  
    }
} 

function handleCellClick(cell, index) {
    const isClicked = 
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;
   

    //only allow to click if game is playing and that cell is not clicked yet
    if (isClicked) return;


    //set selected cell
    cell.classList.add(currentTurn);

    //update cellValues
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;


    //toggle turn
    toggleTurn();
     
    //check game status
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            // update game status
            // show replay button
            updateGameStatus(game.status);
            showReplayButton();
            
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
             // update game status
            // show replay button
            // highlight win cells   
            updateGameStatus(game.status);
            showReplayButton();     
            highlightWinCells(game.winPositions);      
            break;
        }    
    
    
        default:
            //playing
            break;
    }

    console.log('click', cell, index);
}

function initCellElementList() {
    // set index for each element
    const liList = getCellElementList();
    liList.forEach((cell, index) => {
        
       /*  cell.addEventListener('click', () => handleCellClick(cell, index)); */
        cell.dataset.idx = index;
    
    });

    //attach event click for ulElement
    const ulElement = getCellListElement();
    if (ulElement) {
        ulElement.addEventListener("click", (event) => {
            if (event.target.tagName !== "LI") return;    
            
            const index = Number.parseInt(event.target.dataset.idx);
            console.log('click', event.target, index);
            
            handleCellClick(event.target, index);
        });
    }

}


function resetGame(){
    console.log('click button replay');
    //reset temp global variable
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");
    
    // reset DOM element
    //reset game status 
    updateGameStatus(GAME_STATUS.PLAYING);
    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);

    }
    
    //reset game board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = "";
    }

    //reset replay button
    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        
        replayButton.addEventListener('click', resetGame);   
    }
}







/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */






(() => {
    //bind click event for all li elements
    initCellElementList();


    
    //bind click event for replay butotn
    initReplayButton();

})();