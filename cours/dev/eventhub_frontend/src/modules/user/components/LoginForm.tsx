import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLogin } from "../hooks/useLogin";

export const LoginForm: React.FC = () => {
  const { formData, state, handleChange, handleSubmit, isFormValid } =
    useLogin();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Connexion
      </Typography>

      {state.error && (
        <Alert severity="error" onClose={() => {}}>
          {state.error}
        </Alert>
      )}

      {state.success && <Alert severity="success">Connexion réussie !</Alert>}

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        fullWidth
        disabled={state.loading}
      />

      <TextField
        label="Mot de passe"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        fullWidth
        disabled={state.loading}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!isFormValid || state.loading}
        sx={{ mt: 2 }}
      >
        {state.loading ? <CircularProgress size={24} /> : "Se connecter"}
      </Button>
    </Box>
  );
};
