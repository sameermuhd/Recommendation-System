import subprocess

REQUIRE = False

# List of required modules
required_modules = [
    'flask',
    'flask-cors',
    'pandas'
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
import pandas as pd
import math
from flask_cors import CORS
from ml_model import recommend_similar_products
import os

app = Flask(__name__)
CORS(app)
PORT = 3000

# Read data from CSV once when the server starts
df = pd.read_csv('filtered_articles.csv',  dtype=str)

@app.route('/api/products', methods=['GET'])
def get_products():
    # Get query params for start and end indices
    start = int(request.args.get('start', 0))  # Starting index (inclusive)
    end = int(request.args.get('end', 20))     # Ending index (exclusive)
    filter_value = request.args.get('filter', '')
    filtered_df = df
    if filter_value:
        filtered_df = df[df['index_group_name'] == filter_value]
    paginated_data = filtered_df.iloc[start:end].to_dict(orient='records')
    has_more = len(filtered_df) > end
    return jsonify({
        'products': paginated_data,
        'has_more': has_more
    })

@app.route('/api/filters', methods=['GET'])
def get_filters():
    # Get unique values from the 'index_group_name' column
    filters = df['index_group_name'].dropna().unique().tolist()
    
    # Return the list of filters (e.g., 'Men', 'Women', 'Children')
    return jsonify({'filters': filters})

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
    app.run(port=PORT, debug=False)
