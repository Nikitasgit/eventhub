import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export const ProfileForm: React.FC = () => {
  const { formData, state, handleChange, handleSubmit, isFormValid } =
    useUpdateProfile();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Mon profil
      </Typography>

      {state.error && (
        <Alert severity="error" onClose={() => {}}>
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert severity="success">Profil mis à jour avec succès !</Alert>
      )}

      <TextField
        label="Prénom"
        value={formData.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        required
        fullWidth
        disabled={state.loading}
      />

      <TextField
        label="Nom"
        value={formData.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        required
        fullWidth
        disabled={state.loading}
      />

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
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
        {state.loading ? <CircularProgress size={24} /> : "Mettre à jour"}
      </Button>
    </Box>
  );
};
