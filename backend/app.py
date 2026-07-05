from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json
from datetime import datetime
import os
import firebase_admin
from firebase_admin import credentials, firestore

if os.environ.get("FIREBASE_CREDENTIALS"):
    cred_dict = json.loads(os.environ.get("FIREBASE_CREDENTIALS"))
    cred = credentials.Certificate(cred_dict)
else:
    cred = credentials.Certificate("serviceAccountKey.json")

firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")
shelf_model = joblib.load("shelf_model.pkl")

latest_live_reading = None

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Smart E-Nose API is running!",
        "project": "Citrus Freshness Detection - Nagpur",
        "version": "1.0"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        mq135 = float(data["mq135"])
        mq4   = float(data["mq4"])
        mq3   = float(data["mq3"])
        temperature = float(data["temperature"])
        humidity    = float(data["humidity"])
        fruit = data.get("fruit", "Orange")

        sensor_input = np.array([[mq135, mq4, mq3, temperature, humidity]])

        status = model.predict(sensor_input)[0]
        shelf_days = int(round(shelf_model.predict(sensor_input)[0]))
        shelf_days = max(0, shelf_days)

        if status == "Fresh":
            advice = "Fruit is fresh. Safe to consume or store."
        elif status == "Medium":
            advice = "Fruit is aging. Use soon or refrigerate."
        else:
            advice = "Fruit is spoiled. Do not consume."

        result = {
            "fruit": fruit,
            "mq135": mq135,
            "mq4": mq4,
            "mq3": mq3,
            "temperature": temperature,
            "humidity": humidity,
            "freshness": status,
            "shelf_life_days": shelf_days,
            "advice": advice,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        try:
            doc_ref = db.collection('citrus_history').document()
            doc_ref.set(result)
        except Exception as cloud_err:
            print(f"Cloud locker error: {cloud_err}")

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/live", methods=["POST"])
def receive_live_data():
    global latest_live_reading
    try:
        data = request.get_json()

        mq135 = float(data["mq135"])
        mq4   = float(data["mq4"])
        mq3   = float(data["mq3"])
        temperature = float(data["temperature"])
        humidity    = float(data["humidity"])
        fruit = data.get("fruit", "Orange")

        sensor_input = np.array([[mq135, mq4, mq3, temperature, humidity]])
        status = model.predict(sensor_input)[0]
        shelf_days = max(0, int(round(shelf_model.predict(sensor_input)[0])))

        latest_live_reading = {
            "fruit": fruit,
            "mq135": mq135,
            "mq4": mq4,
            "mq3": mq3,
            "temperature": temperature,
            "humidity": humidity,
            "freshness": status,
            "shelf_life_days": shelf_days,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        return jsonify({"message": "Live data received"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/live", methods=["GET"])
def get_live_data():
    if latest_live_reading is None:
        return jsonify({"connected": False}), 200
    return jsonify({"connected": True, "data": latest_live_reading}), 200

@app.route("/history", methods=["GET"])
def history():
    try:
        docs = db.collection('citrus_history').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
        records = [doc.to_dict() for doc in docs]
        return jsonify({
            "total": len(records),
            "records": records
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/analytics", methods=["GET"])
def analytics():
    try:
        docs = db.collection('citrus_history').stream()
        records = [doc.to_dict() for doc in docs]

        if not records:
            return jsonify({"message": "No data yet"}), 200

        total   = len(records)
        fresh   = sum(1 for r in records if r["freshness"] == "Fresh")
        medium  = sum(1 for r in records if r["freshness"] == "Medium")
        spoiled = sum(1 for r in records if r["freshness"] == "Spoiled")

        return jsonify({
            "total_readings": total,
            "fresh_count": fresh,
            "medium_count": medium,
            "spoiled_count": spoiled,
            "fresh_percent": round((fresh / total) * 100, 1),
            "spoiled_percent": round((spoiled / total) * 100, 1)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Smart E-Nose API...")
    app.run(host="0.0.0.0", debug=True, port=5000)