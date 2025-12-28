
// General.ts
import { fetchData } from '../helpers/endpoints';

export type Personnels = {
  id: string;
  nom_prenom: string;
  etat: string;        // EtatPersonnel enum as string
  service: string;     // ServicePersonnel enum as string
  frequence_cardiaque: number;
  position: string;
};

export type Surveillance = {
  zone: number;
  drones_actifs: number;
  drones_panne: number;
  drones_rechargement: number;
  detection_incendie: boolean;
  detection_forme: string;
  audit_conformite: boolean;
};

export type Articles = {
  id: number;
  zone: number;
  etat_emballage: string;
  responsable_id: string;
  position: string;
  rotation: string;
  collisions: number;
};

export type Operations = {
  id: number;
  type_op: string;
  responsable_id: string;
  marge: number;
  km_parcourus: number;
  mot_cle_responsable: string;
  mot_cle_client: string;
};

export type Formations = {
  id: number;
  nom_formation: string;
  sujet: string;
  date_formation: string;
  pourcentage_engagement: number;
  pourcentage_satisfaction: number;
  mot_cle_formateur: string;
  mot_cle_personnel: string;
};


const General = {
  getPersonnel: async (): Promise<Personnels[]> =>
    fetchData("General", "Personnel"),
    
  getSurveillance: async (): Promise<Surveillance[]> =>
    fetchData("General", "Surveillance"),
    
  getArticles: async (): Promise<Articles[]> =>
    fetchData("General", "Articles"),
    
  getOperations: async (): Promise<Operations[]> =>
    fetchData("General", "Operations"),
    
  getFormations: async (): Promise<Formations[]> =>
    fetchData("General", "Formations"),
};

export default General;
