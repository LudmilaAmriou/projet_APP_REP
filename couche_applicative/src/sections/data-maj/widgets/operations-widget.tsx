import { TYPE_OPERATION_OPTIONS } from 'src/_mytypes/_data';

import { TableView } from '../data-table-view';
import General from '../../../services/General';

import type { FieldConfig } from '../add-item-dialog';
import type { ColumnConfig } from '../dynamictable-row';
import type { Operations } from '../../../services/General';

const OPERATION_COLUMNS: ColumnConfig[] = [
  { id: 'id', label: 'ID', type: 'text' },
  { id: 'type_op', label: 'Type Op.', type: 'text' },
  {
    id: 'responsable_name',
    label: 'Responsable'
  },
  {
    id: 'marge',
    label: 'Marge',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => {
        if (val < 500) return 'error';
        if (val < 1000) return 'warning';
        return 'success';
      },
      format: (val: number) => `${val} €`,
    },
  },
  {
    id: 'km_parcourus',
    label: 'KM',
    type: 'badge',
    align: 'center',
    badgeConfig: {
      getColor: (val: number) => {
        if (val < 50) return 'error';
        if (val < 200) return 'warning';
        return 'success';
      },
      format: (val: number) => `${val} km`,
    },
  },
  {
    id: 'mot_cle_client',
    label: 'Mot le plus utilisé-Client',
    type: 'text',
  },
  {
    id: 'mot_cle_responsable',
    label: 'Mot le plus utilisé-Responsable',
    type: 'text',
  },
];

const OPERATION_ADD_FIELDS: FieldConfig[] = [
  { id: "type_op", label: "Type d’opération", type: "select", options: TYPE_OPERATION_OPTIONS },
  { id: "responsable_id", label: "Responsable (ID personnel)", type: "text" },
  { id: "marge", label: "Marge", type: "number" },
  { id: "km_parcourus", label: "KM parcourus", type: "number" },
  { id: "mot_cle_responsable", label: "Mot-clé responsable", type: "text" },
  { id: "mot_cle_client", label: "Mot-clé client", type: "text" },
];


export function OperationsView() {
  function handleAdd(values: Partial<Operations>): Promise<void> {
    throw new Error('Function not implemented.');
  }

  return (
    <TableView<Operations>
      title="Opérations"
      fetchData={General.getOperations}
      columns={OPERATION_COLUMNS}
      nameField="id"
      defaultOrderBy="id" 
      addFields={OPERATION_ADD_FIELDS}
      onAdd={handleAdd}
    />
  );
}
