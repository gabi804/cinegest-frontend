import { useState, useEffect } from "react";
import ReservationsService from "../services/ReservationsService";
import type { ReservationCreateDto } from "../types/ReservationTypes";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "src/shared/libs/nestAxios";

export default function ReservationsCrearPage() {
  const [userId, setUserId] = useState<number>(0);
  const [functionId, setFunctionId] = useState<number>(0);
  const [seats, setSeats] = useState<number>(1);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [functions, setFunctions] = useState<{ id: number; movieTitle?: string; roomName?: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResult = await api.get("/users");
        setUsers(usersResult.data);

        const functionsResult = await api.get("/functions");
        const mappedFunctions = functionsResult.data.map((f: any) => ({
          id: f.id,
          movieTitle: f.movie?.title ?? 'Función',
          roomName: f.room?.name ?? ''
        }));
        setFunctions(mappedFunctions);
      } catch (e: any) {
        console.error("Error fetching data:", e);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit() {
    if (!userId || !functionId || seats <= 0)
      return setSnack({ open: true, message: 'Completa todos los campos', severity: 'error' });

    setLoading(true);
    try {
      const dto: ReservationCreateDto = { userId, functionId, seats };
      await ReservationsService.crearReserva(dto);
      setSnack({ open: true, message: 'Reserva creada', severity: 'success' });
      setTimeout(() => navigate('/reservations'), 700);
    } catch (e: any) {
      setSnack({ open: true, message: e?.message ?? 'Error al crear reserva', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, background: '#f0f4f8', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Crear Reserva
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Usuario</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
              {users.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Función</InputLabel>
            <Select value={functionId} onChange={(e) => setFunctionId(Number(e.target.value))}>
              {functions.map(f => (
                <MenuItem key={f.id} value={f.id}>
                  {f.movieTitle} - {f.roomName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Asientos"
            type="number"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
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


