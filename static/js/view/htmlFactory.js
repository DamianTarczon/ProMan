export const htmlTemplates = {
    board: 1,
    column: 2,
    card: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.column]: columnBuilder,
    [htmlTemplates.card]: cardBuilder
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
    return `<section class="board">
                <div class="board-header">
                <span class="board">${board.title}</span>
                <button class="rename">RENAME</button>
                <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
                <button class="board-toggle"><i class="fas fa-chevron-down">zwin</i></button>
                </div>
                <div class="board-columns" data-board-id=${board.id}>
                </div>
            </section>`;
}

function columnBuilder(column) {
    return `<div class="board-column">
                <div class="board-column-title">${column.title}</div>
                <div class="board-column-content" data-column-id="${column.id}"></div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-title">${card.title}</div>
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
            </div>`;
}
