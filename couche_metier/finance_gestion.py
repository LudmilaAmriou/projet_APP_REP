import os
import requests
from flask import Blueprint, jsonify
import json
import pandas as pd
from couche_data.db_connect import db
from couche_data.db_tables import Personnel, OperationCommerciale, Surveillance
from couche_metier.utils.data_agregation import aggregate_data_multi, build_id_map


finance_bp = Blueprint('finance', __name__, url_prefix='/finance_gestion')

# -----------------------------
# A -  Responsable ayant parcouru le plus de kilomètres
# -----------------------------
@finance_bp.route('/responsable/max_km')
def responsable_max_km():
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(OperationCommerciale.responsable_id, OperationCommerciale.km_parcourus),
        external_key="operations",
        id_col="responsable_id",
        value_cols=["km"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"error": "No operations data available"}), 404

    # Build personnel ID->name map
     # --- 2) Build personnel map using general function ---
    personnel_map = build_id_map(
        local_query=db.session.query(Personnel.id, Personnel.nom_prenom),
        external_key="personnel",
        id_field="id",
        value_field="nomPrenom"
    )

    # Global max
    agg = df_all.groupby("responsable_id", as_index=False)["km"].sum()
    max_row = agg.loc[agg["km"].idxmax()]
    resp_id = max_row["responsable_id"]
    resp_name = personnel_map.get(resp_id, resp_id)
    source_max = df_all.loc[df_all["responsable_id"] == resp_id, "source"].iloc[0]

    return jsonify({
        "responsable": resp_name,
        "identifiant": resp_id,
        "total_km_parcourus": round(max_row["km"], 2),
        "source_max": source_max,
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })




# -----------------------------
# B - Drone le plus ancien 
# -----------------------------
@finance_bp.route('/drone/plus_ancien')
def drone_plus_ancien():
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(
            Surveillance.zone,
            Surveillance.drones_panne,
            Surveillance.drones_rechargement
        ),
        external_key="drones",
        id_col="zone",
        value_cols=["drones_panne", "drones_rechargement"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"error": "No drone data available"}), 404

    # ---- Global aggregation across all sources ----
    agg = (
        df_all.groupby("zone", as_index=False)[["drones_panne", "drones_rechargement"]]
        .sum()
    )

    # Compute drone age rule AFTER aggregation
    agg["drone_age"] = agg["drones_panne"] * 2 + agg["drones_rechargement"]

    # Global max zone
    max_row = agg.loc[agg["drone_age"].idxmax()]
    zone_max = max_row["zone"]

    # Find which source contributed the max zone (for reporting only)
    source_max = (
        df_all.loc[df_all["zone"] == zone_max, "source"]
        .iloc[0]
        if not df_all.loc[df_all["zone"] == zone_max].empty
        else None
    )

    return jsonify({
        "zone": zone_max,
        "drone_age": int(max_row["drone_age"]),
        "drones_panne": int(max_row["drones_panne"]),
        "drones_rechargement": int(max_row["drones_rechargement"]),
        "source_max": source_max,
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })



# -----------------------------
# C - Total des marges par responsable (chart)
# -----------------------------
@finance_bp.route('/marges_par_responsable')
def marges_par_responsable():
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(OperationCommerciale.responsable_id, OperationCommerciale.marge),
        external_key="operations",
        id_col="responsable_id",
        value_cols=["marge"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"error": "No margin data available"}), 404

    # Personnel map dynamically
    personnel_map = build_id_map(
        local_query=db.session.query(Personnel.id, Personnel.nom_prenom),
        external_key="personnel",
        id_field="id",
        value_field="nomPrenom"
    )


    data = [
        {
            "source": source,
            "responsable_id": row["responsable_id"],
            "responsable_name": personnel_map.get(row["responsable_id"], row["responsable_id"]),
            "total_marge": round(row["marge"], 2)
        }
        for source, df_source in df_all.groupby("source")
        for _, row in df_source.groupby("responsable_id", as_index=False)["marge"].sum().iterrows()
    ]

    return jsonify(data)



# -----------------------------
# D - Nombre d’opérations par type (Achat/Vente) pour graphique
# -----------------------------
@finance_bp.route('/operations_par_type')
def operations_par_type():
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(OperationCommerciale.type_op, OperationCommerciale.id),
        external_key="operations",
        id_col="type_op",
        value_cols=["id"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"error": "No operations data available"}), 404

    # Convert enum to string
    df_all["type_op"] = df_all["type_op"].apply(lambda x: x.value if hasattr(x, "value") else str(x))
    df_all["count"] = 1
    agg = df_all.groupby(["type_op", "source"], as_index=False)["count"].sum()

    data = [{"type_op": row["type_op"], "source": row["source"], "count": int(row["count"])} for _, row in agg.iterrows()]
    return jsonify(data)




# -----------------------------
# E - Responsable ayant parcouru le plus de kilomètres par source
# -----------------------------
@finance_bp.route('/responsable/max_km_per_source')
def max_km_per_source():
    """
    Returns the personnel with the max km per source (local DB + each external API).
    """
    # --- 1) Aggregate local + external sources ---
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(
            OperationCommerciale.responsable_id,
            OperationCommerciale.km_parcourus
        ),
        external_key="operations",
        id_col="responsable_id",
        value_cols=["km"],
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"error": "No operations data available"}), 404

    # --- 2) Build personnel map using general function ---
    personnel_map = build_id_map(
        local_query=db.session.query(Personnel.id, Personnel.nom_prenom),
        external_key="personnel",
        id_field="id",
        value_field="nomPrenom"
    )

    # --- 3) Compute max km per source ---
    result_list = []
    for source, df_source in df_all.groupby("source"):
        agg = df_source.groupby("responsable_id", as_index=False)["km"].sum()
        max_row = agg.loc[agg["km"].idxmax()]
        resp_id = max_row["responsable_id"]
        resp_name = personnel_map.get(resp_id, resp_id)
        result_list.append({
            "source": source,
            "responsable_id": resp_id,
            "responsable_name": resp_name,
            "max_km": round(max_row["km"], 2)
        })

    return jsonify(result_list)
