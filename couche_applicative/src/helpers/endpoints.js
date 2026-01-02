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

  "General": {
  Personnel: { brazil: [`${BASE_URLS.brazil}/general/personnel`] },
  Articles: { brazil: [`${BASE_URLS.brazil}/general/articles`] },
  Operations: { brazil: [`${BASE_URLS.brazil}/general/operations`] },
  Formations: { brazil: [`${BASE_URLS.brazil}/general/formations`] },
  Surveillance: { brazil: [`${BASE_URLS.brazil}/general/surveillance`] },
},
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
      australie: [`${BASE_URLS.australie}/juridique/max_personnel_par_site`],
      canada: [`${BASE_URLS.canada}/juridique/max_personnel_par_site`]
    }
  },
  "Direction Générale": {
    A: {
      egypte: [`${BASE_URLS.egypte}/direction_generale/employes_total`],
    }
  },
  "Informatique": {
    B: {
      egypte: [`${BASE_URLS.egypte}/informatique/nb_non_informatique`],
      vietnam: [`${BASE_URLS.vietnam}/informatique/nb_non_informatique`]

    }
  },
  "Achats": {
    A: {
      canada: [`${BASE_URLS.canada}/assistance_commerciale/achats`]
    }
  },
  "Collecte": {
    B: {
      canada: [`${BASE_URLS.canada}/assistance_commerciale/responsables_vente`],
      france: [`${BASE_URLS.france}/assistance_commerciale/responsables_vente`]

    }
  },
  "Assistance Technique": {
    A: {
      brazil: [`${BASE_URLS.brazil}/assistance_commerciale/zone/co2_min`]
    }
  }
};


/// --- Fetch helper for a single country ---
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
    }
  }

  return null;
}

// --- Fetch multiple countries with adapters ---
export async function fetchCountries(
  service,
  metric,
  countries,
  adapters
) {
  const results = [];

  for (const country of countries) {
    try {
      const rawData = await fetchData(service, metric, country);
      if (!rawData) continue;

      const adapter = adapters[country];
      if (!adapter) {
        console.warn(`No adapter for ${service}/${metric}/${country}`);
        continue;
      }

      const normalized = Array.isArray(rawData)
        ? rawData.map(adapter)
        : [adapter(rawData)];

      results.push(...normalized);
    } catch (err) {
      console.warn(`Error fetching ${service}/${metric}/${country}:`, err);
    }
  }

  return results;
}