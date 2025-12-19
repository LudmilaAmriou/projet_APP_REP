// FinanceService.ts
import { fetchData } from '../helpers/endpoints';

export type MaxKmType = { identifiant: string; responsable: string; total_km_parcourus: number };
export type OldestDroneType = { drone_age: number };
export type MargeType = { responsable: string; total_marge: number };
export type OperationType = { type_op: string; count: number };

const financeService = {
  getMaxKm: async (): Promise<MaxKmType> => fetchData("Finance & Contrôle de Gestion", "A"),
  getOldestDrone: async (): Promise<OldestDroneType> => fetchData("Finance & Contrôle de Gestion", "B"),
  getMargeParResponsable: async (): Promise<MargeType[]> => fetchData("Finance & Contrôle de Gestion", "C"),
  getOperationsParType: async (): Promise<OperationType[]> => fetchData("Finance & Contrôle de Gestion", "D"),
};

export default financeService;
