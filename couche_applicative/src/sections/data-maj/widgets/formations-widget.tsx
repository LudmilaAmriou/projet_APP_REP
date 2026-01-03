import { API_KEY } from 'src/helpers/config';
import { SERVICE_OPTIONS } from 'src/_mytypes';
import { API_URL, handleAddGeneral } from 'src/helpers/post_functions';

import { TableView } from '../data-table-view';
import General from '../../../services/General';

import type { FieldConfig } from '../add-item-dialog';
import type { ColumnConfig } from '../dynamictable-row';
import type { Formations } from '../../../services/General';

const FORMATION_COLUMNS: ColumnConfig[] = [
  { id: 'nom_formation', label: 'Nom Formation', type: 'text' },
  { id: 'sujet', label: 'Sujet', type: 'text' },
  { 
    id: 'date_formation', 
    label: 'Date', 
    type: 'text' 
  },
  {
    id: 'pourcentage_engagement',
    label: 'Engagement (%)',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => {
        if (val < 50) return 'error';
        if (val < 75) return 'warning';
        return 'success';
      },
      format: (val: number) => `${val.toFixed(1)} %`,
    },
  },
  {
    id: 'pourcentage_satisfaction',
    label: 'Satisfaction (%)',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => {
        if (val < 50) return 'error';
        if (val < 75) return 'warning';
        return 'success';
      },
      format: (val: number) => `${val.toFixed(1)} %`,
    },
  },
  { id: 'mot_cle_formateur', label: 'Mot le plus utilisé (Formateur)', type: 'text' },
  { id: 'mot_cle_personnel', label: 'Mot le plus utilisé (Personnel)', type: 'text' }, 
];

const FORMATION_ADD_FIELDS: FieldConfig[] = [
  { id: 'nom_formation', label: 'Nom Formation', type: 'text' },
  { id: 'sujet', label: 'Sujet', type: "select", options: SERVICE_OPTIONS  },
  { id: 'date_formation', label: 'Date', type: 'date' },
  { id: 'pourcentage_engagement', label: 'Engagement (%)', type: 'number' },
  { id: 'pourcentage_satisfaction', label: 'Satisfaction (%)', type: 'number' },
];

export function FormationsView() {
    async function handleAdd(values: Partial<Formations>): Promise<Partial<Formations>> {
    // Generate unique ID if your backend requires it
    if (!values.id) {
      values.id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Send to backend; handleAddGeneral will normalize numbers/dates
    await handleAddGeneral({
      table: "formation",
      values,
      apiUrl: API_URL,
      apiKey: API_KEY,
    });

    console.log('Formation added successfully');
    
    return {
      ...values,
      id: values.id, // <-- use backend's returned unique identifier
    };
  }

  return (
    <TableView<Formations>
      tableName="formation"
      title="Formations"
      fetchData={General.getFormations}
      columns={FORMATION_COLUMNS}
      nameField="nom_formation"
      defaultOrderBy="nom_formation"
      addFields={FORMATION_ADD_FIELDS}
      onAdd={handleAdd}
    />
  );
}
