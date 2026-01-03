# routes/general/post_routes.py

import os
from functools import wraps
from flask import Blueprint, request, jsonify, abort
from dotenv import load_dotenv
from couche_data.db_connect import db
from couche_data.db_tables import (
    Personnel, Article, OperationCommerciale,
    Formation, Surveillance,
    EtatPersonnel, ServicePersonnel, TypeOperation,
    EtatEmballage, DetectionForme
)

load_dotenv()  # load .env variables
API_KEY = os.getenv("API_KEY")  

write_bp = Blueprint("write_bp", __name__, url_prefix="/write")

# -----------------------------
# API key protection
# -----------------------------
def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        key = request.headers.get("x-api-key")
        if key != API_KEY:
            abort(401, "Unauthorized: invalid API key")
        return f(*args, **kwargs)
    return decorated

# -----------------------------
#  Personnel
# -----------------------------
@write_bp.route("/personnel", methods=["POST"])
@require_api_key
def add_personnel():
    data = request.json
    try:
        new_personnel = Personnel(
            id=data["id"],  # must be provided
            nom_prenom=data["nom_prenom"],
            etat=EtatPersonnel(data["etat"]),
            service=ServicePersonnel(data["service"]),
            frequence_cardiaque=data.get("frequence_cardiaque"),
            position=data.get("position")
        )
        db.session.add(new_personnel)
        db.session.commit()
    except KeyError as e:
        db.session.rollback()
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid enum value: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    return jsonify({"status": "success", "id": new_personnel.id}), 201


@write_bp.route("/personnel/<string:id>", methods=["PUT"])
@require_api_key
def edit_personnel(id):
    p = Personnel.query.get_or_404(id)
    data = request.json
    if "nom_prenom" in data:
        p.nom_prenom = data["nom_prenom"]
    if "etat" in data:
        try: p.etat = EtatPersonnel(data["etat"])
        except ValueError: return jsonify({"error": "Invalid etat"}), 400
    if "service" in data:
        try: p.service = ServicePersonnel(data["service"])
        except ValueError: return jsonify({"error": "Invalid service"}), 400
    if "frequence_cardiaque" in data:
        p.frequence_cardiaque = data["frequence_cardiaque"]
    if "position" in data:
        p.position = data["position"]
    db.session.commit()
    return jsonify({"status": "updated"})

@write_bp.route("/personnel/<string:id>", methods=["DELETE"])
@require_api_key
def delete_personnel(id):
    p = Personnel.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
#  Articles
# -----------------------------
@write_bp.route("/article", methods=["POST"])
@require_api_key
def add_article():
    data = request.json
    try:
        a = Article(
            zone=data["zone"],  # can be provided or auto-assigned if db autoincrement
            etat_emballage=EtatEmballage(data["etat_emballage"]) if data.get("etat_emballage") else None,
            responsable_id=data.get("responsable_id"),
            position=data.get("position"),
            rotation=data.get("rotation"),
            collisions=data.get("collisions", 0)
        )
        db.session.add(a)
        db.session.commit()
    except KeyError as e:
        db.session.rollback()
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid enum value: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    return jsonify({"status": "success", "id": a.id})



@write_bp.route("/article/<int:id>", methods=["PUT"])
@require_api_key
def edit_article(id):
    a = Article.query.get_or_404(id)
    data = request.json
    if "zone" in data:
        a.zone = data["zone"]
    if "etat_emballage" in data:
        try: a.etat_emballage = EtatEmballage(data["etat_emballage"])
        except ValueError: return jsonify({"error": "Invalid etat_emballage"}), 400
    if "responsable_id" in data:
        a.responsable_id = data["responsable_id"]
    if "position" in data:
        a.position = data["position"]
    if "rotation" in data:
        a.rotation = data["rotation"]
    if "collisions" in data:
        a.collisions = data["collisions"]
    db.session.commit()
    return jsonify({"status": "updated"})

@write_bp.route("/article/<int:id>", methods=["DELETE"])
@require_api_key
def delete_article(id):
    a = Article.query.get_or_404(id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
#  OperationCommerciale
# -----------------------------
@write_bp.route("/operation", methods=["POST"])
@require_api_key
def add_operation():
    data = request.json
    try:
        op = OperationCommerciale(
            type_op=TypeOperation(data["type_op"]),
            responsable_id=data.get("responsable_id"),
            marge=data.get("marge"),
            km_parcourus=data.get("km_parcourus"),
            mot_cle_responsable=data.get("mot_cle_responsable"),
            mot_cle_client=data.get("mot_cle_client")
        )
        db.session.add(op)
        db.session.commit()
    except KeyError as e:
        db.session.rollback()
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid enum value: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    return jsonify({"status": "success", "id": op.id})



@write_bp.route("/operation/<int:id>", methods=["PUT"])
@require_api_key
def edit_operation(id):
    op = OperationCommerciale.query.get_or_404(id)
    data = request.json
    if "type_op" in data:
        try: op.type_op = TypeOperation(data["type_op"])
        except ValueError: return jsonify({"error": "Invalid type_op"}), 400
    for field in ["responsable_id", "marge", "km_parcourus", "mot_cle_responsable", "mot_cle_client"]:
        if field in data:
            setattr(op, field, data[field])
    db.session.commit()
    return jsonify({"status": "updated"})

@write_bp.route("/operation/<int:id>", methods=["DELETE"])
@require_api_key
def delete_operation(id):
    op = OperationCommerciale.query.get_or_404(id)
    db.session.delete(op)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
#  Formation
# -----------------------------
@write_bp.route("/formation", methods=["POST"])
@require_api_key
def add_formation():
    data = request.json
    try:
        f = Formation(
            nom_formation=data["nom_formation"],
            sujet=ServicePersonnel(data["sujet"]) if data.get("sujet") else None,
            date_formation=data.get("date_formation"),
            pourcentage_engagement=data.get("pourcentage_engagement"),
            pourcentage_satisfaction=data.get("pourcentage_satisfaction"),
            mot_cle_formateur=data.get("mot_cle_formateur"),
            mot_cle_personnel=data.get("mot_cle_personnel")
        )
        db.session.add(f)
        db.session.commit()
    except KeyError as e:
        db.session.rollback()
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid enum value: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    return jsonify({"status": "success", "id": f.id})



@write_bp.route("/formation/<int:id>", methods=["PUT"])
@require_api_key
def edit_formation(id):
    f = Formation.query.get_or_404(id)
    data = request.json
    if "nom_formation" in data:
        f.nom_formation = data["nom_formation"]
    if "sujet" in data:
        try: f.sujet = ServicePersonnel(data["sujet"])
        except ValueError: return jsonify({"error": "Invalid sujet"}), 400
    for field in ["date_formation", "pourcentage_engagement", "pourcentage_satisfaction", "mot_cle_formateur", "mot_cle_personnel"]:
        if field in data:
            setattr(f, field, data[field])
    db.session.commit()
    return jsonify({"status": "updated"})

@write_bp.route("/formation/<int:id>", methods=["DELETE"])
@require_api_key
def delete_formation(id):
    f = Formation.query.get_or_404(id)
    db.session.delete(f)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
# Surveillance
# -----------------------------
@write_bp.route("/surveillance", methods=["POST"])
@require_api_key
def add_surveillance():
    data = request.json
    try:
        s = Surveillance(
            drones_actifs=data.get("drones_actifs"),
            drones_panne=data.get("drones_panne"),
            drones_rechargement=data.get("drones_rechargement"),
            detection_incendie=data.get("detection_incendie"),
            detection_forme=DetectionForme(data["detection_forme"]) if data.get("detection_forme") else None,
            audit_conformite=data.get("audit_conformite")
        )
        db.session.add(s)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    return jsonify({"status": "success", "zone": s.zone})



@write_bp.route("/surveillance/<int:zone>", methods=["PUT"])
@require_api_key
def edit_surveillance(zone):
    s = Surveillance.query.get_or_404(zone)
    data = request.json
    for field in ["drones_actifs", "drones_panne", "drones_rechargement", "detection_incendie", "audit_conformite"]:
        if field in data:
            setattr(s, field, data[field])
    if "detection_forme" in data:
        try: s.detection_forme = DetectionForme(data["detection_forme"])
        except ValueError: return jsonify({"error": "Invalid detection_forme"}), 400
    db.session.commit()
    return jsonify({"status": "updated"})

@write_bp.route("/surveillance/<int:zone>", methods=["DELETE"])
@require_api_key
def delete_surveillance(zone):
    s = Surveillance.query.get_or_404(zone)
    db.session.delete(s)
    db.session.commit()
    return jsonify({"status": "deleted"})
