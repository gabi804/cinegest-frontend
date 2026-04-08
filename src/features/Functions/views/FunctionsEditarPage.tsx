import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FunctionsService } from '../services/FunctionsService';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { api } from 'src/shared/libs/nestAxios';

export default function FunctionsEditarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    movie: '',
    room: '',
    date: '',
    time: '',
    price: 0,
  });
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        // Cargar lista de películas y salas
        const mv = await api.get('/movie');
        setMovies(mv.data);
        const rm = await api.get('/rooms');
        setRooms(rm.data);

        // Cargar la función específica
        const resultado = await FunctionsService.obtenerFunctions();
        const func = resultado.find(f => f.id === Number(id));
        if (func) {
          setForm({
            movie: func.movie?.id || '',
            room: func.room?.id || '',
            date: func.date || '',
            time: func.time || '',
            price: func.price || 0,
          });
        } else {
          setSnack({ open: true, message: 'Función no encontrada', severity: 'error' });
        }
      } catch (e: any) {
        setSnack({ open: true, message: e?.message || 'Error al cargar la función', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!id) return;
    setSaving(true);
    try {
      await FunctionsService.actualizarFunction(Number(id), {
        movie: Number(form.movie),
        room: Number(form.room),
        date: form.date,
        time: form.time,
        price: Number(form.price),
      });
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
          <FormControl fullWidth>
            <InputLabel>Película</InputLabel>
            <Select
              value={form.movie}
              label="Película"
              name="movie"
              onChange={(e) => setForm({ ...form, movie: e.target.value })}
            >
              {movies.map(m => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sala</InputLabel>
            <Select
              value={form.room}
              label="Sala"
              name="room"
              onChange={(e) => setForm({ ...form, room: e.target.value })}
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
          />
          <TextField
            label="Hora"
            name="time"
            type="time"
            value={form.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Precio"
            name="price"
            type="number"
            value={form.price || 0}
            onChange={handleChange}
            fullWidth
          />

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
