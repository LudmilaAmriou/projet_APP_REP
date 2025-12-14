from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import Article ,EtatEmballage

rd_bp = Blueprint('rd', __name__, url_prefix='/recherche_developpement')

# -----------------------------
# A -  Articles déformés sans collision
# -----------------------------
@rd_bp.route('/articles/deformes_sans_collision')
def articles_deformes_sans_collision():
    """
    Retourne le nombre d'articles dont l'emballage est déformé
    mais n'a subi aucune collision.
    """
    count = db.session.query(Article)\
        .filter(Article.etat_emballage == EtatEmballage.defo)\
        .filter(Article.collisions == 0)\
        .count()

    return jsonify({'articles_deformes_sans_collision': count})


# -----------------------------
# B  - Machine avec la plus faible cadence (simulée)
# -----------------------------
@rd_bp.route('/machine/faible_cadence')
def machine_faible_cadence():
    """
    Retourne la 'machine' (zone) avec la plus faible cadence.
    Pour le TP, on déduit la cadence comme : 10 - collisions (plus il y a de collisions, plus la cadence est faible).
    """
    articles = db.session.query(Article).all()
    if not articles:
        return jsonify({'error': 'Aucun article trouvé'}), 404

    # Calcul simple de cadence pour chaque zone
    zone_cadence = {}
    for a in articles:
        zone_cadence[a.zone] = zone_cadence.get(a.zone, 10) - a.collisions

    # Zone avec la cadence minimale
    min_zone = min(zone_cadence, key=zone_cadence.get)
    min_cadence = zone_cadence[min_zone]

    return jsonify({
        'zone_machine': min_zone,
        'cadence': min_cadence
    })


# -----------------------------
# C -  Répartition des articles par état d'emballage (graph)
# -----------------------------
@rd_bp.route('/articles/repartition_emballage')
def repartition_emballage():
    """
    Retourne la répartition des articles par état d'emballage.
    Utile pour visualisation (bar chart / pie chart).
    """
    results = db.session.query(Article.etat_emballage, db.func.count(Article.id))\
        .group_by(Article.etat_emballage)\
        .all()

    data = [{'etat_emballage': r[0].value if r[0] else 'Inconnu', 'count': r[1]} for r in results]
    return jsonify(data)


# -----------------------------
# D - Collisions par zone (graph)
# -----------------------------
@rd_bp.route('/articles/collisions_par_zone')
def collisions_par_zone():
    """
    Retourne le nombre total de collisions par zone.
    Utile pour visualisation de la sécurité/logistique.
    """
    results = db.session.query(Article.zone, db.func.sum(Article.collisions))\
        .group_by(Article.zone)\
        .all()

    data = [{'zone': r[0], 'collisions_totales': int(r[1])} for r in results]
    return jsonify(data)
