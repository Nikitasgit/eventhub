import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
} from "@mui/material";

interface BackupCodesModalProps {
  open: boolean;
  codes: string[];
  onClose: () => void;
}

export const BackupCodesModal: React.FC<BackupCodesModalProps> = ({
  open,
  codes,
  onClose,
}) => {
  const handleDownload = () => {
    const content = codes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codes-de-recuperation.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Codes de récupération</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Important :</strong> Ces codes ne seront affichés qu&apos;une
          seule fois. Veuillez les noter dans un endroit sûr. Vous pourrez les
          utiliser pour vous connecter si vous perdez l&apos;accès à votre
          application d&apos;authentification.
        </Alert>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mb: 2,
          }}
        >
          {codes.map((code, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "1.1rem",
                textAlign: "center",
                backgroundColor: "background.paper",
              }}
            >
              {code}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleDownload}>
            Télécharger en TXT
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          J&apos;ai noté les codes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
