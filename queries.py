import data_manager
import psycopg2.extras
import psycopg2
import bcrypt


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """,
        {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE user_id IS NULL;
        """
    )


def get_cards():
    """
    Gather all cards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM cards
        ;
        """
    )


def get_cards_for_board_by_column_id(column_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.column_id = %(column_id)s
        ;
        """,
        {"column_id": column_id})

    return matching_cards


def get_card(card_id):
    card = data_manager.execute_select(
        """
        SELECT * 
        FROM cards
        WHERE cards.id = %(card_id)s
        ;
        """,
        {'card_id': card_id})
    return card


def delete_card(card_id):
    data_manager.execute_no_return(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s;
        """, {"card_id": card_id}
    )


def delete_board(board_id):
    data_manager.execute_no_return(
        """
        DELETE FROM cards
        WHERE board_id = %(board_id)s;
        """, {"board_id": board_id}
    )
    data_manager.execute_no_return(
        """
        DELETE FROM columns
        WHERE board_id = %(board_id)s;
        """, {"board_id": board_id}
    )
    data_manager.execute_no_return(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s;
        """, {"board_id": board_id}
    )


def delete_column(column_id):
    data_manager.execute_no_return(
        """
        DELETE FROM cards
        WHERE column_id = %(column_id)s;
        """, {"column_id": column_id}
    )
    data_manager.execute_no_return(
        """
        DELETE FROM columns
        WHERE id = %(column_id)s;
        """, {"column_id": column_id}
    )


def get_columns(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM columns
        WHERE board_id = %(board_id)s;
        """, {"board_id": board_id}
    )


def update_card_title(card_id, title):
    return data_manager.execute_select(
        """
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(card_id)s
        RETURNING title;
        """,
        {'title': title,
         'card_id': card_id}
    )


def update_board(board):
    return data_manager.execute_select(
        """
        UPDATE boards
        SET title = %(board_title)s
        WHERE id = %(board_id)s
        RETURNING *;
        """, {"board_title": board["title"], "board_id": board["id"]}
    )


def create_new_board(title):
    board_id = data_manager.execute_select(
        """
        INSERT INTO boards (title)
        VALUES (%s)
        RETURNING id
        """, (title,)
    )[0]['id']

    column_titles = data_manager.execute_select(
        """
        SELECT title
        FROM statuses
        """
    )
    for i in range(4):
        insert_column_into_new_board(board_id, i+1, column_titles[i]['title'])


def insert_column_into_new_board(board_id, status_id, title):
    data_manager.execute_no_return(
        """
            INSERT INTO columns (board_id, status_id, title)
            VALUES ((%s), (%s), (%s))
            """, (board_id, status_id, title)
    )


def create_new_private_board(title, user_name):
    user_id = get_user_id_from_session(user_name)
    board_id = data_manager.execute_select(
        """
            INSERT INTO boards (title, user_id)
            VALUES ((%s), (%s))
            RETURNING id
        """, (title, user_id)
    )[0]['id']

    column_titles = data_manager.execute_select(
        """
            SELECT title
            FROM statuses
        """
    )
    for i in range(4):
        insert_column_into_new_board(board_id, i+1, column_titles[i]['title'])


def db_name_check(name):
    db_names_list = data_manager.execute_select("""
    SELECT name
    FROM users
    ;
    """)
    list_names_list = [users['name'] for users in db_names_list]
    if name in list_names_list:
        return True
    else:
        return False


def db_registration(name, password):
    hashed_password = hash_password(password)
    data_manager.execute_no_return("""
    INSERT INTO users(name, password)
    VALUES (%(name)s, %(password)s);

    """, {"name": name, "password": hashed_password})


def get_user_id_from_session(user_name):
    return data_manager.execute_select(
        """
            SELECT id
            FROM users
            WHERE name = (%s)
        """, (user_name, )
    )[0]['id']


def get_private_boards(user_id):
    return data_manager.execute_select(
        """
            SELECT * 
            FROM boards
            WHERE user_id = (%s)
        """, (user_id,)
    )


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def get_hashed_password(name):
    return data_manager.execute_select(
        """
            SELECT password
            FROM users
            WHERE name = (%s)
        """, (name,)
    )[0]['password']
