import * as React from "react";
import {
    AppBar, Avatar, Box, Divider, Drawer, IconButton, List, Menu, MenuItem, Toolbar, Typography, useMediaQuery
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SidenavLinks from '../components/SidenavLinks.tsx'

const DRAWER_WIDTH = 260;

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: "100dvh",
  background: "#f5f5f5", // fondo claro suave
}));

export default function AppLayout() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "white", color: "#333" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: "#90caf9" }} />
        <Typography variant="h6" fontWeight={700} color="#1976d2">
          CineGest
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 1, flex: 1, overflow: "auto" }}>
        <List component="nav">
          <SidenavLinks handleClick={() => !mdUp && handleDrawerToggle()} />
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} UTN FRRa
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "#ffffff",
          color: "#1976d2",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {!mdUp && (
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ color: "#1976d2" }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ color: "#1976d2" }}>
            CineGest Admin
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton aria-label="notifications" sx={{ ml: 0.5, color: "#1976d2" }}>
            <NotificationsNoneOutlinedIcon />
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#90caf9", color: "white" }}>LF</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      {mdUp ? (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
          open
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          {drawer}
        </Drawer>
      )}

      {/* CONTENIDO */}
      <Main>
        <Toolbar />
        <Box sx={{ mb: 2 }} />
        <Outlet />
      </Main>
    </Box>
  );
}