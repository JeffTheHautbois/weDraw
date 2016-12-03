from flask import Flask
from flask import render_template
from flask_socketio import SocketIO, emit
from pprint import pprint
from flask import request
from flask import url_for
from flask import redirect
import database


app = Flask(__name__)
socketio = SocketIO(app)
data = []
database.init()
#import pdb; pdb.set_trace()


@socketio.on('update')
def update(drawing):
    #pprint(drawing)
    database.insert_drawing(drawing)
    socketio.emit("recieve", drawing)  # Send the updated sketch to client


@socketio.on('join')
def connect_user(data):
    drawing = database.get_whole_drawing(data["session_id"])
    emit("loadDrawing", drawing)


@app.route('/<session_id>/<username>/draw')
def draw(session_id,username):
    return render_template('draw.html')


@app.route('/', methods=['GET','POST'])
def hello_world():
    print("someone has connected!")
    if request.method == 'GET':
        return render_template('profilePage.html')
    elif request.method == 'POST':
        return redirect(url_for('draw',session_id=request.form['sessionId'],username=request.form['profileName']))

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=8000)
