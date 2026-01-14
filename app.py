from flask import Flask, request, jsonify, send_file
from deep_translator import GoogleTranslator
from flask_cors import CORS
from gtts import gTTS
import pandas as pd
import os
import json
import io

app = Flask(__name__)
CORS(app)

saved_words = []  

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get("text")
    source = data.get("source", "auto") 
    target = data.get("target", "en")    

    try:
        translated = GoogleTranslator(source=source, target=target).translate(text)
        return jsonify({ "meaning": translated })
    except Exception as e:
        return jsonify({ "error": str(e) }), 500


@app.route("/tts", methods=["POST"])
def tts():
    data = request.json
    text = data.get("text")
    lang = data.get("lang", "ur")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        tts = gTTS(text, lang=lang)
        filename = "tts_output.mp3"
        tts.save(filename)
        return send_file(filename, mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/save_note', methods=['POST'])
def save_note():
    data = request.json
    print("SAVE REQUEST RECEIVED:", data)

    word = data.get("word")
    meaning = data.get("meaning")

    if not word or not meaning:
        return jsonify({"error": "Missing word or meaning"}), 400

    new_note = {"word": word, "meaning": meaning}

    try:
        
        if os.path.exists("saved_notes.json"):
            with open("saved_notes.json", "r", encoding="utf-8") as f:
                notes = json.load(f)
        else:
            notes = []

        
        notes.append(new_note)
        with open("saved_notes.json", "w", encoding="utf-8") as f:
            json.dump(notes, f, ensure_ascii=False, indent=2)

        return jsonify({"message": "Saved successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

        return jsonify({"error": str(e)}), 500




@app.route("/download_notes", methods=["GET"])
def download_notes():
    try:
        with open("saved_notes.json", "r", encoding="utf-8") as f:
            notes = json.load(f)
    except FileNotFoundError:
        notes = []

    df = pd.DataFrame(notes)
    output = io.BytesIO()
    df.to_excel(output, index=False, engine='openpyxl')
    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="zuban_sense_notes.xlsx",
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

if __name__ == '__main__':
    app.run(debug=True)
