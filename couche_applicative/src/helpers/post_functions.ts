// utils/handleApi.ts
import { BASE_URLS } from "./base_urls";

export const API_URL = `${BASE_URLS.brazil}/write`;



export interface HandleOptions {
  table: string;
  values?: Record<string, any>; // optional for delete
  apiUrl: string;
  apiKey: string;
  id?: string | number; // for edit/delete
}

// ----- centralized endpoint map -----
const ENDPOINT_MAP: Record<string, string> = {
  personnel: "/personnel",
  article: "/article",
  operation: "/operation",
  formation: "/formation",
  surveillance: "/surveillance",
};

/**
 * Normalizes payload (numbers, booleans, dates) before sending to backend
 */
function normalizePayload(payload: Record<string, any>) {
  const numericFields = [
    "marge",
    "km_parcourus",
    "collisions",
    "frequence_cardiaque",
    "pourcentage_engagement",
    "pourcentage_satisfaction",
  ];

  numericFields.forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== "") {
      payload[field] = Number(payload[field]);
    }
  });

  const booleanFields = ["detection_incendie", "audit_conformite"];
  booleanFields.forEach((field) => {
    if (payload[field] === "true") payload[field] = true;
    if (payload[field] === "false") payload[field] = false;
  });

  if (payload.date_formation) {
    const date = new Date(payload.date_formation);
    if (!isNaN(date.getTime())) {
      payload.date_formation = date.toISOString();
    } else {
      delete payload.date_formation;
    }
  }

  if (payload.service) payload.service = String(payload.service);

  return payload;
}

/**
 * Add new row
 */
export async function handleAddGeneral({
  table,
  values = {},
  apiUrl,
  apiKey,
}: HandleOptions) {
  const payload = normalizePayload({ ...values });

  const res = await fetch(`${apiUrl}${ENDPOINT_MAP[table]}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur API (${res.status})`);
  }

  return res.json();
}

/**
 * Edit existing row
 */
export async function handleEditGeneral({
  table,
  id,
  values = {},
  apiUrl,
  apiKey,
}: HandleOptions) {
  if (!id) throw new Error("ID is required for edit");

  const payload = normalizePayload({ ...values });

  const res = await fetch(`${apiUrl}${ENDPOINT_MAP[table]}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur API (${res.status})`);
  }

  return res.json();
}

/**
 * Delete existing row
 */
export async function handleDeleteGeneral({
  table,
  id,
  apiUrl,
  apiKey,
}: HandleOptions) {
  if (!id) throw new Error("ID is required for delete");

  const res = await fetch(`${apiUrl}${ENDPOINT_MAP[table]}/${id}`, {
    method: "DELETE",
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur API (${res.status})`);
  }

  return res.json();
}
