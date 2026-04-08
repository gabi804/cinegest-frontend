import { useEffect, useState } from 'react';
import { FunctionsService } from '../services/FunctionsService';
import type { FunctionEntity } from '../types/FunctionTypes';
import { Box, Typography, Paper, Button, IconButton, Snackbar, Alert, Chip, TextField } from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function FunctionsPage() {
  const [allFunctions, setAllFunctions] = useState<FunctionEntity[]>([]);
  const [showInactive, setShowInactive] = useState(() => {
    const saved = localStorage.getItem('functions_showInactive');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  // Guardar estado en localStorage cada que cambia
  useEffect(() => {
    localStorage.setItem('functions_showInactive', JSON.stringify(showInactive));
  }, [showInactive]);

  const displayedFunctions = (showInactive
    ? allFunctions.filter(f => !f.active)
    : allFunctions.filter(f => f.active))
    .filter(f => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      return f.movie?.title?.toLowerCase().includes(query)
        || f.room?.name?.toLowerCase().includes(query)
        || f.date?.toLowerCase().includes(query)
        || `${f.id}`.includes(query);
    });

  useEffect(() => {
    async function fetchData() {
      const funcs = await FunctionsService.obtenerFunctions();
      setAllFunctions(funcs);
    }
    fetchData();
  }, []);

  async function handleDelete(id: number) {
    try {
      await FunctionsService.eliminarFunction(id);
      setAllFunctions(prev => 
        prev.map(f => f.id === id ? { ...f, active: false } : f)
      );
      setSnack({ open: true, message: 'Función marcada como inactiva', severity: 'success' });
    } catch (e: any) {
      setSnack({ open: true, message: e?.message || 'Error al eliminar función', severity: 'error' });
    }
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
            label="Buscar (película/sala/fecha)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
          />
        )}
      </Box>

      {displayedFunctions.length === 0 ? (
        <Typography variant="h6" sx={{ color: '#555' }}>
          No hay {showInactive ? 'funciones inactivas' : 'funciones cargadas'}.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {displayedFunctions.map(f => (
            <Paper
              key={f.id}
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
                {f.movie?.title || 'Sin película'}
              </Typography>
              <Typography sx={{ mb: 0.5 }}>Sala: {f.room?.name || 'Sin sala'}</Typography>
              <Typography sx={{ mb: 0.5 }}>Fecha: {f.date}</Typography>
              <Typography sx={{ mb: 0.5 }}>Hora: {f.time}</Typography>
              <Typography sx={{ mb: 0.5 }}>Precio: ${f.price}</Typography>

              {!showInactive && (
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
