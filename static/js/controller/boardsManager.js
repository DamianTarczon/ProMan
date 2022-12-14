import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        //wez id uzytkownika ktory jest w sesji
        let userId = await dataHandler.getUserId();
        //jesli jest jakies id to najpierw wyswietl jego prywatne boardy i dodaj eventlistenery
        if (userId) {
            let privateBoards = await dataHandler.getPrivateBoards(userId);
            for (let privateBoard of privateBoards) {
                let boardBuilder = htmlFactory(htmlTemplates.board);
                let privateBoardContent = boardBuilder(privateBoard);
                domManager.addChild('.private-board-container', privateBoardContent);
                domManager.addEventListener(
                `.toggle-board-button[data-board-id="${privateBoard.id}"]`,
                "click",
                showHideButtonHandler
                );
                domManager.addEventListener(
                    `.board-title[data-board-id="${privateBoard.id}"]`,
                    'click',
                    changeTitleBox
                );
                domManager.addEventListener(
                    `.board-header[data-board-id="${privateBoard.id}"]`,
                    'click',
                    (e) => {submitBoardTitleChange(e, privateBoard.id)}
                );
                domManager.addEventListener(
                    `.board-delete[data-board-id="${privateBoard.id}"]`,
                    'click',
                    deleteBoard
                );
                domManager.addEventListener(`.add-column[data-board-id="${privateBoard.id}"`,
                'click',
                addNewColumn
                );
                document.querySelector(`.board-header[data-board-id="${privateBoard.id}"]`).style.background = "cornflowerblue";
            }
        }
        //wez reszte publicznych boardow i je wyswietl
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const boardContent = boardBuilder(board);
            domManager.addChild(".board-container", boardContent);
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
            domManager.addEventListener(
                `.board-header[data-board-id="${board.id}"]`,
                'click',
                (e) => {submitBoardTitleChange(e, board.id)}
            );
            domManager.addEventListener(
                `.board-delete[data-board-id="${board.id}"]`,
                'click',
                deleteBoard
            );
            domManager.addEventListener(`.add-column[data-board-id="${board.id}"`,
                'click',
                addNewColumn
            );
            domManager.addEventListener(`#Refresh`,'click',
                refreshSite
            );
        }
    },
};

async function addNewColumn(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    let columnTitle = prompt("Please enter the name of a new column", '');
    await dataHandler.addNewColumn(boardId, columnTitle);
    document.querySelector('.board-container').innerHTML='';
    document.querySelector('.private-board-container').innerHTML='';
    await boardsManager.loadBoards();
}

async function changeTitleBox(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let inputBox = htmlFactory(htmlTemplates.inputBox)(boardId, clickEvent.target.innerHTML);
    domManager.addChild(`.board-title[data-board-id="${boardId}"]`,inputBox, "afterend")
    //  we can find better way to hide current title
    clickEvent.target.style.display='none';
}

async function submitBoardTitleChange(clickEvent, boardId) {
    if (clickEvent.target.dataset.boardId == boardId && clickEvent.target.tagName == 'BUTTON') {
        let input = document.querySelector(`input[data-board-id="${boardId}"]`);
        await dataHandler.updateBoard(boardId,{id:boardId, title:input.value})
        // we delete all boards, than we are loading boards again
        document.querySelector('.board-container').innerHTML='';
        document.querySelector('.private-board-container').innerHTML='';
        await boardsManager.loadBoards()
    }
}

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let btn = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
    if (btn.innerText === 'Show') {
        const columns = await dataHandler.getColumns(boardId);
        btn.innerText = 'Hide';
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i]
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const columnContent = columnBuilder(column);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, columnContent);
            domManager.addEventListener(
                `.column-delete[data-column-id="${column.id}"]`,
                'click',
                deleteColumn
            );
            await cardsManager.loadCards(column.id);
        }
    } else {
        btn.innerText='Show';
        let columns=document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
        columns.innerHTML='';
    }
}

async function deleteBoard(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    await dataHandler.deleteBoard(boardId);
    let boards = document.getElementsByClassName('board');
    for (let i=0; i<boards.length; i++) {
        if (boards[i].getAttribute('data-board-id') === boardId){
            boards[i].remove();
        }
    }
}

async function deleteColumn(clickEvent) {
    let columnId = clickEvent.target.dataset.columnId;
    console.log(columnId);
    await dataHandler.deleteColumn(columnId);
    let columns = document.getElementsByClassName('board-column');
    for (let i=0; i<columns.length; i++) {
        if (columns[i].getAttribute('data-column-id') === columnId){
            columns[i].remove();
        }
    }
}

let button = document.getElementById('board-creator')
button.onclick = async function (){
    let boardTitle = prompt("Please enter the name of a new board", '');
    await dataHandler.createNewBoard(boardTitle);
    // we delete all boards, than we are loading boards again // what is the better option to refresh the page??
    document.querySelector('.board-container').innerHTML='';
    document.querySelector('.private-board-container').innerHTML='';
    await boardsManager.loadBoards()
}


async function refreshSite(clickEvent) {
    document.querySelector('.board-container').innerHTML='';
    await boardsManager.loadBoards()
}