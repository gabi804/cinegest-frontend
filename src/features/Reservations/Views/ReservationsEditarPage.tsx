import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReservationsService from "../services/ReservationsService";
import type { Reservation, ReservationUpdateDto } from "../types/ReservationTypes";
import { Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert, Paper } from "@mui/material";
import { api } from "src/shared/libs/nestAxios";

export default function ReservationsEditarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const id = Number(location.state?.id ?? params.id);

  const [userId, setUserId] = useState<number>(0);
  const [functionId, setFunctionId] = useState<number>(0);
  const [seats, setSeats] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [functions, setFunctions] = useState<{ id: number; title: string }[]>([]);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, functionsRes, reservas] = await Promise.all([
          api.get("/users"),
          api.get("/functions"),
          ReservationsService.obtenerReservas(),
        ]);

        setUsers(usersRes.data);
        setFunctions(
          functionsRes.data.map((f: any) => ({
            id: f.id,
            title: `${f.movie?.title ?? "Sin película"} - ${f.room?.name ?? "Sin sala"}`,
          }))
        );

        const r = reservas.find((x: Reservation) => x.id === id);
        if (r) {
          setUserId(r.user?.id ?? 0);
          setFunctionId(r.function?.id ?? 0);
          setSeats(r.seats);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
    if (id) fetchData();
  }, [id]);

  async function handleSubmit() {
    setLoading(true);
    try {
      const dto: ReservationUpdateDto = { id, userId, functionId, seats };
      await ReservationsService.actualizarReserva(dto);
      setSnack({ open: true, message: "Reserva actualizada correctamente", severity: "success" });
      setTimeout(() => navigate("/reservations"), 700);
    } catch (error: any) {
      setSnack({ open: true, message: error?.message ?? "Error al actualizar reserva", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: '#f0f4f8' }}>
      <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mb: 4 }}>
        Editar Reserva #{id}
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Usuario</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Función</InputLabel>
            <Select value={functionId} onChange={(e) => setFunctionId(Number(e.target.value))}>
              {functions.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.title}</MenuItem>
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

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(33,203,243,0.4)',
                '&:hover': { boxShadow: '0 6px 20px rgba(33,203,243,0.6)', transform: 'translateY(-2px)' },
                transition: '0.3s'
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/reservations')}
              sx={{ flex: 1 }}
            >
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


