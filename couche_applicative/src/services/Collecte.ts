// src/services/Collecte.ts
import type { ZoneAudit } from 'src/_mytypes/_data';

import { CollecteAdapters } from 'src/_mytypes/_data';

import { fetchCountries } from '../helpers/get_functions';

const SOURCES = ['canada', 'france'];

const collecteService = {
  // fetch for one source (legacy)
  getZoneAudit: async (): Promise<ZoneAudit[]> => {
    const source = 'canada';
    return fetchCountries('Collecte', 'B', [source], CollecteAdapters);
  },

  // fetch for all sources and merge results
  getZoneAuditPerCountry: async (): Promise<ZoneAudit[]> => fetchCountries('Collecte', 'B', SOURCES, CollecteAdapters),
};

export default collecteService;
