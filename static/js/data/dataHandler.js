export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
        let boards = apiGet(`/api/boards`)
        for (let board of boards) {
            if (board.id === boardId) {
                return board
            }
        }
    },
    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/board/${boardId}/delete`);
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card

    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
        const data = {
            board_id: boardId,
            status_id: statusId,
            title: cardTitle,
        };
         await apiPost(`/api/boards/${boardId}/cards/`, data);
    },
    deleteCard: async function (cardId) {
        return await apiDelete(`/api/cards/${cardId}/delete`);
    },
    deleteCardsFromColumn: async function (columnId) {
        return await apiDelete(`/api/column/${columnId}/delete`);
    },
    updateCardTitle: async function (title,cardId){
        let date = {
            title: title,
        };
        return await apiPatch(`/api/cards/${cardId}`,date);
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success ADD:', data);
            })
            .catch((error) => {
                console.error('Error ADD:', error);
            });
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPut(url) {

}

async function apiPatch(url, updated) {
    fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "PATCH",

    body: JSON.stringify(updated)
  })
    .then(response => response.json())
            .then(data => {
                console.log('Success PATCH:', data);
            })
            .catch((error) => {
                console.error('Error PATCH:', error);
            });
}
