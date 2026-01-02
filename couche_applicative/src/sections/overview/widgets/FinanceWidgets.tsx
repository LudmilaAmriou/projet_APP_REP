import type { MaxKmType, OldestDroneType, MargeType, OperationType, MaxKmTypeSource } from 'src/services/FinanceService';

// FinanceWidgets.tsx
import { JSX, useEffect, useState } from 'react';

import { Box, Grid, CircularProgress } from '@mui/material';

import financeService from 'src/services/FinanceService';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

type DataState = {
  maxKm: MaxKmType | null;
  oldestDrone: OldestDroneType | null;
  marges: MargeType[] | null;
  operations: OperationType[] | null;
  maxKmParSource: MaxKmTypeSource[] | null;
};


export default function FinanceWidgets(): JSX.Element {
  const [data, setData] = useState<DataState>({
    maxKm: null,
    oldestDrone: null,
    marges: null,
    operations: null,
    maxKmParSource: null,
  });

  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    async function loadData() {
      try {
        const [maxKm, oldestDrone, marges, operations, maxKmParSource] = await Promise.all([
          financeService.getMaxKm(),
          financeService.getOldestDrone(),
          financeService.getMargeParResponsable(),
          financeService.getOperationsParType(),
          financeService.getMaxKmParSource(),
        ]);

        // console.log("=== FINANCE WIDGET RAW DATA ===");
        // console.log("maxKm =>", maxKm);
        // console.log("oldestDrone =>", oldestDrone);
        // console.log("marges =>", marges);
        // console.log("operations =>", operations);
        // console.log("maxKmParSource =>", maxKmParSource);
        // console.log("================================");

        setData({ maxKm, oldestDrone, marges, operations, maxKmParSource });
      } catch (err) {
        console.error("Error fetching finance data:", err);
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
               title={`Max Kms totaux parcourus par : ${data.maxKm?.responsable ?? ''}`}
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
                categories: data.marges?.map(r => r.responsable_name) ?? [''],
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


      
    
          <Grid size={{ xs: 12, md: 6, lg: 12 }}>
         
          <AnalyticsWebsiteVisits
            title="Histogramme des opérations"
            chart={{
              // X-axis: all unique operation types
              categories: [...new Set(data.operations?.map(o => o.type_op) ?? [])],
              
              // Series: one per country
              series: (() => {
                const types = [...new Set(data.operations?.map(o => o.type_op) ?? [])];
                const countries = [...new Set(data.operations?.map(o => o.source) ?? [])];

                return countries.map(source => ({
                  name: source, // use 'source' here
                  data: types.map(type => {
                    const op = data.operations?.find(
                      o => o.source === source && o.type_op === type
                    );
                    return op ? op.count : 0;
                  }),
                }));

              })(),
            }}
          />
        </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 9 }}>
          <AnalyticsCurrentVisits
            title="Répartition du maximum de kms par responsable et par source"
            chart={{
              series: data.maxKmParSource?.map(d => ({ label: d.responsable_name, value: Number(d.max_km ?? 0) })) ?? [],
            }}
          />
        </Grid>
            
        <Grid size={{ xs: 12, md: 6, lg: 3}}>
          <AnalyticsTrafficBySite
            title="Maximum de Km parcourus par Pays"
            list={(data.maxKmParSource
              ?.map((r) => ({
                value: (r.responsable_name), // convert to string
                label: r.source, // country label, matches _langs.label
                total: Number(r.max_km ?? 0),
              }))
              .sort((a, b) => b.total - a.total)) ?? [] // provide default empty array
            }
          />
        </Grid>


          <Grid size={{ xs: 12, md: 6, lg: 12}}>
          <AnalyticsNews
            title="Marge par responsable"
            list={data.marges?.map(r => ({
              id: r.responsable_name,
              title: r.responsable_name,
              description: `Marge totale : ${r.total_marge}`,
              coverUrl: '/assets/icons/glass/ic-glass-buy.svg',
              source: r.source, 
          })) ?? []}
        />
        </Grid>





          {/* <Grid size={{ xs: 4, md: 1, lg: 8 }}>
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
        
 

      

        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}
        


        {/* <Grid size={{ xs: 12, md: 6, lg: 20}}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
  );
}
