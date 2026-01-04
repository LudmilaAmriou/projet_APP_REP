import type { TableType } from 'src/_mytypes/_data';

// TableSelector.tsx
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

type Props = {
  tableType: TableType;
  setTableType: (type: TableType) => void;
};

export default function TableSelector({ tableType, setTableType }: Props) {
  return (
    <FormControl fullWidth sx={{ mt: 2, mr: 1, mb: 3, ml: 1 }}>
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
