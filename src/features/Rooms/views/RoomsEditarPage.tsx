import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomsService } from "../services/RoomsService";
import type { Room } from "../types/RoomTypes";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";

export default function RoomsEditarPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Partial<Room>>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRoom() {
      if (!id) return;
      try {
        const rooms = await RoomsService.obtenerRooms();
        const found = rooms.find((r) => r.id === Number(id));
        if (found) setForm(found);
      } catch (error) {
        console.error("Error al cargar la sala:", error);
      }
    }
    fetchRoom();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!id) return;
    setLoading(true);
    try {
      await RoomsService.actualizarRoom(Number(id), form);
      setSnack({ open: true, message: 'Sala actualizada', severity: 'success' });
      setTimeout(() => navigate("/rooms"), 700);
    } catch (error: any) {
      setSnack({ open: true, message: error?.message ?? 'Error al actualizar sala', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Editar Sala
      </Typography>

      <Paper sx={{
        p: 4,
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Capacidad"
            name="capacity"
            type="number"
            value={form.capacity || ''}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            select
            label="Tipo"
            name="type"
            value={form.type || ''}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="2D">2D</MenuItem>
            <MenuItem value="3D">3D</MenuItem>
            <MenuItem value="VIP">VIP</MenuItem>
          </TextField>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                color: '#fff',
                fontWeight: 600,
                flex: 1,
                py: 1.5,
                boxShadow: '0 4px 15px rgba(33,203,243,0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(33,203,243,0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: '0.3s'
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/rooms')}
              sx={{ flex: 1 }}
            >
              Cancelar
            </Button>
          </Box>
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
