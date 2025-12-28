import { useState, useEffect, useCallback, useMemo } from 'react';

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

import { UserTableHead } from '../table-head';
import { TableNoData } from '../table-no-data';
import General from '../../../services/General';
import { emptyRows, getComparator } from '../utils';
import { UserTableToolbar } from '../table-toolbar';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableRow, ColumnConfig } from '../dynamictable-row';

import type { Personnels } from '../../../services/General';

// Define column configuration
const PERSONNEL_COLUMNS: ColumnConfig[] = [
  {
    id: 'nom_prenom',
    label: 'Nom Complet',
    type: 'avatar',
  },
  {
    id: 'service',
    label: 'Service',
    type: 'text',
  },
  {
    id: 'etat',
    label: 'Etat',
    type: 'status',
    statusColors: {
      'actif': 'success',
      'inactif': 'error',
      'pause': 'warning',
    },
  },
  {
    id: 'frequence_cardiaque',
    label: 'Fréquence Cardiaque',
    align: 'center',
    type: 'badge',
    badgeConfig: {
      getColor: (rate: number) => {
        if (rate < 60) return 'info';
        if (rate > 100) return 'error';
        return 'success';
      },
      format: (rate: number) => `♥ ${rate} bpm`,
    },
  },
  {
    id: 'position',
    label: 'Position',
    type: 'text',
  },
];

export function PersonnelView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [personnels, setPersonnels] = useState<Personnels[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch personnel data
  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        setLoading(true);
        const data = await General.getPersonnel();
        console.log("Fetched personnels:", data);
        setPersonnels(data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching personnel:', err);
        setError('Failed to load personnel data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnels();
  }, []);

  // Filtered & sorted data
  const dataFiltered = useMemo(() => {
    const filtered = personnels.filter((p) =>
      p.nom_prenom.toLowerCase().includes(filterName.toLowerCase())
    );

    const comparator = getComparator(table.order, table.orderBy);
    return filtered.sort(comparator as any);
  }, [personnels, filterName, table.order, table.orderBy]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Personnel
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nouveau personnel
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={personnels.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    personnels.map((p) => p.id)
                  )
                }
                headLabel={[
                  { id: 'nom_prenom', label: 'Nom Complet' },
                  { id: 'service', label: 'Service' },
                  { id: 'etat', label: 'Etat' },
                  { id: 'frequence_cardiaque', label: 'Fréquence Cardiaque', align: 'center' },
                  { id: 'position', label: 'Position' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : (
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        columns={PERSONNEL_COLUMNS}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        nameField="nom_prenom"
                      />
                    ))
                )}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, personnels.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={personnels.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('nom_prenom');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    setSelected(checked ? newSelecteds : []);
  }, []);

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
  const onChangePage = useCallback((event: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}