import type { CountryType } from 'src/_mock/_data';

import { useState } from 'react';

import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';

import ServiceDashboard from './serviceDashboard';
import CountrySelector from '../country-selector';
import ServiceSelector, { ServiceType } from '../service-selector';

export function OverviewAnalyticsView() {
  const [service, setService] = useState<ServiceType>('Finance');
  const [country, setCountry] = useState<CountryType>('br');

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Bonjour, bienvenue de nouveau 👋
      </Typography>

      {/* Dropdown to switch services */}
      <ServiceSelector service={service} setService={setService} />

      {/* Dropdown to switch country */}
      <CountrySelector value={country} onChange={setCountry} />

      {/* Render the correct dashboard */}
      <ServiceDashboard service={service} country={country} />
    </DashboardContent>
  );
}
