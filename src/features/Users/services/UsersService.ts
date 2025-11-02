import type { User, UserCrearDto } from './../types/UserTypes';
import { api } from 'src/shared/libs/nestAxios';

export class UsersService {

    static async obtenerUsers(): Promise<User[]> {
        const result = await api.get<User[]>('/users');
        return result.data;
    }

    static async crearUser(dto: UserCrearDto) {
        const result = await api.post('/users', dto);
        return result.data;
    }

    static async eliminarUser(id: number) {
        const result = await api.delete(`/users/${id}`);
        return result.data;
    }

    static async actualizarUser(id: number, dto: Partial<User>) {
        const result = await api.post(`/users/${id}`, dto);
        return result.data;
    }

}
