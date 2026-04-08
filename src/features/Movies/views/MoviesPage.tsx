import { useEffect, useState } from 'react';
import { MoviesService } from '../services/MoviesService';
import type { Movie } from '../types/MovieTypes';
import { Box, Typography, Paper, Button, IconButton, Snackbar, Alert, Chip, TextField } from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const displayedMovies = (showInactive
    ? allMovies.filter(m => !m.active)
    : allMovies.filter(m => m.active))
    .filter(m => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return m.title.toLowerCase().includes(query)
        || m.genre.toLowerCase().includes(query)
        || `${m.id}`.includes(query);
    });

  async function load() {
    const data = await MoviesService.obtenerMovies();
    setAllMovies(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    try {
      await MoviesService.eliminarMovie(id);
      setAllMovies(prev =>
        prev.map(m => m.id === id ? { ...m, active: false } : m)
      );
      setSnack({ open: true, message: 'Película marcada como inactiva', severity: 'success' });
    } catch (e: any) {
      setSnack({ open: true, message: e?.message || 'Error al eliminar película', severity: 'error' });
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>Películas</Typography>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            color: '#fff',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            boxShadow: '0 4px 15px rgba(33,203,243,0.4)',
            transition: '0.3s',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(33,203,243,0.6)',
              transform: 'translateY(-2px)',
            },
          }}
          onClick={() => navigate('crear')}
        >
          Crear Película
        </Button>
      </Box>

      {/* Filtro para mostrar inactivos */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip
          icon={showInactive ? <VisibilityOff /> : <Visibility />}
          label={showInactive ? 'Mostrando inactivas' : 'Mostrando activas'}
          onClick={() => {
            setShowInactive(!showInactive);
            setSearchTerm('');
          }}
          variant={showInactive ? 'filled' : 'outlined'}
          color={showInactive ? 'error' : 'primary'}
          sx={{ fontWeight: 600 }}
        />
        {showInactive && (
          <TextField
            label="Buscar (título/ID)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
          />
        )}
      </Box>

      {displayedMovies.length === 0 ? (
        <Typography variant="h6" sx={{ color: '#555' }}>
          No hay {showInactive ? 'películas inactivas' : 'películas cargadas'}.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
          {displayedMovies.map((m) => (
            <Paper
              key={m.id}
              sx={{
                p: 3,
                borderRadius: 3,
                background: showInactive
                  ? 'linear-gradient(135deg, #ffebee, #ffcdd2)'
                  : 'linear-gradient(135deg, #ffffff, #e3f2fd)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                },
                opacity: showInactive ? 0.7 : 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {m.title}
              </Typography>
              <Typography sx={{ mb: 1 }}>Género: {m.genre}</Typography>
              <Typography sx={{ mb: 1 }}>Duración: {m.duration} min</Typography>
              <Typography sx={{ mb: 2 }}>Subtitulada: {m.subtitled ? 'Sí' : 'No'}</Typography>

              {!showInactive && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    color="primary"
                    sx={{ '&:hover': { color: '#1976d2' } }}
                    onClick={() => navigate(`editar/${m.id}`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(m.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
