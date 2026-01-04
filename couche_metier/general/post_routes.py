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

# -----------------------------
# Chargement des variables d'environnement
# -----------------------------
load_dotenv()
API_KEY = os.getenv("API_KEY")  # Clé API pour sécuriser les routes POST/PUT/DELETE

# -----------------------------
# Création du Blueprint pour les routes d'écriture
# -----------------------------
write_bp = Blueprint("write_bp", __name__, url_prefix="/write")


# -----------------------------
# Protection par clé API
# -----------------------------
def require_api_key(f):
    """
    Décorateur pour protéger les routes sensibles avec une clé API.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        key = request.headers.get("x-api-key")
        if key != API_KEY:
            abort(401, "Non autorisé : clé API invalide")
        return f(*args, **kwargs)
    return decorated


# -----------------------------
# Routes Personnel
# -----------------------------
@write_bp.route("/personnel", methods=["POST"])
@require_api_key
def add_personnel():
    """
    Ajoute un nouveau personnel.
    Exige : id, nom_prenom, etat, service
    Optionnel : frequence_cardiaque, position
    """
    data = request.json
    try:
        new_personnel = Personnel(
            id=data["id"],
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
        return jsonify({"error": f"Champ manquant : {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Valeur invalide : {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500

    return jsonify({"status": "success", "id": new_personnel.id}), 201


@write_bp.route("/personnel/<string:id>", methods=["PUT"])
@require_api_key
def edit_personnel(id):
    """
    Modifie un personnel existant.
    Accepte les champs : nom_prenom, etat, service, frequence_cardiaque, position
    """
    p = Personnel.query.get_or_404(id)
    data = request.json
    if "nom_prenom" in data:
        p.nom_prenom = data["nom_prenom"]
    if "etat" in data:
        try: p.etat = EtatPersonnel(data["etat"])
        except ValueError: return jsonify({"error": "Etat invalide"}), 400
    if "service" in data:
        try: p.service = ServicePersonnel(data["service"])
        except ValueError: return jsonify({"error": "Service invalide"}), 400
    if "frequence_cardiaque" in data:
        p.frequence_cardiaque = data["frequence_cardiaque"]
    if "position" in data:
        p.position = data["position"]
    db.session.commit()
    return jsonify({"status": "updated"})


@write_bp.route("/personnel/<string:id>", methods=["DELETE"])
@require_api_key
def delete_personnel(id):
    """
    Supprime un personnel par son ID.
    """
    p = Personnel.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
# Routes Articles
# -----------------------------
@write_bp.route("/article", methods=["POST"])
@require_api_key
def add_article():
    """
    Ajoute un nouvel article.
    Champs : zone, etat_emballage (optionnel), responsable_id, position, rotation, collisions (défaut 0)
    """
    data = request.json
    try:
        a = Article(
            zone=data["zone"],
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
        return jsonify({"error": f"Champ manquant : {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Valeur enum invalide : {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500

    return jsonify({"status": "success", "id": a.id})



@write_bp.route("/article/<int:id>", methods=["PUT"])
@require_api_key
def edit_article(id):
    """
    Modifie un article existant.
    Champs modifiables : zone, etat_emballage, responsable_id, position, rotation, collisions
    """
    a = Article.query.get_or_404(id)
    data = request.json
    if "zone" in data:
        a.zone = data["zone"]
    if "etat_emballage" in data:
        try: a.etat_emballage = EtatEmballage(data["etat_emballage"])
        except ValueError: return jsonify({"error": "Etat emballage invalide"}), 400
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
    """
    Supprime un article par son ID.
    """
    a = Article.query.get_or_404(id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
# Routes OperationCommerciale
# -----------------------------
@write_bp.route("/operation", methods=["POST"])
@require_api_key
def add_operation():
    """
    Ajoute une opération commerciale.
    Champs : type_op, responsable_id, marge, km_parcourus, mot_cle_responsable, mot_cle_client
    """
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
        return jsonify({"error": f"Champ manquant : {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Valeur enum invalide : {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500

    return jsonify({"status": "success", "id": op.id})



@write_bp.route("/operation/<int:id>", methods=["PUT"])
@require_api_key
def edit_operation(id):
    """
    Modifie une opération commerciale existante.
    Champs modifiables : type_op, responsable_id, marge, km_parcourus, mot_cle_responsable, mot_cle_client
    """
    op = OperationCommerciale.query.get_or_404(id)
    data = request.json
    if "type_op" in data:
        try: op.type_op = TypeOperation(data["type_op"])
        except ValueError: return jsonify({"error": "type_op invalide"}), 400
    for field in ["responsable_id", "marge", "km_parcourus", "mot_cle_responsable", "mot_cle_client"]:
        if field in data:
            setattr(op, field, data[field])
    db.session.commit()
    return jsonify({"status": "updated"})


@write_bp.route("/operation/<int:id>", methods=["DELETE"])
@require_api_key
def delete_operation(id):
    """
    Supprime une opération commerciale par son ID.
    """
    op = OperationCommerciale.query.get_or_404(id)
    db.session.delete(op)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
# Routes Formation
# -----------------------------
@write_bp.route("/formation", methods=["POST"])
@require_api_key
def add_formation():
    """
    Ajoute une formation.
    Champs : nom_formation, sujet (optionnel), date_formation, pourcentage_engagement, pourcentage_satisfaction, mot_cle_formateur, mot_cle_personnel
    """
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
        return jsonify({"error": f"Champ manquant : {str(e)}"}), 400
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Valeur enum invalide : {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500

    return jsonify({"status": "success", "id": f.id})



@write_bp.route("/formation/<int:id>", methods=["PUT"])
@require_api_key
def edit_formation(id):
    """
    Modifie une formation existante.
    Champs modifiables : nom_formation, sujet, date_formation, pourcentage_engagement, pourcentage_satisfaction, mot_cle_formateur, mot_cle_personnel
    """
    f = Formation.query.get_or_404(id)
    data = request.json
    if "nom_formation" in data:
        f.nom_formation = data["nom_formation"]
    if "sujet" in data:
        try: f.sujet = ServicePersonnel(data["sujet"])
        except ValueError: return jsonify({"error": "Sujet invalide"}), 400
    for field in ["date_formation", "pourcentage_engagement", "pourcentage_satisfaction", "mot_cle_formateur", "mot_cle_personnel"]:
        if field in data:
            setattr(f, field, data[field])
    db.session.commit()
    return jsonify({"status": "updated"})


@write_bp.route("/formation/<int:id>", methods=["DELETE"])
@require_api_key
def delete_formation(id):
    """
    Supprime une formation par son ID.
    """
    f = Formation.query.get_or_404(id)
    db.session.delete(f)
    db.session.commit()
    return jsonify({"status": "deleted"})


# -----------------------------
# Routes Surveillance
# -----------------------------
@write_bp.route("/surveillance", methods=["POST"])
@require_api_key
def add_surveillance():
    """
    Ajoute une entrée de surveillance.
    Champs : drones_actifs, drones_panne, drones_rechargement, detection_incendie, detection_forme, audit_conformite
    """
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
        return jsonify({"error": f"Valeur invalide : {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Erreur serveur : {str(e)}"}), 500

    return jsonify({"status": "success", "zone": s.zone})


@write_bp.route("/surveillance/<int:zone>", methods=["PUT"])
@require_api_key
def edit_surveillance(zone):
    """
    Modifie une entrée de surveillance existante.
    Champs modifiables : drones_actifs, drones_panne, drones_rechargement, detection_incendie, detection_forme, audit_conformite
    """
    s = Surveillance.query.get_or_404(zone)
    data = request.json
    for field in ["drones_actifs", "drones_panne", "drones_rechargement", "detection_incendie", "audit_conformite"]:
        if field in data:
            setattr(s, field, data[field])
    if "detection_forme" in data:
        try: s.detection_forme = DetectionForme(data["detection_forme"])
        except ValueError: return jsonify({"error": "Detection_forme invalide"}), 400
    db.session.commit()
    return jsonify({"status": "updated"})


@write_bp.route("/surveillance/<int:zone>", methods=["DELETE"])
@require_api_key
def delete_surveillance(zone):
    """
    Supprime une entrée de surveillance par zone.
    """
    s = Surveillance.query.get_or_404(zone)
    db.session.delete(s)
    db.session.commit()
    return jsonify({"status": "deleted"})
