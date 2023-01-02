from flask import Flask
from flask import request
from flask import render_template
import requests
from flask_socketio import SocketIO

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from random_password import generate_random_password

# Use a service account
cred = credentials.Certificate('./mahd-8f7f4-firebase-adminsdk-qivy3-9caee6e60b.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)

sio = SocketIO(app)

headers = {"dev-id": "bits-n-bytes-dev-gJ7saQndTH", "x-api-key": "e98630d58b3429f1ff330d2bfc84becfe3ecaad523d06e29892563617fb766bd"}

@app.route('/get-data')
def get_data():
    url_data = "https://api.tryterra.co/v2/body?start_date=2022-3-14&to_webhook=false&user_id=af49017e-1362-4909-bfd5-741df78ea758"
    response = requests.request("GET", url_data, headers=headers)
    return response.json()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    phone = request.form.get('phone')
    return "done"

@app.route('/user_id')
def get_user_id():
    print(request.args.get('id'))
    doc = db.collection(u'users').document(request.args.get('id')).get()
    if doc.exists:
        print(f'Document data: {doc.to_dict()}')
        return {"status": "success", "data": doc.to_dict()}, 200
    else:
        print(u'No such document!')
        return {"status": "failure"}, 404

@app.route('/register', methods=['POST'])
def register():
    fullname = request.form.get('fullname')
    phone = request.form.get('phone')
    gender = request.form.get('gender')
    birthday = request.form.get('birthday')

    data = {
        "fullname": fullname,
        "phone": phone,
        "birthday": birthday,
        "gender": gender,
        "devices": {},
        "password": generate_random_password(12)
    }

    db.collection(u'users').document(phone).set(data)

    return {"status": "success"}, 200 

@app.route('/success', methods=['GET'])
def success():
    db.collection(u'users').document(request.args.get("reference_id")).update({
        "devices": {
            "type": request.args.get('resource'),
            "user_id": request.args.get("user_id")
        }
    })
    return "You have been successfuly connected."   

@app.route('/failure')
def failure():
    return "An error occured, try again later." 

@app.route('/logout', methods=["POST"])
def logout():
    phone = request.form.get('phone')
    user_id = request.form.get('user_id')
    url_data = "https://api.tryterra.co/v2/auth/deauthenticateUser?user_id="+user_id
    response = requests.request("DELETE", url_data, headers=headers)
    db.collection(u'users').document(phone).update({
        "devices": {}
    })
    return {"status": "success"}, 200

# Sockets ===================================

@sio.on('new_data')
def on_new_data(data): 
    sio.emit('new_data', data, broadcast=True)
    print('test')
    if len(data['data']) == 0:
        return

    d = data['data'][0]
    if "heart_data" in d.keys():
        hd = d["heart_data"]["heart_rate_data"]["detailed"]["hr_samples"][-1]['bpm']
        sio.emit('heart_data', hd, broadcast=True)

        if hd < 80 :
            sio.emit('danger', {"hd": "lr", "value": hd}, broadcast=True)
        elif hd > 180:
            sio.emit('danger', {"hd": "gte", "value": hd}, broadcast=True)
    
    if "temperature_data" in d.keys():
        if "body_temperature_samples" in d["temperature_data"]:
            temp = d["temperature_data"]["body_temperature_samples"][-1]['body_temperature_celsius']
            sio.emit('temperature_data', temp, broadcast=True)

            if temp < 35.5 :
                sio.emit('danger', {"temp": "lr", "value": temp}, broadcast=True)
            elif temp > 37.5:
                sio.emit('danger', {"temp": "gte", "value": temp}, broadcast=True)
    
    if "sleep_durations_data" in d.keys():
        asleep = d["sleep_durations_data"]["asleep"]["duration_asleep_state"]
        sio.emit('sleep', asleep, broadcast=True)
@sio.on('image_result')
def image_result(res):
    print(res)
    if res:
        sio.emit('flipped', broadcast=True)

@sio.on('image')
def send_image(data):
    sio.emit('image', data, broadcast=True)

@sio.on('echo-ping')
def echo_ping(message):
    print("Recieved message: ",message)
app.run(host="192.168.43.7",port=4001, debug=True)