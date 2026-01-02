import type { NbSiteNonInfo } from 'src/_mytypes/_data';

import { JSX, useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import informatiqueService from 'src/services/Informatique';

import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';

const STATIC_NB_NON_INFO: NbSiteNonInfo[] = [
  { identifiant: '12345', site: 'Site Egypte', total_sites: 2, source: 'Canada' },
  { identifiant: '67890', site: 'Site Vietnam', total_sites: 2, source: 'Vietnam' },
];

export default function InformatiqueWidgets(): JSX.Element {
  const [data, setData] = useState<NbSiteNonInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const NbNoneInformatique = await informatiqueService.getNbNoneInformatique();

        if (!NbNoneInformatique || NbNoneInformatique.length === 0) {
          setData(STATIC_NB_NON_INFO); // fallback static
        } else {
          setData(NbNoneInformatique);
        }
      } catch (err) {
        console.error('Erreur fetching max personnel:', err);
        setData(STATIC_NB_NON_INFO); // fallback static
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6, lg: 12 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <AnalyticsTrafficBySite
            title="Nombre de sites n’ayant aucun personnel en service informatique"
            list={data
              .map((r) => ({
                value: r.site,
                label: r.source,
                total: r.total_sites,
              }))
              .sort((a, b) => b.total - a.total) // sort descending
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
