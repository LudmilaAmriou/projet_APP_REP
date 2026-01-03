
import { API_KEY } from 'src/helpers/config';
import { ETAT_EMBALLAGE_OPTIONS } from 'src/_mytypes';
import { API_URL, handleAddGeneral } from 'src/helpers/post_functions';

import { TableView } from '../data-table-view';
import General from '../../../services/General';

import type { FieldConfig } from '../add-item-dialog';
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

const ARTICLE_ADD_FIELDS: FieldConfig[] = [
  { id: "zone", label: "Zone", type: "number" },
  { id: "etat_emballage", label: "État emballage", type: "select", options: ETAT_EMBALLAGE_OPTIONS },
  { id: "responsable_id", label: "Responsable (Numéro de sécurité sociale)", type: "text" },
  { id: "position", label: "Position (x,y,z)", type: "text" },
  { id: "rotation", label: "Rotation (x,y,z)", type: "text" },
  { id: "collisions", label: "Collisions", type: "number" },
];


export function ArticlesView() {
    async function handleAdd(values: Partial<Articles>): Promise<Partial<Articles>> {

    
    const result = await handleAddGeneral({
      table: "article",
      values,
      apiUrl: API_URL,
      apiKey: API_KEY,
    });

    console.log('Article added successfully');

    return {
      ...values,
      id: result.id, // <-- use backend's returned unique identifier
    };
  }

  return (

    <TableView<Articles>
      tableName="article"
       title="Articles"
      fetchData={General.getArticles}
      columns={ARTICLE_COLUMNS}
      nameField="zone"
      defaultOrderBy="id"
      addFields={ARTICLE_ADD_FIELDS}
      onAdd={handleAdd}
    />
  );
}
