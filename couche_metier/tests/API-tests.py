import pytest
import requests
import yaml
import os

# -----------------------------
# Load base URL from YAML
# -----------------------------

yaml_path = os.path.join(os.path.dirname(__file__), "../../myBackendAPI.yaml")
with open(yaml_path, "r") as f:  
    config = yaml.safe_load(f)

BASE_URL = config.get("base_url") 
if not BASE_URL:
    raise ValueError("base_url not found in YAML file!")

# -----------------------------
# All endpoints
# -----------------------------
ALL_ENDPOINTS = [
    # RD
    '/recherche_developpement/articles/deformes_sans_collision',
    '/recherche_developpement/machine/faible_cadence',
    '/recherche_developpement/articles/repartition_emballage',
    '/recherche_developpement/articles/collisions_par_zone',

    # General
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

    # Finance
    '/finance_gestion/responsable/max_km',
    '/finance_gestion/drone/plus_ancien',
    '/finance_gestion/marges_par_responsable',
    '/finance_gestion/operations_par_type',

    # Assistance
    '/assistance_commerciale/zone/co2_min',
    '/assistance_commerciale/responsables_vente',
    '/assistance_commerciale/zone/max_drones',
    '/assistance_commerciale/zone/risk_score',
    '/assistance_commerciale/zones/co2_all',
    '/assistance_commerciale/zones/drones_distribution',
]

# -----------------------------
# Parametrized test
# -----------------------------
@pytest.mark.parametrize("endpoint", ALL_ENDPOINTS)
def test_endpoint_live(endpoint):
    url = BASE_URL.rstrip("/") + endpoint
    res = requests.get(url)

    assert res.status_code == 200, f"Failed at {endpoint}: {res.status_code}"
    assert res.headers['Content-Type'].startswith('application/json'), f"{endpoint} did not return JSON"
    
    # Optional: check that JSON is not empty
    data = res.json()
    assert data is not None
