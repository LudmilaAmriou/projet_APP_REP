import type { TableType } from 'src/_mock/_data';

// TableSelector.tsx
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type Props = {
  tableType: TableType;
  setTableType: (type: TableType) => void;
};

export default function TableSelector({ tableType, setTableType }: Props) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Table</InputLabel>
      <Select
        value={tableType}
        label="Table"
        onChange={(e) => setTableType(e.target.value as TableType)}
      >
        <MenuItem value="Personnel">Personnel</MenuItem>
        <MenuItem value="Operations">Operations</MenuItem>
        <MenuItem value="Surveillance">Surveillance</MenuItem>
        <MenuItem value="Formations">Formations</MenuItem>
        <MenuItem value="Articles">Articles</MenuItem>
      </Select>
    </FormControl>
  );
}
