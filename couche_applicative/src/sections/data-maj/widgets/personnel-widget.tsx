import React from 'react';

import { API_KEY } from 'src/helpers/config';
import { ETAT_OPTIONS, SERVICE_OPTIONS } from 'src/_mytypes/_data';
import { API_URL, handleAddGeneral } from 'src/helpers/post_functions';

import { TableView } from '../data-table-view';
import  General from '../../../services/General';

import type { FieldConfig } from '../add-item-dialog';
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


const PERSONNEL_ADD_FIELDS: FieldConfig[] = [
  { id: "nom_prenom", label: "Nom & Prénom", type: "text" },
  { id: "etat", label: "État", type: "select", options: ETAT_OPTIONS },
  { id: "service", label: "Service", type: "select", options: SERVICE_OPTIONS },
  { id: "frequence_cardiaque", label: "Fréquence cardiaque", type: "number" },
  { id: "position", label: "Position (lat,lon)", type: "text" },
];


export function PersonnelView() {

 async function handleAdd(values: Partial<Personnels>): Promise<Partial<Personnels>> {
    
  if (!values.id) {
      values.id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    const result = await handleAddGeneral({
      table: 'personnel',
      values,
      apiUrl: API_URL,
      apiKey: API_KEY,
    });
   console.log('Personnel added successfully');

   return {
    ...values,
    id: result.id, // <-- use backend's returned unique identifier
  };

   
}


  return (
      <TableView<Personnels>
      tableName="personnel"
      title="Personnels"
      fetchData={General.getPersonnel}
      columns={PERSONNEL_COLUMNS}
      nameField="nom_prenom"
      defaultOrderBy="nom_prenom"
      addFields={PERSONNEL_ADD_FIELDS}
      onAdd={handleAdd}
    />
  );
}
