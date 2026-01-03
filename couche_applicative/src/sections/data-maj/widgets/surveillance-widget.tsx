import { red, green } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { API_KEY } from 'src/helpers/config';
import { DETECTION_FORME_OPTIONS } from 'src/_mytypes';
import { API_URL, handleAddGeneral } from 'src/helpers/post_functions';

// surveillance-widget.tsx
import { TableView } from '../data-table-view';
import General from '../../../services/General';

import type { FieldConfig } from '../add-item-dialog';
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


// Define fields for the "Nouveau" dialog
const SURVEILLANCE_ADD_FIELDS: FieldConfig[] = [
  { id: "drones_actifs", label: "Drones actifs", type: "number" },
  { id: "drones_panne", label: "Drones en panne", type: "number" },
  { id: "drones_rechargement", label: "Drones en rechargement", type: "number" },

  { id: "detection_incendie", label: "Détection incendie", type: "boolean" },

  { id: "detection_forme", label: "Forme détectée", type: "select", options: DETECTION_FORME_OPTIONS },

  { id: "audit_conformite", label: "Audit conformité", type: "boolean" },
];


export function SurveillanceView() {

    async function handleAdd(values: Partial<Surveillance>): Promise<void> {
    try {
      await handleAddGeneral({
        table: 'surveillance',  // maps to /write/surveillance
        values,
        apiUrl: API_URL,
        apiKey: API_KEY,
      });
      // optional: show a success toast or message
      console.log('Surveillance added successfully');
    } catch (err: any) {
      console.error('Failed to add surveillance:', err.message || err);
      // optional: show an error toast
    }
  }
  return (
    <TableView<Surveillance>
      title="Surveillance"
      fetchData={General.getSurveillance}   // fetch table data
      columns={SURVEILLANCE_COLUMNS}        // table columns
      nameField="zone"                       // used for filtering/search
      defaultOrderBy="zone"
      idField="zone"                         // unique ID
      addFields={SURVEILLANCE_ADD_FIELDS}    // dialog fields
      onAdd={handleAdd}                      // submit handler for dialog
    />
  );
}
