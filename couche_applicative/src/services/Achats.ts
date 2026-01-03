// FinanceService.ts
import { empAchat } from 'src/_mytypes/_data';

import { fetchData } from '../helpers/get_functions';


const achatsService = {
  getAllAchatEmp: async (): Promise<empAchat> => fetchData("Achats", "A"),
};

export default achatsService;