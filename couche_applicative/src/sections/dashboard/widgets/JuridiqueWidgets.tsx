import type { MaxPerSite } from 'src/_mytypes/_data';

import { JSX, useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import juridiqueService from 'src/services/Juridique';

import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';

const STATIC_MAX_PERSONNEL: MaxPerSite[] = [
  { identifiant: 'Site A', responsable: 'Alice', total_personnel: 400, country: 'Canada' },
  { identifiant: 'Site B', responsable: 'Bob', total_personnel: 400, country: 'Australie' },
];

export default function JuridiqueWidgets(): JSX.Element {
  const [data, setData] = useState<MaxPerSite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const maxPerSite = await juridiqueService.getMaxPerSiteAllCountries();

        if (!maxPerSite || maxPerSite.length === 0) {
          setData(STATIC_MAX_PERSONNEL); // fallback static
        } else {
          setData(maxPerSite);
        }
      } catch (err) {
        console.error('Erreur fetching max personnel:', err);
        setData(STATIC_MAX_PERSONNEL); // fallback static
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
            title="Maximum de personnel juridique par site et par pays"
            list={data
              .map((r) => ({
                value: r.responsable,
                label: r.country,
                total: r.total_personnel,
              }))
              .sort((a, b) => b.total - a.total) // sort descending
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
