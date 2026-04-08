import { useState, useEffect } from "react";
import ReservationsService from "../services/ReservationsService";
import type { Reservation } from "../types/ReservationTypes";
import { Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface HistorialEntry {
  clienteName: string;
  movieTitle: string;
  roomName: string;
  functionDate: string;
  functionTime: string;
  seats: number;
}

export default function HistorialPage() {
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [displayedData, setDisplayedData] = useState<HistorialEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ReservationsService.obtenerReservas();
        // Solo mostrar activos
        setAllReservations(data.filter(r => r.active !== false));
      } catch (e) {
        console.error("Error loading reservations:", e);
      }
    }
    loadData();
  }, []);

  // Filtrar por rango desde/hasta cada que cambia el rango o reservas
  useEffect(() => {
    if (!filterFrom && !filterTo) {
      setDisplayedData([]);
      return;
    }

    const from = filterFrom || '0000-01-01';
    const to = filterTo || '9999-12-31';

    const filtered = allReservations
      .filter(r => {
        const date = r.function?.date;
        return date ? date >= from && date <= to : false;
      })
      .map(r => ({
        clienteName: r.user?.name || 'Sin cliente',
        movieTitle: r.function?.movie?.title || 'Sin película',
        roomName: r.function?.room?.name || 'Sin sala',
        functionDate: r.function?.date || 'Sin fecha',
        functionTime: r.function?.time || 'Sin hora',
        seats: r.seats,
      }));

    setDisplayedData(filtered);
  }, [filterFrom, filterTo, allReservations]);

  return (
    <Box sx={{ p: 4, background: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>Historial de Reservas</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/reservations')}
          sx={{ color: '#1976d2', borderColor: '#1976d2' }}
        >
          Volver
        </Button>
      </Box>

      {/* Buscador rango de fechas */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #ffffff, #e3f2fd)', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <TextField
            label="Desde"
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <Button
            variant="contained"
            onClick={() => { setFilterFrom(''); setFilterTo(''); }}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Limpiar
          </Button>
        </Box>
      </Paper>

      {/* Tabla de resultados */}
      { (filterFrom || filterTo) && displayedData.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Película</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Sala</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#fff' }}>Hora</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#fff', textAlign: 'center' }}>Asientos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    '&:nth-of-type(odd)': { background: '#f9f9f9' },
                    '&:hover': { background: '#f0f4f8' },
                  }}
                >
                  <TableCell>{row.clienteName}</TableCell>
                  <TableCell>{row.movieTitle}</TableCell>
                  <TableCell>{row.roomName}</TableCell>
                  <TableCell>{row.functionTime}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>{row.seats}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (filterFrom || filterTo) ? (
        <Typography variant="h6" sx={{ color: '#999', textAlign: 'center', mt: 4 }}>
          No hay reservas en el rango {filterFrom || 'inicio'} - {filterTo || 'fin'}
        </Typography>
      ) : (
        <Typography variant="h6" sx={{ color: '#999', textAlign: 'center', mt: 4 }}>
          Selecciona un rango Desde/Hasta para ver el historial
        </Typography>
      )}
    </Box>
  );
}
