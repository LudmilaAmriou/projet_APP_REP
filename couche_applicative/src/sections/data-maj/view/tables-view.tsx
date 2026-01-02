import type {  TableType } from 'src/_mytypes/_data';

// import JuridiqueWidgets from './widgets/JuridiqueWidgets';
// import DirectionWidgets from './widgets/DirectionWidgets';
// import AchatsWidgets from './widgets/AchatsWidgets';
// import InformatiqueWidgets from './widgets/InformatiqueWidgets';
// import CollecteWidgets from './widgets/CollecteWidgets';
// import AssistanceWidgets from './widgets/AssistanceWidgets';
// import { ServiceType } from './ServiceSelector';
import { ArticlesView } from '../widgets/articles-widget';
import { PersonnelView } from '../widgets/personnel-widget';
import { FormationsView } from '../widgets/formations-widget';
import { OperationsView } from '../widgets/operations-widget';
import { SurveillanceView } from '../widgets/surveillance-widget';

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
      return <OperationsView/>;
    case 'Surveillance':
      return <SurveillanceView />;
    case 'Formations':
      return <FormationsView />;
    default:
      return null;
  }
}

