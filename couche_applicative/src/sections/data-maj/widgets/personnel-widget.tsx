import React from 'react';

import { TableView } from '../data-table-view';
import  General from '../../../services/General';

import type { ColumnConfig } from '../dynamictable-row';
import type { Personnels } from '../../../services/General';

const PERSONNEL_COLUMNS: ColumnConfig[] = [
  { id: 'nom_prenom', label: 'Nom Complet', type: 'avatar' },
  { id: 'service', label: 'Service', type: 'text' },
  { 
    id: 'etat', 
    label: 'Etat', 
    type: 'status', 
    statusColors: {
      actif: 'success',
      repos: 'warning',
      'arrêt maladie': 'error',
      congé: 'info',
    },
  },
  { 
    id: 'frequence_cardiaque', 
    label: 'Fréquence Cardiaque', 
    type: 'badge',
    badgeConfig: {
      getColor: (rate: number) => rate < 60 ? 'info' : rate > 100 ? 'error' : 'success',
      format: (rate: number) => `♥ ${rate} bpm`,
    },
  },
  { id: 'position', label: 'Position', type: 'text' },
];

export function PersonnelView() {
  return (
    <TableView<Personnels>
      title="Personnel"
      fetchData={General.getPersonnel}
      columns={PERSONNEL_COLUMNS}
      nameField="nom_prenom"
      defaultOrderBy="nom_prenom"
    />
  );
}
