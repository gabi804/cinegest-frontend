import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FunctionsService } from '../services/FunctionsService';
import type { FunctionCrearDto } from '../types/FunctionTypes';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Typography,
  Paper
} from '@mui/material';
import { api } from 'src/shared/libs/nestAxios';

export default function FunctionsCrearPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FunctionCrearDto>({
    movie: '',
    room: '',
    date: '',
    time: '',
    price: 0,
  });
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    async function fetchLists() {
      try {
        const mv = await api.get('/movie');
        // show only active movies when creating a function
        const activeMovies = (mv.data || []).filter((m: any) => m.active !== false);
        setMovies(activeMovies);
        const rm = await api.get('/rooms');
        setRooms(rm.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchLists();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.movie || !form.room) {
      return setSnack({ open: true, message: 'Seleccionar película y sala', severity: 'error' });
    }
    setLoading(true);
    try {
      await FunctionsService.crearFunction({ ...form, movie: Number(form.movie), room: Number(form.room) });
      setSnack({ open: true, message: 'Función creada', severity: 'success' });
      setTimeout(() => navigate('/functions'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? 'Error al crear función', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Crear Función
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Película</InputLabel>
          <Select
            value={form.movie}
            label="Película"
            onChange={(e) => setForm({ ...form, movie: Number(e.target.value) })}
          >
            {movies.map(m => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Sala</InputLabel>
          <Select
            value={form.room}
            label="Sala"
            onChange={(e) => setForm({ ...form, room: Number(e.target.value) })}
          >
            {rooms.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField
          label="Fecha"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Hora"
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Precio"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Seat capacity is defined on the Room entity; functions use their room's capacity */}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            color: '#fff',
            fontWeight: 600,
            py: 1.5,
            boxShadow: '0 4px 15px rgba(33,203,243,0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(33,203,243,0.6)',
              transform: 'translateY(-2px)',
            },
            transition: '0.3s'
          }}
        >
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
