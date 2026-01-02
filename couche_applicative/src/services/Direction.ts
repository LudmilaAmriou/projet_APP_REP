// dgService.ts
import type { DGPersonnel } from 'src/_mytypes/_data';

import { fetchData } from '../helpers/endpoints';


const dgService = {
  getAllPers: async (): Promise<DGPersonnel> => fetchData("Direction Générale", "A"),
};

export default dgService;