import type { CountryType } from 'src/_mock/_data';

// ServiceDashboard.tsx
import React from 'react';

import FinanceWidgets from '../widgets/FinanceWidgets';

// import JuridiqueWidgets from './widgets/JuridiqueWidgets';
// import DirectionWidgets from './widgets/DirectionWidgets';
// import AchatsWidgets from './widgets/AchatsWidgets';
// import InformatiqueWidgets from './widgets/InformatiqueWidgets';
// import CollecteWidgets from './widgets/CollecteWidgets';
// import AssistanceWidgets from './widgets/AssistanceWidgets';
// import { ServiceType } from './ServiceSelector';
import type { ServiceType } from '../service-selector';

type Props = {
  service: ServiceType;
  country: CountryType; // <- add country
};

export default function ServiceDashboard({ service, country }: Props) {
  switch (service) {
    case 'Finance':
      return <FinanceWidgets country={country} />; // pass country to widgets
    case 'Juridique':
      return null;
    case 'Direction générale':
      return null;
    case 'Achats':
      return null;
    case 'Informatique':
      return null;
    case 'Collecte':
      return null;
    case 'Assistance technique':
      return null;
    default:
      return null;
  }
}

