from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import Personnel, OperationCommerciale, Surveillance, TypeOperation
from flask import Blueprint, jsonify

assistance_bp = Blueprint('assistance', __name__, url_prefix='/assistance_commerciale')

# -----------------------------
# A - Zone avec le CO2 le plus faible (calcul déduit)
# -----------------------------
@assistance_bp.route('/zone/co2_min')
def zone_co2_min():
    """
    Retourne la zone avec le niveau de CO2 le plus faible.
    Le niveau de CO2 est déduit à partir des drones actifs, drones en panne,
    drones en rechargement, détection incendie et conformité audit.
    """
    zones = db.session.query(Surveillance).all()
    if not zones:
        return jsonify({'error': 'Aucune zone trouvée'}), 404

    min_zone = None
    min_co2 = None

    for z in zones:
        # Formule de calcul déduit du CO2
        co2_level = 1000
        co2_level -= z.drones_actifs * 80
        co2_level += z.drones_panne * 60
        co2_level += z.drones_rechargement * 30
        co2_level += 100 if z.detection_incendie else 0
        co2_level -= 50 if z.audit_conformite else 0

        if min_co2 is None or co2_level < min_co2:
            min_co2 = co2_level
            min_zone = z

    return jsonify({
        'zone': min_zone.zone,
        'deduced_co2_level': round(min_co2, 2),
        'drones_actifs': min_zone.drones_actifs,
        'drones_panne': min_zone.drones_panne,
        'drones_rechargement': min_zone.drones_rechargement,
        'detection_incendie': min_zone.detection_incendie,
        'audit_conformite': min_zone.audit_conformite
    })


# -----------------------------
# B -  Nombre de responsables en vente
# -----------------------------
@assistance_bp.route('/responsables_vente')
def responsables_vente():
    """
    Retourne le nombre de membres du personnel ayant effectué au moins
    une opération commerciale de type 'vente'.
    """
    count = db.session.query(Personnel)\
        .join(OperationCommerciale)\
        .filter(OperationCommerciale.type_op == TypeOperation.vente)\
        .distinct()\
        .count()
    return jsonify({'nombre_responsables_vente': count})


# -----------------------------
# C - Zone avec le plus de drones disponibles (actifs + rechargement)
# -----------------------------
@assistance_bp.route('/zone/max_drones')
def zone_max_drones():
    """
    Retourne la zone ayant le plus grand nombre de drones disponibles
    (drones actifs + drones en rechargement), utile pour visualisation.
    """
    zones = db.session.query(Surveillance).all()
    if not zones:
        return jsonify({'error': 'Aucune zone trouvée'}), 404

    max_zone = max(zones, key=lambda z: z.drones_actifs + z.drones_rechargement)
    total_drones = max_zone.drones_actifs + max_zone.drones_rechargement

    return jsonify({
        'zone': max_zone.zone,
        'total_operational_drones': total_drones,
        'drones_actifs': max_zone.drones_actifs,
        'drones_rechargement': max_zone.drones_rechargement
    })


# -----------------------------
# D - Zone à risque maximal (métrique personnalisée)
# -----------------------------
@assistance_bp.route('/zone/risk_score')
def zone_risk_score():
    """
    Retourne la zone présentant le risque opérationnel le plus élevé.
    Le score de risque est calculé en fonction des drones en panne,
    de la détection d'incendie et de la non-conformité à l'audit.
    """
    zones = db.session.query(Surveillance).all()
    if not zones:
        return jsonify({'error': 'Aucune zone trouvée'}), 404

    def compute_risk(z):
        score = 0
        score += z.drones_panne * 2
        score += 50 if z.detection_incendie else 0
        score += 20 if not z.audit_conformite else 0
        return score

    high_risk_zone = max(zones, key=compute_risk)
    risk_score = compute_risk(high_risk_zone)

    return jsonify({
        'zone': high_risk_zone.zone,
        'risk_score': risk_score,
        'drones_panne': high_risk_zone.drones_panne,
        'detection_incendie': high_risk_zone.detection_incendie,
        'audit_conformite': high_risk_zone.audit_conformite
    })


# -----------------------------
# E- CO2 déduit pour toutes les zones (pour graphique)
# -----------------------------
@assistance_bp.route('/zones/co2_all')
def zones_co2_all():
    """
    Retourne toutes les zones avec leur niveau de CO2 déduit.
    Format idéal pour créer un graphique comparatif.
    """
    zones = db.session.query(Surveillance).all()
    if not zones:
        return jsonify({'error': 'Aucune zone trouvée'}), 404

    result = []
    for z in zones:
        co2_level = 1000
        co2_level -= z.drones_actifs * 80
        co2_level += z.drones_panne * 60
        co2_level += z.drones_rechargement * 30
        co2_level += 100 if z.detection_incendie else 0
        co2_level -= 50 if z.audit_conformite else 0

        result.append({
            'zone': z.zone,
            'deduced_co2_level': round(co2_level, 2)
        })

    return jsonify(result)


# -----------------------------
# F - Distribution des drones par zone (pour graphique)
# -----------------------------
@assistance_bp.route('/zones/drones_distribution')
def drones_distribution():
    """
    Retourne la distribution des drones par zone.
    Utile pour visualisation (barres, secteurs, etc.).
    """
    zones = db.session.query(Surveillance).all()
    if not zones:
        return jsonify({'error': 'Aucune zone trouvée'}), 404

    result = []
    for z in zones:
        total_drones = z.drones_actifs + z.drones_rechargement
        result.append({
            'zone': z.zone,
            'total_drones': total_drones,
            'drones_actifs': z.drones_actifs,
            'drones_rechargement': z.drones_rechargement
        })

    return jsonify(result)
