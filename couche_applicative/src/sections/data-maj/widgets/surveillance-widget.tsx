import { green, red } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// surveillance-widget.tsx
import { TableView } from '../data-table-view';
import General from '../../../services/General';

import type { ColumnConfig } from '../dynamictable-row';
import type { Surveillance } from '../../../services/General';


const SURVEILLANCE_COLUMNS: ColumnConfig[] = [
  { id: 'zone', label: 'Zone', type: 'text' },

  {
    id: 'drones_actifs',
    label: 'Drones Actifs',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => {
        if (val === 0) return 'error';
        if (val < 5) return 'warning';
        return 'success';
      },
    },
  },
  {
    id: 'drones_panne',
    label: 'Drones en Panne',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => (val > 0 ? 'error' : 'success'),
    },
  },
  {
    id: 'drones_rechargement',
    label: 'Drones en Rechargement',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => (val > 0 ? 'warning' : 'success'),
    },
  },

  {
    id: 'detection_incendie',
    label: 'Détection Incendie',
    type: 'custom', // use custom render
    align: 'center',
    render: (val: boolean) =>
      val ? <CheckCircleIcon sx={{ color: green[500] }} /> : <CancelIcon sx={{ color: red[500] }} />,
  },
  { id: 'detection_forme', label: 'Forme Détectée', type: 'text' },
  {
    id: 'audit_conformite',
    label: 'Audit Conformité',
    type: 'custom',
    align: 'center',
    render: (val: boolean) =>
      val ? <CheckCircleIcon sx={{ color: green[500] }} /> : <CancelIcon sx={{ color: red[500] }} />,
  },
];

export function SurveillanceView() {
  return (
    <TableView<Surveillance>
      title="Surveillance"
      fetchData={General.getSurveillance}
      columns={SURVEILLANCE_COLUMNS}
      nameField="zone"
      defaultOrderBy="zone"
      idField="zone" // use zone as unique ID
    />
  );
}
