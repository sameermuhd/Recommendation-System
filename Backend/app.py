import subprocess

REQUIRE = False

# List of required modules
required_modules = [
    'flask',
    'flask-cors',
    'pandas',
    'flask-mysql',
    'flask-bcrypt',
    'flask-wtf',
    'python-dotenv',
    'flask-migrate',
    'flask_mysqldb'
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
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL
import re
import pandas as pd
import math
from flask_cors import CORS
from ml_model import recommend_similar_products
import os

app = Flask(__name__)
CORS(app)
PORT = 3000
bcrypt = Bcrypt(app)

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root' 
app.config['MYSQL_PASSWORD'] = '' 
app.config['MYSQL_DB'] = 'login_db'

mysql = MySQL(app)

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

@app.route('/login', methods=['POST'])
def login():
    # Get user input
    login_input = request.json.get('login_input')  # Email or phone number
    password = request.json.get('password')

    if not login_input or not password:
        return jsonify({'error': 'Both login_input and password are required'}), 400

    # Check if the input is an email or phone number
    if re.match(r"^[^@]+@[^@]+\.[^@]+$", login_input):  # Email validation
        query = "SELECT * FROM users WHERE email = %s"
    else:  # Assume phone number
        query = "SELECT * FROM users WHERE phone_number = %s"

    # Execute query
    cursor = mysql.connection.cursor()
    cursor.execute(query, (login_input,))
    user = cursor.fetchone()

    if user:
        # Check password hash
        user_id, first_name, last_name, email, phone_number, hashed_password, birthday, gender, address, _ = user
        if bcrypt.check_password_hash(hashed_password, password):
            # Successful login, return user data (you can add JWT token here if needed)
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user_id,
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'phone_number': phone_number,
                    'birthday': birthday,
                    'gender': gender,
                    'address': address
                }
            }), 200
        else:
            return jsonify({'error': 'Incorrect password'}), 401
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/register', methods=['POST'])
def register():
    # Get user input
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    email = request.json.get('email')
    phone_number = request.json.get('phone_number')
    password = request.json.get('password')
    birthday = request.json.get('birthday')
    gender = request.json.get('gender')
    address = request.json.get('address')

    if not (email or phone_number):
        return jsonify({'error': 'Either email or phone number must be provided'}), 400

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Query to insert into the users table
    query = "INSERT INTO users (first_name, last_name, email, phone_number, password, birthday, gender, address) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    cursor = mysql.connection.cursor()

    try:
        cursor.execute(query, (first_name, last_name, email, phone_number, hashed_password, birthday, gender, address))
        mysql.connection.commit()

        # Respond with success message
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'phone_number': phone_number,
                'birthday': birthday,
                'gender': gender,
                'address': address
            }
        }), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500  # Return any error that occurs during registration

# API to fetch user data by ID
@app.route('/user/getInfo/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        cursor = mysql.connection.cursor()
        query = "SELECT * FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        if user:
            user_data = {
                "id": user[0],
                "first_name": user[1],
                "last_name": user[2],
                "email": user[3],
                "phone_number": user[4],
                "birthday": user[6],
                "gender": user[7],
                "address": user[8],
            }
            return jsonify({"success": True, "user": user_data}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to delete user account
@app.route('/user/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        cursor = mysql.connection.cursor()
        query = "DELETE FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        mysql.connection.commit()

        if cursor.rowcount > 0:
            return jsonify({"success": True, "message": "User account deleted successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    
# API to modify user's data
@app.route('/user/edit/<int:user_id>', methods=['PUT'])
def modify_user(user_id):
    try:
        data = request.json

        # Dynamically build the update query based on provided fields
        updates = []
        values = []
        allowed_fields = ["first_name", "last_name", "email", "phone_number", "birthday", "gender", "address", "password"]

        for field in allowed_fields:
            if field in data:
                updates.append(f"{field} = %s")
                if field == "password":
                    hashed_password = bcrypt.generate_password_hash(data[field]).decode('utf-8')
                    values.append(hashed_password)
                else:
                    values.append(data[field])

        if not updates:
            return jsonify({"error": "No valid fields provided to update"}), 400

        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        values.append(user_id)

        cursor = mysql.connection.cursor()
        cursor.execute(query, tuple(values))
        mysql.connection.commit()

        if cursor.rowcount > 0:
            return jsonify({"success": True, "message": "User data updated successfully"}), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(port=PORT, debug=False)
