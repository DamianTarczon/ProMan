export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3,
    inputBox: 4
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.inputBox]: inputBoxBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<section class="board" data-board-id="${board.id}">
                <div class="board-header" data-board-id="${board.id}">
                <span class="board-title" data-board-id="${board.id}" contenteditable="true">${board.title}</span>
                <button class="toggle-board-button" data-board-id="${board.id}">Show</button>
                <button class="board-delete" data-board-id="${board.id}">Delete</button>
                <button class="add-column" data-board-id="${board.id}">Add new column</button>
                </div>
                <div class="board-columns" data-board-id=${board.id}>
                </div>
            </section>`;
}

function columnBuilder(column) {
    return `<div class="board-column" ondragover="onDragOver();" ondrop="onDrop();" data-column-id="${column.id}">
                <div class="board-column-title"  contenteditable="true">${column.title}<a class="column-delete" data-column-id="${column.id}" >🗑</a></div>               
                <div class="board-column-content" data-column-id="${column.id}"></div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" draggable="true" ondragstart="onDragStart();" data-card-id="${card.id}">
                <div class="card-title" contenteditable="true" data-card-id="${card.id}">${card.title}</div>
                <div class="card-remove"><a class="bin" data-card-id="${card.id}" >🗑</a></div>
            </div>`;
}

function inputBoxBuilder(boardId, boardTitle) {
    return `<input type="text" name="title" data-board-id="${boardId}" value="${boardTitle}">
            <button type="Submit" data-board-id="${boardId}">Submit</button>`
}

