import { useState, useEffect, useMemo, useCallback } from 'react';

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
import { emptyRows, getComparator } from './utils';
import { UserTableToolbar } from './table-toolbar';
import { TableEmptyRows } from './table-empty-rows';
import { UserTableRow, ColumnConfig } from './dynamictable-row';

type TableViewProps<T> = {
  title: string;
  fetchData: () => Promise<T[]>;
  columns: ColumnConfig[];
  nameField: keyof T;
  defaultOrderBy: keyof T;
  idField?: keyof T; // optional, default 'id'
};

export function TableView<T extends Record<string, any>>({
  title,
  fetchData,
  columns,
  nameField,
  defaultOrderBy,
  idField = 'id',
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
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchData();
        console.log('Fetched data:', data); // debug
        setRows(data || []);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchData]);

  const dataFiltered = useMemo(() => {
    const filtered = rows.filter((r) =>
      String(r[nameField]).toLowerCase().includes(filterName.toLowerCase())
    );
    const comparator = getComparator(order, orderBy as string);
    return filtered.sort(comparator as any);
  }, [rows, filterName, order, orderBy, nameField]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          Nouveau
        </Button>
      </Box>

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
                        key={getRowId(row)}
                        row={row}
                        columns={columns}
                        selected={selected.includes(getRowId(row))}
                        onSelectRow={() => onSelectRow(getRowId(row))}
                        nameField={nameField as string}
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
