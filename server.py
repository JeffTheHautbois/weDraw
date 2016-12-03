from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
from pprint import pprint
import database

app = Flask(__name__)
socketio = SocketIO(app)
data = []
database.init()


@socketio.on('update')
def update(drawing):
    pprint(drawing)
    database.insert_drawing(drawing)
    socketio.emit("recieve", drawing)  # Send the updated sketch to client


@socketio.on('join')
def connect_user(message):
    print(message + "...success!")
    emit("loadDrawing", database.get_whole_drawing())


@app.route('/<session_id>/draw')
def draw(session_id):
    return render_template('draw.html')


@app.route('/')
def hello_world():
    return 'It works!'

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8000)
