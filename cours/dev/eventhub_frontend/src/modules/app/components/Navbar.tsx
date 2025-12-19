import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppState } from "../../store/store";
import { logout } from "../../user/userSlice";

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: AppState) => state.user.isAuthenticated
  );
  const currentUser = useSelector((state: AppState) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Eventhub
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Typography variant="body2">
                {currentUser?.firstName} {currentUser?.lastName}
              </Typography>
              <Button color="inherit" component={Link} to="/profile">
                Profil
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Connexion
              </Button>
              <Button color="inherit" component={Link} to="/register">
                S'inscrire
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
