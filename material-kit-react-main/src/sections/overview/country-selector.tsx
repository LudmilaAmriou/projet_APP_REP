import React from 'react';

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Box } from '@mui/material';

import { _langs } from '../../_mock/_data';

import type { CountryType } from '../../_mock/_data';

type Props = {
  value: CountryType;
  onChange: (value: CountryType) => void;
};

export default function CountrySelector({ value, onChange }: Props) {
  const handleChange = (e: SelectChangeEvent<CountryType>) => {
    onChange(e.target.value as CountryType);
  };

  const current = _langs.find((c) => c.value === value);

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Pays</InputLabel>
      <Select
        value={value}
        label="Pays"
        onChange={handleChange}
        renderValue={() => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img
              src={current?.icon}
              alt={current?.label}
              style={{ width: 26, height: 20, objectFit: 'cover', borderRadius: 2 }}
            />
            {current?.label}
          </Box>
        )}
      >
        {_langs.map((c) => (
          <MenuItem
            key={c.value}
            value={c.value}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            <img
              src={c.icon}
              alt={c.label}
              style={{ width: 26, height: 20, objectFit: 'cover', borderRadius: 2 }}
            />
            {c.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
