import { useState } from "react";
import { MoviesService } from "../services/MoviesService";
import type { MovieCreateDto } from "../types/MovieTypes";
import { Box, Button, TextField, Typography, Snackbar, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MoviesCrearPage() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState<number | string>(0);
  const [subtitled, setSubtitled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  function validate() {
    if (!String(title).trim()) return 'El título es obligatorio';
    if (!String(genre).trim()) return 'El género es obligatorio';
    const d = Number(duration);
    if (!d || d <= 0) return 'Duración inválida';
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) return setSnack({ open: true, message: err, severity: 'error' });
    setLoading(true);
    try {
    const dto: MovieCreateDto = { title: title.trim(), genre: genre.trim(), duration: Number(duration), subtitled };
      await MoviesService.crearMovie(dto);
      setSnack({ open: true, message: 'Película creada', severity: 'success' });
      setTimeout(() => navigate('/movies'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? 'Error al crear película', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Crear Película
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Género"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Duración (min)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input id="subtitled" type="checkbox" checked={subtitled} onChange={e => setSubtitled(e.target.checked)} />
            <label htmlFor="subtitled">Subtitulada</label>
          </Box>
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
        </Box>
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

