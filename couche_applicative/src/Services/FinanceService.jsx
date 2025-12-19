// src/services/FinanceService.jsx
import { fetchData } from '../helpers/endpoints.js'; 
const financeService = {
  getOldestDrone: async () => {
    return fetchData("Finance & Contrôle de Gestion", "B");
  },
  getMaxKm: async () => {
    return fetchData("Finance & Contrôle de Gestion", "A");
  },
  getMargeParResponsable: async () => {
    return fetchData("Finance & Contrôle de Gestion", "C");
  },
  getOperationsParType: async () => {
    return fetchData("Finance & Contrôle de Gestion", "D");
  }
};

export default financeService;
