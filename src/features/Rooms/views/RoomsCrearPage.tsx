import { useState } from 'react';
import { RoomsService } from '../services/RoomsService';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

export default function RoomsCrearPage() {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number | string>(0);
  const [type, setType] = useState<'2D' | '3D' | 'VIP'>('2D');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  function validate() {
    if (!String(name).trim()) return 'El nombre es obligatorio';
    const cap = Number(capacity);
    if (!cap || cap <= 0) return 'Capacidad inválida';
    return null;
  }

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setSnack({ open: true, message: err, severity: 'error' });
    setLoading(true);
    try {
      await RoomsService.crearRoom({ name: name.trim(), capacity: Number(capacity), type });
      setSnack({ open: true, message: 'Sala creada', severity: 'success' });
      setTimeout(() => navigate('/rooms'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? 'Error al crear sala', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Crear Sala
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Capacidad"
            type="number"
            value={capacity}
            onChange={e => setCapacity(Number(e.target.value))}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select value={type} onChange={e => setType(e.target.value as '2D' | '3D' | 'VIP')}>
              <MenuItem value="2D">2D</MenuItem>
              <MenuItem value="3D">3D</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </Select>
          </FormControl>

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
