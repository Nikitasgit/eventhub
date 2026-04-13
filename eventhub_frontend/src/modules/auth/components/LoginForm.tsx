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
import { useAppDispatch } from "../../store/store";
import { clearError } from "../authSlice";

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    handleChange,
    handleSubmit,
    setTwoFactorCode,
    handleVerifyTwoFactor,
    handleVerifyBackupCode,
    handleBackToCredentials,
    handleSwitchToBackupCode,
    handleSwitchToTotp,
    step,
    mode,
    formData,
    twoFactorCode,
    state,
    isFormValid,
    isTwoFactorCodeValid,
    isBackupCodeValid,
  } = useLogin();

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Box
      component="form"
      onSubmit={
        step === "credentials"
          ? handleSubmit
          : mode === "totp"
            ? handleVerifyTwoFactor
            : handleVerifyBackupCode
      }
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {step === "credentials" ? "Connexion" : "Vérification en deux étapes"}
      </Typography>

      {state.error && (
        <Alert severity="error" onClose={handleClearError}>
          {state.error}
        </Alert>
      )}

      {state.success && step === "credentials" && (
        <Alert severity="success">Connexion réussie !</Alert>
      )}

      {step === "credentials" ? (
        <>
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
        </>
      ) : (
        <>
          {mode === "totp" ? (
            <>
              <Typography variant="body2" color="text.secondary">
                Entrez le code à 6 chiffres généré par votre application
                d&apos;authentification.
              </Typography>

              <TextField
                label="Code de vérification"
                type="text"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                fullWidth
                disabled={state.loading}
                autoFocus
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isTwoFactorCodeValid || state.loading}
                sx={{ mt: 2 }}
              >
                {state.loading ? <CircularProgress size={24} /> : "Vérifier le code"}
              </Button>

              <Button
                type="button"
                variant="text"
                fullWidth
                disabled={state.loading}
                onClick={handleSwitchToBackupCode}
                sx={{ mt: 1 }}
              >
                Connectez-vous avec un code de récupération
              </Button>

              <Button
                type="button"
                variant="outlined"
                fullWidth
                disabled={state.loading}
                onClick={handleBackToCredentials}
              >
                Retour
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                Entrez votre code de récupération (format: XXXXXX-XXXXXX).
              </Typography>

              <TextField
                label="Code de récupération"
                type="text"
                placeholder="XXXXXX-XXXXXX"
                value={twoFactorCode}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^A-Z0-9-]/gi, "")
                    .toUpperCase()
                    .slice(0, 13);
                  let formatted = value.replace(/-/g, "");
                  if (formatted.length > 6) {
                    formatted = formatted.slice(0, 6) + "-" + formatted.slice(6, 12);
                  }
                  setTwoFactorCode(formatted);
                }}
                fullWidth
                disabled={state.loading}
                autoFocus
                inputProps={{ maxLength: 13 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isBackupCodeValid || state.loading}
                sx={{ mt: 2 }}
              >
                {state.loading ? <CircularProgress size={24} /> : "Vérifier le code"}
              </Button>

              <Button
                type="button"
                variant="text"
                fullWidth
                disabled={state.loading}
                onClick={handleSwitchToTotp}
                sx={{ mt: 1 }}
              >
                Utiliser le code TOTP à la place
              </Button>

              <Button
                type="button"
                variant="outlined"
                fullWidth
                disabled={state.loading}
                onClick={handleBackToCredentials}
              >
                Retour
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};
