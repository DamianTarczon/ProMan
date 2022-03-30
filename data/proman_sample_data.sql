--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS columns;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL,
    column_id   INTEGER             NOT NULL
);

CREATE TABLE columns (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL


);

---
--- insert data
---

INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');

INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1, 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1, 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1, 4);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2, 4);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1, 5);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2, 5);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1, 6);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1, 7);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1, 8);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2, 8);

---
--- add columns
---

INSERT INTO columns VALUES (1,1,1,'new');
INSERT INTO columns VALUES (2,1,2,'in progress');
INSERT INTO columns VALUES (3,1,3,'testing');
INSERT INTO columns VALUES (4,1,4,'done');
INSERT INTO columns VALUES (5,2,1,'new');
INSERT INTO columns VALUES (6,2,2,'in progress');
INSERT INTO columns VALUES (7,2,3,'testing');
INSERT INTO columns VALUES (8,2,4,'done');

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY columns
    ADD CONSTRAINT fk_columns_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY columns
    ADD CONSTRAINT fk_columns_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

-- ALTER TABLE ONLY columns
--     ADD CONSTRAINT fk_columns_title FOREIGN KEY (title) REFERENCES statuses(title);
--
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_column_id FOREIGN KEY (column_id) REFERENCES columns(id);
