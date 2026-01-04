import pytest
import requests
import yaml
import os

# -----------------------------
# Charger l'URL de base depuis le YAML
# -----------------------------
yaml_path = os.path.join(os.path.dirname(__file__), "../../myBackendAPI.yaml")
with open(yaml_path, "r") as f:
    config = yaml.safe_load(f)

BASE_URL = config.get("base_url")
if not BASE_URL:
    raise ValueError("base_url introuvable dans le fichier YAML !")

# -----------------------------
# Liste de tous les endpoints GET à tester
# -----------------------------
ALL_ENDPOINTS = [
    # -----------------------------
    # Recherche et Développement (RD)
    # -----------------------------
    '/recherche_developpement/articles/deformes_sans_collision',
    '/recherche_developpement/machine/faible_cadence',
    '/recherche_developpement/articles/repartition_emballage',
    '/recherche_developpement/articles/deformes_sans_collision_per_source',

    # -----------------------------
    # Général
    # -----------------------------
    '/general/tables',
    '/general/personnel',
    '/general/articles',
    '/general/operations',
    '/general/formations',
    '/general/surveillance',
    '/general/stats/personnel/count',
    '/general/stats/articles/deformes',
    '/general/stats/operations/total_km',
    '/general/stats/personnel/etat',
    '/general/stats/articles/per_zone',

    # -----------------------------
    # Finance / Gestion
    # -----------------------------
    '/finance_gestion/responsable/max_km',
    '/finance_gestion/responsable/max_km_per_source',
    '/finance_gestion/drone/plus_ancien',
    '/finance_gestion/marges_par_responsable',
    '/finance_gestion/operations_par_type',

    # -----------------------------
    # Assistance Commerciale
    # -----------------------------
    '/assistance_commerciale/zone/co2_min',
    '/assistance_commerciale/zone/co2_min_per_source',
    '/assistance_commerciale/responsables_vente',
    '/assistance_commerciale/responsables_vente_per_source',
]

# -----------------------------
# Test paramétré pour tous les endpoints GET
# -----------------------------
@pytest.mark.parametrize("endpoint", ALL_ENDPOINTS)
def test_endpoint_live(endpoint):
    """
    Vérifie que chaque endpoint :
        - est accessible (status code 200)
        - retourne du JSON
        - ne renvoie pas de données vides
    """
    url = BASE_URL.rstrip("/") + endpoint
    res = requests.get(url)

    # --- Vérification du code HTTP ---
    assert res.status_code == 200, f"[ÉCHEC] {endpoint} : code {res.status_code}"

    # --- Vérification du type de contenu ---
    content_type = res.headers.get('Content-Type', '')
    assert content_type.startswith('application/json'), f"[ÉCHEC] {endpoint} : Content-Type non JSON ({content_type})"

    # --- Parse JSON ---
    try:
        data = res.json()
    except Exception as e:
        pytest.fail(f"[ÉCHEC] {endpoint} : impossible de parser le JSON ({e})")

    # --- Vérification que les données ne sont pas vides ---
    assert data is not None, f"[ÉCHEC] {endpoint} : JSON renvoie None"

    if isinstance(data, list):
        # liste non vide
        assert len(data) > 0, f"[AVERTISSEMENT] {endpoint} : liste vide"
        # Vérifie que chaque élément est un dict
        for item in data:
            assert isinstance(item, dict), f"[ÉCHEC] {endpoint} : élément de la liste n'est pas un dict"
    elif isinstance(data, dict):
        # dict non vide
        assert len(data.keys()) > 0, f"[AVERTISSEMENT] {endpoint} : dict vide"
    else:
        pytest.fail(f"[ÉCHEC] {endpoint} : JSON renvoie ni liste ni dict, type={type(data)}")
