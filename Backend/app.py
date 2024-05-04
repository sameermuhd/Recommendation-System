import subprocess

REQUIRE = False

# List of required modules
required_modules = [
    'flask',
    'flask-cors'
]

# Install missing modules
if REQUIRE:
  for module in required_modules:
      try:
          __import__(module)
      except ImportError:
          print(f"Installing {module}...")
          subprocess.check_call(["pip", "install", module])

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ml_model import recommend_similar_products
import os

app = Flask(__name__)
CORS(app)
PORT = 3000

# Serve images based on ID
@app.route('/images/<id>', methods=['GET'])
def get_image(id):
    image_path = os.path.join(os.path.dirname(__file__), 'product-images', f'{id}.jpg')

    # Check if the image file exists
    if os.path.exists(image_path):
        return send_file(image_path, mimetype='image/jpeg')
    else:
        # If the file doesn't exist or there's an error, send a 404 response
        return 'Image not found', 404

@app.route('/api/similar-products/<productId>', methods=['GET'])
def similar_products(productId):
    try:
        similar_products = recommend_similar_products(int(productId))
        return similar_products
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=PORT, debug=True)
