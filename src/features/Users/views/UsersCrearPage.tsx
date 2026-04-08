import { useState } from 'react';
import { UsersService } from './../services/UsersService';
import type { UserCrearDto } from './../types/UserTypes';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Paper
} from '@mui/material';

export default function UsersCrearPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  function validate(): string | null {
    if (!name.trim()) return 'El nombre es obligatorio';
    if (!email.trim()) return 'El email es obligatorio';
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return 'Email inválido';
    if (dni && !/^\d{7,}$/.test(dni)) return 'DNI inválido (solo números, mínimo 7 dígitos)';
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      setSnack({ open: true, message: err, severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const dto: UserCrearDto = { name: name.trim(), email: email.trim(), dni: dni.trim() };
      await UsersService.crearUser(dto);
      setSnack({ open: true, message: 'Cliente creado', severity: 'success' });
      setTimeout(() => navigate('/users'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? 'Error al crear usuario', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Crear Cliente
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
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="DNI"
            value={dni}
            onChange={e => setDni(e.target.value)}
            fullWidth
          />

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

