// FinanceWidgets.tsx
import { JSX, useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import { _posts, _tasks, _traffic, _timeline, CountryType } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import financeService, { MaxKmType, OldestDroneType, MargeType, OperationType } from '../../../services/FinanceService';

type DataState = {
  maxKm: MaxKmType | null;
  oldestDrone: OldestDroneType | null;
  marges: MargeType[] | null;
  operations: OperationType[] | null;
};

type Props = {
  country: CountryType; // pass the selected country
};

export default function FinanceWidgets({ country }: Props): JSX.Element {
  const [data, setData] = useState<DataState>({
    maxKm: null,
    oldestDrone: null,
    marges: null,
    operations: null,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  async function loadData() {
    try {
      const [maxKm, oldestDrone, marges, operations] = await Promise.all([
        financeService.getMaxKm(),
        financeService.getOldestDrone(),
        financeService.getMargeParResponsable(),
        financeService.getOperationsParType(),
      ]);

      if (maxKm) {
        // If data for Brazil exists
        setData({ maxKm, oldestDrone, marges, operations });
      } else {
        // Fallback static data for other countries
        setData({
          maxKm: { identifiant: '0', responsable: 'Responsable X', total_km_parcourus: 1000 },
          oldestDrone: { drone_age: 5 },
          marges: [
            {  responsable: 'Responsable A', total_marge: 120 },
            {  responsable: 'Responsable B', total_marge: 80 },
          ],
          operations: [
            { type_op: 'Achat', count: 50 },
            { type_op: 'Vente', count: 70 },
          ],
        });
      }
    } catch (err) {
      console.error('Error fetching finance data:', err);

      // fallback if API fails
      setData({
        maxKm: { identifiant: '0', responsable: 'Responsable X', total_km_parcourus: 1000 },
        oldestDrone: { drone_age: 5 },
        marges: [
          {  responsable: 'Responsable A', total_marge: 120 },
          {responsable: 'Responsable B', total_marge: 80 },
        ],
        operations: [
          { type_op: 'Achat', count: 50 },
          {  type_op: 'Vente', count: 70 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);


  return (
     <Grid container spacing={3}>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
            ) :  (
                <AnalyticsWidgetSummary
                  title={`Max km : ${data.maxKm?.responsable ?? ''}`} // nom de la personne
                  total={(data.maxKm?.total_km_parcourus ?? 0)} // km formaté
                  color="secondary"
                  chart={{
                    series: [data.maxKm?.total_km_parcourus ?? 0],
                    categories: ['Km'],
                  }}
                  icon={<img src="/assets/icons/glass/ic-glass-users.svg" alt="Max km" />}
              
              />
            )}
          </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? <CircularProgress /> : (
            <AnalyticsWidgetSummary
              title="L'age du drone le plus ancien sur le site"
              total={data.oldestDrone?.drone_age ?? 0}
           
              chart={{ series: [data.oldestDrone?.drone_age ?? 0], categories: ['Age'] }}
              icon={<img src="/assets/icons/glass/ic-glass-bag.svg" alt="Drone" />}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {loading ? <CircularProgress /> : (
            <AnalyticsWidgetSummary
              title="La marge totale par responsable"
              color="warning"
              total={data.marges?.reduce((sum, r) => sum + r.total_marge, 0) ?? 0}
              chart={{
                series: data.marges?.map(r => r.total_marge) ?? [0],
                categories: data.marges?.map(r => r.responsable) ?? [''],
              }}
              icon={<img src="/assets/icons/glass/ic-glass-buy.svg" alt="Marge" />}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           {loading ? <CircularProgress /> : (
            <AnalyticsWidgetSummary
              title="Operations par type (Achat / Vente)"
             
              color="error"
              total={data.operations?.reduce((sum, o) => sum + o.count, 0) ?? 0}
              chart={{
                series: data.operations?.map(o => o.count) ?? [0],
                categories: data.operations?.map(o => o.type_op) ?? [''],
              }}
              icon={<img src="/assets/icons/glass/ic-glass-message.svg" alt="Operations" />}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="A revoir"
           
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
  <AnalyticsWebsiteVisits
    title="Histogramme des opérations"
    chart={{
      categories: [
        ...(data.operations?.map(o => o.type_op) ?? []), // types Brésil
        'Achat (Egypte)',
        'Vente (Egypte)',
      ],
      series: [
        {
          name: 'Nombre d’opérations',
          data: [
            ...(data.operations?.map(o => o.count) ?? []), // counts Brésil
            50, // Achat Egypte
            70, // Vente Egypte
          ],
        },
      ],
    }}
  />
</Grid>


        {/* <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        <Grid size={{ xs: 12, md: 6, lg: 20}}>
          <AnalyticsNews
  title="Marge par responsable"
  list={data.marges?.map(r => ({
    id: r.responsable,
    title: r.responsable,
    description: `Marge totale : ${r.total_marge}`,
    coverUrl: '/assets/icons/glass/ic-glass-buy.svg',
    postedAt: Date.now(), // ou une date réelle si tu en as
  })) ?? []}
/>



        </Grid>

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_traffic} />
        </Grid> */}

        <Grid size={{ xs: 12, md: 6, lg: 20}}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid>
      </Grid>
  );
}
