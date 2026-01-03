import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserTableHead } from './table-head';
import { TableNoData } from './table-no-data';
import { UserTableRow } from './dynamictable-row';
import { emptyRows, getComparator } from './utils';
import { UserTableToolbar } from './table-toolbar';
import { TableEmptyRows } from './table-empty-rows';
import { DynamicAddDialog } from './add-item-dialog';

import type { FieldConfig } from './add-item-dialog';
import type { ColumnConfig } from './dynamictable-row';

type TableViewProps<T> = {
  tableName: string;
  title: string;
  fetchData: () => Promise<T[]>;
  columns: ColumnConfig[];
  nameField: keyof T;
  defaultOrderBy: keyof T;
  idField?: keyof T; // default 'id'
  addFields?: FieldConfig[]; // dynamic fields for the dialog
  onAdd?: (values: Partial<T>) => Promise<Partial<T>>; // optional add handler
};

export function TableView<T extends Record<string, any>>({
  tableName,
  title,
  fetchData,
  columns,
  nameField,
  defaultOrderBy,
  idField = 'id',
  addFields,
  onAdd,
}: TableViewProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);
  const [rows, setRows] = useState<T[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // get string ID from row
  const getRowId = useCallback((row: T) => String(row[idField]), [idField]);

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id as keyof T);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds: string[]) => {
      setSelected(checked ? newSelecteds : []);
    },
    []
  );
  const handleUpdateRow = (id: string, updatedValues: Record<string, any>) => {
    setRows((prev) =>
      prev.map((row) => (getRowId(row) === id ? { ...row, ...updatedValues } : row))
    );
  }
  const handleDeleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];
      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  // fetch data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData();
      setRows(data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dataFiltered = useMemo(() => {
    const filtered = rows.filter((r) =>
      String(r[nameField]).toLowerCase().includes(filterName.toLowerCase())
    );
    const comparator = getComparator(order, orderBy as string);
    return filtered.sort(comparator as any);
  }, [rows, filterName, order, orderBy, nameField]);

  const notFound = !dataFiltered.length && !!filterName;

  // handle add
  const handleAddNew = async (values: Partial<T>) => {
  try {
    if (!onAdd) return;
    
    const newRow = await onAdd(values); // now returns the row with key
    if (!newRow) {
      console.warn("No row returned from onAdd");
      setDialogOpen(false);
      return;
    }

    setRows(prev => [...prev, newRow as T]); // add immediately
    setDialogOpen(false);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {addFields && onAdd && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setDialogOpen(true)}
          >
            Nouveau
          </Button>
        )}
      </Box>

      {addFields && onAdd && (
        <DynamicAddDialog<T>
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fields={addFields}
          initialValues={{}}
          onSubmit={handleAddNew}
        />
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy as string}
                rowCount={rows.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(checked, rows.map(getRowId))
                }
                headLabel={[...columns.map((c) => ({ id: c.id, label: c.label })), { id: '' }]}
              />

              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 20 }}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        tableName={tableName}
                        key={getRowId(row)}
                        row={row}
                        columns={columns}
                        selected={selected.includes(getRowId(row))}
                        onSelectRow={() => onSelectRow(getRowId(row))}
                        nameField={nameField as string}
                        onUpdate={handleUpdateRow} // updates row in state
                        onDelete={handleDeleteRow} // deletes row from state
                        editFields={addFields}
                      />

                    ))
                )}

                <TableEmptyRows height={68} emptyRows={emptyRows(page, rowsPerPage, rows.length)} />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
