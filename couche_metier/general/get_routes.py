from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import (
    Personnel, Article, OperationCommerciale,
    Formation, Surveillance,
    EtatPersonnel, ServicePersonnel, TypeOperation,
    EtatEmballage, DetectionForme
)
from sqlalchemy import func, inspect

# Création du Blueprint pour le module Général
general_bp = Blueprint('general', __name__, url_prefix='/general')


# -----------------------------
# Liste des tables de la DB
# -----------------------------
@general_bp.route('/tables', methods=['GET'])
def list_tables():
    """
    Retourne la liste de toutes les tables de la base de données.
    """
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    return jsonify({'tables': tables})


# -----------------------------
# Personnel
# -----------------------------
@general_bp.route('/personnel')
def get_personnel():
    """
    Retourne la liste des personnels avec leur état, service et position.
    """
    personnels = Personnel.query.all()
    return jsonify([{
        'id': p.id,
        'nom_prenom': p.nom_prenom,
        'etat': p.etat.value,
        'service': p.service.value,
        'frequence_cardiaque': p.frequence_cardiaque,
        'position': p.position
    } for p in personnels])


# -----------------------------
# Articles avec le nom du responsable
# -----------------------------
@general_bp.route('/articles')
def get_articles():
    """
    Retourne la liste des articles avec l'état de l'emballage
    et le nom du responsable associé.
    """
    articles = Article.query.all()
    # Construction d'une map id_personnel -> nom
    personnels_map = {p.id: p.nom_prenom for p in Personnel.query.all()}

    return jsonify([{
        'id': a.id,
        'zone': a.zone,
        'etat_emballage': a.etat_emballage.value if a.etat_emballage else None,
        'responsable_id': a.responsable_id,
        'responsable_name': personnels_map.get(a.responsable_id, 'Inconnu'),
        'position': a.position,
        'rotation': a.rotation,
        'collisions': a.collisions
    } for a in articles])


# -----------------------------
# Opérations commerciales avec nom du responsable
# -----------------------------
@general_bp.route('/operations')
def get_operations():
    """
    Retourne toutes les opérations commerciales avec le nom du responsable.
    """
    ops = OperationCommerciale.query.all()
    personnels_map = {p.id: p.nom_prenom for p in Personnel.query.all()}

    return jsonify([{
        'id': o.id,
        'type_op': o.type_op.value,
        'responsable_id': o.responsable_id,
        'responsable_name': personnels_map.get(o.responsable_id, 'Inconnu'),
        'marge': o.marge,
        'km_parcourus': o.km_parcourus,
        'mot_cle_responsable': o.mot_cle_responsable,
        'mot_cle_client': o.mot_cle_client
    } for o in ops])


# -----------------------------
# Formations
# -----------------------------
@general_bp.route('/formations')
def get_formations():
    """
    Retourne toutes les formations avec détails et noms du personnel/formateur.
    """
    formations = Formation.query.all()
    personnels_map = {p.id: p.nom_prenom for p in Personnel.query.all()}

    return jsonify([{
        'id': f.id,
        'nom_formation': f.nom_formation,
        'sujet': f.sujet.value if f.sujet else None,
        'date_formation': f.date_formation.isoformat() if f.date_formation else None,
        'pourcentage_engagement': f.pourcentage_engagement,
        'pourcentage_satisfaction': f.pourcentage_satisfaction,
        'mot_cle_formateur': f.mot_cle_formateur,
        'mot_cle_personnel': f.mot_cle_personnel
    } for f in formations])


# -----------------------------
# Surveillance
# -----------------------------
@general_bp.route('/surveillance')
def get_surveillance():
    """
    Retourne les données de surveillance des zones
    (drones, détection incendie, audit conformité).
    """
    surveils = Surveillance.query.all()
    return jsonify([{
        'zone': s.zone,
        'drones_actifs': s.drones_actifs,
        'drones_panne': s.drones_panne,
        'drones_rechargement': s.drones_rechargement,
        'detection_incendie': s.detection_incendie,
        'detection_forme': s.detection_forme.value if s.detection_forme else None,
        'audit_conformite': s.audit_conformite
    } for s in surveils])


# -----------------------------
# Statistiques
# -----------------------------

# Nombre de personnels
@general_bp.route('/stats/personnel/count')
def personnel_count():
    """
    Retourne le nombre total de personnels.
    """
    count = Personnel.query.count()
    return jsonify({'nb_personnel': count})

# Nombre d'articles déformés
@general_bp.route('/stats/articles/deformes')
def articles_deformes():
    """
    Retourne le nombre d'articles dont l'état d'emballage est déformé.
    """
    count = Article.query.filter(Article.etat_emballage==EtatEmballage.defo).count()
    return jsonify({'nb_articles_deformes': count})

# Total km parcourus dans les opérations
@general_bp.route('/stats/operations/total_km')
def operations_total_km():
    """
    Retourne le total des kilomètres parcourus dans toutes les opérations.
    """
    total_km = db.session.query(func.sum(OperationCommerciale.km_parcourus)).scalar() or 0
    return jsonify({'total_km_parcourus': float(total_km)})

# Distribution des états du personnel
@general_bp.route('/stats/personnel/etat')
def personnel_etat_distribution():
    """
    Retourne la distribution du personnel par état.
    """
    result = db.session.query(Personnel.etat, func.count(Personnel.id))\
        .group_by(Personnel.etat).all()
    return jsonify({etat.value: count for etat, count in result})

# Nombre d'articles par zone
@general_bp.route('/stats/articles/per_zone')
def articles_per_zone():
    """
    Retourne le nombre d'articles par zone.
    """
    result = db.session.query(Article.zone, func.count(Article.id)).group_by(Article.zone).all()
    return jsonify({f'zone_{zone}': count for zone, count in result})
