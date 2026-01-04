import type {  ServiceType } from 'src/_mytypes/_data';

import { useState } from 'react';

import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import ServiceDashboard from './serviceDashboard';
import ServiceSelector from '../service-selector';

export function OverviewAnalyticsView() {
  const [service, setService] = useState<ServiceType>('Finance');
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Bonjour, bienvenue de nouveau 👋
      </Typography>

      {/* Dropdown to switch services */}
      <ServiceSelector service={service} setService={setService} />


      {/* Render the correct dashboard */}
      <ServiceDashboard service={service} />
    </DashboardContent>
  );
}
