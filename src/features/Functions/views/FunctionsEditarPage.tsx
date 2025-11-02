import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FunctionsService } from '../services/FunctionsService';
import type { FunctionEntity } from '../types/FunctionTypes';
import { Box, TextField, Button, Typography, Paper, Snackbar, Alert } from '@mui/material';

export default function FunctionsEditarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<FunctionEntity>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    async function fetchFunction() {
      if (!id) return;
      try {
        const resultado = await FunctionsService.obtenerFunctions();
        const func = resultado.find(f => f.id === Number(id));
        if (func) setForm(func);
        else setSnack({ open: true, message: 'Función no encontrada', severity: 'error' });
      } catch (e: any) {
        setSnack({ open: true, message: e?.message || 'Error al cargar la función', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchFunction();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!id) return;
    setSaving(true);
    try {
      await FunctionsService.actualizarFunction(Number(id), form);
      setSnack({ open: true, message: 'Función actualizada', severity: 'success' });
      setTimeout(() => navigate('/functions'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message || 'Error al actualizar función', severity: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Typography sx={{ p: 4 }}>Cargando...</Typography>;

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: '#f0f4f8' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Editar Función
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Movie ID" name="movie" value={form.movie || ''} onChange={handleChange} fullWidth />
          <TextField label="Room ID" name="room" value={form.room || ''} onChange={handleChange} fullWidth />
          <TextField label="Fecha" name="date" value={form.date || ''} onChange={handleChange} fullWidth />
          <TextField label="Hora" name="time" value={form.time || ''} onChange={handleChange} fullWidth />
          <TextField label="Precio" name="price" type="number" value={form.price || 0} onChange={handleChange} fullWidth />
          <TextField label="Asientos disponibles" name="availableSeats" type="number" value={form.availableSeats || 0} onChange={handleChange} fullWidth />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(33,203,243,0.4)',
                '&:hover': { boxShadow: '0 6px 20px rgba(33,203,243,0.6)', transform: 'translateY(-2px)' },
                transition: '0.3s'
              }}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/functions')} sx={{ flex: 1 }}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
