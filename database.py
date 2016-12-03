import sqlite3
conn = sqlite3.connect('dbase.db')
c = conn.cursor()


def init():
    c.execute('''CREATE TABLE IF NOT EXISTS sketch
             (time integer, session_id integer,
              user_id integer, x integer, y integer,
              lastX integer, lastY integer, lWidth color, lColor text)''')
    conn.commit()


def get_db_formatted(data):
    drawing = data["drawing"]
    db_formatted = (data["time"], data["session_id"], data["user_id"],
                    drawing["x"], drawing["y"], drawing["lastX"],
                    drawing["lastY"])
    return db_formatted


def get_json_formatted(data):
    json = {}
    json["time"] = data[0]
    json["session_id"] = data[1]
    json["user_id"] = data[2]
    drawing = {}
    drawing["x"] = data[3]
    drawing["y"] = data[4]
    drawing["lastX"] = data[5]
    drawing["lastY"] = data[6]
    json["drawing"] = drawing

    return json


def insert_drawing(data):
    db_formatted = get_db_formatted(data)
    c.execute('INSERT INTO sketch VALUES (?, ?, ?, ?, ?, ?, ?)', db_formatted)
    conn.commit()


def get_whole_drawing():
    output = []
    for row in c.execute("SELECT * FROM sketch ORDER BY time"):
        output.append(get_json_formatted(row))
    return output
