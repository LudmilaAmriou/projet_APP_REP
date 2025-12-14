from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import Personnel, OperationCommerciale, Surveillance, TypeOperation

finance_bp = Blueprint('finance', __name__, url_prefix='/finance_gestion')

# -----------------------------
# A -  Responsable ayant parcouru le plus de kilomètres
# -----------------------------
@finance_bp.route('/responsable/max_km')
def responsable_max_km():
    """
    Retourne le membre du personnel ayant parcouru le plus de kilomètres
    sur ses opérations commerciales.
    """
    result = db.session.query(Personnel, db.func.sum(OperationCommerciale.km_parcourus).label('total_km'))\
        .join(OperationCommerciale)\
        .group_by(Personnel.id)\
        .order_by(db.desc('total_km'))\
        .first()

    if not result:
        return jsonify({'error': 'Aucun responsable trouvé'}), 404

    personnel, total_km = result
    return jsonify({
        'responsable': personnel.nom_prenom,
        'identifiant': personnel.id,
        'total_km_parcourus': float(total_km)
    })


# -----------------------------
# B - Drone le plus ancien (simulé)
# -----------------------------
@finance_bp.route('/drone/plus_ancien')
def drone_plus_ancien():
    """
    Retourne la zone avec le drone le plus ancien.
    Pour le TP, on déduit un âge fictif à partir du nombre de drones actifs + panne.
    Plus il y a de drones en panne, plus le drone est 'ancien'.
    """
    zones = db.session.query(Surveillance).all()
    if not zones:
        return jsonify({'error': 'Aucune zone trouvée'}), 404

    # Déduction de l'ancienneté
    oldest_zone = max(zones, key=lambda z: z.drones_panne)
    drone_age = oldest_zone.drones_panne * 2 + oldest_zone.drones_rechargement  # métrique fictive

    return jsonify({
        'zone': oldest_zone.zone,
        'drone_age': drone_age,
        'drones_panne': oldest_zone.drones_panne,
        'drones_rechargement': oldest_zone.drones_rechargement
    })


# -----------------------------
# C - Total des marges par responsable (pour graphique)
# -----------------------------
@finance_bp.route('/marges_par_responsable')
def marges_par_responsable():
    """
    Retourne la marge totale par responsable.
    Utile pour visualisation des performances financières.
    """
    results = db.session.query(Personnel.nom_prenom, db.func.sum(OperationCommerciale.marge).label('total_marge'))\
        .join(OperationCommerciale)\
        .group_by(Personnel.id)\
        .all()

    data = [{'responsable': r[0], 'total_marge': float(r[1])} for r in results]
    return jsonify(data)


# -----------------------------
# D - Nombre d’opérations par type (Achat/Vente) pour graphique
# -----------------------------
@finance_bp.route('/operations_par_type')
def operations_par_type():
    """
    Retourne le nombre d'opérations par type (Achat ou Vente)
    pour toutes les zones/responsables.
    """
    results = db.session.query(OperationCommerciale.type_op, db.func.count(OperationCommerciale.id))\
        .group_by(OperationCommerciale.type_op)\
        .all()

    data = [{'type_op': r[0].value, 'count': r[1]} for r in results]
    return jsonify(data)
