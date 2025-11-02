import { useEffect, useState } from 'react';
import { FunctionsService } from '../services/FunctionsService';
import type { FunctionEntity } from '../types/FunctionTypes';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from 'src/shared/libs/nestAxios';

export default function FunctionsPage() {
  const [functions, setFunctions] = useState<FunctionEntity[]>([]);
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const funcs = await FunctionsService.obtenerFunctions();
      setFunctions(funcs);

      const mv = await api.get('/movie');
      setMovies(mv.data);

      const rm = await api.get('/rooms');
      setRooms(rm.data);
    }
    fetchData();
  }, []);

  function getMovieTitle(id: number) {
    return movies.find(m => m.id === id)?.title ?? `#${id}`;
  }

  function getRoomName(id: number) {
    return rooms.find(r => r.id === id)?.name ?? `#${id}`;
  }

  async function handleDelete(id: number) {
    await FunctionsService.eliminarFunction(id);
    setFunctions(prev => prev.filter(f => f.id !== id));
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>Funciones</Typography>
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
          Crear Función
        </Button>
      </Box>

      {functions.length === 0 ? (
        <Typography variant="h6" sx={{ color: '#555' }}>
          No hay funciones cargadas.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {functions.map(f => (
            <Paper
              key={f.id}
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
                {getMovieTitle(f.movie.id)}
              </Typography>
              <Typography sx={{ mb: 0.5 }}>Sala: {getRoomName(f.room.id)}</Typography>
              <Typography sx={{ mb: 0.5 }}>Fecha: {f.date}</Typography>
              <Typography sx={{ mb: 0.5 }}>Hora: {f.time}</Typography>
              <Typography sx={{ mb: 0.5 }}>Precio: ${f.price}</Typography>
              <Typography sx={{ mb: 2 }}>Asientos disponibles: {f.availableSeats}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton
                  color="primary"
                  sx={{ '&:hover': { color: '#1976d2' } }}
                  onClick={() => navigate(`editar/${f.id}`)}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(f.id)}>
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
