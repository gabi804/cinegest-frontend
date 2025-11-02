import { useState, useEffect } from 'react';
import { RoomsService } from '../services/RoomsService';
import type { Room } from '../types/RoomTypes';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// TextField intentionally removed (not used)
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function RoomsEliminarPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            const data = await RoomsService.obtenerRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    const handleEliminar = async () => {
        if (selectedRoomId !== null) {
            try {
                await RoomsService.eliminarRoom(selectedRoomId);
                setSnack({ open: true, message: 'Sala eliminada', severity: 'success' });
                setTimeout(() => navigate('/rooms'), 700);
            } catch (e: any) {
                setSnack({ open: true, message: e?.message ?? 'Error al eliminar', severity: 'error' });
            }
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
                <FormControl fullWidth>
                    <InputLabel>Seleccionar sala a eliminar</InputLabel>
                    <Select
                        label="Seleccionar sala a eliminar"
                        value={selectedRoomId ?? ''}
                        onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                    >
                        {rooms.map(room => (
                            <MenuItem key={room.id} value={room.id}>
                                {room.name} ({room.type})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button color="error" variant="contained" onClick={handleEliminar} disabled={selectedRoomId === null}>
                    Eliminar Sala
                </Button>
            </Box>

            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
            </Snackbar>
        </>
    );
}
