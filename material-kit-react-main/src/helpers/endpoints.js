// src/api/endpoints.js

import { BASE_URLS } from './base_urls';


export const SERVICES = [
  "Finance & Contrôle de Gestion",
  "Juridique",
  "Direction Générale",
  "Informatique",
  "Achats",
  "Collecte",
  "Assistance Technique"
];

// Structure: SERVICE → METRIC → COUNTRY → ENDPOINTS
export const API_ENDPOINTS = {
  "Finance & Contrôle de Gestion": {
    A: {
      brazil: [`${BASE_URLS.brazil}/finance_gestion/responsable/max_km`]
    },
    B: {
      brazil: [`${BASE_URLS.brazil}/finance_gestion/drone/plus_ancien`],
    },
    C: {
      brazil: [`${BASE_URLS.brazil}/finance_gestion/marges_par_responsable`]
    },
    D: {
      brazil: [`${BASE_URLS.brazil}/finance_gestion/operations_par_type`]
    },
    E: {
      brazil: [`${BASE_URLS.brazil}/finance_gestion/responsable/max_km_per_source`]
    }
  },
  "Juridique": {
    B: {
      australie: [`${BASE_URLS.australie}/juridique`],
      canada: [`${BASE_URLS.canada}/juridique`]
    }
  },
  "Informatique": {
    B: {
      egypte: [`${BASE_URLS.egypte}/informatique`],
      vietnam: [`${BASE_URLS.vietnam}/informatique`]

    }
  },
  "Achats": {
    A: {
      canada: [`${BASE_URLS.canada}//assistance_commerciale/achats`]
    }
  },
  "Collecte": {
    B: {
      canada: [`${BASE_URLS.canada}///assistance_commerciale/responsables_vente`],
      france: [`${BASE_URLS.france}///assistance_commerciale/responsables_vente`]

    }
  },
  "Assistance Technique": {
    A: {
      brazil: [`${BASE_URLS.brazil}/assistance_commerciale/zone/co2_min`]
    }
  }
};


// Fetch helper (tries all endpoints for a country)
export async function fetchData(service, metric, country = "brazil") {
  const metricObj = API_ENDPOINTS[service]?.[metric];
  if (!metricObj || !metricObj[country]) return null;

  for (const endpoint of metricObj[country]) {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) continue;
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn(`Erreur sur ${endpoint}:`, err);
      continue;
    }
  }

  return null; // fallback if all endpoints fail
}
