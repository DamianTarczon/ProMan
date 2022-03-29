import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        }
    },

};

async function deleteButtonHandler(clickEvent) {
    let cardId = clickEvent.target.dataset.cardId;
    await dataHandler.deleteCard(cardId);
    let cards = document.getElementsByClassName('card');
    for (let i=0; i<cards.length; i++) {
        if (cards[i].dataset.cardId === cardId) {
            cards[i].remove();
        }
    }
}
