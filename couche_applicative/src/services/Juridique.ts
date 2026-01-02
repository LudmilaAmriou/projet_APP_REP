// src/services/Juridique.ts
import type { MaxPerSite } from 'src/_mytypes/_data';

import { JuridiqueAdapters } from 'src/_mytypes/_data';

import { fetchCountries } from '../helpers/endpoints';

const COUNTRIES = ['canada', 'australie'];

const juridiqueService = {
  // Fetch for one country (legacy)
  getMaxPerSite: async (): Promise<MaxPerSite[]> => {
    const country = 'canada';
    const data = await fetchCountries('Juridique', 'B', [country], JuridiqueAdapters);
    return data;
  },

  // Fetch for all countries and merge results
  getMaxPerSiteAllCountries: async (): Promise<MaxPerSite[]> => {
    const data = await fetchCountries('Juridique', 'B', COUNTRIES, JuridiqueAdapters);
    return data;
  },
};

export default juridiqueService;
