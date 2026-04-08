import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Snackbar } from '@mui/material';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const admin = AuthService.getAdminData();
  const [name, setName] = useState(admin?.name || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password && password !== confirm) {
      setSnack({ open: true, message: 'Las contraseñas no coinciden', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.updateProfile(admin.id, name, password || undefined);
      if (result && (result as any).error) {
        setSnack({ open: true, message: (result as any).error, severity: 'error' });
      } else {
        AuthService.setAdminData({ id: admin.id, username: admin.username, name });
        setSnack({ open: true, message: 'Perfil actualizado', severity: 'success' });
        setTimeout(() => navigate('/'), 800);
      }
    } catch (err: any) {
      setSnack({ open: true, message: err?.response?.data?.error || err.message || 'Error', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: '#f7fafc' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1976d2' }}>Editar Perfil Admin</Typography>
      <Paper sx={{ p: 4, maxWidth: 540 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

          <TextField label="Nueva contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />

          <TextField label="Confirmar contraseña" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              Guardar
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
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
