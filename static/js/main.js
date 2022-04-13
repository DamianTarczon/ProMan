import {boardsManager} from "./controller/boardsManager.js";
import {dataHandler} from "./data/dataHandler.js";



function init() {
    boardsManager.loadBoards();
}

export async function createPrivateBoard() {
    let privateBoardTitle = prompt("Please enter the name of a new private board", '');
    await dataHandler.createNewPrivateBoard(privateBoardTitle);
    document.querySelector('.board-container').innerHTML='';
    document.querySelector('.private-board-container').innerHTML='';
    await boardsManager.loadBoards()
}

init();
