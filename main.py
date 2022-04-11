from flask import Flask, render_template, url_for, request, session, redirect
from dotenv import load_dotenv
import mimetypes
import queries
import time
import bcrypt
from util import json_response

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = "b/\n\xefp\xc6z\xaaj\xbd\x1fR=\x17.f%\xbf\xe7I\xd3"
# app.permanent_session_lifetime = timedelta(minutes=5)
load_dotenv()


@app.route("/")
def index():
    if len(session) == 0:
        user = "guest"
    else:
        user = session['user']
    return render_template('index.html', user=user)


@app.route("/registration", methods=['GET', 'POST'])
def registration():
    if request.method == 'GET':
        return render_template('registration.html')
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password']
        if not is_name_in_db(name):
            queries.db_registration(name, password)
        else:
            error = "User name already taken. Try again!"
            return render_template('registration.html', error=error)
        return redirect(url_for('index'))


def is_name_in_db(name):
    print(name)
    list_names_list = queries.db_name_check()
    print(list_names_list)

    if name in list_names_list:
        return True
    else:
        return False


def is_password_in_db(password):
    list_passwords_list = queries.db_password_check()
    if password in list_passwords_list:
        return True
    else:
        return False


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return render_template('login.html')
    else:
        name = request.form['name']
        password = request.form['password']
        if is_name_in_db(name) and is_password_in_db(password):
            session['user'] = name
            ok = f"Hi {name} You are now logged in!"
            return render_template("index.html", ok=ok)
        else:
            error = "Incorrect name or password. Try again!"
            return render_template('login.html', error=error)


@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


@app.route("/api/boards", methods=['GET', 'POST'])
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/post", methods=["POST"])
@json_response
def create_new_board():
    title = request.json
    queries.create_new_board(title)


@app.route('/api/new_private_board', methods=['POST'])
@json_response
def create_new_private_board():
    if len(session) == 0:
        return redirect(url_for('index'))
    else:
        title = request.json
        queries.create_new_private_board(title, session['user'])


@app.route("/api/cards")
@json_response
def get_cards():
    """
    All the cards
    """
    return queries.get_cards()


@app.route("/api/cards/<int:card_id>", methods=["GET", "PUT"])
@json_response
def get_card(card_id: int):
    if request.method == 'GET':
        return queries.get_card(card_id)
    elif request.method == 'PUT':
        card = request.json
        title = queries.update_card_title(card['id'], card['title'])
        print(title)


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
def delete_column(column_id: int):
    queries.delete_column(column_id)


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


@app.route("/api/user_id")
@json_response
def get_user_id_from_session():
    if len(session) == 0:
        return None
    else:
        user_name = session['user']
    return queries.get_user_id_from_session(user_name)


@app.route('/api/private_boards/<user_id>')
@json_response
def get_private_boards(user_id):
    return queries.get_private_boards(user_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
