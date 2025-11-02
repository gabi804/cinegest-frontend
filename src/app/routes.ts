import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import MoviesPage from "../features/Movies/views/MoviesPage";
import MoviesCrearPage from "../features/Movies/views/MoviesCrearPage";
import MoviesEliminarPage from "../features/Movies/views/MoviesEliminarPage";
//import MoviesEditarPage from "../features/Movies/views/MoviesEditarPage";
import ReservationsPage from "../features/Reservations/Views/ReservationsPage";
import ReservationsCrearPage from "../features/Reservations/Views/ReservationsCrearPage";
import ReservationsEditarPage from "../features/Reservations/Views/ReservationsEditarPage";
import ReservationsEliminarPage from "../features/Reservations/Views/ReservationsEliminarPage";
// Functions, Rooms and Users routes will be lazy-loaded to avoid top-level import issues

export const router = createBrowserRouter([
    {
        path: "/",
        Component: AppLayout,
        children: [
            { path: "movies", Component: MoviesPage },
            { path: "movies/crear", Component: MoviesCrearPage },
            { path: "movies/eliminar", Component: MoviesEliminarPage },
            { path: "movies/editar/:id", lazy: () => import('../features/Movies/views/MoviesEditarPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "reservations", Component: ReservationsPage },
            { path: "reservations/crear", Component: ReservationsCrearPage },
            { path: "reservations/editar", Component: ReservationsEditarPage },
            { path: "reservations/eliminar", Component: ReservationsEliminarPage },
            { path: "functions", lazy: () => import('../features/Functions/views/FunctionsPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "functions/crear", lazy: () => import('../features/Functions/views/FunctionsCrearPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "functions/editar/:id", lazy: () => import('../features/Functions/views/FunctionsEditarPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "functions/eliminar/:id", lazy: () => import('../features/Functions/views/FunctionsEliminarPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "rooms/eliminar/:id", lazy: () => import('../features/Rooms/views/RoomsEliminarPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "rooms", lazy: () => import('../features/Rooms/views/RoomsPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "rooms/crear", lazy: () => import('../features/Rooms/views/RoomsCrearPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "rooms/editar/:id", lazy: () => import('../features/Rooms/views/RoomsEditarPage').then((m: any) => ({ Component: m.default ?? m })) },
            { path: "users", lazy: () => import('../features/Users/views/UsersPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "users/crear", lazy: () => import('../features/Users/views/UsersCrearPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "users/eliminar", lazy: () => import('../features/Users/views/UsersEliminarPage').then((m:any) => ({ Component: m.default ?? m })) },
            { path: "users/editar/:id", lazy: () => import('../features/Users/views/UsersEditarPage').then((m:any) => ({ Component: m.default ?? m })) },

        ]
    },
])
    