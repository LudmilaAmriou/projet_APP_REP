import type {  TableType } from 'src/_mock/_data';
// import JuridiqueWidgets from './widgets/JuridiqueWidgets';
// import DirectionWidgets from './widgets/DirectionWidgets';
// import AchatsWidgets from './widgets/AchatsWidgets';
// import InformatiqueWidgets from './widgets/InformatiqueWidgets';
// import CollecteWidgets from './widgets/CollecteWidgets';
// import AssistanceWidgets from './widgets/AssistanceWidgets';
// import { ServiceType } from './ServiceSelector';

// TABLESVIEW.tsx
import React from 'react';

import { ArticlesView } from '../widgets/articles-widget';
import { PersonnelView } from '../widgets/personnel-widget';

type Props = {
  tableType: TableType;
};

export default function TablesView({ tableType }: Props) {
  switch (tableType) {
    case 'Personnel':
      return <PersonnelView />; 
    case 'Articles':
      return <ArticlesView />;
    case 'Operations':
      return null;
    case 'Surveillance':
      return null;
    case 'Formations':
      return null;
    default:
      return null;
  }
}

