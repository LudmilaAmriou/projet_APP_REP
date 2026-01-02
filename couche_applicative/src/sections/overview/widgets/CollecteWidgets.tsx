import type { ZoneAudit } from 'src/_mytypes/_data';

import { JSX, useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import collecteService from 'src/services/Collecte';

import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';

const STATIC_ZONE_AUDIT: ZoneAudit[] = [
  { identifiant: '12345', pourcentage: 80, source: 'Canada' },
  { identifiant: '67890', pourcentage: 80, source: 'Vietnam' },
];

export default function CollecteWidgets(): JSX.Element {
  const [data, setData] = useState<ZoneAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const zoneAudit = await collecteService.getZoneAudit();

        if (!zoneAudit || zoneAudit.length === 0) {
          setData(STATIC_ZONE_AUDIT); // fallback static
        } else {
          setData(zoneAudit);
        }
      } catch (err) {
        console.error('Erreur fetching max personnel:', err);
        setData(STATIC_ZONE_AUDIT); // fallback static
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
            title="Pourcentage des zones ayant été validées cette année par un audit de conformité"
            list={data
                .map((r) => ({
                value: r.identifiant,
                label: r.source,
                total: r.pourcentage, // for sorting
                display: `${r.pourcentage}%`, // for showing %
                }))
                .sort((a, b) => b.total - a.total)}
            />

        )}
      </Grid>
    </Grid>
  );
}
