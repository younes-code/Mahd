from flask import Flask
from flask import request

import socketio

# standard Python
sio = socketio.Client()

app = Flask(__name__)

sio.connect('http://192.168.43.7:4001')

@app.route("/terra", methods=["POST"])
def handle_terra_webhook():
    print("Webhook recieved!")
    sio.emit('new_data', request.json)
    return "OK"

app.run(port=8000)
