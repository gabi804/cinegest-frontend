import { api } from 'src/shared/libs/nestAxios';
import type { FunctionEntity, FunctionCrearDto } from '../types/FunctionTypes';

export class FunctionsService {
  static async obtenerFunctions() {
    const result = await api.get<FunctionEntity[]>('/functions');
    return result.data;
  }

  static async crearFunction(dto: FunctionCrearDto) {
    const result = await api.post('/functions', dto);
    return result;
  }

  static async actualizarFunction(id: number, dto: Partial<FunctionCrearDto>) {
    const result = await api.put(`/functions/${id}`, dto);
    return result;
  }

  static async eliminarFunction(id: number) {
    const result = await api.delete(`/functions/${id}`);
    return result;
  }
}
