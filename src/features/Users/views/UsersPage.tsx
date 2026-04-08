import { useEffect, useState } from 'react';
import { UsersService } from './../services/UsersService';
import type { User } from './../types/UserTypes';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  TextField,
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showInactive, setShowInactive] = useState(() => {
    const saved = localStorage.getItem('users_showInactive');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  // Guardar estado en localStorage cada que cambia
  useEffect(() => {
    localStorage.setItem('users_showInactive', JSON.stringify(showInactive));
  }, [showInactive]);

  const displayedUsers = (showInactive
    ? allUsers.filter(u => !u.active)
    : allUsers.filter(u => u.active))
    .filter(u => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(query)
        || `${u.dni ?? ''}`.includes(query);
    });

  useEffect(() => {
    async function fetchUsers() {
      const resultado = await UsersService.obtenerUsers();
      setAllUsers(resultado);
    }
    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    try {
      await UsersService.eliminarUser(id);
      setAllUsers(prev =>
        prev.map(u => u.id === id ? { ...u, active: false } : u)
      );
      setSnack({ open: true, message: 'Cliente marcado como inactivo', severity: 'success' });
    } catch (e: any) {
      setSnack({ open: true, message: e?.message || 'Error al eliminar cliente', severity: 'error' });
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>Clientes</Typography>
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
          Crear Cliente
        </Button>
      </Box>

      {/* Filtro para mostrar inactivos */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip
          icon={showInactive ? <VisibilityOff /> : <Visibility />}
          label={showInactive ? 'Mostrando inactivos' : 'Mostrando activos'}
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
            label="Buscar (nombre o DNI)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
          />
        )}
      </Box>

      {displayedUsers.length === 0 ? (
        <Typography variant="h6" sx={{ color: '#555' }}>
          No hay {showInactive ? 'clientes inactivos' : 'clientes cargados'}.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {displayedUsers.map(user => (
            <Paper
              key={user.id}
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
                {user.name}
              </Typography>
              <Typography sx={{ mb: 1 }}>ID: {user.id}</Typography>
              <Typography sx={{ mb: 1 }}>Email: {user.email}</Typography>
              <Typography sx={{ mb: 2 }}>DNI: {user.dni ?? '-'}</Typography>

              {!showInactive && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    color="primary"
                    sx={{
                      '&:hover': { color: '#1976d2' },
                    }}
                    onClick={() => navigate(`editar/${user.id}`)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}>
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
