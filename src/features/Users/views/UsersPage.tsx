import { useEffect, useState } from 'react';
import { UsersService } from './../services/UsersService';
import type { User } from './../types/UserTypes';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      const resultado = await UsersService.obtenerUsers();
      setUsers(resultado);
    }
    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    await UsersService.eliminarUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  return (
    <Box sx={{ p: 4, background: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>Usuarios</Typography>
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
          Crear Usuario
        </Button>
      </Box>

      {users.length === 0 ? (
        <Typography variant="h6" sx={{ color: '#555' }}>
          No hay usuarios cargados.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {users.map(user => (
            <Paper
              key={user.id}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {user.name}
              </Typography>
              <Typography sx={{ mb: 1 }}>ID: {user.id}</Typography>
              <Typography sx={{ mb: 2 }}>Email: {user.email}</Typography>

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
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
