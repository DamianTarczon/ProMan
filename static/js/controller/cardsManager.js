import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (columnId) {
        const cards = await dataHandler.getCardsByColumnId(columnId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-column-content[data-column-id="${columnId}"]`, content);
            domManager.addEventListener(
                `.bin[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(`.card-title[data-card-id="${card.id}"]`, 'input', changeTitle);
            // domManager.addEventListener(`.board[data-board-id="${card.board_id}"]`, 'drag', changeColumn);
        }
    },

    onDragStart: function (event){
        event.dataTransfer.setData('text/plain', event.target.id);
    },

    onDrop: function (event){

    },

    onDragOver: function (event){

    }

};


function changeColumn() {
    const cards = document.querySelectorAll('.card');
    const columns = document.querySelectorAll('.board-column');
    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', event => {
            event.preventDefault();
            const afterElement = getDragAfterElement(column, event.clientY);
            const card = document.querySelector('.card');
            let newCard = document.createElement(`${card}`);
            if (afterElement == null) {
                column.appendChild(newCard);
            } else {
                column.insertBefore(newCard, afterElement);
            }
        });

        function getDragAfterElement(column, y) {
            const draggableElements = [...column.querySelectorAll('.card:not(.dragging)')]
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return {offset: offset, element: child}
                } else {
                    return closest
                }
            }, {offset: Number.NEGATIVE_INFINITY});
        }
    });
}

async function deleteButtonHandler(clickEvent) {
    let cardId = clickEvent.target.getAttribute('data-card-id');
    await dataHandler.deleteCard(cardId);
    let cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute('data-card-id') === cardId) {
            cards[i].remove();
        }
    }
}


async function changeTitle(clickEvent) {
    let cardId = clickEvent.target.getAttribute('data-card-id');
    let title = clickEvent.target.innerText;
    let card = await dataHandler.getCard(cardId);
    card.title = title;
    await dataHandler.updateCardTitle(card)
}