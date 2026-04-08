import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UsersService } from './../services/UsersService';
import type { User } from './../types/UserTypes';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Paper
} from '@mui/material';

export default function UsersEditarPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;
      try {
        const users = await UsersService.obtenerUsers();
        const found = users.find(u => u.id === Number(id));
        if (found) setForm(found);
      } catch (e: any) {
        console.error(e);
      }
    }
    fetchUser();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate(): string | null {
    if (!form.name || !form.name.toString().trim()) return 'El nombre es obligatorio';
    if (!form.email || !form.email.toString().trim()) return 'El email es obligatorio';
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(String(form.email))) return 'Email inválido';
    if (form.dni && !/^[0-9]{7,}$/.test(String(form.dni))) return 'DNI inválido (solo números, mínimo 7 dígitos)';
    return null;
  }

  async function handleSubmit() {
    if (!id) return;
    const err = validate();
    if (err) {
      setSnack({ open: true, message: err, severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      await UsersService.actualizarUser(Number(id), form);
      setSnack({ open: true, message: 'Cliente actualizado', severity: 'success' });
      setTimeout(() => navigate('/users'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? 'Error al actualizar', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Editar Cliente
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name ?? ''}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Email"
            name="email"
            value={form.email ?? ''}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="DNI"
            name="dni"
            value={form.dni ?? ''}
            onChange={handleChange}
            fullWidth
          />

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
              onClick={() => navigate('/users')}
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

