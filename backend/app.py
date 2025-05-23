from flask import Flask, request, jsonify
from flask_cors import CORS
from generate import generate_love_image

app = Flask(__name__)
CORS(app)  # ✅ 启用跨域支持

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    text = data.get('text', '')
    path = generate_love_image(text)
    return jsonify(success=True, path=path)

if __name__ == '__main__':
    app.run(port=5000)

