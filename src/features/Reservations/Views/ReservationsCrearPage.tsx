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
  Paper,
  Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "src/shared/libs/nestAxios";
import { UsersService } from 'src/features/Users/services/UsersService';

export default function ReservationsCrearPage() {
  const [userId, setUserId] = useState<number>(0);
  const [functionId, setFunctionId] = useState<number>(0);
  const [seats, setSeats] = useState<number>(1);
  const [userQuery, setUserQuery] = useState('');
  const [userOptions, setUserOptions] = useState<{ id: number; name: string }[]>([]);
  const [functions, setFunctions] = useState<{ id: number; movieTitle?: string; roomName?: string; }[]>([]);
  const [availableSeatsForFunction, setAvailableSeatsForFunction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
          const functionsResult = await api.get("/functions");
          // only allow active functions as options for creating reservations
          const activeFunctions = (functionsResult.data || []).filter((f: any) => f.active !== false);
          const mappedFunctions = activeFunctions.map((f: any) => ({
            id: f.id,
            movieTitle: f.movie?.title ?? 'Función',
            roomName: f.room?.name ?? '',
            date: f.date,
            time: f.time,
            price: f.price
          }));
          setFunctions(mappedFunctions);
      } catch (e: any) {
        console.error("Error fetching data:", e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (!userQuery || userQuery.length < 2) {
          setUserOptions([]);
          return;
        }
        const res = await UsersService.searchUsers(userQuery);
        setUserOptions(res || []);
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [userQuery]);

  useEffect(() => {
    async function fetchAvailability() {
      if (!functionId) {
        setAvailableSeatsForFunction(null);
        return;
      }
      try {
        const res = await api.get(`/functions/${functionId}/availability`);
        setAvailableSeatsForFunction(res.data?.available ?? null);
      } catch (e) {
        console.error(e);
        setAvailableSeatsForFunction(null);
      }
    }
    fetchAvailability();
  }, [functionId]);

  async function handleSubmit() {
    if (!userId || !functionId || seats <= 0)
      return setSnack({ open: true, message: 'Completa todos los campos', severity: 'error' });

    if (availableSeatsForFunction !== null && seats > availableSeatsForFunction) {
      return setSnack({ open: true, message: `No hay suficientes asientos. Disponibles: ${availableSeatsForFunction}`, severity: 'error' });
    }

    setLoading(true);
    try {
      const dto: ReservationCreateDto = { userId, functionId, seats };
      await ReservationsService.crearReserva(dto);
      setSnack({ open: true, message: 'Reserva creada', severity: 'success' });
      setTimeout(() => navigate('/reservations?refresh=true'), 700);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al crear reserva';
      setSnack({ open: true, message: msg, severity: 'error' });
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
          <Autocomplete
            options={userOptions}
            getOptionLabel={(option: any) => option.name ?? ''}
            onInputChange={(_, value) => setUserQuery(value)}
            onChange={(_, value: any) => setUserId(value?.id ?? 0)}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
            freeSolo={false}
          />

          <FormControl fullWidth>
            <InputLabel>Función</InputLabel>
            <Select value={functionId} onChange={(e) => setFunctionId(Number(e.target.value))}>
              {functions.map((f: any) => (
                <MenuItem key={f.id} value={f.id}>
                  {`${f.date} ${f.time} — ${f.movieTitle} — ${f.roomName} — $${f.price}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {availableSeatsForFunction !== null && (
            <Typography sx={{ color: availableSeatsForFunction > 0 ? 'green' : 'red' }}>
              Disponibles: {availableSeatsForFunction}
            </Typography>
          )}

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


