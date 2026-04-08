import type { User } from "src/features/Users/types";
import type { FunctionEntity } from "src/features/Functions/types/FunctionTypes";



export interface Reservation {
  id: number;
  user: User;
  function: FunctionEntity;
  seats: number;
  active?: boolean;
}

export interface ReservationCreateDto {
  userId: number;
  functionId: number;
  seats: number;
 
}

export interface ReservationUpdateDto {
  id: number;
  userId: number;
  functionId: number;
  seats: number;
 
}


