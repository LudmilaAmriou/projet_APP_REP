// FinanceService.ts
import { fetchData } from '../helpers/endpoints';

export type MaxKmType = { identifiant: string; responsable: string; total_km_parcourus: number };
export type OldestDroneType = { drone_age: number };
export type MargeType = { responsable_name: string; total_marge: number ,  source: string;};
export type MaxKmTypeSource = { source: string; max_km: number,  responsable_name: string };
export type OperationType = {
  source: string; type_op: string; count: number 
};

const financeService = {
  getMaxKm: async (): Promise<MaxKmType> => fetchData("Finance & Contrôle de Gestion", "A"),
  getOldestDrone: async (): Promise<OldestDroneType> => fetchData("Finance & Contrôle de Gestion", "B"),
  getMargeParResponsable: async (): Promise<MargeType[]> => fetchData("Finance & Contrôle de Gestion", "C"),
  getOperationsParType: async (): Promise<OperationType[]> => fetchData("Finance & Contrôle de Gestion", "D"),
  getMaxKmParSource: async (): Promise<MaxKmTypeSource[]> => fetchData("Finance & Contrôle de Gestion", "E"),

};

export default financeService;
