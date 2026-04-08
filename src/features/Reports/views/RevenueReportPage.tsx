import { useState, useEffect } from 'react';
import { ReportsService } from '../services/ReportsService';
import type { DailyRevenueData } from '../types/ReportTypes';
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
  Card,
  CardContent,
  TextField,
} from '@mui/material';
// Chart removed: replaced by a more logical Top Movies by Revenue table

export default function RevenueReportPage() {
  const [data, setData] = useState<DailyRevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('2025-12-01');
  const [endDate, setEndDate] = useState('2025-12-31');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await ReportsService.getDailyRevenue(startDate, endDate);
      setData(result);
      setLoading(false);
    }
    load();
  }, [startDate, endDate]);

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalReservations = data.reduce((sum, d) => sum + d.reservations, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Reporte de Ingresos</Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Desde"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Hasta"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 180 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Ingresos Totales</Typography>
            <Typography variant="h5">${totalRevenue.toLocaleString('es-AR')}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 180 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Reservas</Typography>
            <Typography variant="h5">{totalReservations}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabla detallada */}
      <Typography variant="h6" sx={{ mb: 2 }}>Ingresos Diarios</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell align="right"><strong>Reservas</strong></TableCell>
              <TableCell align="right"><strong>Ingresos</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Cargando...</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Sin datos para el período seleccionado</TableCell>
              </TableRow>
            ) : (
              data.map((daily) => (
                <TableRow key={daily.date}>
                  <TableCell>{new Date(daily.date).toLocaleDateString('es-AR')}</TableCell>
                  <TableCell align="right">{daily.reservations}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      ${daily.revenue.toLocaleString('es-AR')}
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
