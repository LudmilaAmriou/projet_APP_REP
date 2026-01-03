import { useState } from 'react';

import {
  Box,
  Grid,
  Dialog,
  Button,
  Switch,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';

export type FieldConfig = {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: string[];
};

type DynamicAddDialogProps<T> = {
  open: boolean;
  onClose: () => void;
  fields: FieldConfig[];
  onSubmit: (values: Partial<T>) => Promise<void>;
};

export function DynamicAddDialog<T>({
  open,
  onClose,
  fields,
  onSubmit,
}: DynamicAddDialogProps<T>) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [snackbar, setSnackbar] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

const handleSubmit = async () => {
  try {
    await onSubmit(values as Partial<T>);
    setValues({});
    setSnackbar({ msg: 'Ajout effectué avec succès 🎉', severity: 'success' });
    onClose();
  } catch (err: any) {
    console.error('Full error object:', err);
    const message = err?.message || JSON.stringify(err) || 'Erreur lors de l’ajout ❌';
    setSnackbar({ msg: message, severity: 'error' });
  }
};


  const renderField = (f: FieldConfig) => {
    // BOOLEAN FIELD
    if (f.type === 'boolean') {
      return (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <FormControlLabel
            label={f.label}
            control={
              <Switch
                checked={!!values[f.id]}
                onChange={e => handleChange(f.id, e.target.checked)}
              />
            }
          />
        </Box>
      );
    }

    // SELECT / ENUM FIELD
    if (f.type === 'select') {
      return (
        <TextField
          fullWidth
          label={f.label}
          select
          value={values[f.id] ?? ''}
          onChange={e => handleChange(f.id, e.target.value)}
        >
          {f.options?.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    // DEFAULT INPUT FIELD
    return (
      <TextField
        fullWidth
        label={f.label}
        type={f.type ?? 'text'}
        value={values[f.id] ?? ''}
        onChange={e => handleChange(f.id, e.target.value)}
      />
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un nouvel élément</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {fields.map(f => (
              <Grid size={{ xs: 12, sm: 6 }} key={f.id}>
                {renderField(f)}
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Snackbar for success/error feedback --- */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar?.severity} sx={{ width: '100%' }}>
          {snackbar?.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
