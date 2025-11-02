import { useEffect, useState } from "react";
import ReservationsService from "../services/ReservationsService";
import type { Reservation } from "../types/ReservationTypes";
import { Box, Typography, Button, MenuItem, Select, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ReservationsEliminarPage() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const data = await ReservationsService.obtenerReservas();
      setReservas(data);
    }
    fetchData();
  }, []);

  async function handleDelete() {
    if (selectedId === null) return;
    await ReservationsService.eliminarReserva(selectedId);
    navigate("/reservations");
  }

  return (
    <Box>
      <Typography variant="h4">Eliminar Reserva</Typography>
      <FormControl sx={{ mt: 2, minWidth: 300 }}>
        <Select value={selectedId ?? ""} onChange={(e) => setSelectedId(Number(e.target.value))}>
          {reservas.map(r => (
            <MenuItem key={r.id} value={r.id}>
              Reserva {r.id} - Usuario {r.user.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={selectedId === null}>
          Eliminar
        </Button>
      </Box>
    </Box>
  );
}
