
import { TableView } from '../data-table-view';
import General from '../../../services/General';

import type { ColumnConfig } from '../dynamictable-row';
import type { Articles } from '../../../services/General';

const ARTICLE_COLUMNS: ColumnConfig[] = [
  { id: 'id', label: 'ID', type: 'text' },
  { id: 'zone', label: 'Zone', type: 'text' },
  { id: 'etat_emballage', label: 'État Emballage', type: 'status',
    statusColors: {
      'correct': 'success',
      'déformé': 'error'
    }, },
  { id: 'responsable_name', label: 'Responsable', type: 'text' },
  { id: 'position', label: 'Position', type: 'text' },
  { id: 'collisions', label: 'Collisions', type: 'badge' },
];

export function ArticlesView() {
  return (
    <TableView<Articles>
      title="Articles"
      fetchData={General.getArticles}
      columns={ARTICLE_COLUMNS}
      nameField="zone"
      defaultOrderBy="id"
    />
  );
}
