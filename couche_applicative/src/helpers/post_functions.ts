import { BASE_URLS } from "./base_urls";


export const API_URL = `${BASE_URLS.brazil}/write`;

// utils/handleAdd.ts
export type TableName =
  | "personnel"
  | "article"
  | "operation"
  | "formation"
  | "surveillance";

export type ServiceType =
  | "Finance"
  | "Juridique"
  | "Direction générale"
  | "Achats"
  | "Informatique"
  | "Collecte"
  | "Assistance technique";

interface HandleAddOptions {
  table: TableName;
  values: Record<string, any>;
  apiUrl: string;
  apiKey: string;
}




/**
 * Normalizes payload and sends POST request to backend.
 */
export async function handleAddGeneral({
  table,
  values,
  apiUrl,
  apiKey,
}: HandleAddOptions) {
  // Clone values so we don't mutate the original object
  const payload: Record<string, any> = { ...values };

  // ---- Numeric fields ----
  ["zone", "marge", "km_parcourus", "collisions", "frequence_cardiaque", "pourcentage_engagement", "pourcentage_satisfaction"].forEach(
    (field) => {
      if (payload[field] !== undefined && payload[field] !== "") {
        payload[field] = Number(payload[field]);
      }
    }
  );

  // ---- Boolean fields ----
  ["detection_incendie", "audit_conformite"].forEach((field) => {
    if (payload[field] === "true") payload[field] = true;
    if (payload[field] === "false") payload[field] = false;
  });

  // ---- Date fields ----
  if (payload.date_formation) {
    const date = new Date(payload.date_formation);
    if (!isNaN(date.getTime())) {
      payload.date_formation = date.toISOString();
    } else {
      delete payload.date_formation; // invalid date, remove
    }
  }

  // ---- Enum normalization for ServiceType ----
  if (payload.service) {
    const service = String(payload.service);
    
    // Make sure casing matches your backend enum exactly
    const mapping: Record<string, ServiceType> = {
      finance: "Finance",
      juridique: "Juridique",
      "direction générale": "Direction générale",
      achats: "Achats",
      informatique: "Informatique",
      collecte: "Collecte",
      "assistance technique": "Assistance technique",
    };
    const key = service.toLowerCase();
    if (mapping[key]) payload.service = mapping[key];
    else console.warn(`Unknown service value: ${service}`);
  }

  // ---- Endpoint mapping ----
  const endpointMap: Record<TableName, string> = {
    personnel: "/personnel",
    article: "/article",
    operation: "/operation",
    formation: "/formation",
    surveillance: "/surveillance",
  };
  const endpoint = endpointMap[table];

  // ---- Send POST request ----
  const res = await fetch(`${apiUrl}${endpoint}`, {
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
