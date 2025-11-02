import { api } from 'src/shared/libs/nestAxios';
import type { Room } from './../types/RoomTypes';

export class RoomsService {
    static async obtenerRooms() {
        const result = await api.get<Room[]>('/rooms');
        return result.data;
    }

    static async crearRoom(dto: Partial<Room>) {
        const result = await api.post('/rooms', dto);
        return result.data;
    }

    static async actualizarRoom(id: number, dto: Partial<Room>) {
        const result = await api.put(`/rooms/${id}`, dto);
        return result.data;
    }


    static async eliminarRoom(id: number) {
        const result = await api.delete(`/rooms/${id}`);
        return result.data;
    }
}