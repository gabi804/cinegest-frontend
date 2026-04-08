import { useState, useEffect } from 'react';
import { ReportsService } from '../services/ReportsService';
import type { MovieStats } from '../types/ReportTypes';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SimpleBarChart from '../components/SimpleBarChart';

export default function MoviesReportPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState<string>(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().slice(0,10);
  });
  const [to, setTo] = useState<string>(today);
  const [stats, setStats] = useState<MovieStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await ReportsService.getMovieStatsByRange(from, to);
      setStats(data.sort((a, b) => b.totalReservations - a.totalReservations));
      setLoading(false);
    }
    load();
  }, [from, to]);

  const topMovie = stats[0];
  const totalRevenue = stats.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalReservations = stats.reduce((sum, s) => sum + s.totalReservations, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Reporte de Películas</Typography>

          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="Desde" type="date" value={from} onChange={e => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Hasta" type="date" value={to} onChange={e => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>

      {/* Chart */}
      <Box sx={{ mb: 3 }}>
        <SimpleBarChart data={stats.slice(0, 8).map(s => ({ label: s.movieTitle.length > 12 ? s.movieTitle.slice(0, 12) + '...' : s.movieTitle, value: s.totalReservations }))} height={220} width={900} />
      </Box>

      {/* Resumen Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 calc(25% - 8px)', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Ingresos</Typography>
            <Typography variant="h5">${totalRevenue.toLocaleString('es-AR')}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 calc(25% - 8px)', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Reservas</Typography>
            <Typography variant="h5">{totalReservations}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 calc(25% - 8px)', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Película Top</Typography>
            <Typography variant="h6">{topMovie?.movieTitle || 'N/A'}</Typography>
          </CardContent>
        </Card>
        {/* Occupancy average removed per request */}
      </Box>

      {/* Tabla detallada */}
      <Typography variant="h6" sx={{ mb: 2 }}>Detalle por Película</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Película</strong></TableCell>
              <TableCell align="right"><strong>Reservas</strong></TableCell>
              <TableCell align="right"><strong>Ingresos</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Cargando...</TableCell>
              </TableRow>
            ) : stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Sin datos para este mes</TableCell>
              </TableRow>
            ) : (
              stats.map((stat, idx) => (
                <TableRow key={stat.movieId} sx={{ backgroundColor: idx === 0 ? '#fffacd' : 'white' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {idx === 0 && <TrendingUpIcon sx={{ color: 'gold' }} />}
                      {stat.movieTitle}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{stat.totalReservations}</TableCell>
                  <TableCell align="right">${stat.totalRevenue.toLocaleString('es-AR')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
