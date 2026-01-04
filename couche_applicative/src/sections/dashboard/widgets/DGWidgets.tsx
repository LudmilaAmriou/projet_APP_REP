// DirectionWidgets.tsx — Nombre d’employés total de l’ensemble du groupe Innov3D

;

import type { DGPersonnel } from 'src/_mytypes/_data';

import { JSX, useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import { _langs } from 'src/_mytypes/_data';
import dgService from 'src/services/Direction';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';

// ---- Static fallback if API fails ----
const STATIC_DG_EMPLOYEES: DGPersonnel = {
  total_employees: 750000,
  breakdown: [
    { country: 'Egypte', employees: 7500000 },
  ],
};

type DataState = {
  nbEmployees: DGPersonnel | null;
};

export default function DirectionWidgets(): JSX.Element {
  const [data, setData] = useState<DataState>({ nbEmployees: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const nbEmployees = await dgService.getAllPers();

        // fallback if API returns nothing
        setData({ nbEmployees: nbEmployees ?? STATIC_DG_EMPLOYEES });
      } catch (err) {
        console.error("Error fetching DG employees:", err);
        setData({ nbEmployees: STATIC_DG_EMPLOYEES });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

   const summaryFlag =
    _langs.find(l => l.label === data.nbEmployees?.breakdown?.[0]?.country)?.icon ??
    '/assets/icons/flags/ic-flag-al.svg';

  return (
    <Grid container spacing={3}>
   

   <Grid size={{ xs: 12, sm: 6, md: 12 }}>
           {loading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
               <CircularProgress />
             </Box>
           ) : (
             <AnalyticsWidgetSummary
               title="Nombre d’employés total de l’ensemble du groupe Innov3D"
               total={data.nbEmployees?.total_employees ?? 0}
               color="primary"
               chart={{
                 series: [data.nbEmployees?.total_employees ?? 0],
                 categories: ['Employés'],
               }}
               icon={<img src={summaryFlag} alt="Employés Direction générale" style={{ width: 48, height: 48, borderRadius: '50%' }} />}
             />
           )}
         </Grid>
     
      
    </Grid>
  );
}
