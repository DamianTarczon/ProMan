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
                `.card[data-card-id="${card.id}"]`,
                "button",
                deleteButtonHandler
            );
            domManager.addEventListener(`.card-title[data-card-id="${card.id}"]`, 'input', changeTitle);
        }
    },
};

async function deleteButtonHandler(clickEvent) {
    let cardId = clickEvent.target.getAttribute('data-card-id');
    await dataHandler.deleteCard(cardId);
    let cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].dataset.cardId === cardId) {
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