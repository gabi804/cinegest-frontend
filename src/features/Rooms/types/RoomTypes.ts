export interface Room {
    id: number;
    name: string;
    capacity: number;
    type: '2D' | '3D' | 'VIP';
}
