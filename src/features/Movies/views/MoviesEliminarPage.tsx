import { useEffect, useState } from "react";
import { MoviesService } from "../services/MoviesService";
import type { Movie } from "../types/MovieTypes";
import { Box, Button, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MoviesEliminarPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      const data = await MoviesService.obtenerMovies();
      setMovies(data);
    }
    fetchMovies();
  }, []);

  async function handleDelete() {
    if (!selectedId) return;
    await MoviesService.eliminarMovie(selectedId);
    navigate("/movie");
  }

  return (
    <Box>
      <Typography variant="h4">Eliminar Película</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="select-movie-label">Seleccionar película</InputLabel>
        <Select
          labelId="select-movie-label"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {movies.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button sx={{ mt: 2 }} variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
    </Box>
  );
}
