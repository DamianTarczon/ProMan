from flask import Flask, render_template, url_for, request
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/registration")
def registration():
    return render_template('registration.html')


@app.route("/login")
def login():
    return render_template('login.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/cards")
@json_response
def get_cards():
    """
    All the cards
    """
    return queries.get_cards()


@app.route("/api/cards/<int:card_id>", methods=["GET", "POST"])
@json_response
def get_card(card_id: int):
    if request.method == 'GET':
        return queries.get_card(card_id)
    elif request.method == 'POST':
        card = request.json
        queries.update_card(card['id'], card['title'])


@app.route("/api/boards/<int:column_id>/cards/")
@json_response
def get_cards_for_board_by_column_id(column_id: int):
    """
    All cards that belongs to a board
    :param column_id: id of the parent board
    """
    return queries.get_cards_for_board_by_column_id(column_id)


@app.route("/api/cards/<int:card_id>/delete", methods=['DELETE'])
@json_response
def delete_card(card_id: int):
    queries.delete_card(card_id)


@app.route("/api/board/<int:board_id>/delete", methods=['DELETE'])
@json_response
def delete_board(board_id: int):
    queries.delete_board(board_id)


@app.route("/api/column/<int:column_id>/delete", methods=['DELETE'])
@json_response
def delete_cards_from_column(column_id: int):
    queries.delete_cards_from_column(column_id)


@app.route("/api/<int:board_id>/columns")
@json_response
def get_columns(board_id: int):
    """
    All the boards
    """
    return queries.get_columns(board_id)


@app.route("/api/<int:board_id>/put", methods=['PUT'])
@json_response
def update_board(board_id: int):
    """
    Update board by board_id
    """
    board = request.get_json()
    return queries.update_board(board)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
