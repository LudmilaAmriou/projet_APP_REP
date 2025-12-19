// ServiceSelector.tsx
import React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export type ServiceType =
  | 'Finance'
  | 'Juridique'
  | 'Direction générale'
  | 'Achats'
  | 'Informatique'
  | 'Collecte'
  | 'Assistance technique';

type Props = {
  service: ServiceType;
  setService: (service: ServiceType) => void;
};

export default function ServiceSelector({ service, setService }: Props) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Service</InputLabel>
      <Select
        value={service}
        label="Service"
        onChange={(e) => setService(e.target.value as ServiceType)}
      >
        <MenuItem value="Finance">Finance</MenuItem>
        <MenuItem value="Juridique">Juridique</MenuItem>
        <MenuItem value="Direction générale">Direction générale</MenuItem>
        <MenuItem value="Achats">Achats</MenuItem>
        <MenuItem value="Informatique">Informatique</MenuItem>
        <MenuItem value="Collecte">Collecte</MenuItem>
        <MenuItem value="Assistance technique">Assistance technique</MenuItem>
      </Select>
    </FormControl>
  );
}
