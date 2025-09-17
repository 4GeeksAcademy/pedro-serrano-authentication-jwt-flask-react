"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

# JWT
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# SIGNUP -------------------------------------------------------------------
@api.route('/signup', methods=['POST'])
def signup():
    
    # Registro de usuario + emisión de token JWT para acceder de inmediato a /private
    # - Uso bcrypt (instanciado en app.py con Bcrypt(app)) para hashear la contraseña, tal como me enseñó el mentor Dyloc
    
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    #  Si no se envían email o password, devuelve error 400 e informa al usuario
    if not email or not password:
        return jsonify({"msg": "Email and password are required."}), 400

    # Si el email ya está registrado, devuelve error 409 (conflict) e informa al usuario
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered."}), 409

    # Obtener la instancia de bcrypt creada en app.py
    # (Flask-Bcrypt registra la extensión en current_app.extensions['bcrypt'])
    bcrypt = current_app.extensions.get("bcrypt")
    if bcrypt is None:
        # Fallback seguro: inicializa con la app actual si por orden de carga aún no está registrado
        bcrypt = Bcrypt(current_app)

    # Hashear la contraseña con bcrypt y guardar el usuario
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(email=email, password=password_hash, is_active=True)
    db.session.add(user)
    db.session.commit()

    # Emitir token (duración 10 minutos)
    expires = datetime.timedelta(minutes=10)
    access_token = create_access_token(identity=user.id, expires_delta=expires)

    return jsonify({
        "msg": "User created successfully.",
        "access_token": access_token,
        "user": user.serialize()
    }), 201


# LOGIN -------------------------------------------------------------------
@api.route('/login', methods=['POST'])
def login():
    
    # Login de usuario.
    # - Verifico credenciales usando bcrypt.check_password_hash
    # - Devuelvo un JWT para acceder a private
    
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        return jsonify({"msg": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Invalid credentials."}), 401

    # Obtener instancia de bcrypt desde la app ya inicializada
    bcrypt = current_app.extensions.get("bcrypt")
    if bcrypt is None:
        # Fallback seguro en caso de que no esté registrado aún
        bcrypt = Bcrypt(current_app)

    # Verificar la contraseña usando bcrypt:
    # - primer parámetro: contraseña hasheada almacenada en la BD
    # - segundo parámetro: contraseña en texto plano recibida en el login
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid credentials."}), 401

    # Emitir token (duración 10 minutos)
    expires = datetime.timedelta(minutes=10)
    access_token = create_access_token(identity=user.id, expires_delta=expires)

    return jsonify({
        "msg": "Login successful.",
        "access_token": access_token,
        "user": user.serialize()
    }), 200


# PRIVATE -------------------------------------------------------------------
@api.route('/private', methods=['GET'])
@jwt_required()
def private():

    # Ruta protegida con JWT:
    # - Requiere header Authorization: Bearer <token>
    # - Si el token es válido, devolvemos un mensaje y datos públicos del usuario.

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found."}), 404

    return jsonify({
        "msg": f"You are authenticated as {user.email}.",
        "user": user.serialize()
    }), 200
