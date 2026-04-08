import { useEffect, useState } from "react";
import ReservationsService from "../services/ReservationsService";
import type { Reservation } from "../types/ReservationTypes";
import { Box, Typography, Button, Paper, IconButton, Snackbar, Alert, Chip, TextField } from "@mui/material";
import { Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ReservationDisplay {
  id: number;
  clienteName: string;
  movieTitle: string;
  roomName: string;
  functionDate: string;
  functionTime: string;
  seats: number;
  active: boolean;
}

export default function ReservationsPage() {
  const [allReservas, setAllReservas] = useState<ReservationDisplay[]>([]);
  const [showInactive, setShowInactive] = useState(() => {
    const saved = localStorage.getItem('reservations_showInactive');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Guardar estado en localStorage cada que cambia
  useEffect(() => {
    localStorage.setItem('reservations_showInactive', JSON.stringify(showInactive));
  }, [showInactive]);

  const filteredReservas = (showInactive
    ? allReservas.filter(r => !r.active)
    : allReservas.filter(r => r.active))
    .filter(r => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return r.clienteName.toLowerCase().includes(q)
        || r.movieTitle.toLowerCase().includes(q)
        || r.roomName.toLowerCase().includes(q)
        || `${r.id}`.includes(q);
    });

  const totalPages = Math.max(1, Math.ceil(filteredReservas.length / itemsPerPage));
  const activePage = Math.min(page, totalPages);
  const paginatedReservas = filteredReservas.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [showInactive, searchTerm, allReservas]);

  async function load() {
    try {
      // Esperar un poco para asegurar que el backend tiene los datos
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = await ReservationsService.obtenerReservas();
      console.log("Reservations loaded:", data);
      
      // Mapear los datos para mostrar nombres en lugar de objetos
      const mapped: ReservationDisplay[] = data.map((r: Reservation) => {
        console.log("Mapping reservation:", r);
        return {
          id: r.id,
          clienteName: r.user?.name || 'Sin cliente',
          movieTitle: r.function?.movie?.title || 'Sin película',
          roomName: r.function?.room?.name || 'Sin sala',
          functionDate: r.function?.date || 'Sin fecha',
          functionTime: r.function?.time || 'Sin hora',
          seats: r.seats,
          active: r.active !== false,
        };
      });
      
      console.log("Mapped reservations:", mapped);
      setAllReservas(mapped);
    } catch (e: any) {
      console.error("Error loading reservations:", e);
    }
  }

  useEffect(() => {
    load();
  }, [searchParams]);

  async function handleDelete(id: number) {
    try {
      await ReservationsService.eliminarReserva(id);
      setAllReservas(prev =>
        prev.map(r => r.id === id ? { ...r, active: false } : r)
      );
      setSnack({ open: true, message: 'Reserva marcada como inactiva', severity: 'success' });
    } catch (e: any) {
      setSnack({ open: true, message: e?.message || 'Error al eliminar reserva', severity: 'error' });
    }
  }

  return (
    <Box sx={{ p: 4, background: "#f5f7fa", minHeight: "100vh" }}>
      {/* Encabezado */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1976d2" }}>Reservas</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("historial")}
            sx={{ color: "#1976d2", borderColor: "#1976d2", fontWeight: 600 }}
          >
            Historial
          </Button>
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
      </Box>

      {/* Filtro para mostrar inactivos */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip
          icon={showInactive ? <VisibilityOff /> : <Visibility />}
          label={showInactive ? 'Mostrando inactivas' : 'Mostrando activas'}
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
            label="Buscar (cliente/película/sala)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 260 }}
          />
        )}
      </Box>

      {paginatedReservas.length === 0 ? (
        <Typography variant="h6" sx={{ color: "#555" }}>
          No hay {showInactive ? 'reservas inactivas' : 'reservas cargadas'}.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
          {paginatedReservas.map((r) => (
            <Paper
              key={r.id}
              sx={{
                p: 3,
                borderRadius: 3,
                background: showInactive
                  ? "linear-gradient(135deg, #ffebee, #ffcdd2)"
                  : "linear-gradient(135deg, #ffffff, #e3f2fd)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
                opacity: showInactive ? 0.7 : 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {r.clienteName}
              </Typography>
              <Typography sx={{ mb: 1, fontSize: '0.9rem', color: '#666' }}>
                {r.movieTitle} — {r.roomName}
              </Typography>
              <Typography sx={{ mb: 1, fontSize: '0.85rem', color: '#888' }}>
                {r.functionDate} a las {r.functionTime}
              </Typography>
              <Typography sx={{ mb: 2, fontWeight: 600 }}>
                {r.seats} {r.seats === 1 ? 'asiento' : 'asientos'}
              </Typography>

              {!showInactive && (
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
              )}
            </Paper>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Página {activePage} de {totalPages}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            disabled={activePage <= 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={activePage >= totalPages}
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
          >
            Siguiente
          </Button>
        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}




