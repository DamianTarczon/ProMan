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
            domManager.addEventListener(
                `.board-title[data-board-id="${board.id}"]`,
                'click',
                changeTitleBox
            );
            // domManager.addEventListener(
            //     `.board-header[data-board-id="${board.id}"]`,
            //     'click',
            //     (e) => {submitBoardTitleChange(e, board.id)}
            // )
        }
    },


};
async function changeTitleBox(clickEvent) {

    const boardId = clickEvent.target.dataset.boardId;
    let inputBox = htmlFactory(htmlTemplates.inputBox)(boardId, clickEvent.target.innerHTML);
    domManager.addChild(`.board-title[data-board-id="${boardId}"]`,inputBox, "afterend")
    //  we can find better way to hide current title
    clickEvent.target.style.display='none';
}
// async function submitBoardTitleChange(clickEvent, boardId) {
//     if (clickEvent && clickEvent.target.dataset.boardId == boardId && clickEvent.target.tagName == 'BUTTON') {
//         let input = document.querySelector(`input[data-board-id="${boardId}"]`);
//         await dataHandler.updateBoard(boardId,{id:boardId, title:input.value})
//         // we delete all boards, than we are loading boards again
//         document.querySelector('.board-container').innerHTML='';
//         await boardsManager.loadBoards()
//     }
// }
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

// async function deleteBoard(clickEvent) {
//     let boardId = clickEvent.target.dataset.boardId;
//     await dataHandler.deleteBoard(boardId);
//     let boards = document.getElementsByClassName('board');
//     for (let i=0; i<boards.length; i++) {
//         if (boards[i].dataset.boardId === boardId){
//             boards[i].parentElement.remove();
//         }
//     }
// }

// async function deleteColumn(clickEvent) {
//     let columnId = clickEvent.target.dataset.columnId;
//     await dataHandler.deleteCardsFromColumn(columnId);
//     //remove div with that column
//
// }
