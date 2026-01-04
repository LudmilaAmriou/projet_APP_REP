import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { API_KEY } from 'src/helpers/config';
import { API_URL, handleEditGeneral, handleDeleteGeneral } from 'src/helpers/post_functions';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { DynamicAddDialog, type FieldConfig } from './add-item-dialog';


// ----------------------------------------------------------------------

// Generic column configuration
export type ColumnConfig = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
  type?: 'text' | 'avatar' | 'status' | 'badge' | 'number' | 'custom';
  statusColors?: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'>;
  badgeConfig?: {
    getColor: (value: any) => string;
    format?: (value: any) => string;
  };
  
};

export type DynamicTableRowProps = {
  tableName: string;
  row: Record<string, any>;
  columns: ColumnConfig[];
  selected: boolean;
  onSelectRow: () => void;
  idField?: string;
  nameField?: string;
  avatarField?: string;
  onUpdate?: (id: string, updatedValues: Record<string, any>) => void;
  onDelete?: (id: string) => void;
  editFields?: FieldConfig[];
};


export function UserTableRow({ 
  tableName,
  row, 
  columns,
  selected, 
  onSelectRow,
  idField = 'id',
  nameField = 'name',
  avatarField = 'avatarUrl',
  onUpdate,
  onDelete,
  editFields,
  
}: DynamicTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [rowData, setRowData] = useState(row); // current row data



  const handleEdit = () => {
    setRowData(row); // load current row data
    setEditOpen(true);
    setOpenPopover(null);
  };

  const handleDelete = async () => {
  if (!window.confirm(`Supprimer ${row[nameField]} ?`)) return;
    if (rowData && rowData[idField]) {
      await handleDeleteGeneral({
        table: tableName, // <-- or dynamic
        id: rowData[idField],
        apiUrl: API_URL,
        apiKey: API_KEY || '',
      });

      // call parent callback if exists
      onDelete?.(rowData[idField]);
    }
  setOpenPopover(null);
};


  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleUpdateSubmit = async (values: Record<string, any>) => {

    if (rowData && rowData[idField]) {
      await handleEditGeneral({
        table: tableName, // <-- or pass dynamically from props if needed
        id: rowData[idField],
        values,
        apiUrl: API_URL,
        apiKey: API_KEY || '', // or however you store your key
      });

      setRowData(prev => ({ ...prev, ...values }));

      // call parent callback if exists
      onUpdate?.(rowData[idField], values);

      setEditOpen(false);
    }

};


  const renderCell = (column: ColumnConfig, value: any) => {
    // If custom render function provided, use it
    
    if (column.render) {
      return column.render(value, rowData);
    }

    // Handle different cell types
    switch (column.type) {
      case 'avatar':
        return (
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={value} src={row[avatarField]}>
              {value?.charAt(0)?.toUpperCase() || '?'}
            </Avatar>
            {value}
          </Box>
        );

      case 'status':
        { const statusColors = column.statusColors || {
          'actif': 'success',
          'active': 'success',
          'inactif': 'error',
          'inactive': 'error',
          'pause': 'warning',
          'en pause': 'warning',
        };
        const color = statusColors[value?.toLowerCase()] || 'default';
        return <Label color={color}>{value}</Label>; }

      case 'badge':
        if (column.badgeConfig) {
          const badgeColor = column.badgeConfig.getColor(value);
          const displayValue = column.badgeConfig.format 
            ? column.badgeConfig.format(value) 
            : value;
          return (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: `${badgeColor}.lighter`,
              }}
            >
              <span style={{ 
                color: badgeColor,
                fontWeight: 600,
              }}>
                {displayValue}
              </span>
            </Box>
          );
        }
        return value;

      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;

      case 'text':
      default:
        return value;
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {columns.map((column) => (
          <TableCell 
            key={column.id}
            align={column.align || 'left'}
            component={column.type === 'avatar' ? 'th' : undefined}
            scope={column.type === 'avatar' ? 'row' : undefined}
          >
            {renderCell(column, rowData[column.id])}
          </TableCell>
        ))}

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
              Modifier
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Supprimer
            </MenuItem>
        </MenuList>
      </Popover>

         {/* Edit Dialog */}
      {editFields && (
        <DynamicAddDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fields={editFields}
          initialValues={rowData}  // pass current row values
          onSubmit={handleUpdateSubmit}
        />
      )}

    </>
  );
}

