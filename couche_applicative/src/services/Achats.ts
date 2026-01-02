// FinanceService.ts
import { empAchat } from 'src/_mytypes/_data';

import { fetchData } from '../helpers/endpoints';


const achatsService = {
  getAllAchatEmp: async (): Promise<empAchat> => fetchData("Achats", "A"),
};

export default achatsService;