import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import HistoryIcon from '@mui/icons-material/History';

export default function ReportsPage() {
  const navigate = useNavigate();

  const reports = [
    {
      title: 'Películas por Mes',
      description: 'Ver qué películas tuvieron más vistas y ganancias en cada mes',
      icon: TrendingUpIcon,
      path: '/reports/movies',
    },
    {
      title: 'Ocupación de Salas',
      description: 'Análisis de ocupación y utilización de cada sala',
      icon: GridOnIcon,
      path: '/reports/rooms-occupancy',
    },
    {
      title: 'Ingresos y Reservas',
      description: 'Seguimiento de ingresos diarios y tendencias de reservas',
      icon: BarChartIcon,
      path: '/reports/revenue',
    },
    {
      title: 'Historial de Reservas',
      description: 'Consulta el historial de reservas por fecha específica',
      icon: HistoryIcon,
      path: '/reports/historial',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>Historial y Reportes</Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Analiza datos para tomar decisiones informadas sobre tu cine
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.path}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate(report.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h6">{report.title}</Typography>
                </Box>
                <Typography color="textSecondary" variant="body2">
                  {report.description}
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(report.path);
                  }}
                >
                  Ver Reporte →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
