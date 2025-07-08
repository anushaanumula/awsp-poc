from flask import Flask, jsonify, request
from flask_cors import CORS

from intent_parser import extract_intent
from kpi_engine import get_kpi_data

app = Flask(__name__)
CORS(app)


@app.route('/assistant/prompt-query', methods=['POST'])
def prompt_query():
    data = request.get_json(force=True)
    prompt = data.get('prompt', '')
    intent = extract_intent(prompt)
    result = get_kpi_data(intent)
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
