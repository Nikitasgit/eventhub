import React from "react";
import { Box, Typography } from "@mui/material";

export const HomePage: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Bienvenue sur Eventhub
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Gérez vos événements en toute simplicité
      </Typography>
    </Box>
  );
};
