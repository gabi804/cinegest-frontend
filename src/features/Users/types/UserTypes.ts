export interface UserCrearDto {
    name: string;
    email: string;
    dni?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    dni?: string;
    active?: boolean;
}
 
 
