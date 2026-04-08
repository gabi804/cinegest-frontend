
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const SidenavLink = ({
                         to,
                         icon,
                         label,
                         onClick,
                     }: {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) => {
    const location = useLocation();
    const selected = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
    return (
        <ListItemButton
            component={NavLink}
            to={to}
            onClick={onClick}
            selected={selected}
            sx={{ borderRadius: 1, mb: 0.5 }}
        >
            <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
};

interface SidenavLinksProps {
    handleClick: () => void;
}

/*
*  Links que se muestran en el sidebar.
* */
export default function SidenavLinks(props: SidenavLinksProps) {
    return (
        <>
            
            
            <SidenavLink to="/movies" icon={<Inventory2OutlinedIcon />} label="Películas" onClick={props.handleClick} />
            <SidenavLink to="/reservations" icon={<Inventory2OutlinedIcon />} label="Reservas" onClick={props.handleClick} />
            <SidenavLink to="/functions" icon={<Inventory2OutlinedIcon />} label="Funciones" onClick={props.handleClick} />
            <SidenavLink to="/rooms" icon={<Inventory2OutlinedIcon />} label="Salas" onClick={props.handleClick} />
           <SidenavLink to="/users" icon={<PeopleAltOutlinedIcon />} label="Clientes" onClick={props.handleClick}/>
           <SidenavLink to="/reports" icon={<AnalyticsIcon />} label="Historial y Reportes" onClick={props.handleClick}/>
           <SidenavLink to="/admin/profile" icon={<AccountCircleOutlinedIcon />} label="Perfil" onClick={props.handleClick}/>

        </>
    )
}

