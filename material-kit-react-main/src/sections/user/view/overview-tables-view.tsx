import type { TableType } from 'src/_mock/_data';

import { useState } from 'react';

import Box from '@mui/material/Box';

import TableSelector from 'src/sections/user/data-selector';
import TablesView from 'src/sections/user/view/tables-view';

export function OverviewTablesView() {
  const [tableType, setTableType] = useState<TableType>('Personnel');

  return (
    <Box
      sx={{
        maxWidth: 1200, // same as your table container width
        width: '100%',
        mx: 'auto', // center horizontally
        mb: 4, // spacing at bottom
      }}
    >
      {/* Dropdown to switch table types */}
      <Box sx={{ mb: 2, width: '100%' }}>
        <TableSelector tableType={tableType} setTableType={setTableType} />
      </Box>

      {/* Table view corresponding to selected table type */}
      <TablesView tableType={tableType} />
    </Box>
  );
}
