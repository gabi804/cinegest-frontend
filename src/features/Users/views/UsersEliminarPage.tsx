import { useState, useEffect } from 'react';
import { UsersService } from './../services/UsersService';
import type { User } from './../types/UserTypes';
//import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function UsersEliminarPage() {
    const [users, setUsers] = useState<User[]>([]);
    //const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            const resultado = await UsersService.obtenerUsers();
            setUsers(resultado);
        }
        fetchUsers();
    }, []);

    async function handleEliminar(id: number) {
        await UsersService.eliminarUser(id);
        setUsers(users.filter(u => u.id !== id));
    }

    return (
        <Box>
            <h2>Eliminar Usuarios</h2>
            {users.map(user => (
                <Box key={user.id} sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    <p>ID: {user.id}</p>
                    <p>Nombre: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <Button variant="outlined" color="error" onClick={() => handleEliminar(user.id)}>Eliminar</Button>
                </Box>
            ))}
        </Box>
    );
}
