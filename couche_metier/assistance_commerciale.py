from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import OperationCommerciale
from couche_metier.utils.data_agregation import aggregate_data_multi

# Création du Blueprint pour le module Assistance Commerciale
assistance_bp = Blueprint('assistance', __name__, url_prefix='/assistance_commerciale')


# -----------------------------
# A - Zone avec le CO2 le plus faible
# -----------------------------
@assistance_bp.route('/zone/co2_min')
def zone_co2_min():
    """
    Retourne la zone avec le niveau de CO2 le plus faible
    à partir des données des APIs externes 'releves'.
    """
    # --- Agrégation uniquement des données externes ---
    df_all, sources_responded = aggregate_data_multi(
        external_key="releves",
        id_col="zone",
        value_cols=["co2"],
        local_source=None  # pas de DB locale
    )

    if df_all.empty:
        return jsonify({"error": "Pas de données relevés disponibles"}), 404

    # --- Sélection de la zone avec CO2 minimal ---
    min_row = df_all.loc[df_all["co2"].idxmin()]

    return jsonify({
        "zone": min_row["zone"],
        "co2_level": round(min_row["co2"], 2),
        "source": min_row["source"],
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })


# -----------------------------
# B - Nombre de responsables en vente
# -----------------------------
@assistance_bp.route('/responsables_vente')
def responsables_vente():
    """
    Retourne le nombre de responsables ayant effectué au moins
    une opération de type 'vente', en agrégeant DB locale + APIs externes.
    """
    # --- Agrégation locale + externe pour opérations 'vente' ---
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(
            OperationCommerciale.responsable_id,
            OperationCommerciale.id,
            OperationCommerciale.type_op
        ).filter(OperationCommerciale.type_op == 'vente'),
        external_key="operations",
        id_col="responsable_id",
        value_cols=["id", "type_op"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"nombre_responsables_vente": 0, "sources_responded": [], "num_sources_responded": 0})

    # --- Comptage distinct des responsables ---
    df_all = df_all[df_all["type_op"].str.lower() != "achat"]
    distinct_count = df_all["responsable_id"].nunique()

    return jsonify({
        "nombre_responsables_vente": int(distinct_count),
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })


# -----------------------------
# C - Zone avec le CO2 minimal par source
# -----------------------------
@assistance_bp.route('/zone/co2_min_per_source')
def zone_co2_min_per_source():
    """
    Retourne la zone avec le niveau de CO2 le plus faible
    pour chaque source externe.
    """
    df_all, sources_responded = aggregate_data_multi(
        external_key="releves",
        id_col="zone",
        value_cols=["co2"],
        local_source=None  # pas de DB locale
    )

    if df_all.empty:
        return jsonify({"error": "Pas de données relevés disponibles"}), 404

    # --- Minimum CO2 par source ---
    result_list = []
    for source, df_source in df_all.groupby("source"):
        min_row = df_source.loc[df_source["co2"].idxmin()]
        result_list.append({
            "source": source,
            "zone": min_row["zone"],
            "co2_level": round(min_row["co2"], 2)
        })

    return jsonify(result_list)


# -----------------------------
# D - Nombre de responsables en vente par source
# -----------------------------
@assistance_bp.route('/responsables_vente_per_source')
def responsables_vente_per_source():
    """
    Retourne le nombre de responsables ayant effectué
    au moins une vente, regroupé par source.
    """
    df_all, _ = aggregate_data_multi(
        local_query=db.session.query(
            OperationCommerciale.responsable_id,
            OperationCommerciale.id,
            OperationCommerciale.type_op
        ).filter(OperationCommerciale.type_op == 'vente'),
        external_key="operations",
        id_col="responsable_id",
        value_cols=["id", "type_op"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify([])

    df_all = df_all[df_all["type_op"].str.lower() != "achat"]

    # --- Comptage distinct par source ---
    result_list = []
    for source, df_source in df_all.groupby("source"):
        distinct_count = df_source["responsable_id"].nunique()
        result_list.append({
            "source": source,
            "nombre_responsables_vente": int(distinct_count)
        })

    return jsonify(result_list)
