from flask import Flask, render_template, url_for
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


@app.route("/api/cards/<int:card_id>", methods=["GET", "POST", "PATCH"])
@json_response
def get_card(card_id: int):
    return queries.get_card(card_id)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


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


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
