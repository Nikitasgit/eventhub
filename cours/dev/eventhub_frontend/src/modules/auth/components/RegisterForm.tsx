import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRegister } from "../hooks/useRegister";
import { PasswordValidator } from "../services/passwordValidator";
import { PasswordCriteriaList } from "./PasswordCriteriaList";

export const RegisterForm: React.FC = () => {
  const { formData, state, handleChange, handleSubmit, isFormValid } =
    useRegister();

  const passwordCriteria = PasswordValidator.checkCriteria(formData.password);

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
        Inscription
      </Typography>

      {state.error && (
        <Alert severity="error" onClose={() => {}}>
          {state.error}
        </Alert>
      )}

      {state.success && <Alert severity="success">Inscription réussie !</Alert>}

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

      <TextField
        label="Mot de passe"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        fullWidth
        disabled={state.loading}
        error={state.passwordErrors.length > 0 && formData.password !== ""}
        helperText={
          formData.password !== "" && state.passwordErrors.length > 0
            ? state.passwordErrors[0]
            : ""
        }
      />

      {formData.password !== "" && (
        <PasswordCriteriaList criteria={passwordCriteria} />
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!isFormValid() || state.loading}
        sx={{ mt: 2 }}
      >
        {state.loading ? <CircularProgress size={24} /> : "S'inscrire"}
      </Button>
    </Box>
  );
};
