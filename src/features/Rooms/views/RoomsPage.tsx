import { useEffect, useState } from 'react';
import { RoomsService } from '../services/RoomsService';
import type { Room } from '../types/RoomTypes';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await RoomsService.obtenerRooms();
        setRooms(data);
      } catch (err) {
        console.error('Error al obtener salas:', err);
      }
    };
    fetchRooms();
  }, []);

  const handleCrear = () => navigate('/rooms/crear');

  const handleEliminar = async (id: number) => {
    try {
      await RoomsService.eliminarRoom(id);
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error al eliminar sala:', err);
    }
  };

  return (
    <Box sx={{ p: 4, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
          Salas
        </Typography>

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
          onClick={handleCrear}
        >
          Crear Sala
        </Button>
      </Box>

      {/* Contenido */}
      {rooms.length === 0 ? (
        <Typography variant="h6" sx={{ color: '#555' }}>
          No hay salas cargadas.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
          {rooms.map(room => (
            <Paper
              key={room.id}
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
                {room.name}
              </Typography>
              <Typography>Capacidad: {room.capacity}</Typography>
              <Typography>Tipo: {room.type}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <IconButton
                  color="primary"
                  sx={{
                    '&:hover': { color: '#1976d2' },
                  }}
                  onClick={() => navigate(`/rooms/editar/${room.id}`)}
                >
                  <Edit />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => handleEliminar(room.id)}
                >
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

