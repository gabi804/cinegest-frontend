export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
}

export interface MovieCreateDto {
  title: string;
  genre: string;
  duration: number;
}

export interface MovieUpdateDto {
  id: number;
  title: string;
  genre: string;
  duration: number;
}
