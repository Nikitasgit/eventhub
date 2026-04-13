import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

interface DisableTwoFactorAuthModalProps {
  open: boolean;
  onClose: () => void;
  onDisable: () => Promise<void>;
}

export const DisableTwoFactorAuthModal: React.FC<DisableTwoFactorAuthModalProps> = ({
  open,
  onClose,
  onDisable,
}) => {
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const handleDisable = async () => {
    setProcessing(true);
    setProcessError(null);

    try {
      await onDisable();
      onClose();
    } catch (err) {
      setProcessError(
        err instanceof Error ? err.message : "Erreur lors de la désactivation de la 2FA"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setProcessError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Désactiver la double authentification</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Vous êtes sur le point de désactiver la double authentification. Votre compte sera moins
          sécurisé. Êtes-vous sûr de vouloir continuer ?
        </DialogContentText>

        {processError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {processError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={processing}>
          Annuler
        </Button>
        <Button onClick={handleDisable} variant="contained" disabled={processing} color="error">
          {processing ? <CircularProgress size={20} /> : "Désactiver"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
