import { api } from "src/shared/libs/nestAxios";
import type { Reservation, ReservationCreateDto, ReservationUpdateDto } from "../types/ReservationTypes";

export class ReservationsService {
  static async obtenerReservas() {
    const result = await api.get<Reservation[]>("/reservations");
    return result.data;
  }

  static async crearReserva(dto: ReservationCreateDto) {
    const result = await api.post("/reservations", dto);
    return result.data;
  }

  static async actualizarReserva(dto: ReservationUpdateDto) {
    const result = await api.put(`/reservations/${dto.id}`, dto);
    return result.data;
  }

  static async eliminarReserva(id: number) {
    const result = await api.delete(`/reservations/${id}`);
    return result.data;
  }
}
export default ReservationsService;
