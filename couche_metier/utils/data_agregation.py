import requests
import pandas as pd
import os 
import json

# --- Chemin vers le dossier courant ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Charger la configuration des APIs externes depuis le fichier JSON ---
config_path = os.path.join(BASE_DIR, "Innov3D_endpt.json")
with open(config_path) as f:
    EXTERNAL_APIS = json.load(f)


def aggregate_data_multi(local_query=None, external_key=None, id_col=None, value_cols=None, local_source="local"):
    """
    Agrège les données locales et externes avec plusieurs colonnes numériques.
    Returns:
        df_all: DataFrame contenant toutes les sources
        sources_responded: liste des sources ayant répondu
    """
    df_all = pd.DataFrame(columns=[id_col] + value_cols + ["source"])
    sources_responded = []

    # --- Base locale ---
    if local_query:
        try:
            local_data = local_query.all()
            if local_data:
                df_local = pd.DataFrame(local_data, columns=[id_col]+value_cols)
                df_local["source"] = local_source
                df_all = pd.concat([df_all, df_local], ignore_index=True)
                sources_responded.append(local_source)
        except:
            pass

    # --- APIs externes ---
    for country, cfg in EXTERNAL_APIS.get(external_key, {}).items():
        try:
            # Récupération des données externes
            ext_data = pd.DataFrame(requests.get(cfg["url"], timeout=10).json())
            if ext_data.empty:
                continue

            # Appliquer le rename_map si présent
            if "rename_map" in cfg and cfg["rename_map"]:
                ext_data = ext_data.rename(columns=cfg["rename_map"])

            # Ajouter la colonne source
            ext_data["source"] = country

            # Concaténer uniquement les colonnes demandées
            df_all = pd.concat([df_all, ext_data[[id_col]+value_cols+["source"]]], ignore_index=True)
            sources_responded.append(country)
        except Exception as e:
            print(f"Erreur lors de la récupération de {external_key} pour {country}: {e}")
            continue

    return df_all, sources_responded


def build_id_map(local_query=None, external_key=None, id_field=None, value_field=None):
    """
    Construit un dictionnaire mappant ID -> valeur à partir de la base locale et des APIs externes.

    Args:
        local_query: requête SQLAlchemy renvoyant id_field et value_field ou objets complets
        external_key: clé dans EXTERNAL_APIS (ex: 'personnel', 'operations', etc.)
        id_field: nom de la colonne à utiliser comme clé (id)
        value_field: nom de la colonne à utiliser comme valeur (nom ou champ lisible)

    Returns:
        dict {id: valeur}
    """
    id_map = {}

    # ---------------------------
    # Base locale
    # ---------------------------
    if local_query is not None:
        rows = local_query.all()
        if rows:
            df_local = pd.DataFrame(rows, columns=[id_field, value_field])
            df_local = df_local.dropna(subset=[id_field, value_field])
            id_map.update(df_local.set_index(id_field)[value_field].astype(str).to_dict())

    # ---------------------------
    # APIs externes
    # ---------------------------
    for cfg in EXTERNAL_APIS.get(external_key, {}).values():
        try:
            ext_data = requests.get(cfg["url"], timeout=5).json()
            rename_map = cfg.get("rename_map", {})
            ext_id_field = rename_map.get(id_field, id_field)
            ext_value_field = rename_map.get(value_field, value_field)

            df_ext = pd.DataFrame(ext_data)
            if ext_id_field in df_ext.columns and ext_value_field in df_ext.columns:
                df_ext = df_ext.dropna(subset=[ext_id_field, ext_value_field])
                id_map.update(
                    df_ext.set_index(ext_id_field)[ext_value_field].astype(str).to_dict()
                )

        except Exception as e:
            print(f"Erreur lors de la récupération de {external_key} depuis {cfg.get('url')}: {e}")
            continue

    return id_map
