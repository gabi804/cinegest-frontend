import { useEffect, useState } from "react";
import ReservationsService from "../services/ReservationsService";
import type { Reservation } from "../types/ReservationTypes";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ReservationsPage() {
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const navigate = useNavigate();

  async function load() {
    const data = await ReservationsService.obtenerReservas();
    setReservas(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    await ReservationsService.eliminarReserva(id);
    await load();
  }

  return (
    <Box sx={{ p: 4, background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Encabezado */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1976d2" }}>Reservas</Typography>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
            color: "#fff",
            fontWeight: 600,
            px: 3,
            py: 1.2,
            boxShadow: "0 4px 15px rgba(33,203,243,0.4)",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(33,203,243,0.6)",
              transform: "translateY(-2px)",
            },
          }}
          onClick={() => navigate("crear")}
        >
          Crear Reserva
        </Button>
      </Box>

      {reservas.length === 0 ? (
        <Typography variant="h6" sx={{ color: "#555" }}>
          No hay reservas cargadas.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 3 }}>
          {reservas.map((r) => (
            <Paper
              key={r.id}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff, #e3f2fd)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Reserva #{r.id}
              </Typography>
              <Typography sx={{ mb: 1 }}>Usuario: {r.user?.name ?? "N/A"}</Typography>
              <Typography sx={{ mb: 1 }}>
                Función: {r.function?.movie?.title ?? "N/A"} - {r.function?.room?.name ?? "N/A"}
              </Typography>
              <Typography sx={{ mb: 2 }}>Asientos: {r.seats}</Typography>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <IconButton
                  color="primary"
                  sx={{ "&:hover": { color: "#1976d2" } }}
                  onClick={() => navigate(`editar`, { state: { id: r.id } })}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(r.id)}>
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




