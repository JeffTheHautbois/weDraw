import sqlite3
conn = sqlite3.connect('dbase.db')
c = conn.cursor()


def init():
    c.execute('''CREATE TABLE IF NOT EXISTS sketch
             (time integer, session_id integer,
              user_id integer, x integer, y integer,
              lastX integer, lastY integer)''')
    conn.commit()
