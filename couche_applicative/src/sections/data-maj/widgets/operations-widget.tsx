import { TableView } from '../data-table-view';
import General from '../../../services/General';

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

export function OperationsView() {
  return (
    <TableView<Operations>
      title="Opérations"
      fetchData={General.getOperations}
      columns={OPERATION_COLUMNS}
      nameField="id"
      defaultOrderBy="id" 
    />
  );
}
