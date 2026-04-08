import { api } from 'src/shared/libs/nestAxios';
import type { MovieStats, MonthlyStats, RoomOccupancyStats, DailyRevenueData } from '../types/ReportTypes';

function safeGetId(obj: any) {
  if (!obj) return undefined;
  if (typeof obj === 'number') return obj;
  if (typeof obj === 'string') return Number(obj);
  return obj.id ?? obj._id;
}

export class ReportsService {
  static async getMovieStatsByMonth(month: string): Promise<MovieStats[]> {
    try {
      const [moviesRes, functionsRes, reservationsRes] = await Promise.all([
        api.get('/movie'),
        api.get('/functions'),
        api.get('/reservations'),
      ]);

      const movies = moviesRes.data ?? [];
      const functions = functionsRes.data ?? [];
      const reservations = reservationsRes.data ?? [];

      const movieMap = new Map<number, any>();
      movies.forEach((m: any) => movieMap.set(safeGetId(m), m));

      // accumulate per movie
      const statsMap = new Map<number, { movieTitle: string; totalSeats: number; totalRevenue: number; totalCapacity: number }>();

     
      const functionsOfMonth = functions.filter((f: any) => typeof f.date === 'string' && f.date.startsWith(month));

      
      const reservationsByFunction = new Map<number, any[]>();
      reservations.forEach((r: any) => {
        const funcId = safeGetId(r.function);
        if (!funcId) return;
        const arr = reservationsByFunction.get(funcId) ?? [];
        arr.push(r);
        reservationsByFunction.set(funcId, arr);
      });

      functionsOfMonth.forEach((fn: any) => {
        const funcId = safeGetId(fn.id ?? fn);
        if (!funcId) return;
        const movie = fn.movie ?? (fn.movieId ? movieMap.get(fn.movieId) : undefined);
        const movieId = safeGetId(movie);
        const movieTitle = movie?.title ?? movie?.name ?? 'Sin título';
        const roomCapacity = Number(fn.room?.capacity ?? (fn.roomId ? fn.roomId.capacity : 0)) || 0;

        const resForFunc = reservationsByFunction.get(funcId) ?? [];
        const seatsReserved = resForFunc.reduce((s: number, r: any) => s + (Number(r.seats) || 0), 0);
        const revenue = seatsReserved * (Number(fn.price) || 0);

        const existing = statsMap.get(movieId) ?? { movieTitle, totalSeats: 0, totalRevenue: 0, totalCapacity: 0 };
        existing.totalSeats += seatsReserved;
        existing.totalRevenue += revenue;
        existing.totalCapacity += roomCapacity; // each function contributes room capacity
        statsMap.set(movieId, existing);
      });

      const out: MovieStats[] = [];
      statsMap.forEach((v, k) => {
        const occupancy = v.totalCapacity > 0 ? Math.round((v.totalSeats / v.totalCapacity) * 100) : 0;
        out.push({ movieId: k, movieTitle: v.movieTitle, totalReservations: v.totalSeats, totalRevenue: v.totalRevenue, month, occupancyRate: occupancy });
      });

      return out.sort((a, b) => b.totalReservations - a.totalReservations);
    } catch (err) {
      // fallback to empty array to avoid breaking UI
      return [];
    }
  }

  static async getMovieStatsByRange(from: string, to: string): Promise<MovieStats[]> {
    try {
      const res = await api.get(`/reports/movies?from=${from}&to=${to}`);
      return res.data ?? [];
    } catch (err) {
      return [];
    }
  }

  static async getMonthlyStats(month: string): Promise<MonthlyStats> {
    try {
      const [functionsRes, reservationsRes] = await Promise.all([api.get('/functions'), api.get('/reservations')]);
      const functions = functionsRes.data ?? [];
      const reservations = reservationsRes.data ?? [];

      const functionsOfMonth = functions.filter((f: any) => typeof f.date === 'string' && f.date.startsWith(month));
      const functionIds = new Set(functionsOfMonth.map((f: any) => safeGetId(f.id)));

      let totalSeats = 0;
      let totalRevenue = 0;
      let totalCapacity = 0;

      const reservationsOfMonth = reservations.filter((r: any) => functionIds.has(safeGetId(r.function)));

      const funcMap = new Map(functionsOfMonth.map((f: any) => [safeGetId(f.id), f]));

      reservationsOfMonth.forEach((r: any) => {
        const f = funcMap.get(safeGetId(r.function));
        const seats = Number(r.seats) || 0;
        totalSeats += seats;
        totalRevenue += seats * (Number((f as any)?.price) || 0);
      });

      // total capacity across functions in month
      functionsOfMonth.forEach((f: any) => {
        totalCapacity += Number(f.room?.capacity ?? 0) || 0;
      });

      const averageOccupancy = totalCapacity > 0 ? Math.round((totalSeats / totalCapacity) * 100) : 0;

      return { month, totalReservations: totalSeats, totalRevenue, averageOccupancy };
    } catch (err) {
      return { month, totalReservations: 0, totalRevenue: 0, averageOccupancy: 0 };
    }
  }

  static async getRoomOccupancy(): Promise<RoomOccupancyStats[]> {
    try {
      const [roomsRes, functionsRes, reservationsRes] = await Promise.all([api.get('/rooms'), api.get('/functions'), api.get('/reservations')]);
      const rooms = roomsRes.data ?? [];
      const functions = functionsRes.data ?? [];
      const reservations = reservationsRes.data ?? [];

      const roomStats = new Map<number, { roomName: string; totalFunctions: number; totalSeatsUsed: number; totalCapacity: number }>();

      // map functions by room
      functions.forEach((f: any) => {
        const roomId = safeGetId(f.room);
        if (!roomId) return;
        const room = f.room ?? rooms.find((r: any) => safeGetId(r.id) === roomId);
        const capacity = Number(room?.capacity) || 0;
        const entry = roomStats.get(roomId) ?? { roomName: room?.name ?? `Sala ${roomId}`, totalFunctions: 0, totalSeatsUsed: 0, totalCapacity: 0 };
        entry.totalFunctions += 1;
        entry.totalCapacity += capacity;
        roomStats.set(roomId, entry);
      });

      // aggregate reservations per function and then add to room
      const reservationsByFunction = new Map<number, any[]>();
      reservations.forEach((r: any) => {
        const fid = safeGetId(r.function);
        if (!fid) return;
        const arr = reservationsByFunction.get(fid) ?? [];
        arr.push(r);
        reservationsByFunction.set(fid, arr);
      });

      functions.forEach((f: any) => {
        const funcId = safeGetId(f.id);
        const roomId = safeGetId(f.room);
        if (!roomId) return;
        const arr = reservationsByFunction.get(funcId) ?? [];
        const seats = arr.reduce((s: number, r: any) => s + (Number(r.seats) || 0), 0);
        const entry = roomStats.get(roomId);
        if (entry) {
          entry.totalSeatsUsed += seats;
          roomStats.set(roomId, entry);
        }
      });

      const out: RoomOccupancyStats[] = [];
      roomStats.forEach((v, k) => {
        const occupancy = v.totalCapacity > 0 ? Math.round((v.totalSeatsUsed / v.totalCapacity) * 100) : 0;
        out.push({ roomId: k, roomName: v.roomName, occupancyPercentage: occupancy, totalFunctions: v.totalFunctions, totalSeatsUsed: v.totalSeatsUsed, totalCapacity: v.totalCapacity });
      });

      return out.sort((a, b) => b.occupancyPercentage - a.occupancyPercentage);
    } catch (err) {
      return [];
    }
  }

  static async getRoomOccupancyByRange(from: string, to: string): Promise<RoomOccupancyStats[]> {
    try {
      const res = await api.get(`/reports/rooms?from=${from}&to=${to}`);
      return res.data ?? [];
    } catch (err) {
      return [];
    }
  }

  static async getDailyRevenue(startDate: string, endDate: string): Promise<DailyRevenueData[]> {
    try {
      const [functionsRes, reservationsRes] = await Promise.all([api.get('/functions'), api.get('/reservations')]);
      const functions = functionsRes.data ?? [];
      const reservations = reservationsRes.data ?? [];

      const funcMap = new Map(functions.map((f: any) => [safeGetId(f.id), f]));

      // filter reservations by date range using the function date
      const daily = new Map<string, { revenue: number; reservations: number }>();

      reservations.forEach((r: any) => {
        const f = funcMap.get(safeGetId(r.function));
        if (!f || !(f as any).date) return;
        const date = (f as any).date;
        if (date < startDate || date > endDate) return;
        const seats = Number(r.seats) || 0;
        const revenue = seats * (Number((f as any).price) || 0);
        const cur = daily.get(date) ?? { revenue: 0, reservations: 0 };
        cur.revenue += revenue;
        cur.reservations += 1;
        daily.set(date, cur);
      });

      const out: DailyRevenueData[] = Array.from(daily.entries()).map(([date, v]) => ({ date, revenue: v.revenue, reservations: v.reservations }));
      out.sort((a, b) => a.date.localeCompare(b.date));
      return out;
    } catch (err) {
      return [];
    }
  }
}
