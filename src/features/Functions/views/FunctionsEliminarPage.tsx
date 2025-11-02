import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FunctionsService } from '../services/FunctionsService';
import type { FunctionEntity } from '../types/FunctionTypes';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function FunctionsEliminarPage() {
  const { id } = useParams<{ id: string }>();
  const [func, setFunc] = useState<FunctionEntity | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFunction() {
      if (!id) return;
      const resultado = await FunctionsService.obtenerFunctions();
      const found = resultado.find(f => f.id === Number(id));
      if (found) setFunc(found);
    }
    fetchFunction();
  }, [id]);

  async function handleEliminar() {
    if (!id) return;
    await FunctionsService.eliminarFunction(Number(id));
    navigate('/functions');
  }

  if (!func) return <div>Cargando...</div>;

 return (
  <Box>
    <h2>Eliminar Función</h2>
    <p>
      ¿Estás seguro que quieres eliminar la función de la película{" "}
      <strong>{func.movie?.title ?? "N/A"}</strong> en la sala{" "}
      <strong>{func.room?.name ?? "N/A"}</strong>?
    </p>
    <Button variant="contained" color="error" onClick={handleEliminar} sx={{ mr: 1 }}>
      Eliminar
    </Button>
    <Button variant="outlined" onClick={() => navigate('/functions')}>Cancelar</Button>
  </Box>
);

}
