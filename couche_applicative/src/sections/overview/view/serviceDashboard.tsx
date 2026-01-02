import type {  ServiceType } from 'src/_mytypes/_data';

import React from 'react';

import { ComingSoonView } from 'src/sections/error';

import DGWidgets from '../widgets/DGWidgets';
import AchatWidgets from '../widgets/AchatWidgets';
import FinanceWidgets from '../widgets/FinanceWidgets';
import CollecteWidgets from '../widgets/CollecteWidgets';
import InformatiqueWidgets from '../widgets/Informatique';
import JuridiqueWidgets from '../widgets/JuridiqueWidgets';

type Props = {
  service: ServiceType;

};

export default function ServiceDashboard({ service }: Props) {
  switch (service) {
    case 'Finance':
      return <FinanceWidgets />;
    case 'Juridique':
      return <JuridiqueWidgets />;;
    case 'Direction générale':
      return <DGWidgets />;
    case 'Achats':
      return <AchatWidgets />;
    case 'Informatique':
      return <InformatiqueWidgets />;
    case 'Collecte':
      return <CollecteWidgets />;
    case 'Assistance technique':
      return <ComingSoonView />;
    default:
      return null;
  }
}

