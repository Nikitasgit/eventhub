import React, { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCurrentUserQrCode } from "../hooks";
import { EnableTwoFactorAuthModal } from "./EnableTwoFactorAuthModal";
import { DisableTwoFactorAuthModal } from "./DisableTwoFactorAuthModal";
import { BackupCodesModal } from "./BackupCodesModal";
import { apiClient } from "../../auth/services/apiClient";

export const ProfileForm: React.FC = () => {
  const { user: currentUser, loading, error, refetch } = useAuth();
  const {
    loading: qrCodeLoading,
    error: qrCodeError,
    qrCode,
    fetchQrCode,
    reset,
  } = useCurrentUserQrCode();
  const [enableModalOpen, setEnableModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [backupCodesModalOpen, setBackupCodesModalOpen] = useState(false);
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleOpenEnableModal = async () => {
    setEnableModalOpen(true);
    await fetchQrCode();
  };

  const handleCloseEnableModal = () => {
    setEnableModalOpen(false);
    reset();
  };

  const handleOpenDisableModal = () => {
    setDisableModalOpen(true);
  };

  const handleCloseDisableModal = async () => {
    setDisableModalOpen(false);
    await refetch();
  };

  const handleEnableTwoFactorAuth = async (
    secret: string,
    code: string,
  ): Promise<string[]> => {
    const result = await apiClient.enableTwoFactorAuth(secret, code);
    setBackupCodes(result.backupCodes);
    setEnableModalOpen(false);
    setBackupCodesModalOpen(true);
    return result.backupCodes;
  };

  const handleDisableTwoFactorAuth = async () => {
    await apiClient.disableTwoFactorAuth();
    await refetch();
    setDisableModalOpen(false);
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box
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

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">
                {currentUser?.email || "-"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Rôle
              </Typography>
              <Typography variant="body1">
                {currentUser?.role || "-"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {currentUser?.twoFactorEnabled ? (
          <Button
            variant="outlined"
            onClick={handleOpenDisableModal}
            sx={{ alignSelf: "flex-start" }}
          >
            Désactiver la double authentification
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={handleOpenEnableModal}
            sx={{ alignSelf: "flex-start" }}
          >
            Activer la double authentification
          </Button>
        )}
      </Box>

      <EnableTwoFactorAuthModal
        open={enableModalOpen}
        onClose={handleCloseEnableModal}
        loading={qrCodeLoading}
        error={qrCodeError}
        qrCode={qrCode}
        onEnable={handleEnableTwoFactorAuth}
      />

      <DisableTwoFactorAuthModal
        open={disableModalOpen}
        onClose={handleCloseDisableModal}
        onDisable={handleDisableTwoFactorAuth}
      />

      <BackupCodesModal
        open={backupCodesModalOpen}
        codes={backupCodes || []}
        onClose={async () => {
          setBackupCodes(null);
          setBackupCodesModalOpen(false);
          await refetch();
        }}
      />
    </>
  );
};
