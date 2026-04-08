export interface MovieStats {
  movieId: number;
  movieTitle: string;
  totalReservations: number;
  totalRevenue: number;
  month: string;
  occupancyRate: number;
}

export interface MonthlyStats {
  month: string;
  totalReservations: number;
  totalRevenue: number;
  averageOccupancy: number;
}

export interface RoomOccupancyStats {
  roomId: number;
  roomName: string;
  occupancyPercentage: number;
  totalFunctions: number;
  totalSeatsUsed: number;
  totalCapacity: number;
}

export interface DailyRevenueData {
  date: string;
  revenue: number;
  reservations: number;
}
