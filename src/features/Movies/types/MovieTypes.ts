export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  subtitled?: boolean;
  active?: boolean;
}

export interface MovieCreateDto {
  title: string;
  genre: string;
  duration: number;
  subtitled?: boolean;
}

export interface MovieUpdateDto {
  id: number;
  title: string;
  genre: string;
  duration: number;
  subtitled?: boolean;
}
