import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoviesService } from '../services/MoviesService';
import type { MovieUpdateDto } from '../types/MovieTypes';
import { Box, TextField, Button, Typography, Snackbar, Alert, Paper } from '@mui/material';

export default function MoviesEditarPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const movieId = Number(id);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState<number>(90);
  const [subtitled, setSubtitled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!movieId) {
      setSnack({ open: true, message: 'ID de película inválido', severity: 'error' });
      setLoading(false);
      return;
    }

    async function loadMovie() {
      try {
        const m = await MoviesService.obtenerMovie(movieId);
        if (!m) {
          setSnack({ open: true, message: 'Película no encontrada', severity: 'error' });
        } else {
          setTitle(m.title);
          setGenre(m.genre ?? '');
          setDuration(m.duration ?? 90);
          setSubtitled(!!m.subtitled);
        }
      } catch (e: any) {
        setSnack({ open: true, message: e?.message || 'Error al cargar la película', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [movieId]);

  async function handleSubmit() {
    if (!movieId) return;
    setSaving(true);
    try {
      const dto: MovieUpdateDto = { id: movieId, title: title.trim(), genre: genre.trim(), duration, subtitled };
      await MoviesService.actualizarMovie(movieId, dto);
      setSnack({ open: true, message: 'Película actualizada', severity: 'success' });
      setTimeout(() => navigate('/movies'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message || 'Error al actualizar la película', severity: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Typography sx={{ p: 4 }}>Cargando...</Typography>;

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: '#f0f4f8' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Editar Película
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Título" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
          <TextField label="Género" value={genre} onChange={e => setGenre(e.target.value)} fullWidth />
          <TextField
            label="Duración (min)"
            type="number"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            fullWidth
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input id="subtitled_edit" type="checkbox" checked={subtitled} onChange={e => setSubtitled(e.target.checked)} />
            <label htmlFor="subtitled_edit">Subtitulada</label>
          </Box>

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

            <Button
              variant="outlined"
              onClick={() => navigate('/movies')}
              sx={{ flex: 1 }}
            >
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
