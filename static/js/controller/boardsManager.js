import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild(".board-container", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );

        }
    },


};

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const columns = await dataHandler.getColumns(boardId);
    for (let i=0; i<columns.length;i++) {
        const columnBuilder = htmlFactory(htmlTemplates.column);
        const content1 = columnBuilder(columns[i]);
        domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content1)
        await cardsManager.loadCards(columns[i].id);
    }
}

async function deleteBoard(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    await dataHandler.deleteBoard(boardId);
    let boards = document.getElementsByClassName('board');
    for (let i=0; i<boards.length; i++) {
        if (boards[i].dataset.boardId === boardId){
            boards[i].parentElement.remove();
        }
    }
}

async function deleteColumn(clickEvent) {
    let columnId = clickEvent.target.dataset.columnId;
    await dataHandler.deleteCardsFromColumn(columnId);
    //remove div with that column

}
