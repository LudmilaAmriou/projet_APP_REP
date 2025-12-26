from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import  OperationCommerciale
from flask import Blueprint, jsonify
from couche_metier.utils.data_agregation import aggregate_data_multi


assistance_bp = Blueprint('assistance', __name__, url_prefix='/assistance_commerciale')

# -----------------------------
# A - Zone avec le CO2 le plus faible (calcul déduit)
# -----------------------------
@assistance_bp.route('/zone/co2_min')
def zone_co2_min():
    """
    Returns the zone with the lowest CO2 level from external 'releves' API.
    """

    # --- Aggregate only external 'releves' data ---
    df_all, sources_responded = aggregate_data_multi(
        external_key="releves",
        id_col="zone",
        value_cols=["co2"],
        local_source=None  # no local DB
    )

    if df_all.empty:
        return jsonify({"error": "No releves data available"}), 404

    # --- Pick the zone with minimum CO2 ---
    min_row = df_all.loc[df_all["co2"].idxmin()]

    return jsonify({
        "zone": min_row["zone"],
        "co2_level": round(min_row["co2"], 2),
        "source": min_row["source"],
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })


# -----------------------------
# B -  Nombre de responsables en vente
# -----------------------------
@assistance_bp.route('/responsables_vente')
def responsables_vente():
    """
    Returns the number of personnel who performed at least one 'vente' operation,
    aggregating local DB + external APIs.
    """
    # --- 1) Aggregate local + external 'operations' data ---
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(
            OperationCommerciale.responsable_id,
            OperationCommerciale.id,  # just to count operations
            OperationCommerciale.type_op
        ).filter(OperationCommerciale.type_op == 'vente'),  # or TypeOperation.vente.value if Enum
        external_key="operations",
        id_col="responsable_id",
         value_cols=["id", "type_op"], # we just need to count operations
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify({"nombre_responsables_vente": 0, "sources_responded": [], "num_sources_responded": 0})

    # --- 2) Count distinct responsables who had at least 1 vente ---
    df_all = df_all[df_all["type_op"].str.lower() != "achat"]
    distinct_count = df_all["responsable_id"].nunique()

    return jsonify({
        "nombre_responsables_vente": int(distinct_count),
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })


# -----------------------------
# C - Zone avec le CO2 minimum par source
# -----------------------------
@assistance_bp.route('/zone/co2_min_per_source')
def zone_co2_min_per_source():
    """
    Returns the zone with the lowest CO2 level per source (external APIs only, grouped by country).
    """
    # Aggregate only external 'releves' data
    df_all, sources_responded = aggregate_data_multi(
        external_key="releves",
        id_col="zone",
        value_cols=["co2"],
        local_source=None  # no local DB
    )

    if df_all.empty:
        return jsonify({"error": "No releves data available"}), 404

    # Group by source (country) and pick the min CO2 for each
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
    Returns the number of personnel who performed at least one 'vente' operation, grouped by source.
    """
    # Aggregate local + external 'operations' data
    df_all, _ = aggregate_data_multi(
        local_query=db.session.query(
            OperationCommerciale.responsable_id,
            OperationCommerciale.id,  # just to count operations
            OperationCommerciale.type_op
        ).filter(OperationCommerciale.type_op == 'vente'),  # or TypeOperation.vente.value if Enum
        external_key="operations",
        id_col="responsable_id",
        value_cols=["id", "type_op"],  # counting operations
        local_source="local (Brésil)"
    )

    if df_all.empty:
        return jsonify([])
    
    df_all = df_all[df_all["type_op"].str.lower() != "achat"]
    distinct_count = df_all["responsable_id"].nunique()

    # Count distinct responsables per source
    result_list = []
    for source, df_source in df_all.groupby("source"):
        distinct_count = df_source["responsable_id"].nunique()
        result_list.append({
            "source": source,
            "nombre_responsables_vente": int(distinct_count)
        })

    return jsonify(result_list)
