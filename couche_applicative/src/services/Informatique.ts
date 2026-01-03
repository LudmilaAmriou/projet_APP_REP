// src/services/Informatique.ts
import type { NbSiteNonInfo } from 'src/_mytypes/_data';

import { InformatiqueAdapters } from 'src/_mytypes/_data';

import { fetchCountries } from '../helpers/get_functions';

const SOURCES = ['egypte', 'vietnam'];

const informatiqueService = {
  // fetch for one source (legacy)
  getNbNoneInformatique: async (): Promise<NbSiteNonInfo[]> => {
    const source = 'egypte';
    const data = await fetchCountries('Informatique', 'B', [source], InformatiqueAdapters);
    return data;
  },

  // fetch for all sources and merge results
  getNbNoneInformatiquePerCountry: async (): Promise<NbSiteNonInfo[]> => {
    const data = await fetchCountries('Informatique', 'B', SOURCES, InformatiqueAdapters);
    return data;
  },
};

export default informatiqueService;
