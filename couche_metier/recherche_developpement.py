from flask import Blueprint, jsonify
from couche_data.db_connect import db
from couche_data.db_tables import Article, EtatEmballage
from couche_metier.utils.data_agregation import aggregate_data_multi

# Création du Blueprint pour le module Recherche & Développement
rd_bp = Blueprint('rd', __name__, url_prefix='/recherche_developpement')


# -----------------------------
# A - Articles déformés sans collision
# -----------------------------
@rd_bp.route('/articles/deformes_sans_collision')
def articles_deformes_sans_collision():
    """
    Retourne le nombre d'articles dont l'emballage est déformé
    mais qui n'ont subi aucune collision, en agrégeant la base locale et les APIs externes.
    """
    # --- Agrégation des données internes + externes ---
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

    # --- Normalisation des états d'emballage en minuscules ---
    if "etat_emballage" in df_all.columns:
        df_all["etat_emballage"] = df_all["etat_emballage"].apply(lambda x: str(x).split('.')[-1].lower())
    
    # --- Filtrage des articles déformés sans collision ---
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
# B - Machine avec la plus faible cadence (simulée)
# -----------------------------
@rd_bp.route('/machine/faible_cadence')
def machine_faible_cadence():
    """
    Retourne la machine (zone) avec la cadence la plus faible à partir des APIs externes.
    La cadence est déduite pour simplifier (ex: 10 - collisions).
    """
    # --- Agrégation des données externes "machines" ---
    df_all, sources_responded = aggregate_data_multi(
        external_key="machines",  # clé dans EXTERNAL_APIS
        id_col="zone",
        value_cols=["cadence_de_production", "etat"],  # pour l'instant, seule la cadence est utilisée
        local_source=None  # pas de DB locale
    )

    if df_all.empty:
        return jsonify({
            'zone_machine': None,
            'cadence': None,
            'sources_responded': [],
            'num_sources_responded': 0
        })

    # --- Calcul de la cadence effective ---
    df_all["deduced_cadence"] = df_all["cadence_de_production"].astype(float)

    # --- Trouver la machine (zone) avec la cadence minimale par source ---
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
# C - Répartition des articles par état d'emballage
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
# D - Articles déformés sans collision par source
# -----------------------------
@rd_bp.route('/articles/deformes_sans_collision_per_source')
def articles_deformes_sans_collision_per_source():
    """
    Retourne le nombre d'articles déformés sans collision, agrégés par source
    (DB locale + APIs externes).
    """
    # --- Agrégation des données internes + externes ---
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

    # --- Normalisation des états d'emballage ---
    if "etat_emballage" in df_all.columns:
        df_all["etat_emballage"] = df_all["etat_emballage"].apply(lambda x: str(x).split('.')[-1].lower())

    # --- Filtrage des articles déformés sans collision ---
    df_filtered = df_all[
        (df_all["etat_emballage"].isin(["defo", "deformé", "déformé", "abimé", "abim", "abim�"]))  
         & (df_all["collisions"] == 0)
    ]

    # --- Comptage par source ---
    counts_per_source = df_filtered.groupby("source").size().reset_index(name="count")

    # --- Conversion en liste de dictionnaires ---
    result = counts_per_source.to_dict(orient="records")

    return jsonify({
        "articles_deformes_sans_collision": result,
        "sources_responded": sources_responded,
        "num_sources_responded": len(sources_responded)
    })
