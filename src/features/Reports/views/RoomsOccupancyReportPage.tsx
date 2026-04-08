import { useState, useEffect } from 'react';
import { ReportsService } from '../services/ReportsService';
import type { RoomOccupancyStats } from '../types/ReportTypes';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import SimpleBarChart from '../components/SimpleBarChart';

export default function RoomsOccupancyReportPage() {
  const today = new Date().toISOString().slice(0,10);
  const [from, setFrom] = useState<string>(() => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0,10); });
  const [to, setTo] = useState<string>(today);
  const [stats, setStats] = useState<RoomOccupancyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await ReportsService.getRoomOccupancyByRange(from, to);
      setStats(data);
      setLoading(false);
    }
    load();
  }, [from, to]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Ocupación de Salas</Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField label="Desde" type="date" value={from} onChange={e => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Hasta" type="date" value={to} onChange={e => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
      </Box>

      {/* Chart */}
      <Box sx={{ mb: 3 }}>
        <SimpleBarChart data={stats.map(s => ({ label: s.roomName.length > 12 ? s.roomName.slice(0, 12) + '...' : s.roomName, value: s.occupancyPercentage }))} height={200} width={900} />
      </Box>

      {/* Summary Card (basic) */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>Total Funciones</Typography>
              <Typography variant="h5">{stats.reduce((sum, s) => sum + s.totalFunctions, 0)}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" gutterBottom>Asientos Usados</Typography>
              <Typography variant="h5">{stats.reduce((sum, s) => sum + s.totalSeatsUsed, 0).toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography color="textSecondary" gutterBottom>Capacidad Total</Typography>
              <Typography variant="h5">{stats.reduce((sum, s) => sum + s.totalCapacity, 0).toLocaleString()}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabla detallada */}
      <Typography variant="h6" sx={{ mb: 2 }}>Detalle por Sala</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Sala</strong></TableCell>
              <TableCell align="right"><strong>Funciones</strong></TableCell>
              <TableCell align="right"><strong>Asientos Usados</strong></TableCell>
              <TableCell align="right"><strong>Capacidad</strong></TableCell>
              <TableCell><strong>Ocupación</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Cargando...</TableCell>
              </TableRow>
            ) : stats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Sin datos disponibles</TableCell>
              </TableRow>
            ) : (
              stats.map((stat) => (
                <TableRow key={stat.roomId}>
                  <TableCell><strong>{stat.roomName}</strong></TableCell>
                  <TableCell align="right">{stat.totalFunctions}</TableCell>
                  <TableCell align="right">{stat.totalSeatsUsed}</TableCell>
                  <TableCell align="right">{stat.totalCapacity}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={stat.occupancyPercentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: stat.occupancyPercentage >= 80 ? '#4caf50' : stat.occupancyPercentage >= 60 ? '#ff9800' : '#f44336',
                            }
                          }}
                        />
                      </Box>
                      <Typography sx={{ minWidth: 35 }}>{stat.occupancyPercentage}%</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
