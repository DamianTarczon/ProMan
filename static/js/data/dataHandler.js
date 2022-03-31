export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    updateBoard: async function (boardId, board) {
        let DB = {
            id: board.id,
            title: board.title
        };
        return await apiPut(`/api/${boardId}/put`, DB);

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
    getCardsByColumnId: async function (columnId) {
        return await apiGet(`/api/boards/${columnId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
        const cards = await apiGet(`/api/cards`);
        for (let card of cards){
            if (card.id == cardId) {
                return card
            }
        }
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
    getColumns: async function (boardId) {
        return await apiGet(`/api/${boardId}/columns`);
    },
    deleteColumn: async function (columnId) {
        return await apiDelete(`/api/column/${columnId}/delete`);
    },
    updateCardTitle: async function (data) {
        let DB = {
            id: data.id,
            board_id: data.board_id,
            status_id: data.status_id,
            title: data.title,
            card_order: data.card_order,
        };
        return await apiPost(`/api/cards/${data.id}`, DB);
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
    console.log(payload,"1");
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            console.log(response.json(),"json")
        })
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

async function apiPut(url, payload) {
    console.log(payload, "1");
    await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            console.log(response.json(), "json")
        })
        .then(data => {
            console.log('Success ADD:', data);
        })
        .catch((error) => {
            console.error('Error ADD:', error);
        });
}

async function apiPatch(url) {
}
