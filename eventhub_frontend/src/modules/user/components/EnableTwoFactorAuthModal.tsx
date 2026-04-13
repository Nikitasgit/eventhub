import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";

interface QrCodeData {
  image: string;
  email: string;
  secret: string;
}

interface EnableTwoFactorAuthModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  qrCode: QrCodeData | null;
  onEnable: (secret: string, code: string) => Promise<string[]>;
}

export const EnableTwoFactorAuthModal: React.FC<EnableTwoFactorAuthModalProps> = ({
  open,
  onClose,
  loading,
  error,
  qrCode,
  onEnable,
}) => {
  const [totpCode, setTotpCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const handleEnable = async () => {
    if (!qrCode || !totpCode || totpCode.length !== 6) {
      setProcessError("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setProcessing(true);
    setProcessError(null);

    try {
      await onEnable(qrCode.secret, totpCode);
      setTotpCode("");
      onClose();
    } catch (err) {
      setProcessError(
        err instanceof Error ? err.message : "Erreur lors de l'activation de la 2FA"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setTotpCode("");
    setProcessError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Double authentification</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : qrCode ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <DialogContentText>
              Scannez ce QR code avec votre application d'authentification
              (Google Authenticator, Authy, etc.)
            </DialogContentText>
            <Box
              component="img"
              src={qrCode.image}
              alt="QR Code pour l'authentification à deux facteurs"
              sx={{ maxWidth: "100%", height: "auto" }}
            />
            <DialogContentText variant="body2" color="text.secondary">
              Secret: {qrCode.secret}
            </DialogContentText>

            <Box sx={{ width: "100%", mt: 2 }}>
              <DialogContentText sx={{ mb: 1 }}>
                Entrez le code à 6 chiffres généré par votre application :
              </DialogContentText>
              <TextField
                fullWidth
                label="Code TOTP"
                value={totpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setTotpCode(value);
                  setProcessError(null);
                }}
                error={!!processError}
                helperText={processError}
                inputProps={{
                  maxLength: 6,
                  pattern: "[0-9]{6}",
                  inputMode: "numeric",
                }}
                disabled={processing}
              />
            </Box>

            {processError && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {processError}
              </Alert>
            )}
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={processing}>
          Annuler
        </Button>
        {qrCode && (
          <Button
            onClick={handleEnable}
            variant="contained"
            disabled={processing || totpCode.length !== 6}
          >
            {processing ? <CircularProgress size={20} /> : "Activer"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
