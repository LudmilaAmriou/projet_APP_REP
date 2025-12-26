from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import Article ,EtatEmballage
from couche_metier.utils.data_agregation import aggregate_data_multi

rd_bp = Blueprint('rd', __name__, url_prefix='/recherche_developpement')

# -----------------------------
# A -  Articles déformés sans collision
# -----------------------------
@rd_bp.route('/articles/deformes_sans_collision')
def articles_deformes_sans_collision():
    """
    Returns the count of articles whose packaging is deformed
    but had no collisions, aggregating internal DB + external APIs.
    """
    # --- Aggregate internal + external data ---
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(
            Article.id,
            Article.etat_emballage,
            Article.collisions
        ),
        external_key="articles",
        id_col="id",
        value_cols=["etat_emballage", "collisions"],
        local_source="local (DB)"
    )

    if df_all.empty:
        return jsonify({"articles_deformes_sans_collision": 0, "sources_responded": [], "num_sources_responded": 0})

    # --- Normalize etat_emballage to lowercase strings ---
    if "etat_emballage" in df_all.columns:
        df_all["etat_emballage"] = df_all["etat_emballage"].apply(lambda x: str(x).split('.')[-1].lower())
    
    # --- Filter deformed without collision ---
    df_filtered = df_all[
        (df_all["etat_emballage"].isin(["defo", "deformé", "déformé", "abimé", "abim", "abim�"]))  
        & (df_all["collisions"] == 0)
    ]

    return jsonify({
        "articles_deformes_sans_collision": len(df_filtered),
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })

# -----------------------------
# B  - Machine avec la plus faible cadence (simulée -- Pas de donnees directes)
# -----------------------------
@rd_bp.route('/machine/faible_cadence')
def machine_faible_cadence():
    """
    Returns the machine (zone) with the lowest cadence across external APIs.
    Cadence is deduced as: 10 - collisions (for TP simplification).
    """
    # --- Aggregate external 'machines' data ---
    df_all, sources_responded = aggregate_data_multi(
        external_key="machines",  # key in EXTERNAL_APIS
        id_col="zone",
        value_cols=["cadence_de_production", "etat"],  # we only need cadence for now
        local_source=None  # no local DB
    )

    if df_all.empty:
        return jsonify({
            'zone_machine': None,
            'cadence': None,
            'sources_responded': [],
            'num_sources_responded': 0
        })

    # --- Compute effective cadence (deduced) ---
    # If collisions exist, you could subtract them or adjust; for now use cadence as-is
    df_all["deduced_cadence"] = df_all["cadence_de_production"].astype(float)

    # --- Find machine (zone) with minimum cadence per source ---
    result_list = []
    for source, df_source in df_all.groupby("source"):
        min_row = df_source.loc[df_source["deduced_cadence"].idxmin()]
        result_list.append({
            "source": source,
            "zone_machine": min_row["zone"],
            "cadence": round(min_row["deduced_cadence"], 2)
        })

    return jsonify({
        "machines_faible_cadence": result_list,
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
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
# D -  Articles déformés sans collision (per source)
# -----------------------------
@rd_bp.route('/articles/deformes_sans_collision_per_source')
def articles_deformes_sans_collision_per_source():
    """
    Returns the count of articles whose packaging is deformed
    but had no collisions, aggregated per source (internal DB + external APIs).
    """
    # --- Aggregate internal + external data ---
    df_all, sources_responded = aggregate_data_multi(
        local_query=db.session.query(
            Article.id,
            Article.etat_emballage,
            Article.collisions
        ),
        external_key="articles",
        id_col="id",
        value_cols=["etat_emballage", "collisions"],
        local_source="local (DB)"
    )

    if df_all.empty:
        return jsonify({"articles_deformes_sans_collision": [], "sources_responded": [], "num_sources_responded": 0})

    # --- Normalize etat_emballage to lowercase strings ---
    if "etat_emballage" in df_all.columns:
        df_all["etat_emballage"] = df_all["etat_emballage"].apply(lambda x: str(x).split('.')[-1].lower())

    # --- Filter deformed without collision ---
    df_filtered = df_all[
        (df_all["etat_emballage"].isin(["defo", "deformé", "déformé", "abimé", "abim", "abim�"]))  
         & (df_all["collisions"] == 0)
    ]

    # --- Count per source ---
    counts_per_source = df_filtered.groupby("source").size().reset_index(name="count")

    # --- Convert to list of dicts ---
    result = counts_per_source.to_dict(orient="records")

    return jsonify({
        "articles_deformes_sans_collision": result,
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })
