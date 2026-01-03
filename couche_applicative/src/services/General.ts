// General.ts
import { fetchData } from '../helpers/get_functions';

// -----------------------------
// Types
// -----------------------------
export type Personnels = {
  id: string;
  nom_prenom: string;
  etat: string;        // EtatPersonnel enum as string
  service: string;     // ServicePersonnel enum as string
  frequence_cardiaque: number;
  position: string;
};

export type Surveillance = {
  zone: string;
  drones_actifs: number;
  drones_panne: number;
  drones_rechargement: number;
  detection_incendie: boolean;
  detection_forme: string;
  audit_conformite: boolean;
};

export type Articles = {
  id: string;
  zone: number;
  etat_emballage: string;
  responsable_name: string;
  position: string;
  rotation: string;
  collisions: number;
};

export type Operations = {
  id: string;
  type_op: string;
  responsable_id: string;
  marge: number;
  km_parcourus: number;
  mot_cle_responsable: string;
  mot_cle_client: string;
};

export type Formations = {
  id: string;
  nom_formation: string;
  sujet: string;
  date_formation: string;
  pourcentage_engagement: number;
  pourcentage_satisfaction: number;
  mot_cle_formateur: string;
  mot_cle_personnel: string;
  personnel_name: string;
};

// -----------------------------
// General service
// -----------------------------
const General = {
  getPersonnel: async (): Promise<Personnels[]> =>
    ((await fetchData("General", "Personnel")) as Personnels[] | null) ?? [],

  getSurveillance: async (): Promise<Surveillance[]> =>
    ((await fetchData("General", "Surveillance")) as Surveillance[] | null) ?? [],

  getArticles: async (): Promise<Articles[]> =>
    ((await fetchData("General", "Articles")) as Articles[] | null) ?? [],

  getOperations: async (): Promise<Operations[]> =>
    ((await fetchData("General", "Operations")) as Operations[] | null) ?? [],

  getFormations: async (): Promise<Formations[]> =>
    ((await fetchData("General", "Formations")) as Formations[] | null) ?? [],
};

export default General;
