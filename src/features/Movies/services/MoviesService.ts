import { api } from "src/shared/libs/nestAxios";
import type { Movie, MovieCreateDto, MovieUpdateDto } from "../types/MovieTypes";

export class MoviesService {
  static async obtenerMovies() {
    const result = await api.get<Movie[]>("/movie");
    return result.data;
  }

  static async obtenerMovie(id: number): Promise<Movie> {
    const result = await api.get<Movie>(`/movie/${id}`);
    return result.data;
  }

  static async crearMovie(dto: MovieCreateDto) {
    const result = await api.post("/movie", dto);
    return result.data;
  }

  static async actualizarMovie(id: number, dto: MovieUpdateDto) {
    const result = await api.put(`/movie/${id}`, dto);
    return result.data;
  }

  static async eliminarMovie(id: number) {
    const result = await api.delete(`/movie/${id}`);
    return result.data;
  }
}
