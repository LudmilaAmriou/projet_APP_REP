import type { TableType } from 'src/_mytypes/_data';

import { useState } from 'react';

import Box from '@mui/material/Box';

import TableSelector from 'src/sections/data-maj/data-selector';
import TablesView from 'src/sections/data-maj/view/tables-view';

export function OverviewTablesView() {
  const [tableType, setTableType] = useState<TableType>('Personnel');

  return (
    <Box
      sx={{
        maxWidth: 1200, 
        width: '100%',
        mx: 'auto', // center horizontally
        mb: 4, // spacing at bottom
      }}
    >
      {/* Dropdown to switch table types */}
   
    <TableSelector tableType={tableType} setTableType={setTableType} />
    


      {/* Table view corresponding to selected table type */}
      <TablesView tableType={tableType} />
    </Box>
  );
}
