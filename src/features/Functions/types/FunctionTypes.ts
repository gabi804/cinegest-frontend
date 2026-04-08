import type { Room } from "src/features/Rooms/types/RoomTypes";
import type { Movie } from "src/features/Movies/types/MovieTypes";
export interface FunctionEntity {
  id: number;
  movie: Movie;   // ahora es objeto completo
  room: Room;  // id de la room
  date: string;
  time: string;
  price: number;
  active: boolean;
}

export interface FunctionCrearDto {
  movie: number | '';
  room: number | '';
  date: string;
  time: string;
  price: number;
}
