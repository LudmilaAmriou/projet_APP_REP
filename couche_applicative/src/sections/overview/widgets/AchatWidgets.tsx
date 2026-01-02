// AchatsWidgets.tsx — Nombre d’employés total Achats

import type { JSX } from 'react';
import type { empAchat } from 'src/_mytypes/_data';

import { useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import { _langs } from 'src/_mytypes/_data';
import achatsService from 'src/services/Achats';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';

// ---- Static fallback if API fails ----
const STATIC_ACHAT_EMPLOYEES: empAchat = {
  total_empl_achat: 50000,
  breakdown: [
    { source: 'Canada', employees: 50000 },
  ],
};

type DataState = {
  nbEmployees: empAchat | null;
};

export default function AchatsWidgets(): JSX.Element {
  const [data, setData] = useState<DataState>({ nbEmployees: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const nbEmployees = await achatsService.getAllAchatEmp();
        setData({ nbEmployees: nbEmployees ?? STATIC_ACHAT_EMPLOYEES });
      } catch (err) {
        console.error('Error fetching Achats employees:', err);
        setData({ nbEmployees: STATIC_ACHAT_EMPLOYEES });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Get the first source flag dynamically for the summary icon
  const summaryFlag =
    _langs.find(l => l.label === data.nbEmployees?.breakdown?.[0]?.source)?.icon ??
    '/assets/icons/flags/ic-flag-al.svg';

  return (
    <Grid container spacing={3}>
      {/* TOTAL EMPLOYEES CARD */}
      <Grid size={{ xs: 12, sm: 6, md: 12 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <AnalyticsWidgetSummary
            title="Nombre d’employés du service Achats pour l’ensemble du groupe Innov3D"
            total={data.nbEmployees?.total_empl_achat ?? 0}
            color="primary"
            chart={{
              series: [data.nbEmployees?.total_empl_achat ?? 0],
              categories: ['Employés'],
            }}
            icon={<img src={summaryFlag} alt="Employés Achats" style={{ width: 48, height: 48, borderRadius: '50%' }} />}
          />
        )}
      </Grid>

     
    </Grid>
  );
}
