import os
import json
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
# Enable CORS for cross-origin requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB connection setup
try:
    client = MongoClient(
        'mongodb+srv://abhishkdk:7rVNhjh5vWGT7aqM@cluster0.nau6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        tlsInsecure=True  
    )
    db = client['visualization_dashboard']  
    collection = db['dash-data']  
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

@app.route('/api/load_data', methods=['POST'])
def load_data():
    file_path = 'jsondata.json'  

    if not os.path.exists(file_path):
        return jsonify({"message": "File not found."}), 404

    try:
        with open(file_path, 'r') as file:
            json_data = json.load(file)
            if isinstance(json_data, list):
                result = collection.insert_many(json_data)
                return jsonify({"message": "Data inserted successfully!", "inserted_ids": str(result.inserted_ids)}), 200
            else:
                return jsonify({"message": "JSON data is not a list."}), 400
    except Exception as e:
        return jsonify({"message": "Error loading data.", "error": str(e)}), 500

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        data = list(collection.find({}, {'_id': 0}))  
        

        transformed_data = []
        for entry in data:
            year = entry.get("start_year") or entry.get("end_year") or None  
            transformed_entry = {
                "Country": entry.get("country", "Unknown"),
                "Intensity": entry.get("intensity", 0),
                "Likelihood": entry.get("likelihood", 0),
                "Relevance": entry.get("relevance", 0),
                "Year": int(year) if isinstance(year, str) and year.isdigit() else year,
                "Topic": entry.get("topic", "Unknown"),
                "Region": entry.get("region", "Unknown"),
                "City": entry.get("city", "Unknown")
            }
            transformed_data.append(transformed_entry)

        return jsonify({"data": transformed_data}), 200
    except Exception as e:
        return jsonify({"message": "Error fetching data.", "error": str(e)}), 500

@app.route('/api/test_connection', methods=['GET'])
def test_connection():
    try:
        client.admin.command('ping')
        return jsonify({"message": "MongoDB connection successful!"}), 200
    except Exception as e:
        return jsonify({"message": "MongoDB connection failed!", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  
